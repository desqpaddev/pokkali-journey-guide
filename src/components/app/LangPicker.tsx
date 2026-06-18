import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LANG_LABEL, type Lang } from "@/lib/geo";

export function LangPicker({ value, onChange }: { value: Lang; onChange: (l: Lang) => void }) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as Lang)}>
      <TabsList>
        {(Object.keys(LANG_LABEL) as Lang[]).map((l) => (
          <TabsTrigger key={l} value={l}>{LANG_LABEL[l]}</TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}