export interface ClusterContext {
  name: string;
  cluster: string;
  user: string;
  namespace?: string;
}

export interface SecretSummary {
  name: string;
  namespace: string;
  type: string;
  entries: number;
  createdAt: string;
}

export interface SecretEntry {
  key: string;
  value: string;
  isBinary: boolean;
}

export interface SecretDetail {
  name: string;
  namespace: string;
  type: string;
  resourceVersion: string;
  entries: SecretEntry[];
  createdAt: string;
}

export interface IpcApi {
  'k8s:contexts:list': () => Promise<ClusterContext[]>;
  'k8s:contexts:current': () => Promise<string>;
  'k8s:contexts:switch': (payload: { contextName: string }) => Promise<void>;
  'k8s:contexts:delete': (payload: { contextName: string }) => Promise<string>;
  'k8s:namespaces:list': () => Promise<string[]>;
  'k8s:secrets:list': (payload: { namespace: string }) => Promise<SecretSummary[]>;
  'k8s:secrets:get': (payload: { namespace: string; name: string }) => Promise<SecretDetail>;
  'k8s:secrets:update': (payload: {
    namespace: string;
    name: string;
    entries: SecretEntry[];
    resourceVersion: string;
  }) => Promise<SecretDetail>;
  'k8s:secrets:create': (payload: {
    namespace: string;
    name: string;
    entries: SecretEntry[];
    type?: string;
  }) => Promise<SecretDetail>;
  'k8s:secrets:delete': (payload: { namespace: string; name: string }) => Promise<void>;
}
