import { ipcMain } from 'electron';
import * as demo from '../services/demo-data';
import { listContexts, getCurrentContext, switchContext, deleteContext } from '../services/k8s-client';
import { listNamespaces } from '../services/k8s-namespaces';
import {
  listSecrets,
  getSecret,
  updateSecret,
  createSecret,
  deleteSecret,
} from '../services/k8s-secrets';

const isDemoMode = !!process.env.DEMO_MODE;

export function registerIpcHandlers(): void {
  ipcMain.handle('k8s:contexts:list', () => {
    return isDemoMode ? demo.listContexts() : listContexts();
  });

  ipcMain.handle('k8s:contexts:current', () => {
    return isDemoMode ? demo.getCurrentContext() : getCurrentContext();
  });

  ipcMain.handle('k8s:contexts:switch', (_event, payload: { contextName: string }) => {
    if (isDemoMode) return demo.switchContext(payload.contextName);
    switchContext(payload.contextName);
  });

  ipcMain.handle('k8s:contexts:delete', (_event, payload: { contextName: string }) => {
    return isDemoMode ? demo.deleteContext(payload.contextName) : deleteContext(payload.contextName);
  });

  ipcMain.handle('k8s:namespaces:list', () => {
    return isDemoMode ? demo.listNamespaces() : listNamespaces();
  });

  ipcMain.handle('k8s:secrets:list', (_event, payload: { namespace: string }) => {
    return isDemoMode ? demo.listSecrets(payload.namespace) : listSecrets(payload.namespace);
  });

  ipcMain.handle(
    'k8s:secrets:get',
    (_event, payload: { namespace: string; name: string }) => {
      return isDemoMode
        ? demo.getSecret(payload.namespace, payload.name)
        : getSecret(payload.namespace, payload.name);
    },
  );

  ipcMain.handle(
    'k8s:secrets:update',
    (
      _event,
      payload: {
        namespace: string;
        name: string;
        entries: { key: string; value: string; isBinary: boolean }[];
        resourceVersion: string;
      },
    ) => {
      return isDemoMode
        ? demo.updateSecret(payload.namespace, payload.name, payload.entries, payload.resourceVersion)
        : updateSecret(payload.namespace, payload.name, payload.entries, payload.resourceVersion);
    },
  );

  ipcMain.handle(
    'k8s:secrets:create',
    (
      _event,
      payload: {
        namespace: string;
        name: string;
        entries: { key: string; value: string; isBinary: boolean }[];
        type?: string;
      },
    ) => {
      return isDemoMode
        ? demo.createSecret(payload.namespace, payload.name, payload.entries, payload.type)
        : createSecret(payload.namespace, payload.name, payload.entries, payload.type);
    },
  );

  ipcMain.handle(
    'k8s:secrets:delete',
    (_event, payload: { namespace: string; name: string }) => {
      return isDemoMode
        ? demo.deleteSecret(payload.namespace, payload.name)
        : deleteSecret(payload.namespace, payload.name);
    },
  );
}
