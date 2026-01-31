export type AgentResult = {
  analysis?: string;
  enhanced_bpmn?: string;
  [key: string]: any;
};

export async function uploadBpmn(file: File): Promise<AgentResult> {
  const fd = new FormData();
  fd.append("bpmn_file", file, file.name);

  const resp = await fetch("http://localhost:8000/control-craft-agent", {
    method: "POST",
    body: fd,
  });

  // Try JSON first
  const text = await resp.text();
  try {
    const parsed = JSON.parse(text);
    return parsed as AgentResult;
  } catch {
    // If not JSON, return raw text under a sensible key
    return { analysis: text };
  }
}

export function downloadFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
