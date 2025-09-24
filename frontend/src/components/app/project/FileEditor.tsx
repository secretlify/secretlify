import { BaseFileEditor } from "./BaseFileEditor";

export function FileEditor({
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
      fontSize={14}
      padding={{ top: 16, bottom: 8 }}
    />
  );
}
