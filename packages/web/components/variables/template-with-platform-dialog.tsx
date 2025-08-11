'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { serviceTemplates, ServiceTemplate } from '@/lib/service-templates';
import { TemplateImportDialog } from './template-import-dialog';
import { useSetAtom } from 'jotai';
import { addPlatformAtom, importTemplateAtom } from '@/atoms/localStorage';
import { toast } from 'sonner';
import { ArrowRight, ChevronLeft } from 'lucide-react';

interface TemplateWithPlatformDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: string;
}

export function TemplateWithPlatformDialog({
  open,
  onOpenChange,
  selectedTemplate
}: TemplateWithPlatformDialogProps) {
  const [step, setStep] = useState<'template' | 'platform'>('template');
  const [localSelectedTemplate, setLocalSelectedTemplate] = useState<string | undefined>(selectedTemplate);
  const [platformName, setPlatformName] = useState('');
  const [platformDescription, setPlatformDescription] = useState('');
  const [showTemplateImport, setShowTemplateImport] = useState(false);
  const [createdPlatformId, setCreatedPlatformId] = useState<string | null>(null);
  const addPlatform = useSetAtom(addPlatformAtom);
  const importTemplate = useSetAtom(importTemplateAtom);
  
  const handleSelectTemplate = (templateId: string) => {
    setLocalSelectedTemplate(templateId);
    setStep('platform');
  };
  
  const handleCreatePlatform = () => {
    if (!platformName.trim()) {
      toast.error('Please enter a platform name');
      return;
    }
    
    // Create new platform
    const newPlatform = addPlatform({
      name: platformName,
      description: platformDescription
    });
    
    setCreatedPlatformId(newPlatform.id);
    
    // Open template import dialog
    setShowTemplateImport(true);
    onOpenChange(false);
  };
  
  const handleTemplateImport = async (
    template: ServiceTemplate,
    values: Record<string, string>,
    instanceConfig?: {
      instanceName: string;
      environment?: string;
      variablePrefix?: string;
    }
  ): Promise<void> => {
    if (!createdPlatformId) return;
    
    try {
      importTemplate({
        platformId: createdPlatformId,
        templateId: template.id,
        instanceName: instanceConfig?.instanceName || `${template.name} Instance`,
        environment: instanceConfig?.environment,
        variablePrefix: instanceConfig?.variablePrefix,
        variableValues: values
      });
      toast.success('Service instance configured successfully');
      setShowTemplateImport(false);
      
      // Reset state
      setPlatformName('');
      setPlatformDescription('');
      setCreatedPlatformId(null);
      setLocalSelectedTemplate(undefined);
      setStep('template');
    } catch (error) {
      console.error('Failed to import template:', error);
      toast.error('Failed to configure service instance');
    }
  };
  
  const selectedTemplateInfo = localSelectedTemplate 
    ? serviceTemplates.find(t => t.id === localSelectedTemplate)
    : null;
  
  if (step === 'template') {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Choose a Service Template</DialogTitle>
              <DialogDescription>
                Select a service to quickly set up environment variables
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-3">
                {serviceTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
                    onClick={() => handleSelectTemplate(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {template.icon && <span>{template.icon}</span>}
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {template.description}
                          </CardDescription>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {template.variables.filter(v => v.required).length} required
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {template.variables.filter(v => !v.required).length} optional
                            </Badge>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Platform</DialogTitle>
            <DialogDescription>
              Create a new platform for {selectedTemplateInfo?.name} configuration
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="platform-name">Platform Name</Label>
              <Input
                id="platform-name"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="e.g., Production, Staging, Development"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="platform-description">
                Description (optional)
              </Label>
              <Input
                id="platform-description"
                value={platformDescription}
                onChange={(e) => setPlatformDescription(e.target.value)}
                placeholder="Brief description of this platform"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setStep('template')}
              className="mr-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlatform}>
                Create & Configure
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Template Import Dialog */}
      {showTemplateImport && createdPlatformId && localSelectedTemplate && (
        <TemplateImportDialog
          open={showTemplateImport}
          onOpenChange={setShowTemplateImport}
          platformId={createdPlatformId}
          preselectedTemplate={localSelectedTemplate}
          onImport={handleTemplateImport}
        />
      )}
    </>
  );
}