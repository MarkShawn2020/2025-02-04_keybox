import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type KeyNameFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export function KeyNameForm({ onSubmit, isLoading }: KeyNameFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Key Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="OPENAI_API_KEY"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          The environment variable name that will be used in your code
        </p>
      </div>
      <div>
        <Label htmlFor="description">Key Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter key description (optional)"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Next"}
      </Button>
    </form>
  );
}
