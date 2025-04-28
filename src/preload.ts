import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // APIs will be added here later
});