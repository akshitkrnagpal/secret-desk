import { contextBridge, ipcRenderer } from 'electron';

const api = {
  contexts: {
    list: () => ipcRenderer.invoke('k8s:contexts:list'),
    current: () => ipcRenderer.invoke('k8s:contexts:current'),
    switch: (contextName: string) =>
      ipcRenderer.invoke('k8s:contexts:switch', { contextName }),
    delete: (contextName: string) =>
      ipcRenderer.invoke('k8s:contexts:delete', { contextName }),
  },
  namespaces: {
    list: () => ipcRenderer.invoke('k8s:namespaces:list'),
  },
  secrets: {
    list: (namespace: string) => ipcRenderer.invoke('k8s:secrets:list', { namespace }),
    get: (namespace: string, name: string) =>
      ipcRenderer.invoke('k8s:secrets:get', { namespace, name }),
    update: (
      namespace: string,
      name: string,
      entries: { key: string; value: string; isBinary: boolean }[],
      resourceVersion: string,
    ) =>
      ipcRenderer.invoke('k8s:secrets:update', {
        namespace,
        name,
        entries,
        resourceVersion,
      }),
    create: (
      namespace: string,
      name: string,
      entries: { key: string; value: string; isBinary: boolean }[],
      type?: string,
    ) => ipcRenderer.invoke('k8s:secrets:create', { namespace, name, entries, type }),
    delete: (namespace: string, name: string) =>
      ipcRenderer.invoke('k8s:secrets:delete', { namespace, name }),
  },
};

contextBridge.exposeInMainWorld('secretDesk', api);

export type SecretDeskApi = typeof api;
