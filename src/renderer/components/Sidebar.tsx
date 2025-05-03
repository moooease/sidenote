import React, { useEffect, useState } from 'react';

import { FileNode } from '../types/FileNode';
import FolderTree from './FolderTree';

interface SidebarProps {
    onFileSelect: (path: string, name: string) => void;
}

function Sidebar({ onFileSelect }: SidebarProps) {
    const [rootFolder, setRootFolder] = useState<string | null>(null);
    const [structure, setStructure] = useState<FileNode[]>([]);

    useEffect(() => {
        async function loadSavedRoot() {
            const saved = await window.electronAPI.getSavedRoot();
            if (saved) {
                setRootFolder(saved);
                const structure = await window.electronAPI.readFolderStructure(saved);
                setStructure(structure);
            }
        }

        loadSavedRoot();
    }, []);

    const handleSelectFolder = async () => {
        console.log('Selecting folder...');
        const selectedFolder = await window.electronAPI.selectRootFolder();

        if (selectedFolder) {
            setRootFolder(selectedFolder);
            const folderStructure = await window.electronAPI.readFolderStructure(selectedFolder);
            setStructure(folderStructure);
        }
    };

    return (
        <div className='p-4'>
            <h2 className='mb-4 text-lg font-semibold'>Explorer</h2>
            <button className='mb-4 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600' onClick={handleSelectFolder}>
                Select Root Folder
            </button>

            {rootFolder && <div className='mb-2 text-sm text-gray-600'>{rootFolder}</div>}

            <div>{structure.length > 0 && <FolderTree structure={structure} onFileSelect={onFileSelect} />}</div>
        </div>
    );
}

export default Sidebar;
