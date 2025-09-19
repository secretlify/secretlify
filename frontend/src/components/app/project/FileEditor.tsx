import Editor, { loader } from "@monaco-editor/react";
import { useEffect } from "react";

export function FileEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
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
        },
      });
    });
  }, []);

  return (
    <Editor
      height="55vh"
      language="dotenv"
      theme="dotenvTheme"
      value={value}
      onChange={(v) => onChange(v ?? "")}
      options={{
        minimap: { enabled: false },
        wordWrap: "on",
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        fontSize: 14,
        automaticLayout: true,
        overviewRulerBorder: false,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        occurrencesHighlight: "off",
        selectionHighlight: false,
        renderLineHighlight: "none",
        padding: { top: 16, bottom: 8 },
      }}
    />
  );
}
