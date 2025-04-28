import React, { useState } from 'react';
import { FileNode } from '../types/FileNode';

interface FolderTreeProps {
	structure: FileNode[];
	onFileSelect: (path: string, name: string) => void;
}

interface FolderTreeNodeProps {
	node: FileNode;
	onFileSelect: (path: string, name: string) => void;
}

function FolderTree({ structure, onFileSelect }: FolderTreeProps) {
	return (
		<div className="text-sm">
			{structure.map((node) => (
				<div key={node.path}>
					<FolderTreeNode node={node} onFileSelect={onFileSelect} />
				</div>
			))}
		</div>
	);
}

function FolderTreeNode({ node, onFileSelect }: FolderTreeNodeProps) {
	const [expanded, setExpanded] = useState(false);

	if (node.type === 'folder') {
		return (
			<div className="pl-2">
				<div
					className="cursor-pointer font-bold hover:underline"
					onClick={() => setExpanded(!expanded)}
				>
					{expanded ? '📂' : '📁'} {node.name}
				</div>
				{expanded && node.children && (
					<div className="pl-4">
						{node.children.map((child) => (
							<div key={child.path}>
								<FolderTreeNode
									node={child}
									onFileSelect={onFileSelect}
								/>
							</div>
						))}
					</div>
				)}
			</div>
		);
	} else {
		return (
			<div
				className="pl-2 hover:underline cursor-pointer"
				onClick={() => {
					console.log('Clicked:', node.name, node.path);
					onFileSelect(node.path, node.name);
				}}
			>
				📝 {node.name}
			</div>
		);
	}
}

export default FolderTree;
