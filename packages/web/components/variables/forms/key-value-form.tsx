import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type KeyValueFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export function KeyValueForm({ onSubmit, isLoading }: KeyValueFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="value">Key Value</Label>
        <Input
          id="value"
          name="value"
          placeholder="Enter value (required)"
          required
        />
      </div>
      <div>
        <Label htmlFor="note">Note</Label>
        <Input
          id="note"
          name="note"
          placeholder="Enter note"
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}
