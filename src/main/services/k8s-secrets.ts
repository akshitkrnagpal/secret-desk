import * as k8s from '@kubernetes/client-node';
import { getKubeConfig } from './k8s-client';
import type { SecretSummary, SecretDetail, SecretEntry } from '../../shared/types';

function isBinaryData(value: string): boolean {
  try {
    const decoded = Buffer.from(value, 'base64').toString('utf-8');
    // Check for non-printable characters (excluding common whitespace)
    for (let i = 0; i < decoded.length; i++) {
      const code = decoded.charCodeAt(i);
      if (code < 32 && code !== 9 && code !== 10 && code !== 13) {
        return true;
      }
    }
    return false;
  } catch {
    return true;
  }
}

function decodeSecretData(data: Record<string, string> | undefined): SecretEntry[] {
  if (!data) return [];
  return Object.entries(data).map(([key, value]) => {
    const binary = isBinaryData(value);
    return {
      key,
      value: binary ? value : Buffer.from(value, 'base64').toString('utf-8'),
      isBinary: binary,
    };
  });
}

function encodeSecretData(entries: SecretEntry[]): Record<string, string> {
  const data: Record<string, string> = {};
  for (const entry of entries) {
    if (entry.key.trim()) {
      data[entry.key] = entry.isBinary
        ? entry.value
        : Buffer.from(entry.value).toString('base64');
    }
  }
  return data;
}

export async function listSecrets(namespace: string): Promise<SecretSummary[]> {
  const kc = getKubeConfig();
  const api = kc.makeApiClient(k8s.CoreV1Api);
  const res = await api.listNamespacedSecret({ namespace });
  return (res.items ?? []).map((s) => ({
    name: s.metadata!.name!,
    namespace: s.metadata!.namespace!,
    type: s.type ?? 'Opaque',
    entries: Object.keys(s.data ?? {}).length,
    createdAt: s.metadata!.creationTimestamp?.toISOString() ?? '',
  }));
}

export async function getSecret(namespace: string, name: string): Promise<SecretDetail> {
  const kc = getKubeConfig();
  const api = kc.makeApiClient(k8s.CoreV1Api);
  const s = await api.readNamespacedSecret({ namespace, name });
  return {
    name: s.metadata!.name!,
    namespace: s.metadata!.namespace!,
    type: s.type ?? 'Opaque',
    resourceVersion: s.metadata!.resourceVersion!,
    entries: decodeSecretData(s.data),
    createdAt: s.metadata!.creationTimestamp?.toISOString() ?? '',
  };
}

export async function updateSecret(
  namespace: string,
  name: string,
  entries: SecretEntry[],
  resourceVersion: string,
): Promise<SecretDetail> {
  const kc = getKubeConfig();
  const api = kc.makeApiClient(k8s.CoreV1Api);
  const s = await api.replaceNamespacedSecret({
    namespace,
    name,
    body: {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name, namespace, resourceVersion },
      data: encodeSecretData(entries),
    },
  });
  return {
    name: s.metadata!.name!,
    namespace: s.metadata!.namespace!,
    type: s.type ?? 'Opaque',
    resourceVersion: s.metadata!.resourceVersion!,
    entries: decodeSecretData(s.data),
    createdAt: s.metadata!.creationTimestamp?.toISOString() ?? '',
  };
}

export async function createSecret(
  namespace: string,
  name: string,
  entries: SecretEntry[],
  type?: string,
): Promise<SecretDetail> {
  const kc = getKubeConfig();
  const api = kc.makeApiClient(k8s.CoreV1Api);
  const s = await api.createNamespacedSecret({
    namespace,
    body: {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: { name, namespace },
      type: type || 'Opaque',
      data: encodeSecretData(entries),
    },
  });
  return {
    name: s.metadata!.name!,
    namespace: s.metadata!.namespace!,
    type: s.type ?? 'Opaque',
    resourceVersion: s.metadata!.resourceVersion!,
    entries: decodeSecretData(s.data),
    createdAt: s.metadata!.creationTimestamp?.toISOString() ?? '',
  };
}

export async function deleteSecret(namespace: string, name: string): Promise<void> {
  const kc = getKubeConfig();
  const api = kc.makeApiClient(k8s.CoreV1Api);
  await api.deleteNamespacedSecret({ namespace, name });
}
