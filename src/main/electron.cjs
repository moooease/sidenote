const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "../../preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    if (!app.isPackaged) {
        // Development: Load Vite dev server
        mainWindow.loadURL("http://localhost:5173");
        mainWindow.webContents.openDevTools();
    } else {
        // Production: Load built index.html
        mainWindow.loadFile(
            path.join(__dirname, "../../dist/renderer/index.html")
        );
    }

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
