import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import FileExplorer from "./FileExplorer";
import "./Editor.css";

const CodeEditor = () => {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div className="editor-container">
      {/* 📂 File Explorer Sidebar */}
      <FileExplorer
        setSelectedFile={setSelectedFile}
        setCode={setCode}
        setLanguage={setLanguage}
      />

      {/* 📝 Code Editor Section */}
      <div className="editor-main">
        <div className="editor-header">
          <span>{selectedFile ? selectedFile.name : "No file selected"}</span>
          <button className="save-btn">💾 Save</button>
        </div>

        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={language}
          value={code}
          onChange={(newValue) => setCode(newValue)}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
