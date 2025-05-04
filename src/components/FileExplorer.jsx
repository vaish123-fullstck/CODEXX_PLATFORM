import React, { useEffect, useState } from "react";
import axios from "axios";

// 🔁 Replace with actual logged-in user ID or dynamically passed prop
const userId = "user123";

const FileNode = ({ node, level = 0, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === "folder";
  const paddingLeft = `${level * 20}px`;

  const handleClick = async () => {
    if (!isFolder) {
      try {
        const response = await axios.get("http://localhost:5000/api/files/read", {
          params: {
            userId,
            filePath: node.path
          }
        });
        onSelect({
          name: node.name,
          path: node.path,
          code: response.data.content,
          language: response.data.language
        });
      } catch (err) {
        console.error("❌ Failed to read file:", err.message);
      }
    } else {
      setExpanded(!expanded);
    }
  };

  return (
    <div style={{ paddingLeft }}>
      <span
        onClick={handleClick}
        style={{ cursor: "pointer", fontWeight: isFolder ? "bold" : "normal" }}
      >
        {isFolder ? (expanded ? "📂" : "📁") : "📄"} {node.name}
      </span>
      {isFolder &&
        expanded &&
        node.children.map((child) => (
          <FileNode key={child.path} node={child} level={level + 1} onSelect={onSelect} />
        ))}
    </div>
  );
};

const FileExplorer = ({ setSelectedFile, setCode, setLanguage }) => {
  const [fileTree, setFileTree] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/files/list", {
          params: { userId }
        });
        setFileTree(response.data);
      } catch (error) {
        console.error("❌ Error fetching file list:", error.message);
      }
    };

    fetchFiles();
  }, []);

  const handleFileSelect = ({ name, path, code, language }) => {
    setSelectedFile({ name, path });
    setCode(code);
    setLanguage(language);
  };

  return (
    <div className="sidebar">
      <div className="explorer-title">📁 File Explorer</div>
      {fileTree.length === 0 ? (
        <p>No files uploaded.</p>
      ) : (
        fileTree.map((node) => (
          <FileNode key={node.path} node={node} onSelect={handleFileSelect} />
        ))
      )}
    </div>
  );
};

export default FileExplorer;
