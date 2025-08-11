export type VariableTemplate = {
  name: string;
  description?: string;
  required: boolean;
  placeholder?: string;
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
};

export type ServiceTemplate = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  category: 'database' | 'auth' | 'storage' | 'api' | 'messaging' | 'monitoring' | 'other';
  variables: VariableTemplate[];
  documentation?: string;
};

export const serviceTemplates: ServiceTemplate[] = [
  {
    id: 'supabase',
    name: 'Supabase',
    description: 'Open source Firebase alternative with PostgreSQL database',
    category: 'database',
    icon: 'database',
    variables: [
      {
        name: 'SUPABASE_URL',
        description: 'Your Supabase project URL',
        required: true,
        placeholder: 'https://xxxxx.supabase.co',
        validation: {
          pattern: /^https:\/\/[a-z0-9]+\.supabase\.co$/,
          message: 'Must be a valid Supabase URL'
        }
      },
      {
        name: 'SUPABASE_ANON_KEY',
        description: 'Public anonymous key for browser access',
        required: true,
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      },
      {
        name: 'SUPABASE_SERVICE_KEY',
        description: 'Service role key for server-side access (keep secret)',
        required: false,
        placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    ],
    documentation: 'https://supabase.com/docs/guides/getting-started'
  },
  {
    id: 'postgres',
    name: 'PostgreSQL Database',
    description: 'PostgreSQL database connection',
    category: 'database',
    icon: 'database',
    variables: [
      {
        name: 'DATABASE_HOST',
        description: 'Database host address',
        required: true,
        placeholder: 'localhost or db.example.com'
      },
      {
        name: 'DATABASE_PORT',
        description: 'Database port',
        required: true,
        placeholder: '5432',
        validation: {
          pattern: /^\d+$/,
          message: 'Must be a valid port number'
        }
      },
      {
        name: 'DATABASE_NAME',
        description: 'Database name',
        required: true,
        placeholder: 'myapp_db'
      },
      {
        name: 'DATABASE_USER',
        description: 'Database username',
        required: true,
        placeholder: 'postgres'
      },
      {
        name: 'DATABASE_PASSWORD',
        description: 'Database password',
        required: true,
        placeholder: '********'
      },
      {
        name: 'DATABASE_URL',
        description: 'Full connection string (alternative to individual variables)',
        required: false,
        placeholder: 'postgresql://user:password@host:port/database'
      }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'OpenAI API for GPT and other AI models',
    category: 'api',
    icon: 'brain',
    variables: [
      {
        name: 'OPENAI_API_KEY',
        description: 'Your OpenAI API key',
        required: true,
        placeholder: 'sk-...',
        validation: {
          pattern: /^sk-[a-zA-Z0-9]{48}$/,
          message: 'Must be a valid OpenAI API key'
        }
      },
      {
        name: 'OPENAI_ORGANIZATION',
        description: 'OpenAI organization ID (optional)',
        required: false,
        placeholder: 'org-...'
      },
      {
        name: 'OPENAI_BASE_URL',
        description: 'Custom API endpoint (for proxies or Azure)',
        required: false,
        placeholder: 'https://api.openai.com/v1'
      }
    ],
    documentation: 'https://platform.openai.com/docs'
  },
  {
    id: 'aws-s3',
    name: 'AWS S3',
    description: 'Amazon S3 object storage',
    category: 'storage',
    icon: 'cloud',
    variables: [
      {
        name: 'AWS_ACCESS_KEY_ID',
        description: 'AWS access key ID',
        required: true,
        placeholder: 'AKIA...'
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        description: 'AWS secret access key',
        required: true,
        placeholder: '********'
      },
      {
        name: 'AWS_REGION',
        description: 'AWS region',
        required: true,
        placeholder: 'us-east-1'
      },
      {
        name: 'AWS_S3_BUCKET',
        description: 'S3 bucket name',
        required: true,
        placeholder: 'my-bucket'
      }
    ]
  },
  {
    id: 'redis',
    name: 'Redis',
    description: 'Redis cache and message broker',
    category: 'database',
    icon: 'database',
    variables: [
      {
        name: 'REDIS_HOST',
        description: 'Redis host address',
        required: true,
        placeholder: 'localhost or redis.example.com'
      },
      {
        name: 'REDIS_PORT',
        description: 'Redis port',
        required: true,
        placeholder: '6379',
        validation: {
          pattern: /^\d+$/,
          message: 'Must be a valid port number'
        }
      },
      {
        name: 'REDIS_PASSWORD',
        description: 'Redis password (if required)',
        required: false,
        placeholder: '********'
      },
      {
        name: 'REDIS_URL',
        description: 'Full connection string (alternative)',
        required: false,
        placeholder: 'redis://user:password@host:port/db'
      }
    ]
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Payment processing with Stripe',
    category: 'api',
    icon: 'credit-card',
    variables: [
      {
        name: 'STRIPE_PUBLISHABLE_KEY',
        description: 'Public key for client-side',
        required: true,
        placeholder: 'pk_test_...'
      },
      {
        name: 'STRIPE_SECRET_KEY',
        description: 'Secret key for server-side',
        required: true,
        placeholder: 'sk_test_...'
      },
      {
        name: 'STRIPE_WEBHOOK_SECRET',
        description: 'Webhook endpoint secret',
        required: false,
        placeholder: 'whsec_...'
      }
    ]
  },
  {
    id: 'sendgrid',
    name: 'SendGrid',
    description: 'Email delivery service',
    category: 'messaging',
    icon: 'mail',
    variables: [
      {
        name: 'SENDGRID_API_KEY',
        description: 'SendGrid API key',
        required: true,
        placeholder: 'SG...'
      },
      {
        name: 'SENDGRID_FROM_EMAIL',
        description: 'Default sender email',
        required: true,
        placeholder: 'noreply@example.com',
        validation: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'Must be a valid email address'
        }
      },
      {
        name: 'SENDGRID_FROM_NAME',
        description: 'Default sender name',
        required: false,
        placeholder: 'My App'
      }
    ]
  },
  {
    id: 'github-oauth',
    name: 'GitHub OAuth',
    description: 'GitHub OAuth application',
    category: 'auth',
    icon: 'github',
    variables: [
      {
        name: 'GITHUB_CLIENT_ID',
        description: 'GitHub OAuth app client ID',
        required: true,
        placeholder: 'Iv1...'
      },
      {
        name: 'GITHUB_CLIENT_SECRET',
        description: 'GitHub OAuth app client secret',
        required: true,
        placeholder: '********'
      },
      {
        name: 'GITHUB_REDIRECT_URI',
        description: 'OAuth callback URL',
        required: true,
        placeholder: 'https://myapp.com/auth/github/callback'
      }
    ]
  },
  {
    id: 'google-oauth',
    name: 'Google OAuth',
    description: 'Google OAuth 2.0 authentication',
    category: 'auth',
    icon: 'user',
    variables: [
      {
        name: 'GOOGLE_CLIENT_ID',
        description: 'Google OAuth client ID',
        required: true,
        placeholder: '...apps.googleusercontent.com'
      },
      {
        name: 'GOOGLE_CLIENT_SECRET',
        description: 'Google OAuth client secret',
        required: true,
        placeholder: 'GOCSPX-...'
      },
      {
        name: 'GOOGLE_REDIRECT_URI',
        description: 'OAuth callback URL',
        required: true,
        placeholder: 'https://myapp.com/auth/google/callback'
      }
    ]
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    description: 'MongoDB database connection',
    category: 'database',
    icon: 'database',
    variables: [
      {
        name: 'MONGODB_URI',
        description: 'MongoDB connection string',
        required: true,
        placeholder: 'mongodb://localhost:27017/mydb or mongodb+srv://...',
        validation: {
          pattern: /^mongodb(\+srv)?:\/\/.+/,
          message: 'Must be a valid MongoDB URI'
        }
      },
      {
        name: 'MONGODB_DB_NAME',
        description: 'Database name (if not in URI)',
        required: false,
        placeholder: 'myapp'
      }
    ]
  },
  {
    id: 'nextauth',
    name: 'NextAuth.js',
    description: 'Authentication for Next.js',
    category: 'auth',
    icon: 'shield',
    variables: [
      {
        name: 'NEXTAUTH_URL',
        description: 'Canonical URL of your site',
        required: true,
        placeholder: 'https://myapp.com'
      },
      {
        name: 'NEXTAUTH_SECRET',
        description: 'Secret for encrypting tokens',
        required: true,
        placeholder: 'Generate with: openssl rand -base64 32'
      }
    ]
  },
  {
    id: 'sentry',
    name: 'Sentry',
    description: 'Error tracking and monitoring',
    category: 'monitoring',
    icon: 'activity',
    variables: [
      {
        name: 'SENTRY_DSN',
        description: 'Sentry Data Source Name',
        required: true,
        placeholder: 'https://...@sentry.io/...'
      },
      {
        name: 'SENTRY_AUTH_TOKEN',
        description: 'Authentication token for source maps',
        required: false,
        placeholder: 'sntrys_...'
      },
      {
        name: 'SENTRY_ORG',
        description: 'Sentry organization slug',
        required: false,
        placeholder: 'my-org'
      },
      {
        name: 'SENTRY_PROJECT',
        description: 'Sentry project slug',
        required: false,
        placeholder: 'my-project'
      }
    ]
  }
];

// Helper function to get template by ID
export function getServiceTemplate(id: string): ServiceTemplate | undefined {
  return serviceTemplates.find(template => template.id === id);
}

// Helper function to validate variables against a template
export function validateTemplateVariables(
  templateId: string,
  variables: Record<string, string>
): { 
  valid: boolean; 
  missing: string[]; 
  invalid: Array<{ name: string; message: string }> 
} {
  const template = getServiceTemplate(templateId);
  if (!template) {
    return { valid: false, missing: [], invalid: [] };
  }

  const missing: string[] = [];
  const invalid: Array<{ name: string; message: string }> = [];

  for (const varTemplate of template.variables) {
    const value = variables[varTemplate.name];
    
    // Check required variables
    if (varTemplate.required && !value) {
      missing.push(varTemplate.name);
      continue;
    }
    
    // Validate pattern if exists and value is provided
    if (value && varTemplate.validation?.pattern) {
      if (!varTemplate.validation.pattern.test(value)) {
        invalid.push({
          name: varTemplate.name,
          message: varTemplate.validation.message || 'Invalid format'
        });
      }
    }
  }

  return {
    valid: missing.length === 0 && invalid.length === 0,
    missing,
    invalid
  };
}

// Helper to get all variables for a template
export function getTemplateVariableNames(templateId: string): string[] {
  const template = getServiceTemplate(templateId);
  return template ? template.variables.map(v => v.name) : [];
}

// Helper to check if variables might belong to a template
export function detectServiceTemplate(variableNames: string[]): string | null {
  for (const template of serviceTemplates) {
    const templateVarNames = template.variables
      .filter(v => v.required)
      .map(v => v.name);
    
    // Check if all required variables of this template are present
    const hasAllRequired = templateVarNames.every(name => 
      variableNames.includes(name)
    );
    
    if (hasAllRequired) {
      return template.id;
    }
  }
  
  return null;
}