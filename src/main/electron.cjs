const { app, BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const fsp = require('fs').promises;

let mainWindow = null;

const createWindow = () => {
    console.log('Preload path:', path.join(__dirname, 'preload.js'));

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (!app.isPackaged) {
        // Development: Load Vite dev server
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Production: Load built index.html
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

    if (result.canceled) {
        return null;
    } else {
        const folderPath = result.filePaths[0];
        return folderPath;
    }
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
                    return null; // ignore non-markdown files
                }
            })
        ).then((results) => results.filter(Boolean));
    }

    return await readFolder(rootPath);
});

ipcMain.handle('read-file', async (event, filePath) => {
    const content = await fsp.readFile(filePath, 'utf-8');
    return content;
});

ipcMain.handle('save-file', async (event, filePath, content) => {
    await fsp.writeFile(filePath, content, 'utf-8');
    return true;
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
