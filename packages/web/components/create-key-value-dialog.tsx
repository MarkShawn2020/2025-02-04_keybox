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
import { createClient } from '@/utils/supabase/client';

type CreateKeyValueDialogProps = {
  onKeyCreated: () => void;
  platformId: string;
  groupId: string;
};

export function CreateKeyValueDialog({ onKeyCreated, platformId, groupId }: CreateKeyValueDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    note: "",
    value: "",
  });

  const handleClose = () => {
    setOpen(false);
    setFormData({ note: "", value: "" });
  };

  const handleSubmit = async () => {
    if (!formData.value.trim()) {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('keys')
        .insert({
          note: formData.note,
          value: formData.value,
          key_group_id: groupId,
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Key created successfully",
      });
      onKeyCreated();
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
          <DialogTitle>Create New Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">


            <Label>Note</Label>
            <Input
              placeholder="Enter note"
              value={formData.note}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, note: e.target.value }))
              }
            />

<div className="space-y-2">
            <Label>Key Value</Label>
            <Input
              placeholder="Enter value (required)"
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, value: e.target.value }))
              }
            />
          </div>
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
