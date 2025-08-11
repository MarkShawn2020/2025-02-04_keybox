'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Code, ArrowRight } from 'lucide-react';
import { TemplateImportDialog } from './template-import-dialog';
import { KeyCreationTrigger } from './key-creation-flow/trigger';
import { cn } from '@/lib/utils';
import { ServiceTemplate } from '@/lib/service-templates';

interface AddNewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformId: string;
  onTemplateImport?: (
    template: ServiceTemplate, 
    values: Record<string, string>, 
    config?: {
      instanceName: string;
      environment?: string;
      variablePrefix?: string;
    }
  ) => Promise<void>;
}

export function AddNewDialog({ 
  open, 
  onOpenChange, 
  platformId,
  onTemplateImport 
}: AddNewDialogProps) {
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showCustomCreation, setShowCustomCreation] = useState(false);
  
  const handleTemplateChoice = () => {
    setShowTemplateDialog(true);
    onOpenChange(false);
  };
  
  const handleCustomChoice = () => {
    setShowCustomCreation(true);
    onOpenChange(false);
  };
  
  const handleTemplateImportComplete = async (
    template: ServiceTemplate, 
    values: Record<string, string>, 
    config?: {
      instanceName: string;
      environment?: string;
      variablePrefix?: string;
    }
  ) => {
    if (onTemplateImport) {
      await onTemplateImport(template, values, config);
    }
    setShowTemplateDialog(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Variables</DialogTitle>
            <DialogDescription>
              Choose how you want to add environment variables to this platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Card 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-primary",
                "relative overflow-hidden"
              )}
              onClick={handleTemplateChoice}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Use Service Template</CardTitle>
                    </div>
                    <CardDescription>
                      Quick setup with pre-configured service templates for Supabase, PostgreSQL, 
                      OpenAI, AWS, and more. Automatically creates all required variables with 
                      proper naming conventions.
                    </CardDescription>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Recommended
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Multi-variable
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Best practices
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
            
            <Card 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-border",
                "relative"
              )}
              onClick={handleCustomChoice}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Create Custom Variable</CardTitle>
                    </div>
                    <CardDescription>
                      Manually create a single environment variable with a custom name and value. 
                      Full control over variable naming and configuration.
                    </CardDescription>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Single variable
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Custom naming
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Template Import Dialog */}
      <TemplateImportDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        platformId={platformId}
        onImport={handleTemplateImportComplete}
      />
      
      {/* Custom Creation Trigger */}
      {showCustomCreation && (
        <KeyCreationTrigger
          startStep="key-name"
          platformId={platformId}
          open={showCustomCreation}
          onOpenChange={setShowCustomCreation}
        >
          <span />
        </KeyCreationTrigger>
      )}
    </>
  );
}