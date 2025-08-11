/**
 * 实例管理工具函数
 */

// 环境标签配置
export const ENVIRONMENT_CONFIG = {
  production: {
    label: 'Production',
    prefix: 'PROD',
    color: '#ef4444', // red
    icon: '🔴',
    order: 1
  },
  staging: {
    label: 'Staging',
    prefix: 'STG',
    color: '#f59e0b', // amber
    icon: '🟡',
    order: 2
  },
  development: {
    label: 'Development',
    prefix: 'DEV',
    color: '#10b981', // green
    icon: '🟢',
    order: 3
  },
  test: {
    label: 'Test',
    prefix: 'TEST',
    color: '#8b5cf6', // purple
    icon: '🟣',
    order: 4
  },
  local: {
    label: 'Local',
    prefix: 'LOCAL',
    color: '#6b7280', // gray
    icon: '⚫',
    order: 5
  }
} as const;

export type EnvironmentTag = keyof typeof ENVIRONMENT_CONFIG;

/**
 * 生成变量前缀
 */
export function generateVariablePrefix(
  environment: string,
  serviceName: string,
  instanceNumber?: number
): string {
  // 获取环境前缀
  const envConfig = ENVIRONMENT_CONFIG[environment as EnvironmentTag];
  const envPrefix = envConfig?.prefix || environment.slice(0, 4).toUpperCase();
  
  // 处理服务名称
  const servicePrefix = serviceName
    .replace(/[^A-Z0-9]/gi, '_')
    .toUpperCase()
    .slice(0, 10);
  
  // 组合前缀
  if (instanceNumber && instanceNumber > 1) {
    return `${envPrefix}_${servicePrefix}${instanceNumber}_`;
  }
  return `${envPrefix}_${servicePrefix}_`;
}

/**
 * 生成实例名称建议
 */
export function generateInstanceNameSuggestions(
  templateName: string,
  environment: string,
  existingInstanceCount: number
): string[] {
  const envLabel = ENVIRONMENT_CONFIG[environment as EnvironmentTag]?.label || environment;
  
  const suggestions: string[] = [];
  
  // 基本组合
  suggestions.push(`${envLabel} ${templateName}`);
  suggestions.push(`${templateName} - ${envLabel}`);
  
  // 如果已有实例，添加编号
  if (existingInstanceCount > 0) {
    suggestions.push(`${templateName} ${existingInstanceCount + 1}`);
    suggestions.push(`${envLabel} ${templateName} ${existingInstanceCount + 1}`);
  } else {
    suggestions.push(`Main ${templateName}`);
    suggestions.push(`Primary ${templateName}`);
  }
  
  // 特定用途
  if (environment === 'production') {
    suggestions.push(`Live ${templateName}`);
  } else if (environment === 'development') {
    suggestions.push(`Dev ${templateName}`);
  } else if (environment === 'test') {
    suggestions.push(`Test ${templateName}`);
  }
  
  return suggestions.filter((s, i, arr) => arr.indexOf(s) === i); // 去重
}

/**
 * 应用前缀到变量名
 */
export function applyPrefixToVariables(
  variables: Record<string, string>,
  prefix: string
): Record<string, string> {
  if (!prefix) return variables;
  
  const prefixed: Record<string, string> = {};
  
  Object.entries(variables).forEach(([key, value]) => {
    // 如果变量名已经有前缀，先移除
    const cleanKey = key.replace(/^[A-Z]+_[A-Z]+_/, '');
    prefixed[`${prefix}${cleanKey}`] = value;
  });
  
  return prefixed;
}

/**
 * 检测变量名是否需要加密显示
 */
export function isSecretVariable(variableName: string): boolean {
  const secretPatterns = [
    'PASSWORD',
    'SECRET',
    'KEY',
    'TOKEN',
    'PRIVATE',
    'CREDENTIAL',
    'AUTH'
  ];
  
  const upperName = variableName.toUpperCase();
  return secretPatterns.some(pattern => upperName.includes(pattern));
}

/**
 * 获取环境的显示配置
 */
export function getEnvironmentDisplay(environment: string) {
  const config = ENVIRONMENT_CONFIG[environment as EnvironmentTag];
  return config || {
    label: environment,
    prefix: environment.slice(0, 4).toUpperCase(),
    color: '#6b7280',
    icon: '⚪',
    order: 99
  };
}

/**
 * 根据模板类型推荐服务用途
 */
export function suggestServicePurpose(templateId: string): string[] {
  const purposeMap: Record<string, string[]> = {
    'postgres': ['primary', 'replica', 'backup', 'analytics'],
    'redis': ['cache', 'session', 'queue', 'pubsub'],
    'supabase': ['main', 'auth', 'storage', 'realtime'],
    'mongodb': ['primary', 'secondary', 'analytics', 'archive'],
    'aws-s3': ['assets', 'backups', 'logs', 'uploads'],
    'stripe': ['payments', 'subscriptions', 'billing'],
    'sendgrid': ['transactional', 'marketing', 'notifications'],
  };
  
  return purposeMap[templateId] || ['primary', 'secondary', 'backup'];
}

/**
 * 计算实例编号
 */
export function calculateInstanceNumber(
  existingGroups: Array<{ template_id?: string; instance_number?: number }>,
  templateId: string
): number {
  const sameTemplateGroups = existingGroups.filter(
    g => g.template_id === templateId
  );
  
  if (sameTemplateGroups.length === 0) return 1;
  
  const maxNumber = Math.max(
    ...sameTemplateGroups.map(g => g.instance_number || 1)
  );
  
  return maxNumber + 1;
}

/**
 * 生成实例身份标识
 */
export function generateInstanceIdentity(
  templateId: string,
  environment: string,
  instanceNumber: number,
  instanceName: string
): {
  unique_key: string;
  display_name: string;
  short_name: string;
} {
  // 生成唯一键：环境-模板-编号
  const envPrefix = ENVIRONMENT_CONFIG[environment as EnvironmentTag]?.prefix || 
    environment.slice(0, 3).toUpperCase();
  const templatePrefix = templateId.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase();
  const unique_key = `${envPrefix.toLowerCase()}-${templatePrefix}-${instanceNumber}`;
  
  // 生成简短名称
  const short_name = `${envPrefix} ${templateId.split('-').map(w => 
    w.charAt(0).toUpperCase()
  ).join('')}${instanceNumber > 1 ? instanceNumber : ''}`;
  
  return {
    unique_key,
    display_name: instanceName,
    short_name
  };
}

/**
 * 验证实例身份唯一性
 */
export function isInstanceIdentityUnique(
  unique_key: string,
  existingGroups: Array<{ instance_identity?: { unique_key: string } }>
): boolean {
  return !existingGroups.some(g => g.instance_identity?.unique_key === unique_key);
}