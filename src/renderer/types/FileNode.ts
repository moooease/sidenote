export type FileNode = {
    type: 'file' | 'folder';
    name: string;
    path: string;
    children?: FileNode[];
};
