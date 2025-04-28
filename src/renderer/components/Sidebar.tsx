import React, { useState } from 'react';
import FolderTree from './FolderTree';
import { FileNode } from '../types/FileNode';

interface SidebarProps {
	onFileSelect: (path: string, name: string) => void;
}

function Sidebar({ onFileSelect }: SidebarProps) {
	const [rootFolder, setRootFolder] = useState<string | null>(null);
	const [structure, setStructure] = useState<FileNode[]>([]);

	const handleSelectFolder = async () => {
		console.log('Selecting folder...');
		const selectedFolder = await window.electronAPI.selectRootFolder();

		if (selectedFolder) {
			setRootFolder(selectedFolder);
			const folderStructure =
				await window.electronAPI.readFolderStructure(selectedFolder);
			setStructure(folderStructure);
		}
	};

	return (
		<div className="p-4">
			<h2 className="text-lg font-semibold mb-4">Explorer</h2>
			<button
				className="w-full mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				onClick={handleSelectFolder}
			>
				Select Root Folder
			</button>

			{rootFolder && (
				<div className="text-sm mb-2 text-gray-600">{rootFolder}</div>
			)}

			<div>
				{structure.length > 0 && (
					<FolderTree
						structure={structure}
						onFileSelect={onFileSelect}
					/>
				)}
			</div>
		</div>
	);
}

export default Sidebar;
