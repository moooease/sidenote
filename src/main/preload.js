const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectRootFolder: () => ipcRenderer.invoke('select-root-folder'),
    readFolderStructure: (rootPath) => ipcRenderer.invoke('read-folder-structure', rootPath),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
    getSavedRoot: () => ipcRenderer.invoke('get-saved-root')
});
