import { BaseFileEditor } from "../BaseFileEditor";

export function MobileFileEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <BaseFileEditor
      value={value}
      onChange={onChange}
      height="100%"
      fontSize={16}
      padding={{ top: 12, bottom: 8 }}
      lineNumbersMinChars={3}
    />
  );
}
