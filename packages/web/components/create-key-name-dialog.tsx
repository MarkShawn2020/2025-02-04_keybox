import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCreateKeyGroup } from "@/hooks/usePlatforms";
import { BaseDialog } from "./ui/base-dialog";
import { KeyNameForm } from "./forms/key-name-form";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

type CreateKeyGroupDialogProps = {
  platformId: string;
};

export function CreateKeyNameDialog({ platformId }: CreateKeyGroupDialogProps) {
  const { mutate: createKeyGroup } = useCreateKeyGroup();
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
      name: formData.get('name') as string,
      description: formData.get('description') as string || undefined,
    };

    if (!data.name) {
      toast({
        title: "Error",
        description: "Please enter a group name",
        variant: "destructive",
      });
      return;
    }

    if (!platformId) {
      toast({
        title: "Error",
        description: "Platform ID is required",
        variant: "destructive",
      });
      return;
    }

    console.log('Creating key group:', {
      platformId,
      ...data
    });

    setLoading(true);
    try {
      await createKeyGroup({
        platformId,
        data
      });
      handleClose();
      toast({
        title: "Success",
        description: "Key group created successfully",
      });
    } catch (error: any) {
      console.error('Error creating key group:', error);
      const errorMessage = error?.message || 
        (error?.cause?.message) || 
        JSON.stringify(error) || 
        "Failed to create key group";
      toast({
        title: "Error",
        description: errorMessage,
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
      title="Create New Key Name"
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
      <KeyNameForm
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </BaseDialog>
  );
}
