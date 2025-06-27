import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import Editor from './components/Editor';
import Sidebar from './components/Sidebar';

function App() {
    const [currentNoteName, setCurrentNoteName] = useState<string | null>(null);
    const [currentNotePath, setCurrentNotePath] = useState<string | null>(null);
    const [editedContent, setEditedContent] = useState<string>('');

    async function handleOpenFile(filePath: string, fileName: string) {
        try {
            const content = await window.electronAPI.readFile(filePath);
            setEditedContent(content);
            setCurrentNoteName(fileName);
            setCurrentNotePath(filePath);
        } catch (error) {
            console.error('Failed to read file:', error);
        }
    }

    return (
        <PanelGroup direction='horizontal' className='text-dark dark:text-enamel h-screen font-mono'>
            {/* Sidebar Panel */}
            <Panel defaultSize={20} minSize={10}>
                <div className='border-ash bg-enamel dark:border-smoke dark:bg-carbon h-full overflow-y-auto border-r'>
                    <Sidebar onFileSelect={(path, name) => handleOpenFile(path, name)} />
                </div>
            </Panel>

            <PanelResizeHandle className='bg-ash dark:bg-smoke w-1 cursor-col-resize' />

            {/* Editor Panel */}
            <Panel defaultSize={60} minSize={30}>
                {currentNoteName && currentNotePath ? (
                    <Editor noteName={currentNoteName} notePath={currentNotePath} content={editedContent} setContent={setEditedContent} />
                ) : (
                    <div className='bg-enamel text-smoke dark:bg-carbon dark:text-foam flex h-full items-center justify-center'>
                        Select a note to view.
                    </div>
                )}
            </Panel>

            <PanelResizeHandle className='bg-ash dark:bg-smoke w-1 cursor-col-resize' />

            {/* Browser / AI Panel */}
            <Panel defaultSize={20} minSize={10}>
                <div className='bg-cement text-dark dark:bg-soot dark:text-enamel h-full overflow-y-auto p-4'>
                    <h2 className='text-lg font-semibold'>Browser / AI Assistant</h2>
                </div>
            </Panel>
        </PanelGroup>
    );
}

export default App;
