import React from 'react';

function Sidebar() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Explorer</h2>
      <button className="w-full mb-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        + New Folder
      </button>
      <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">
        + New Note
      </button>
    </div>
  );
}

export default Sidebar;