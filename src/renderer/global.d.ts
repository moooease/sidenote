export {};

declare global {
    interface Window {
        electronAPI: {
            selectRootFolder: () => Promise<string | null>;
            readFolderStructure: (rootPath: string) => Promise<any>;
            readFile: (filePath: string) => Promise<string>;
            saveFile: (filePath: string, content: string) => Promise<boolean>;
            getSavedRoot: () => Promise<string | null>;
        };
    }
}
