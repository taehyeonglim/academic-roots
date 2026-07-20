import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseGenealogy } from "../src/data/schema";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = resolve(here, "../src/data/genealogy.json");

try {
  const raw: unknown = JSON.parse(readFileSync(dataPath, "utf8"));
  const { data, warnings } = parseGenealogy(raw);
  const unverifiedPeople = data.people.filter((p) => p.confidence === "unverified").length;
  const unverifiedEdges = data.relationships.filter((r) => r.confidence === "unverified").length;
  for (const w of warnings) console.warn(`warning: ${w}`);
  console.log(
    `OK: genealogy.json — ${data.people.length} people, ${data.relationships.length} relationships` +
      ` (${unverifiedPeople} unverified people, ${unverifiedEdges} unverified relationships)`,
  );
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
