function FileList({ files }) {
    return (
      <div className="file-list">
        {files.length === 0 ? (
          <p>No files selected</p>
        ) : (
          files.map((file, index) => <div key={index} className="file-item">{file}</div>)
        )}
      </div>
    );
  }
  
  export default FileList;
  