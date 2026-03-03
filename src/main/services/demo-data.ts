import type { ClusterContext, SecretSummary, SecretDetail, SecretEntry } from '../../shared/types';

const CONTEXTS: ClusterContext[] = [
  { name: 'prod-us-east-1', cluster: 'eks-prod-us-east-1', user: 'aws-prod-admin' },
  { name: 'staging-eu-west-1', cluster: 'eks-staging-eu-west-1', user: 'aws-staging-dev' },
  { name: 'dev-local', cluster: 'kind-dev-local', user: 'kind-admin', namespace: 'default' },
];

const NAMESPACES = [
  'default',
  'api-gateway',
  'auth-service',
  'monitoring',
  'payments',
  'web-frontend',
];

let currentContext = 'dev-local';

interface MockSecret {
  name: string;
  namespace: string;
  type: string;
  entries: SecretEntry[];
  createdAt: string;
  resourceVersion: string;
}

const SECRETS: MockSecret[] = [
  {
    name: 'database-credentials',
    namespace: 'default',
    type: 'Opaque',
    resourceVersion: '184920',
    createdAt: '2025-11-02T08:14:32Z',
    entries: [
      { key: 'DB_HOST', value: 'postgres-primary.db.svc.cluster.local', isBinary: false },
      { key: 'DB_PORT', value: '5432', isBinary: false },
      { key: 'DB_USER', value: 'app_readwrite', isBinary: false },
      { key: 'DB_PASSWORD', value: 'kP9$mX2vL#nQ8wR4', isBinary: false },
      { key: 'DB_NAME', value: 'secretdesk_production', isBinary: false },
      {
        key: 'CONNECTION_STRING',
        value:
          'postgresql://app_readwrite:kP9$mX2vL#nQ8wR4@postgres-primary.db.svc.cluster.local:5432/secretdesk_production',
        isBinary: false,
      },
    ],
  },
  {
    name: 'stripe-api-keys',
    namespace: 'default',
    type: 'Opaque',
    resourceVersion: '152301',
    createdAt: '2025-10-18T14:22:05Z',
    entries: [
      { key: 'STRIPE_PUBLISHABLE_KEY', value: 'pk_live_51N8xRTK...redacted', isBinary: false },
      { key: 'STRIPE_SECRET_KEY', value: 'sk_live_51N8xRTK...redacted', isBinary: false },
      { key: 'STRIPE_WEBHOOK_SECRET', value: 'whsec_5f3k8...redacted', isBinary: false },
    ],
  },
  {
    name: 'tls-wildcard-cert',
    namespace: 'default',
    type: 'kubernetes.io/tls',
    resourceVersion: '198437',
    createdAt: '2026-01-10T03:00:00Z',
    entries: [
      { key: 'tls.crt', value: 'LS0tLS1CRUdJTi...', isBinary: true },
      { key: 'tls.key', value: 'LS0tLS1CRUdJTi...', isBinary: true },
    ],
  },
  {
    name: 'docker-registry',
    namespace: 'default',
    type: 'kubernetes.io/dockerconfigjson',
    resourceVersion: '112088',
    createdAt: '2025-09-05T11:45:19Z',
    entries: [
      {
        key: '.dockerconfigjson',
        value: '{"auths":{"ghcr.io":{"auth":"Z2hwX3Rl...redacted"}}}',
        isBinary: false,
      },
    ],
  },
  {
    name: 'jwt-signing-keys',
    namespace: 'default',
    type: 'Opaque',
    resourceVersion: '173654',
    createdAt: '2025-10-28T19:33:47Z',
    entries: [
      { key: 'JWT_PRIVATE_KEY', value: 'LS0tLS1CRUdJTi...', isBinary: true },
      { key: 'JWT_PUBLIC_KEY', value: 'LS0tLS1CRUdJTi...', isBinary: true },
    ],
  },
  {
    name: 'smtp-credentials',
    namespace: 'default',
    type: 'Opaque',
    resourceVersion: '165210',
    createdAt: '2025-10-22T07:18:55Z',
    entries: [
      { key: 'SMTP_HOST', value: 'smtp.sendgrid.net', isBinary: false },
      { key: 'SMTP_PORT', value: '587', isBinary: false },
      { key: 'SMTP_USER', value: 'apikey', isBinary: false },
      { key: 'SMTP_PASSWORD', value: 'SG.xK9m2...redacted', isBinary: false },
    ],
  },
  {
    name: 'oauth-github-app',
    namespace: 'default',
    type: 'Opaque',
    resourceVersion: '141877',
    createdAt: '2025-10-12T16:07:23Z',
    entries: [
      { key: 'GITHUB_CLIENT_ID', value: 'Iv1.a8b3c9d2e1f4', isBinary: false },
      { key: 'GITHUB_CLIENT_SECRET', value: 'ghs_7xK9mW2pL...redacted', isBinary: false },
      { key: 'GITHUB_APP_PRIVATE_KEY', value: 'LS0tLS1CRUdJTi...', isBinary: true },
    ],
  },
  {
    name: 'redis-auth',
    namespace: 'default',
    type: 'Opaque',
    resourceVersion: '189302',
    createdAt: '2025-12-01T22:50:11Z',
    entries: [
      { key: 'REDIS_URL', value: 'redis://:s3cur3P@ss@redis-master.cache.svc:6379/0', isBinary: false },
      { key: 'REDIS_PASSWORD', value: 's3cur3P@ss', isBinary: false },
    ],
  },
];

export function listContexts(): ClusterContext[] {
  return CONTEXTS;
}

export function getCurrentContext(): string {
  return currentContext;
}

export function switchContext(contextName: string): void {
  const ctx = CONTEXTS.find((c) => c.name === contextName);
  if (!ctx) {
    throw new Error(`Context "${contextName}" not found`);
  }
  currentContext = contextName;
}

export function deleteContext(_contextName: string): string {
  // No-op in demo mode
  return currentContext;
}

export async function listNamespaces(): Promise<string[]> {
  return NAMESPACES;
}

export async function listSecrets(namespace: string): Promise<SecretSummary[]> {
  return SECRETS.filter((s) => s.namespace === namespace).map((s) => ({
    name: s.name,
    namespace: s.namespace,
    type: s.type,
    entries: s.entries.length,
    createdAt: s.createdAt,
  }));
}

export async function getSecret(namespace: string, name: string): Promise<SecretDetail> {
  const secret = SECRETS.find((s) => s.namespace === namespace && s.name === name);
  if (!secret) {
    throw new Error(`Secret "${name}" not found in namespace "${namespace}"`);
  }
  return {
    name: secret.name,
    namespace: secret.namespace,
    type: secret.type,
    resourceVersion: secret.resourceVersion,
    entries: secret.entries,
    createdAt: secret.createdAt,
  };
}

export async function updateSecret(
  namespace: string,
  name: string,
  entries: SecretEntry[],
  _resourceVersion: string,
): Promise<SecretDetail> {
  const secret = SECRETS.find((s) => s.namespace === namespace && s.name === name);
  if (!secret) {
    throw new Error(`Secret "${name}" not found in namespace "${namespace}"`);
  }
  return {
    name: secret.name,
    namespace: secret.namespace,
    type: secret.type,
    resourceVersion: secret.resourceVersion,
    entries,
    createdAt: secret.createdAt,
  };
}

export async function createSecret(
  namespace: string,
  name: string,
  entries: SecretEntry[],
  type?: string,
): Promise<SecretDetail> {
  return {
    name,
    namespace,
    type: type ?? 'Opaque',
    resourceVersion: '999999',
    entries,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteSecret(_namespace: string, _name: string): Promise<void> {
  // No-op in demo mode
}
