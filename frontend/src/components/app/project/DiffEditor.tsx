import Editor, { loader } from "@monaco-editor/react";
import { useEffect } from "react";

interface DiffEditorProps {
  value: string;
}

export function DiffEditor({ value }: DiffEditorProps) {
  useEffect(() => {
    loader.init().then((monaco) => {
      // Register a custom language for diff
      monaco.languages.register({ id: "diff" });

      monaco.languages.setMonarchTokensProvider("diff", {
        tokenizer: {
          root: [
            // Lines starting with + (additions)
            [/^\+(?!\+\+).*$/, "addition"],
            // Lines starting with - (deletions)
            [/^-(?!--).*$/, "deletion"],
            // File headers (optional, for future use)
            [/^(@@).*?(@@)/, "range"],
            // Comments
            [/^#.*$/, "comment"],
            // Normal lines (context)
            [/^.*$/, "context"],
          ],
        },
      });

      // Define a custom theme for diffs
      monaco.editor.defineTheme("diffTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          // Green for additions
          { token: "addition", foreground: "4ade80", background: "052e16" },
          // Red for deletions
          { token: "deletion", foreground: "f87171", background: "450a0a" },
          // Blue for range markers
          { token: "range", foreground: "60a5fa", fontStyle: "bold" },
          // Gray for context lines
          { token: "context", foreground: "a3a3a3" },
          // Comments
          { token: "comment", foreground: "6b7280", fontStyle: "italic" },
        ],
        colors: {
          "editor.lineHighlightBackground": "#1a1a1a",
          "editorLineNumber.foreground": "#525252",
          "editorLineNumber.activeForeground": "#a3a3a3",
          "editor.selectionBackground": "#264f78",
          "editor.inactiveSelectionBackground": "#1a3a5a",
          focusBorder: "#00000000",
        },
      });
    });
  }, []);

  return (
    <Editor
      height="100%"
      language="diff"
      theme="diffTheme"
      value={value}
      options={{
        readOnly: true,
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
