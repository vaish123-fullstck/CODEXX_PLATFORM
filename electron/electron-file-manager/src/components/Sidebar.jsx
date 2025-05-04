function Sidebar({ onSelectFolder }) {
    return (
      <div className="sidebar">
        <button onClick={onSelectFolder}>Select Folder</button>
        <div className="tabs">
          <div className="tab active">Changes</div>
          <div className="tab">History</div>
        </div>
      </div>
    );
  }
  
  export default Sidebar;
  