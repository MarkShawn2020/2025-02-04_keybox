import { KeysList } from "@/components/keys-list";
import { KeyCreationTrigger } from "@/components/key-creation-flow/trigger";

export default function VariablesPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <KeysList />
    </div>
  );
}
