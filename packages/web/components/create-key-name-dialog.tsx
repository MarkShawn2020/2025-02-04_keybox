import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCreateKeyGroup } from "@/hooks/usePlatforms";
import { Textarea } from "./ui/textarea";

type CreateKeyGroupDialogProps = {
  platformId: string;
};

export function CreateKeyNameDialog({ platformId }: CreateKeyGroupDialogProps) {
  const { mutate: createKeyGroup } = useCreateKeyGroup();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async () => {
    if (!formData.name) {
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
      name: formData.name,
      description: formData.description
    });

    setLoading(true);
    try {
      await createKeyGroup({
        platformId,
        data: {
          name: formData.name,
          description: formData.description || undefined,
        }
      });
      handleClose();
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
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          handleClose();
        } else {
          setOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Key Name</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Key Name</Label>
            <Input
              placeholder="OPENAI_API_KEY"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Key Description</Label>
            <Textarea
              placeholder="Enter key description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
