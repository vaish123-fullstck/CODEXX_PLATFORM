import { useState } from "react";

function App() {
    const [folderPath, setFolderPath] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");

    const selectFolder = async () => {
        console.log("📂 Selecting folder...");
        try {
            const result = await window.electron.invoke("select-folder");
            if (result.success) {
                console.log("✅ Upload successful:", result.message);
                setFolderPath(result.folderPath);
                setUploadStatus("✅ Upload successful!");
            } else {
                console.warn("❌ Upload failed or canceled:", result.message);
                setFolderPath(null);
                setUploadStatus(`❌ ${result.message}`);
            }
        } catch (error) {
            console.error("❌ Error selecting folder:", error);
            setUploadStatus("❌ Upload error occurred.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>📁 Folder Uploader</h1>
            <button onClick={selectFolder} style={{ padding: "10px", marginBottom: "10px" }}>
                Select & Upload Folder
            </button>

            {folderPath && (
                <p>📂 Selected Folder: <strong>{folderPath}</strong></p>
            )}

            {uploadStatus && <p style={{ marginTop: "20px" }}>{uploadStatus}</p>}
        </div>
    );
}

export default App;
