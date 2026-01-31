import type { Route } from "./+types/home";
import { useState } from "react";
import { uploadBpmn, downloadFile } from "../lib/agentClient";
import Markdown from "react-markdown";
//@ts-ignore
import ReactBpmn from "react-bpmn";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BPMN Analyzer" },
    { name: "description", content: "Upload a BPMN for analysis" },
  ];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | undefined>(undefined);
  const [enhanced, setEnhanced] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setError("Choose a .bpmn file first");
    setError(undefined);
    setLoading(true);
    try {
      const res = await uploadBpmn(file);
      // Accept multiple possible keys
      setAnalysis(res.analysis);
      setEnhanced(res.generated);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">BPMN Analyzer</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <input
            aria-label="bpmn-file"
            type="file"
            accept=".bpmn,application/xml,text/xml"
            onChange={(ev) => setFile(ev.target.files?.[0] ?? null)}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Uploading…" : "Upload & Analyze"}
          </button>
        </div>
      </form>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      {analysis && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Analysis (Markdown)</h2>
          <Markdown>{analysis}</Markdown>
          <div className="mt-2">
            <button
              onClick={() => downloadFile("analysis.md", analysis)}
              className="px-3 py-1 mr-2 bg-green-600 text-white rounded"
            >
              Download Markdown
            </button>
          </div>
        </section>
      )}

      {enhanced && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Enhanced BPMN (XML)</h2>
          <ReactBpmn diagramXML={enhanced} />
          <div className="mt-2">
            <button
              onClick={() =>
                downloadFile("enhanced.bpmn", enhanced, "application/xml")
              }
              className="px-3 py-1 mr-2 bg-green-600 text-white rounded"
            >
              Download BPMN
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
