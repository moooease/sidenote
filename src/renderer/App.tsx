import React, { useState } from 'react';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import Sidebar from './components/Sidebar';

function App() {
	const [currentNoteContent, setCurrentNoteContent] = useState<string | null>(
		null
	);
	const [currentNoteName, setCurrentNoteName] = useState<string | null>(null);

	async function handleOpenFile(filePath: string, fileName: string) {
		console.log('Opening file:', filePath);
		const content = await window.electronAPI.readFile(filePath);
		console.log('File content loaded:', content.slice(0, 100)); // show first 100 chars
		setCurrentNoteContent(content);
		setCurrentNoteName(fileName);
	}

	return (
		<PanelGroup direction="horizontal" className="h-screen">
			{/* Sidebar Panel */}
			<Panel defaultSize={20} minSize={10}>
				<div className="h-full bg-white border-r border-gray-300 overflow-y-auto">
					<Sidebar
						onFileSelect={(path, name) =>
							handleOpenFile(path, name)
						}
					/>
				</div>
			</Panel>

			<PanelResizeHandle className="w-1 bg-gray-300 cursor-col-resize" />

			{/* Editor Panel */}
			<Panel defaultSize={60} minSize={30}>
				<div className="h-full bg-gray-50 overflow-y-auto p-4">
					{currentNoteName ? (
						<>
							<h2 className="text-lg font-semibold mb-2">
								{currentNoteName}
							</h2>
							<pre className="whitespace-pre-wrap">
								{currentNoteContent}
							</pre>
						</>
					) : (
						<div className="h-full flex items-center justify-center text-gray-400">
							Select a note to view.
						</div>
					)}
				</div>
			</Panel>

			<PanelResizeHandle className="w-1 bg-gray-300 cursor-col-resize" />

			{/* Browser / AI Panel */}
			<Panel defaultSize={20} minSize={10}>
				<div className="h-full bg-gray-200 overflow-y-auto p-4">
					<h2 className="text-lg font-semibold">
						AI Research Panel / Browser
					</h2>
				</div>
			</Panel>
		</PanelGroup>
	);
}

export default App;
