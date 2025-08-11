'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Database,
  CreditCard,
  Mail,
  Cloud,
  Shield,
  Activity,
  Brain,
  Github,
  AlertCircle,
  CheckCircle2,
  Wand2,
  Settings,
  Copy
} from 'lucide-react';
import { serviceTemplates, ServiceTemplate, VariableTemplate } from '@/lib/service-templates';
import { toast } from 'sonner';
import { 
  ENVIRONMENT_CONFIG,
  generateVariablePrefix,
  generateInstanceNameSuggestions,
  applyPrefixToVariables,
  getEnvironmentDisplay,
  EnvironmentTag
} from '@/lib/instance-utils';
import { useAtomValue } from 'jotai';
import { platformsAtom } from '@/atoms/localStorage';

interface TemplateImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platformId: string;
  preselectedTemplate?: string;
  onImport?: (
    template: ServiceTemplate, 
    values: Record<string, string>,
    instanceConfig?: {
      instanceName: string;
      environment?: string;
      variablePrefix?: string;
    }
  ) => Promise<void>;
}

const categoryIcons = {
  database: Database,
  auth: Shield,
  storage: Cloud,
  api: Brain,
  messaging: Mail,
  monitoring: Activity,
  other: AlertCircle,
};

export function TemplateImportDialog({
  open,
  onOpenChange,
  platformId,
  preselectedTemplate,
  onImport,
}: TemplateImportDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(preselectedTemplate || '');
  const [instanceName, setInstanceName] = useState('');
  const [environment, setEnvironment] = useState<string>('development');
  const [variablePrefix, setVariablePrefix] = useState('');
  const [usePrefix, setUsePrefix] = useState(true);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState(preselectedTemplate ? 'config' : 'templates');

  const platforms = useAtomValue(platformsAtom);
  const currentPlatform = platforms.find(p => p.id === platformId);
  
  const template = serviceTemplates.find(t => t.id === selectedTemplate);

  // Calculate existing instances count
  const existingInstanceCount = useMemo(() => {
    if (!currentPlatform || !selectedTemplate) return 0;
    return (currentPlatform.variable_groups || []).filter(
      vg => vg.template_id === selectedTemplate
    ).length;
  }, [currentPlatform, selectedTemplate]);

  // Generate instance name suggestions
  const instanceNameSuggestions = useMemo(() => {
    if (!template) return [];
    return generateInstanceNameSuggestions(
      template.name,
      environment,
      existingInstanceCount
    );
  }, [template, environment, existingInstanceCount]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = serviceTemplates.find(t => t.id === templateId);
    if (template) {
      // Set default instance name
      const suggestions = generateInstanceNameSuggestions(
        template.name,
        environment,
        existingInstanceCount
      );
      setInstanceName(suggestions[0] || `${template.name} Instance`);
      
      // Generate default prefix
      const prefix = generateVariablePrefix(
        environment,
        template.name,
        existingInstanceCount + 1
      );
      setVariablePrefix(prefix);
      
      // Initialize empty values for all variables
      const initialValues: Record<string, string> = {};
      template.variables.forEach(v => {
        initialValues[v.name] = '';
      });
      setVariableValues(initialValues);
    }
  };

  // Update prefix when environment changes
  useEffect(() => {
    if (template) {
      const prefix = generateVariablePrefix(
        environment,
        template.name,
        existingInstanceCount + 1
      );
      setVariablePrefix(prefix);
      
      // Update instance name suggestion
      const suggestions = generateInstanceNameSuggestions(
        template.name,
        environment,
        existingInstanceCount
      );
      setInstanceName(suggestions[0] || instanceName);
    }
  }, [environment]);

  const handleImport = async () => {
    if (!template) return;

    // Validate required fields
    const missingRequired = template.variables
      .filter(v => v.required && !variableValues[v.name])
      .map(v => v.name);

    if (missingRequired.length > 0) {
      toast.error(`Missing required variables: ${missingRequired.join(', ')}`);
      return;
    }

    // Validate patterns
    for (const variable of template.variables) {
      const value = variableValues[variable.name];
      if (value && variable.validation?.pattern) {
        if (!variable.validation.pattern.test(value)) {
          toast.error(
            `${variable.name}: ${variable.validation.message || 'Invalid format'}`
          );
          return;
        }
      }
    }

    setIsImporting(true);
    try {
      if (onImport) {
        const instanceConfig = {
          instanceName,
          environment,
          variablePrefix: usePrefix ? variablePrefix : undefined
        };
        await onImport(template, variableValues, instanceConfig);
        toast.success(`${instanceName} configured successfully`);
        onOpenChange(false);
        // Reset form
        setSelectedTemplate('');
        setInstanceName('');
        setEnvironment('development');
        setVariablePrefix('');
        setVariableValues({});
        setActiveTab('config');
      } else {
        toast.error('Import handler not provided');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to configure instance');
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Configure Service Instance</DialogTitle>
          <DialogDescription>
            Set up a new instance of a service with its environment variables
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Select Service Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service template" />
              </SelectTrigger>
              <SelectContent>
                {serviceTemplates.map((template) => {
                  const Icon = categoryIcons[template.category];
                  return (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{template.name}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {template && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="config">
                  <Settings className="h-4 w-4 mr-2" />
                  Instance Configuration
                </TabsTrigger>
                <TabsTrigger value="variables">
                  <Database className="h-4 w-4 mr-2" />
                  Variables ({template.variables.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="config" className="space-y-4 mt-4">
                {/* Instance Name */}
                <div className="space-y-2">
                  <Label htmlFor="instanceName">Instance Name</Label>
                  <Input
                    id="instanceName"
                    value={instanceName}
                    onChange={(e) => setInstanceName(e.target.value)}
                    placeholder="e.g., Production Supabase"
                  />
                  {instanceNameSuggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Suggestions:</span>
                      {instanceNameSuggestions.slice(0, 3).map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => setInstanceName(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Environment Selection */}
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <RadioGroup value={environment} onValueChange={setEnvironment}>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(ENVIRONMENT_CONFIG).map(([key, config]) => {
                        const envDisplay = getEnvironmentDisplay(key);
                        return (
                          <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem value={key} id={key} />
                            <Label 
                              htmlFor={key} 
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <span>{envDisplay.icon}</span>
                              <span>{config.label}</span>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>

                {/* Variable Prefix */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prefix">Variable Prefix</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="usePrefix"
                        checked={usePrefix}
                        onCheckedChange={setUsePrefix}
                      />
                      <Label htmlFor="usePrefix" className="text-sm">
                        Use prefix
                      </Label>
                    </div>
                  </div>
                  <Input
                    id="prefix"
                    value={variablePrefix}
                    onChange={(e) => setVariablePrefix(e.target.value)}
                    placeholder="e.g., PROD_DB_"
                    disabled={!usePrefix}
                  />
                  <p className="text-xs text-muted-foreground">
                    Prefix helps avoid conflicts when using multiple instances
                  </p>
                </div>

                {/* Instance Info */}
                {existingInstanceCount > 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      You already have {existingInstanceCount} {template.name} instance{existingInstanceCount !== 1 ? 's' : ''}.
                      This will be instance #{existingInstanceCount + 1}.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="variables" className="space-y-4 mt-4">
              {/* Variable Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Environment Variables</Label>
                  {template.documentation && (
                    <a
                      href={template.documentation}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View Documentation →
                    </a>
                  )}
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {template.variables.map((variable) => {
                      const value = variableValues[variable.name] || '';
                      const isValid = !variable.validation?.pattern || 
                        !value || 
                        variable.validation.pattern.test(value);
                      
                      // Show the actual variable name that will be used
                      const displayName = usePrefix && variablePrefix 
                        ? `${variablePrefix}${variable.name}` 
                        : variable.name;

                      return (
                        <div key={variable.name} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label htmlFor={variable.name}>
                              <code className="text-sm font-mono">{displayName}</code>
                            </Label>
                            {variable.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                            {value && isValid && (
                              <CheckCircle2 className="h-3 w-3 text-green-600" />
                            )}
                          </div>
                          
                          <Input
                            id={variable.name}
                            type={variable.name.toLowerCase().includes('password') || 
                                  variable.name.toLowerCase().includes('secret') || 
                                  variable.name.toLowerCase().includes('key') 
                                  ? 'password' : 'text'}
                            value={value}
                            onChange={(e) => setVariableValues({
                              ...variableValues,
                              [variable.name]: e.target.value
                            })}
                            placeholder={variable.placeholder}
                            className={!isValid ? 'border-red-500' : ''}
                          />
                          
                          {variable.description && (
                            <p className="text-xs text-muted-foreground">
                              {variable.description}
                            </p>
                          )}
                          
                          {!isValid && value && (
                            <p className="text-xs text-red-600">
                              {variable.validation?.message || 'Invalid format'}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!selectedTemplate || !instanceName || isImporting}
          >
            {isImporting ? 'Configuring...' : 'Configure Instance'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}