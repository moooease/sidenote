const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fsp = require('fs').promises;
const { setConfig, getConfigValue } = require('./persistence');

let mainWindow = null;

const createWindow = () => {
    const preloadPath = path.join(__dirname, 'preload.js');
    console.log('Preload path:', preloadPath);

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: preloadPath,
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (!app.isPackaged) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'));
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.whenReady().then(createWindow);

ipcMain.handle('select-root-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
    });

    if (!result.canceled && result.filePaths.length > 0) {
        const selected = result.filePaths[0];
        setConfig('rootPath', selected);
        return selected;
    }

    return null;
});

ipcMain.handle('get-saved-root', async () => {
    return getConfigValue('rootPath');
});

ipcMain.handle('read-folder-structure', async (event, rootPath) => {
    async function readFolder(dir) {
        const entries = await fsp.readdir(dir, { withFileTypes: true });
        return Promise.all(
            entries.map(async (entry) => {
                const fullPath = `${dir}/${entry.name}`;
                if (entry.isDirectory()) {
                    return {
                        type: 'folder',
                        name: entry.name,
                        path: fullPath,
                        children: await readFolder(fullPath)
                    };
                } else if (entry.isFile() && entry.name.endsWith('.md')) {
                    return {
                        type: 'file',
                        name: entry.name,
                        path: fullPath
                    };
                } else {
                    return null;
                }
            })
        ).then((results) => results.filter(Boolean));
    }

    return await readFolder(rootPath);
});

ipcMain.handle('read-file', async (event, filePath) => {
    return await fsp.readFile(filePath, 'utf-8');
});

ipcMain.handle('save-file', async (event, filePath, content) => {
    await fsp.writeFile(filePath, content, 'utf-8');
    return true;
});

ipcMain.handle('create-folder', async (event, targetPath, folderName) => {
    const newFolderPath = path.join(targetPath, folderName);
    try {
        await fsp.mkdir(newFolderPath, { recursive: true });
    } catch (err) {
        console.error('Failed to create folder:', err);
        throw err;
    }
});

ipcMain.handle('create-note', async (event, targetPath, fileName) => {
    const newFilePath = path.join(targetPath, fileName);
    try {
        await fsp.writeFile(newFilePath, '', 'utf-8'); // Create empty note
    } catch (err) {
        console.error('Failed to create note:', err);
        throw err;
    }
});

ipcMain.handle('move-item', async (event, sourcePath, targetFolderPath) => {
    const fs = require('fs');
    const fsp = fs.promises;
    const path = require('path');

    const itemName = path.basename(sourcePath);
    let destinationPath = path.join(targetFolderPath, itemName);

    try {
        // ✅ If source doesn't exist, abort
        await fsp.access(sourcePath);
    } catch {
        console.warn(`[move-item] Source does not exist: ${sourcePath}`);
        return { success: false, reason: 'Source does not exist' };
    }

    try {
        // 🔁 Handle name collision
        try {
            await fsp.access(destinationPath);

            const ext = path.extname(itemName);
            const base = path.basename(itemName, ext);
            let i = 1;

            while (true) {
                const newName = `${base} (${i})${ext}`;
                const newPath = path.join(targetFolderPath, newName);
                try {
                    await fsp.access(newPath);
                    i++;
                } catch {
                    destinationPath = newPath;
                    break;
                }
            }
        } catch {
            // destinationPath doesn't exist — all good
        }

        await fsp.rename(sourcePath, destinationPath);
        return { success: true };
    } catch (err) {
        console.error('[move-item] Rename failed:', err);
        return { success: false, reason: err.message };
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
