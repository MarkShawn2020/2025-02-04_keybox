import { useMemo } from 'react';
import { GroupedVariableLocal } from '@/hooks/use-variable-groups';
import { 
  getServiceTemplate, 
  validateTemplateVariables,
  ServiceTemplate,
  serviceTemplates 
} from '@/lib/service-templates';

export interface ValidationResult {
  isComplete: boolean;
  missingRequired: string[];
  missingOptional: string[];
  invalidVariables: Array<{ name: string; message: string }>;
  completionPercentage: number;
  suggestions: string[];
}

export function useVariableValidation(
  group: GroupedVariableLocal | null
): ValidationResult | null {
  return useMemo(() => {
    if (!group) return null;

    // If no template, can't validate
    if (!group.group.template_id) {
      return {
        isComplete: true,
        missingRequired: [],
        missingOptional: [],
        invalidVariables: [],
        completionPercentage: 100,
        suggestions: [],
      };
    }

    const template = getServiceTemplate(group.group.template_id);
    if (!template) {
      return {
        isComplete: true,
        missingRequired: [],
        missingOptional: [],
        invalidVariables: [],
        completionPercentage: 100,
        suggestions: [],
      };
    }

    // Get existing variables
    const existingVariables: Record<string, string> = {};
    group.keyGroups.forEach(keyGroup => {
      // Use the first non-revoked key value, or the first key if all are revoked
      const activeKey = keyGroup.keys.find(k => !k.revoked) || keyGroup.keys[0];
      if (activeKey) {
        existingVariables[keyGroup.name] = activeKey.value;
      }
    });

    // Validate against template
    const validation = validateTemplateVariables(
      group.group.template_id,
      existingVariables
    );

    // Calculate optional variables
    const optionalVariables = template.variables.filter(v => !v.required);
    const missingOptional = optionalVariables
      .filter(v => !existingVariables[v.name])
      .map(v => v.name);

    // Calculate completion percentage
    const totalVariables = template.variables.length;
    const presentVariables = Object.keys(existingVariables).filter(
      key => template.variables.some(v => v.name === key)
    ).length;
    const completionPercentage = totalVariables > 0 
      ? Math.round((presentVariables / totalVariables) * 100)
      : 100;

    // Generate suggestions
    const suggestions: string[] = [];
    
    if (validation.missing.length > 0) {
      suggestions.push(
        `Add missing required variables: ${validation.missing.join(', ')}`
      );
    }

    if (validation.invalid.length > 0) {
      validation.invalid.forEach(inv => {
        suggestions.push(`Fix ${inv.name}: ${inv.message}`);
      });
    }

    if (missingOptional.length > 0 && validation.missing.length === 0) {
      suggestions.push(
        `Consider adding optional variables for full functionality: ${missingOptional.slice(0, 3).join(', ')}${missingOptional.length > 3 ? '...' : ''}`
      );
    }

    return {
      isComplete: validation.valid,
      missingRequired: validation.missing,
      missingOptional,
      invalidVariables: validation.invalid,
      completionPercentage,
      suggestions,
    };
  }, [group]);
}

// Hook to detect if current variables match a template
export function useTemplateDetection(variableNames: string[]): {
  detectedTemplate: ServiceTemplate | null;
  confidence: number;
  matchedVariables: string[];
  missingVariables: string[];
} {
  return useMemo(() => {
    if (variableNames.length === 0) {
      return {
        detectedTemplate: null,
        confidence: 0,
        matchedVariables: [],
        missingVariables: [],
      };
    }

    // Try to detect which template these variables might belong to
    let bestMatch: {
      template: ServiceTemplate;
      score: number;
      matched: string[];
      missing: string[];
    } | null = null;

    for (const template of serviceTemplates) {
      const requiredVars = template.variables.filter(v => v.required);
      const matched = requiredVars.filter(v => 
        variableNames.includes(v.name)
      );
      const missing = requiredVars.filter(v => 
        !variableNames.includes(v.name)
      );

      const score = matched.length / requiredVars.length;

      if (score > 0 && (!bestMatch || score > bestMatch.score)) {
        bestMatch = {
          template,
          score,
          matched: matched.map(v => v.name),
          missing: missing.map(v => v.name),
        };
      }
    }

    if (bestMatch && bestMatch.score >= 0.5) {
      return {
        detectedTemplate: bestMatch.template,
        confidence: bestMatch.score,
        matchedVariables: bestMatch.matched,
        missingVariables: bestMatch.missing,
      };
    }

    return {
      detectedTemplate: null,
      confidence: 0,
      matchedVariables: [],
      missingVariables: [],
    };
  }, [variableNames]);
}

// Hook to provide smart suggestions when adding new variables
export function useVariableSuggestions(
  existingVariables: string[],
  currentInput: string
): string[] {
  return useMemo(() => {
    if (!currentInput) return [];

    const suggestions: string[] = [];
    const upperInput = currentInput.toUpperCase();

    // Get all possible variable names from templates
    const allTemplateVariables = new Set<string>();
    
    // This would need to be refactored to properly get all templates
    // For now, we'll use a hardcoded list of common patterns
    const commonPatterns = [
      { prefix: 'DATABASE_', vars: ['HOST', 'PORT', 'USER', 'PASSWORD', 'NAME', 'URL'] },
      { prefix: 'REDIS_', vars: ['HOST', 'PORT', 'PASSWORD', 'URL'] },
      { prefix: 'AWS_', vars: ['ACCESS_KEY_ID', 'SECRET_ACCESS_KEY', 'REGION'] },
      { prefix: 'OPENAI_', vars: ['API_KEY', 'ORGANIZATION', 'BASE_URL'] },
      { prefix: 'STRIPE_', vars: ['PUBLISHABLE_KEY', 'SECRET_KEY', 'WEBHOOK_SECRET'] },
      { prefix: 'GITHUB_', vars: ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'] },
      { prefix: 'GOOGLE_', vars: ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI'] },
    ];

    // Find matching patterns
    for (const pattern of commonPatterns) {
      if (upperInput.startsWith(pattern.prefix)) {
        pattern.vars.forEach(varSuffix => {
          const fullVar = pattern.prefix + varSuffix;
          if (fullVar.startsWith(upperInput) && !existingVariables.includes(fullVar)) {
            suggestions.push(fullVar);
          }
        });
      }
    }

    // If user typed a known prefix, suggest related variables they don't have
    for (const pattern of commonPatterns) {
      if (pattern.prefix.startsWith(upperInput)) {
        pattern.vars.forEach(varSuffix => {
          const fullVar = pattern.prefix + varSuffix;
          if (!existingVariables.includes(fullVar)) {
            suggestions.push(fullVar);
          }
        });
      }
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }, [existingVariables, currentInput]);
}