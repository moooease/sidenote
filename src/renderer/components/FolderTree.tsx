import React, { useState } from 'react';

import { FileNode } from '../types/FileNode';

interface FolderTreeProps {
    structure: FileNode[];
    onFileSelect: (path: string, name: string) => void;
    onSelect?: (node: FileNode) => void; // ✅ Add this
}

interface FolderTreeNodeProps {
    node: FileNode;
    onFileSelect: (path: string, name: string) => void;
    onSelect?: (node: FileNode) => void;
}

function FolderTree({ structure, onFileSelect, onSelect }: FolderTreeProps) {
    return (
        <div className='text-sm'>
            {structure.map((node) => (
                <div key={node.path}>
                    <FolderTreeNode node={node} onFileSelect={onFileSelect} onSelect={onSelect} />
                </div>
            ))}
        </div>
    );
}

function FolderTreeNode({ node, onFileSelect, onSelect }: FolderTreeNodeProps) {
    const [expanded, setExpanded] = useState(false);

    if (node.type === 'folder') {
        return (
            <div className='pl-2'>
                <div
                    className='cursor-pointer font-bold hover:underline'
                    onClick={() => {
                        setExpanded(!expanded);
                        onSelect?.(node);
                    }}
                >
                    {expanded ? '📂' : '📁'} {node.name}
                </div>

                {expanded && node.children && (
                    <div className='pl-4'>
                        {node.children.map((child) => (
                            <div key={child.path}>
                                <FolderTreeNode node={child} onFileSelect={onFileSelect} />
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
                onClick={() => {
                    console.log('Clicked:', node.name, node.path);
                    onFileSelect(node.path, node.name);
                    onSelect?.(node);
                }}
            >
                📝 {node.name}
            </div>
        );
    }
}

export default FolderTree;
