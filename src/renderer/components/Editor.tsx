import debounce from 'lodash/debounce';
import React, { useEffect } from 'react';

interface EditorProps {
    notePath: string | null;
    noteName: string | null;
    content: string;
    setContent: (value: string) => void;
}

function Editor({ notePath, noteName, content, setContent }: EditorProps) {
    useEffect(() => {
        const loadContent = async () => {
            if (notePath) {
                try {
                    const text = await window.electronAPI.readFile(notePath);
                    setContent(text);
                } catch (err) {
                    console.error('Failed to load file content:', err);
                }
            }
        };

        loadContent();
    }, [notePath, setContent]);

    const debouncedSave = debounce(async (path: string, text: string) => {
        try {
            await window.electronAPI.saveFile(path, text);
            console.log('Autosaved');
        } catch (err) {
            console.error('Save failed:', err);
        }
    }, 1000);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setContent(newText);
        if (notePath) {
            debouncedSave(notePath, newText);
        }
    };

    if (!notePath || !noteName) {
        return <div className='text-smoke dark:text-foam flex h-full items-center justify-center'>Select a note to begin editing.</div>;
    }

    return (
        <div className='flex h-full flex-col'>
            <div className='text-smoke dark:text-foam px-4 py-2 text-sm'>{noteName}</div>
            <textarea
                className='text-dark dark:text-enamel flex-grow resize-none bg-transparent p-4 font-mono outline-none'
                value={content}
                onChange={handleChange}
                placeholder='Start typing your notes...'
            />
        </div>
    );
}

export default Editor;
