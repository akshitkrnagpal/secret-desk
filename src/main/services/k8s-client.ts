import { KubeConfig } from '@kubernetes/client-node';
import { writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { dump } from 'js-yaml';
import type { ClusterContext } from '../../shared/types';

let kubeConfig: KubeConfig | null = null;

function getKubeConfig(): KubeConfig {
  if (!kubeConfig) {
    kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();
  }
  return kubeConfig;
}

export function reloadKubeConfig(): void {
  kubeConfig = null;
  getKubeConfig();
}

export function listContexts(): ClusterContext[] {
  const kc = getKubeConfig();
  return kc.getContexts().map((ctx) => ({
    name: ctx.name,
    cluster: ctx.cluster,
    user: ctx.user,
    namespace: ctx.namespace,
  }));
}

export function getCurrentContext(): string {
  const kc = getKubeConfig();
  return kc.getCurrentContext();
}

export function switchContext(contextName: string): void {
  const kc = getKubeConfig();
  const ctx = kc.getContexts().find((c) => c.name === contextName);
  if (!ctx) {
    throw new Error(`Context "${contextName}" not found in kubeconfig`);
  }
  kc.setCurrentContext(contextName);
}

function getKubeConfigPath(): string {
  const envPath = process.env.KUBECONFIG;
  if (envPath) {
    // KUBECONFIG can be a colon-separated list; use the first file
    return envPath.split(':')[0];
  }
  return join(homedir(), '.kube', 'config');
}

export function deleteContext(contextName: string): string {
  const kc = getKubeConfig();

  const contextIndex = kc.contexts.findIndex((c) => c.name === contextName);
  if (contextIndex === -1) {
    throw new Error(`Context "${contextName}" not found in kubeconfig`);
  }

  // Remove the context
  kc.contexts.splice(contextIndex, 1);

  // Find clusters and users still referenced by remaining contexts
  const referencedClusters = new Set(kc.contexts.map((c) => c.cluster));
  const referencedUsers = new Set(kc.contexts.map((c) => c.user));

  // Remove orphaned clusters and users
  kc.clusters = kc.clusters.filter((c) => referencedClusters.has(c.name));
  kc.users = kc.users.filter((u) => referencedUsers.has(u.name));

  // Update current context if needed
  if (kc.getCurrentContext() === contextName) {
    const newCurrent = kc.contexts.length > 0 ? kc.contexts[0].name : '';
    kc.setCurrentContext(newCurrent);
  }

  // Persist to disk: exportConfig() returns JSON, convert to YAML
  const configJson = JSON.parse(kc.exportConfig());
  const configYaml = dump(configJson, { noRefs: true, lineWidth: -1 });
  writeFileSync(getKubeConfigPath(), configYaml, 'utf-8');

  return kc.getCurrentContext();
}

export { getKubeConfig };
