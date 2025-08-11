'use client';

import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { platformsAtom } from '@/atoms/localStorage';
import { getServiceTemplate } from '@/lib/service-templates';

export interface GroupedVariableLocal {
  group: {
    id: string;
    name: string;
    description?: string;
    template_id?: string;
    instance_identity?: {
      unique_key: string;
      display_name: string;
      short_name?: string;
    };
    instance_name?: string;
    environment_tag?: string;
    variable_prefix?: string;
    instance_number?: number;
    instance_metadata?: {
      purpose?: string;
      color?: string;
      icon?: string;
      tags?: string[];
    };
  };
  keyGroups: Array<{
    id: string;
    name: string;
    description?: string;
    keys: Array<{
      id: string;
      value: string;
      note?: string;
      revoked: boolean;
    }>;
  }>;
  validation?: {
    isComplete: boolean;
    missingVariables: string[];
  };
}

export function useVariableGroups(platformId: string) {
  const platforms = useAtomValue(platformsAtom);
  
  const groups = useMemo(() => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return [];
    
    const variableGroups = platform.variable_groups || [];
    
    return variableGroups.map(vg => {
      // Get key groups that belong to this variable group
      const relatedKeyGroups = platform.key_groups.filter(kg => 
        vg.key_group_ids.includes(kg.id)
      );
      
      // Validate if template-based
      let validation;
      if (vg.template_id) {
        const template = getServiceTemplate(vg.template_id);
        if (template) {
          const existingVarNames = relatedKeyGroups.map(kg => kg.name);
          const requiredVars = template.variables.filter(v => v.required);
          const missingVars = requiredVars
            .filter(v => !existingVarNames.includes(v.name))
            .map(v => v.name);
          
          validation = {
            isComplete: missingVars.length === 0,
            missingVariables: missingVars,
          };
        }
      }
      
      return {
        group: {
          id: vg.id,
          name: vg.name,
          description: vg.description,
          template_id: vg.template_id,
          instance_identity: vg.instance_identity,
          instance_name: vg.instance_name,
          environment_tag: vg.environment_tag,
          variable_prefix: vg.variable_prefix,
          instance_number: vg.instance_number,
          instance_metadata: vg.instance_metadata,
        },
        keyGroups: relatedKeyGroups,
        validation,
      };
    });
  }, [platforms, platformId]);
  
  return {
    groups,
    isLoading: false,
    error: null,
    refresh: () => {}, // localStorage is reactive through atoms
  };
}

export function useTemplateSuggestion(platformId: string) {
  const platforms = useAtomValue(platformsAtom);
  
  const suggestedTemplate = useMemo(() => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return null;
    
    // Check if there are already variable groups with templates
    if (platform.variable_groups?.some(vg => vg.template_id)) {
      return null; // Already using templates
    }
    
    // Detect template based on existing key group names
    const keyGroupNames = platform.key_groups.map(kg => kg.name);
    
    // Check for common patterns
    if (keyGroupNames.includes('SUPABASE_URL') && keyGroupNames.includes('SUPABASE_ANON_KEY')) {
      return 'supabase';
    }
    if (keyGroupNames.includes('DATABASE_HOST') && keyGroupNames.includes('DATABASE_USER')) {
      return 'postgres';
    }
    if (keyGroupNames.includes('OPENAI_API_KEY')) {
      return 'openai';
    }
    if (keyGroupNames.includes('AWS_ACCESS_KEY_ID') && keyGroupNames.includes('AWS_SECRET_ACCESS_KEY')) {
      return 'aws-s3';
    }
    
    return null;
  }, [platforms, platformId]);
  
  return {
    suggestedTemplate,
    isLoading: false,
  };
}