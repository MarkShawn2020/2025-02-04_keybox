import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useKeys } from '@/hooks/use-keys';
import { MultiSelect } from '../ui/multi-select';
import type { ProjectWithKeys } from '@keybox/shared';
import { Pencil, Trash, Download, Check, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectWithKeys;
  onUpdate: (id: string, name: string, description?: string, keys?: string[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDownloadEnv: (id: string) => Promise<void>;
  previewContent?: string;
}

export function ProjectCard({ 
  project, 
  onUpdate, 
  onDelete,
  onDownloadEnv,
  previewContent
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [selectedKeys, setSelectedKeys] = useState<string[]>(project.keys);
  const { platforms } = useKeys();

  // Flatten all keys from all platforms
  const allKeys = platforms.flatMap(platform => 
    platform.key_groups?.flatMap(group => 
      group.keys?.map(key => ({
        value: key.id,
        label: `${platform.name} - ${group.name} - ${key.value}`
      })) || []
    ) || []
  );

  const handleSave = async () => {
    await onUpdate(project.id, name, description, selectedKeys);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(project.name);
    setDescription(project.description || '');
    setSelectedKeys(project.keys);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2 px-3">
        {isEditing ? (
          <div className="flex-1 mr-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              className="h-8"
            />
          </div>
        ) : (
          <CardTitle className="text-base">{project.name}</CardTitle>
        )}
        <div className="flex space-x-1">
          {isEditing ? (
            <>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsPreviewVisible(!isPreviewVisible)}>
                {isPreviewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8"
                onClick={() => onDelete(project.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="ghost"
                className="h-8 w-8"
                onClick={() => onDownloadEnv(project.id)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description"
                className="text-sm min-h-[60px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Environment Variables</Label>
              <MultiSelect
                options={allKeys}
                value={selectedKeys}
                onChange={setSelectedKeys}
                placeholder="Select environment variables"
                className="text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {description && (
              <div className="space-y-1">
                <Label className="text-xs">Description</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}
            {selectedKeys.length > 0 && (
              <div className="space-y-1">
                <Label className="text-xs">Environment Variables</Label>
                <div className="flex flex-wrap gap-1">
                  {selectedKeys.map(keyId => {
                    const keyInfo = allKeys.find(k => k.value === keyId);
                    return keyInfo ? (
                      <div 
                        key={keyId}
                        className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-xs"
                      >
                        {keyInfo.label}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            {isPreviewVisible && previewContent && (
              <div className="space-y-1">
                <Label className="text-xs">.env Preview</Label>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  {previewContent}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
