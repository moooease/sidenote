import debounce from 'lodash/debounce';
import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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
            setCurrentNotePath(filePath); // Save path for autosave
        } catch (error) {
            console.error('Failed to read file:', error);
        }
    }

    const debouncedSave = debounce(async (path: string, content: string) => {
        try {
            await window.electronAPI.saveFile(path, content);
            console.log('Autosaved successfully.');
        } catch (error) {
            console.error('Autosave failed:', error);
        }
    }, 1000);

    return (
        <PanelGroup direction='horizontal' className='h-screen'>
            {/* Sidebar Panel */}
            <Panel defaultSize={20} minSize={10}>
                <div className='h-full overflow-y-auto border-r border-gray-300 bg-white'>
                    <Sidebar onFileSelect={(path, name) => handleOpenFile(path, name)} />
                </div>
            </Panel>

            <PanelResizeHandle className='w-1 cursor-col-resize bg-gray-300' />

            {/* Editor Panel */}
            <Panel defaultSize={60} minSize={30}>
                <div className='h-full overflow-y-auto bg-gray-50 p-4'>
                    {currentNoteName ? (
                        <>
                            <h2 className='mb-2 text-lg font-semibold'>{currentNoteName}</h2>
                            <textarea
                                className='h-[calc(100vh-150px)] w-full resize-none rounded border bg-white p-2'
                                value={editedContent}
                                onChange={(e) => {
                                    const newContent = e.target.value;
                                    setEditedContent(newContent);
                                    if (currentNotePath) {
                                        debouncedSave(currentNotePath, newContent);
                                    }
                                }}
                                placeholder='Start typing your notes...'
                            />
                        </>
                    ) : (
                        <div className='flex h-full items-center justify-center text-gray-400'>Select a note to view.</div>
                    )}
                </div>
            </Panel>

            <PanelResizeHandle className='w-1 cursor-col-resize bg-gray-300' />

            {/* Browser / AI Panel */}
            <Panel defaultSize={20} minSize={10}>
                <div className='h-full overflow-y-auto bg-gray-200 p-4'>
                    <h2 className='text-lg font-semibold'>AI Research Panel / Browser</h2>
                </div>
            </Panel>
        </PanelGroup>
    );
}

export default App;
