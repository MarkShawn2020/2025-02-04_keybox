import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateKey } from "@/hooks/usePlatforms";
import { BaseDialog } from "../ui/base-dialog";
import { KeyValueForm } from "@/components/variables/forms/key-value-form";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";

type CreateKeyValueDialogProps = {
  platformId: string;
  groupId: string;
};

export function CreateKeyValueDialog({ platformId, groupId }: CreateKeyValueDialogProps) {
  const { mutate: createKey } = useCreateKey();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      value: formData.get('value') as string,
      note: formData.get('note') as string || undefined,
    };

    if (!data.value.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      createKey({
        groupId,
        data
      });

      toast({
        title: "Success",
        description: "Key created successfully",
      });
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create key",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
      title="Create New Key"
      trigger={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      }
    >
      <KeyValueForm
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </BaseDialog>
  );
}
