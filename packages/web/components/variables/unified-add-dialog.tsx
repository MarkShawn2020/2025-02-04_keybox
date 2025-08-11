'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Code, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KeyCreationTrigger } from './key-creation-flow/trigger';
import { TemplateWithPlatformDialog } from './template-with-platform-dialog';

interface UnifiedAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnifiedAddDialog({ 
  open, 
  onOpenChange 
}: UnifiedAddDialogProps) {
  const [showKeyCreation, setShowKeyCreation] = useState(false);
  const [showTemplateWithPlatform, setShowTemplateWithPlatform] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>();
  
  const handleManualFlow = () => {
    setShowKeyCreation(true);
    onOpenChange(false);
  };
  
  const handleTemplateFlow = () => {
    setShowTemplateWithPlatform(true);
    onOpenChange(false);
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Variables</DialogTitle>
            <DialogDescription>
              Choose how you want to add environment variables
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Card 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md hover:border-primary",
                "relative overflow-hidden"
              )}
              onClick={handleTemplateFlow}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Quick Setup with Template</CardTitle>
                    </div>
                    <CardDescription>
                      Create a new platform with pre-configured service templates for Supabase, 
                      PostgreSQL, OpenAI, AWS, and more.
                    </CardDescription>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Recommended
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
                "cursor-pointer transition-all hover:shadow-md hover:border-border"
              )}
              onClick={handleManualFlow}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg">Custom Setup</CardTitle>
                    </div>
                    <CardDescription>
                      Create a new platform or add variables to an existing one. 
                      Full control over naming and configuration.
                    </CardDescription>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Manual
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Flexible
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
      
      {/* Key Creation Flow */}
      {showKeyCreation && (
        <KeyCreationTrigger
          startStep="platform"
          open={showKeyCreation}
          onOpenChange={setShowKeyCreation}
        >
          <span />
        </KeyCreationTrigger>
      )}
      
      {/* Template with Platform Dialog */}
      {showTemplateWithPlatform && (
        <TemplateWithPlatformDialog
          open={showTemplateWithPlatform}
          onOpenChange={setShowTemplateWithPlatform}
          selectedTemplate={selectedTemplate}
        />
      )}
    </>
  );
}