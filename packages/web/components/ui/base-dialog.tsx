import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type BaseDialogProps = {
  title: string;
  children: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerText?: string;
};

export function BaseDialog({
  title,
  children,
  trigger,
  open,
  onOpenChange,
  triggerText = "Add New",
}: BaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        {trigger || (
          <Button onClick={() => onOpenChange?.(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
