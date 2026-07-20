import { z } from "zod";

export const sourceSchema = z.object({
  url: z.string().url(),
  label: z.string().optional(),
});

export const personSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "id must be kebab-case"),
  name: z.string().min(1),
  degree: z.enum(["PhD", "EdD", "MS", "other"]),
  degreeField: z.string().optional(),
  institution: z.string().optional(),
  year: z.number().int().min(1500).max(2100).optional(),
  dissertationTitle: z.string().optional(),
  currentAffiliation: z.string().optional(),
  links: z
    .object({
      homepage: z.string().url().optional(),
      googleScholar: z.string().url().optional(),
      wikipedia: z.string().url().optional(),
    })
    .optional(),
  photo: z.string().optional(),
  sources: z.array(sourceSchema),
  confidence: z.enum(["verified", "unverified"]),
  role: z.enum(["anchor", "self"]).optional(),
  notes: z.string().optional(),
});

export const relationshipSchema = z.object({
  advisorId: z.string(),
  studentId: z.string(),
  type: z.enum(["advisor", "co-advisor"]),
  sources: z.array(sourceSchema).min(1),
  confidence: z.enum(["verified", "unverified"]),
});

export const genealogySchema = z.object({
  people: z.array(personSchema),
  relationships: z.array(relationshipSchema),
});

export type Genealogy = z.infer<typeof genealogySchema>;

export interface ParsedGenealogy {
  data: Genealogy;
  warnings: string[];
}

/**
 * Zod parse + integrity checks. Throws a single aggregated Error listing every
 * problem so a broken dataset fails loudly at build/dev time.
 */
export function parseGenealogy(raw: unknown): ParsedGenealogy {
  const parsed = genealogySchema.safeParse(raw);
  if (!parsed.success) {
    const lines = parsed.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
    );
    throw new Error(`genealogy.json schema errors:\n- ${lines.join("\n- ")}`);
  }

  const { people, relationships } = parsed.data;
  const problems: string[] = [];
  const warnings: string[] = [];

  const ids = new Set<string>();
  for (const p of people) {
    if (ids.has(p.id)) problems.push(`duplicate person id: ${p.id}`);
    ids.add(p.id);
    if (p.role !== "self" && p.sources.length === 0) {
      problems.push(`person "${p.id}" has no sources (required unless role is "self")`);
    }
  }

  const anchors = people.filter((p) => p.role === "anchor");
  if (anchors.length !== 1) {
    problems.push(`expected exactly 1 person with role "anchor", found ${anchors.length}`);
  }
  if (people.filter((p) => p.role === "self").length > 1) {
    problems.push(`at most 1 person may have role "self"`);
  }

  const edgeKeys = new Set<string>();
  for (const r of relationships) {
    if (!ids.has(r.advisorId)) problems.push(`relationship advisorId not found: ${r.advisorId}`);
    if (!ids.has(r.studentId)) problems.push(`relationship studentId not found: ${r.studentId}`);
    if (r.advisorId === r.studentId) problems.push(`self-loop relationship: ${r.advisorId}`);
    const key = `${r.advisorId}->${r.studentId}`;
    if (edgeKeys.has(key)) problems.push(`duplicate relationship: ${key}`);
    edgeKeys.add(key);
  }

  if (problems.length === 0) {
    // Cycle detection via Kahn's algorithm — genealogy must be a DAG.
    const indegree = new Map<string, number>(people.map((p) => [p.id, 0]));
    const out = new Map<string, string[]>(people.map((p) => [p.id, []]));
    for (const r of relationships) {
      indegree.set(r.studentId, (indegree.get(r.studentId) ?? 0) + 1);
      out.get(r.advisorId)!.push(r.studentId);
    }
    const queue = people.filter((p) => indegree.get(p.id) === 0).map((p) => p.id);
    let visited = 0;
    while (queue.length > 0) {
      const id = queue.shift()!;
      visited += 1;
      for (const next of out.get(id) ?? []) {
        const d = (indegree.get(next) ?? 0) - 1;
        indegree.set(next, d);
        if (d === 0) queue.push(next);
      }
    }
    if (visited !== people.length) {
      problems.push("advisor graph contains a cycle — genealogy must be a DAG");
    }

    // Connectivity is a warning, not an error: partial data is allowed to grow.
    if (anchors.length === 1) {
      const adj = new Map<string, string[]>(people.map((p) => [p.id, []]));
      for (const r of relationships) {
        adj.get(r.advisorId)!.push(r.studentId);
        adj.get(r.studentId)!.push(r.advisorId);
      }
      const seen = new Set<string>([anchors[0].id]);
      const bfs = [anchors[0].id];
      while (bfs.length > 0) {
        for (const n of adj.get(bfs.shift()!) ?? []) {
          if (!seen.has(n)) {
            seen.add(n);
            bfs.push(n);
          }
        }
      }
      for (const p of people) {
        if (!seen.has(p.id)) warnings.push(`person "${p.id}" is disconnected from the anchor`);
      }
    }
  }

  if (problems.length > 0) {
    throw new Error(`genealogy.json integrity errors:\n- ${problems.join("\n- ")}`);
  }

  return { data: parsed.data, warnings };
}
