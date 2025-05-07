import React, { useState } from 'react';

import { FileNode } from '../types/FileNode';

interface FolderTreeProps {
    structure: FileNode[];
    onFileSelect: (path: string, name: string) => void;
    rootPath: string;
    updateStructure: () => Promise<void>;
}

interface FolderTreeNodeProps {
    node: FileNode;
    onFileSelect: (path: string, name: string) => void;
    rootPath: string;
    updateStructure: () => Promise<void>;
}

function FolderTree({ structure, onFileSelect, rootPath, updateStructure }: FolderTreeProps) {
    return (
        <div className='text-sm'>
            {structure.map((node) => (
                <div key={node.path}>
                    <FolderTreeNode node={node} onFileSelect={onFileSelect} rootPath={rootPath} updateStructure={updateStructure} />
                </div>
            ))}
        </div>
    );
}

function FolderTreeNode({ node, onFileSelect, rootPath, updateStructure }: FolderTreeNodeProps) {
    const [expanded, setExpanded] = useState(false);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const sourcePath = e.dataTransfer.getData('application/node-path');
        const destinationPath = node.path;

        if (!sourcePath || sourcePath === destinationPath) return;

        try {
            await window.electronAPI.moveItem(sourcePath, destinationPath);
            await updateStructure();
        } catch (err) {
            console.error('Failed to move item:', err);
        }
    };

    if (node.type === 'folder') {
        return (
            <div className='pl-2'>
                <div
                    className='cursor-pointer font-bold hover:underline'
                    onClick={() => setExpanded(!expanded)}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('application/node-path', node.path)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    {expanded ? '📂' : '📁'} {node.name}
                </div>
                {expanded && node.children && (
                    <div className='pl-4'>
                        {node.children.map((child) => (
                            <div key={child.path}>
                                <FolderTreeNode node={child} onFileSelect={onFileSelect} rootPath={rootPath} updateStructure={updateStructure} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    } else {
        return (
            <div
                className='cursor-pointer pl-2 hover:underline'
                onClick={() => onFileSelect(node.path, node.name)}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('application/node-path', node.path)}
            >
                📝 {node.name}
            </div>
        );
    }
}

export default FolderTree;
