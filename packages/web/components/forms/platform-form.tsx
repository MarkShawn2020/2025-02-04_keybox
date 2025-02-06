import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type PlatformFormProps = {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
};

export function PlatformForm({ onSubmit, isLoading }: PlatformFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Platform Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="openai"
          required
        />
        <p className="text-sm text-muted-foreground mt-1">
          The name of the platform or service (e.g., OPENAI, AWS, ALICLOUD)
        </p>
      </div>
      <div>
        <Label htmlFor="description">Platform Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="OpenAI's Environment Variables"
        />
        <p className="text-sm text-muted-foreground mt-1">
          What this platform is used for
        </p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Next"}
      </Button>
    </form>
  );
}
