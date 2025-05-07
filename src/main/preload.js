const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectRootFolder: () => ipcRenderer.invoke('select-root-folder'),
    readFolderStructure: (rootPath) => ipcRenderer.invoke('read-folder-structure', rootPath),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
    getSavedRoot: () => ipcRenderer.invoke('get-saved-root'),
    createFolder: (targetPath, folderName) => ipcRenderer.invoke('create-folder', targetPath, folderName),
    createNote: (targetPath, fileName) => ipcRenderer.invoke('create-note', targetPath, fileName),
    moveItem: (sourcePath, targetFolderPath) => ipcRenderer.invoke('move-item', sourcePath, targetFolderPath)
});
