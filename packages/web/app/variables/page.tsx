import { EnvVarActions } from "@/components/env-var-actions";
import { KeysList } from "@/components/keys-list";

export default function VariablesPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <KeysList />
    </div>
  );
}
