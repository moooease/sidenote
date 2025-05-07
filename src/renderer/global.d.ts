export {};

declare global {
    interface Window {
        electronAPI: {
            selectRootFolder: () => Promise<string | null>;
            readFolderStructure: (rootPath: string) => Promise<any>;
            readFile: (filePath: string) => Promise<string>;
            saveFile: (filePath: string, content: string) => Promise<boolean>;
            getSavedRoot: () => Promise<string | null>;
            createFolder: (targetPath: string, folderName: string) => Promise<void>;
            createNote: (targetPath: string, fileName: string) => Promise<void>;
            moveItem: (sourcePath: string, targetFolderPath: string) => Promise<void>;
        };
    }
}
