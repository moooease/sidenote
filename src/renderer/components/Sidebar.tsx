import React, { useEffect, useState } from 'react';

import { FileNode } from '../types/FileNode';
import FolderTree from './FolderTree';

interface SidebarProps {
    onFileSelect: (path: string, name: string) => void;
}

function Sidebar({ onFileSelect }: SidebarProps) {
    const [rootFolder, setRootFolder] = useState<string | null>(null);
    const [structure, setStructure] = useState<FileNode[]>([]);
    const [creatingItem, setCreatingItem] = useState<null | { type: 'folder' | 'note' }>(null);
    const [newItemName, setNewItemName] = useState('');

    useEffect(() => {
        async function loadSavedRoot() {
            const saved = await window.electronAPI.getSavedRoot();
            if (saved) {
                try {
                    const structure = await window.electronAPI.readFolderStructure(saved);
                    setRootFolder(saved);
                    setStructure(structure);
                } catch (err: any) {
                    console.warn('Saved root folder no longer exists:', saved);
                    console.warn(err);
                    alert('The previously selected root folder could not be found. Please select a new one.');
                    setRootFolder(null);
                    setStructure([]);
                }
            }
        }

        loadSavedRoot();
    }, []);

    const handleSelectFolder = async () => {
        const selectedFolder = await window.electronAPI.selectRootFolder();
        if (selectedFolder) {
            setRootFolder(selectedFolder);
            const folderStructure = await window.electronAPI.readFolderStructure(selectedFolder);
            setStructure(folderStructure);
        }
    };

    const handleItemCreation = async () => {
        if (!rootFolder || !newItemName.trim() || !creatingItem) return;

        const finalName = creatingItem.type === 'note' && !newItemName.endsWith('.md') ? `${newItemName.trim()}.md` : newItemName.trim();

        try {
            if (creatingItem.type === 'folder') {
                await window.electronAPI.createFolder(rootFolder, finalName);
            } else {
                await window.electronAPI.createNote(rootFolder, finalName);
            }

            const updated = await window.electronAPI.readFolderStructure(rootFolder);
            setStructure(updated);
        } catch (err) {
            console.error(`Failed to create ${creatingItem.type}:`, err);
        } finally {
            setCreatingItem(null);
            setNewItemName('');
        }
    };

    return (
        <div className='p-4'>
            <h2 className='mb-4 text-lg font-semibold'>Explorer</h2>

            <button className='mb-4 w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600' onClick={handleSelectFolder}>
                Select Root Folder
            </button>

            {rootFolder && (
                <>
                    <div className='flex gap-2 border-b p-2'>
                        <button
                            className='rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300'
                            onClick={() => {
                                setCreatingItem({ type: 'folder' });
                                setNewItemName('');
                            }}
                        >
                            ➕ New Folder
                        </button>
                        <button
                            className='rounded bg-gray-200 px-2 py-1 text-sm hover:bg-gray-300'
                            onClick={() => {
                                setCreatingItem({ type: 'note' });
                                setNewItemName('');
                            }}
                        >
                            📝 New Note
                        </button>
                    </div>

                    <div className='mb-2 text-sm text-gray-600'>{rootFolder}</div>

                    {structure.length > 0 && (
                        <FolderTree
                            structure={structure}
                            onFileSelect={onFileSelect}
                            rootPath={rootFolder}
                            updateStructure={async () => {
                                const updated = await window.electronAPI.readFolderStructure(rootFolder);
                                setStructure(updated);
                            }}
                        />
                    )}
                </>
            )}

            {creatingItem && (
                <input
                    className='my-2 w-full rounded border px-2 py-1 text-sm'
                    autoFocus
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`Enter ${creatingItem.type === 'folder' ? 'folder' : 'note'} name`}
                    onKeyDown={async (e) => {
                        if (e.key === 'Escape') {
                            setCreatingItem(null);
                            setNewItemName('');
                        } else if (e.key === 'Enter') {
                            await handleItemCreation();
                        }
                    }}
                    onBlur={() => {
                        setCreatingItem(null);
                        setNewItemName('');
                    }}
                />
            )}
        </div>
    );
}

export default Sidebar;
