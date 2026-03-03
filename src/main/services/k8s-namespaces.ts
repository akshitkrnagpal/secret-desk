import * as k8s from '@kubernetes/client-node';
import { getKubeConfig } from './k8s-client';

export async function listNamespaces(): Promise<string[]> {
  const kc = getKubeConfig();
  const api = kc.makeApiClient(k8s.CoreV1Api);
  const res = await api.listNamespace();
  return (res.items ?? []).map((ns) => ns.metadata!.name!).sort();
}
