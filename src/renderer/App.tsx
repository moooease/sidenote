import React from "react";
import Sidebar from "./components/Sidebar";

function App() {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-64 bg-white border-r border-gray-300 overflow-y-auto">
                <Sidebar />
            </div>
            <div className="flex-1 bg-gray-50 border-r border-gray-300 overflow-y-auto p-4">
                <h1 className="text-xl font-bold">Note Editor</h1>
            </div>
            <div className="w-[400px] bg-gray-200 overflow-y-auto p-4">
                <h2 className="text-lg font-semibold">
                    AI Research Panel / Browser
                </h2>
            </div>
        </div>
    );
}

export default App;
