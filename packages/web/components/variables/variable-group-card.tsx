'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight,
  Package,
  AlertTriangle,
  Plus,
  Hash,
  Server,
  Trash2,
  MoreVertical,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GroupedVariableLocal } from '@/hooks/use-variable-groups';
import { ServiceTemplate, getServiceTemplate } from '@/lib/service-templates';
import { getEnvironmentDisplay } from '@/lib/instance-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSetAtom } from 'jotai';
import { deleteVariableGroupAtom } from '@/atoms/localStorage';
import { toast } from 'sonner';

interface VariableGroupCardProps {
  group: GroupedVariableLocal;
  platformId: string;
  onAddVariable?: (groupId: string, variableName: string) => void;
  onEditVariable?: (keyGroupId: string) => void;
  className?: string;
}

export function VariableGroupCard({ 
  group, 
  platformId,
  onAddVariable,
  onEditVariable,
  className 
}: VariableGroupCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteVariableGroup = useSetAtom(deleteVariableGroupAtom);
  
  // Get template info if exists
  const template: ServiceTemplate | undefined = group.group.template_id 
    ? getServiceTemplate(group.group.template_id) 
    : undefined;

  // Calculate completion status
  const requiredVariables = template?.variables.filter(v => v.required) || [];
  const existingVariableNames = group.keyGroups.map(kg => kg.name);
  const missingRequired = requiredVariables.filter(
    v => !existingVariableNames.includes(v.name)
  );
  const isComplete = missingRequired.length === 0;

  // Get status color and icon
  const getStatusIndicator = () => {
    if (!template) return null;
    
    if (isComplete) {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Complete</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{missingRequired.length} missing</span>
        </div>
      );
    }
  };

  // Get environment display info
  const envDisplay = group.group.environment_tag 
    ? getEnvironmentDisplay(group.group.environment_tag)
    : null;

  const handleDelete = () => {
    deleteVariableGroup({
      platformId,
      groupId: group.group.id
    });
    toast.success('Service instance deleted');
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className={cn("transition-all hover:shadow-md", className)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Environment Badge */}
              {envDisplay && (
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: envDisplay.color, color: envDisplay.color }}
                >
                  {envDisplay.icon} {envDisplay.label}
                </Badge>
              )}
              
              {/* Instance Number */}
              {group.group.instance_number && group.group.instance_number > 1 && (
                <Badge variant="secondary" className="text-xs">
                  <Hash className="h-3 w-3 mr-1" />
                  Instance {group.group.instance_number}
                </Badge>
              )}
              
              {/* Template Badge */}
              {template && (
                <Badge variant="outline" className="text-xs">
                  <Server className="h-3 w-3 mr-1" />
                  {template.name}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">
                {group.group.instance_name || group.group.name}
              </CardTitle>
            </div>
            
            {/* Identity and Prefix Display */}
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {group.group.instance_identity && (
                <div className="flex items-center gap-1">
                  <Fingerprint className="h-3 w-3 text-muted-foreground" />
                  <code className="text-xs text-muted-foreground">
                    {group.group.instance_identity.unique_key}
                  </code>
                </div>
              )}
              {group.group.variable_prefix && (
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  Prefix: {group.group.variable_prefix}
                </code>
              )}
            </div>
            
            {group.group.description && (
              <CardDescription className="mt-2">
                {group.group.description}
              </CardDescription>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIndicator()}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Instance
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {/* Existing Variables */}
            <div>
              <h4 className="text-sm font-medium mb-2">Variables</h4>
              <div className="space-y-2">
                {group.keyGroups.map((keyGroup) => {
                  const varTemplate = template?.variables.find(
                    v => v.name === keyGroup.name
                  );
                  const hasActiveKey = keyGroup.keys.some(k => !k.revoked);
                  
                  return (
                    <div
                      key={keyGroup.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          {hasActiveKey ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <code className="text-sm font-mono">{keyGroup.name}</code>
                        </div>
                        {varTemplate?.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {keyGroup.keys.length} value{keyGroup.keys.length !== 1 ? 's' : ''}
                        </span>
                        {onEditVariable && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditVariable(keyGroup.id)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Missing Variables */}
            {missingRequired.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-amber-600 dark:text-amber-400">
                  Missing Required Variables
                </h4>
                <div className="space-y-2">
                  {missingRequired.map((variable) => (
                    <div
                      key={variable.name}
                      className="flex items-center justify-between p-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <code className="text-sm font-mono">{variable.name}</code>
                      </div>
                      
                      {onAddVariable && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAddVariable(group.group.id, variable.name)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Variables */}
            {template && (
              <>
                {(() => {
                  const optionalVars = template.variables.filter(
                    v => !v.required && !existingVariableNames.includes(v.name)
                  );
                  
                  return optionalVars.length > 0 ? (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-muted-foreground">
                        Optional Variables
                      </h4>
                      <div className="space-y-2">
                        {optionalVars.map((variable) => (
                          <div
                            key={variable.name}
                            className="flex items-center justify-between p-2 rounded-lg border border-muted"
                          >
                            <div>
                              <code className="text-sm font-mono text-muted-foreground">
                                {variable.name}
                              </code>
                              {variable.description && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {variable.description}
                                </p>
                              )}
                            </div>
                            
                            {onAddVariable && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onAddVariable(group.group.id, variable.name)}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service Instance</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{group.group.instance_name || group.group.name}"?
            <br />
            <br />
            This will permanently delete:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{group.keyGroups.length} environment variable{group.keyGroups.length !== 1 ? 's' : ''}</li>
              <li>All associated values and configurations</li>
            </ul>
            <br />
            {group.group.instance_identity && (
              <div className="text-xs text-muted-foreground">
                Instance ID: {group.group.instance_identity.unique_key}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Instance
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}