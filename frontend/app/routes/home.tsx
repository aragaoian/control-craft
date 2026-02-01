import { useState } from "react";
import {
  Upload,
  FileText,
  Download,
  X,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Markdown from "react-markdown";
import { uploadBpmn, downloadFile } from "../lib/agentClient";
import { Button } from "../components/ui/button";
//@ts-ignore
import ReactBpmn from "react-bpmn";
import gfm from "remark-gfm";

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | undefined>(undefined);
  const [enhanced, setEnhanced] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);

  async function handleUpload() {
    if (!file) {
      setError("Please select a .bpmn file first");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const res = await uploadBpmn(file);
      setAnalysis(res.analysis);
      setEnhanced(res.generated);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setFile(null);
    setAnalysis(undefined);
    setEnhanced(undefined);
    setError(undefined);
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  };

  const hasResults = analysis || enhanced;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Control-Craft
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered process audit and redesign
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-medium text-foreground">Upload File</h2>
          </div>

          {!file ? (
            <label
              className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground mb-1">
                {isDragging
                  ? "Drop your file here"
                  : "Click to upload or drag and drop"}
              </span>
              <span className="text-xs text-muted-foreground">
                Supports .bpmn and .xml files
              </span>
              <input
                type="file"
                accept=".bpmn,application/xml,text/xml"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
                aria-label="bpmn-file"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-4 bg-secondary/50 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB • Ready to analyze
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {file && !loading && !hasResults && (
            <Button
              onClick={handleUpload}
              className="w-full mt-4 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze BPMN
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="card-elevated p-4 mb-6 border-destructive/30 bg-destructive/5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="card-elevated p-12 mb-6">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium text-foreground mb-1">
                Analyzing your BPMN file
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a few moments...
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {hasResults && !loading && (
          <div className="space-y-6">
            {/* Success Banner */}
            <div className="card-elevated p-4 bg-success/5 border-success/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Analysis Complete
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your BPMN file has been successfully analyzed
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis Result */}
            {analysis && (
              <div className="card-elevated">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-foreground">
                      Analysis Report
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile("analysis.md", analysis)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-5">
                  <div className="markdown-content">
                    <Markdown remarkPlugins={[gfm]}>{analysis}</Markdown>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced BPMN */}
            {enhanced && (
              <div className="card-elevated">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-foreground">
                      Enhanced BPMN
                    </h3>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadFile("enhanced.bpmn", enhanced, "application/xml")
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="p-5 h-100">
                  <ReactBpmn
                    diagramXML={enhanced}
                    className="w-full h-100"
                    width="100%"
                  />
                </div>
              </div>
            )}

            {/* New Analysis */}
            <Button variant="outline" onClick={handleClear} className="w-full">
              Analyze Another File
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
