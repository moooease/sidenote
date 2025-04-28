import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
    // We'll expand this later for filesystem access, settings, etc.
});
