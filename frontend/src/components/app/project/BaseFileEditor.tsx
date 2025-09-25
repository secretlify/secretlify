import Editor, { loader } from "@monaco-editor/react";
import { useEffect } from "react";

interface BaseFileEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  fontSize?: number;
  padding?: { top: number; bottom: number };
  lineNumbersMinChars?: number;
}

export function BaseFileEditor({
  value,
  onChange,
  height = "55vh",
  fontSize = 14,
  padding = { top: 16, bottom: 8 },
  lineNumbersMinChars,
}: BaseFileEditorProps) {
  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.languages.register({ id: "dotenv" });

      monaco.languages.setMonarchTokensProvider("dotenv", {
        tokenizer: {
          root: [
            [/^[A-Z0-9_]+(?==)/, "variable"],
            [/"([^"\\]|\\.)*"/, "string"],
            [/#.*/, "comment"],
          ],
        },
      });

      monaco.editor.defineTheme("dotenvTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "variable", foreground: "D4AF37" },
          { token: "string", foreground: "A3A3A3" },
          { token: "comment", foreground: "6A9955", fontStyle: "italic" },
        ],
        colors: {
          focusBorder: "#00000000",
          "editor.background": "#0a0a0a",
        },
      });
    });
  }, []);

  const editorOptions = {
    minimap: { enabled: false },
    wordWrap: "on" as const,
    scrollBeyondLastLine: false,
    lineNumbers: "on" as const,
    fontSize,
    automaticLayout: true,
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    occurrencesHighlight: "off" as const,
    selectionHighlight: false,
    renderLineHighlight: "none" as const,
    padding,
    ...(lineNumbersMinChars && { lineNumbersMinChars }),
  };

  return (
    <Editor
      className="ph-no-capture"
      height={height}
      language="dotenv"
      theme="dotenvTheme"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={editorOptions}
      loading={null}
    />
  );
}
