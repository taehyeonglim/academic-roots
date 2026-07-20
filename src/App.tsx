import { useMemo, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { GenealogyGraph } from "./components/GenealogyGraph";
import { Header } from "./components/Header";
import { Legend } from "./components/Legend";
import { PersonPanel } from "./components/PersonPanel";
import rawData from "./data/genealogy.json";
import { parseGenealogy, type ParsedGenealogy } from "./data/schema";

type ParseOutcome =
  | ({ ok: true } & ParsedGenealogy)
  | { ok: false; message: string };

export default function App() {
  const parsed = useMemo<ParseOutcome>(() => {
    try {
      return { ok: true, ...parseGenealogy(rawData) };
    } catch (err) {
      return { ok: false, message: err instanceof Error ? err.message : String(err) };
    }
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!parsed.ok) {
    return (
      <div className="data-error">
        <h1>Invalid genealogy data</h1>
        <pre>{parsed.message}</pre>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <div className="graph-wrap">
          <ReactFlowProvider>
            <GenealogyGraph data={parsed.data} selectedId={selectedId} onSelect={setSelectedId} />
          </ReactFlowProvider>
          <Legend />
        </div>
        <aside className={`panel ${selectedId ? "is-open" : ""}`}>
          <PersonPanel data={parsed.data} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>
      </main>
    </div>
  );
}
