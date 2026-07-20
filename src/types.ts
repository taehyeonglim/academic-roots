import type { z } from "zod";
import type {
  genealogySchema,
  personSchema,
  relationshipSchema,
  sourceSchema,
} from "./data/schema";

export type Source = z.infer<typeof sourceSchema>;
export type Person = z.infer<typeof personSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Genealogy = z.infer<typeof genealogySchema>;
