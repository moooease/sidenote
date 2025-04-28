import React from "react";

function App() {
    return (
        <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <div
                style={{
                    width: "250px",
                    borderRight: "1px solid #ccc",
                    overflowY: "auto",
                }}
            >
                {/* Sidebar component will go here */}
            </div>

            {/* Editor */}
            <div
                style={{
                    flex: 1,
                    borderRight: "1px solid #ccc",
                    overflowY: "auto",
                }}
            >
                {/* NoteEditor component will go here */}
            </div>

            {/* Right Panel (AI or Browser) */}
            <div style={{ width: "400px", overflowY: "auto" }}>
                {/* BrowserPanel or AIResearchPanel will go here */}
            </div>
        </div>
    );
}

export default App;
