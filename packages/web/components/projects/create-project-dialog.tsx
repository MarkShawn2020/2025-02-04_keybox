import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useKeys } from '@/hooks/use-keys';
import { useProjects } from '@/hooks/use-projects';
import { MultiSelect } from '../ui/multi-select';

interface CreateProjectDialogProps {
  onProjectCreated: () => void;
}

export function CreateProjectDialog({ onProjectCreated }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const { platforms, fetchPlatforms } = useKeys();

  // Refresh platforms data when dialog opens
  useEffect(() => {
    if (open) {
      fetchPlatforms();
    }
  }, [open, fetchPlatforms]);

  // Flatten all keys from all platforms
  const allKeys = platforms.flatMap(platform => 
    platform.key_groups?.flatMap(group => 
      group.keys?.map(key => ({
        value: key.id,
        label: `${platform.name} - ${group.name} - ${key.value}`
      })) || []
    ) || []
  );

  const { createProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(name, description, selectedKeys);
      setOpen(false);
      setName('');
      setDescription('');
      setSelectedKeys([]);
      onProjectCreated();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a new project to manage environment variables.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Environment Variables</Label>
              <MultiSelect
                options={allKeys}
                value={selectedKeys}
                onChange={setSelectedKeys}
                placeholder="Select environment variables"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
