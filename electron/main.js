const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");

const PORT = 5000;
let mainWindow;

const server = express();
server.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
server.use(express.json());

const createElectronWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5174");
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
};

// ✅ IPC for folder selection + upload
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });

  if (result.canceled || result.filePaths.length === 0) {
    return { success: false, message: "No folder selected." };
  }

  const rootFolder = result.filePaths[0];
  const repoName = path.basename(rootFolder); // 🆕 repoName from folder name

  const walk = (dir, root) => {
    let results = [];
    const list = fs.readdirSync(dir);

    const ignored = new Set([".git", ".gitignore", ".gitattributes", ".gitmodules"]);

    list.forEach((file) => {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);

      if (stat.isDirectory() && file.startsWith(".")) return;
      if (stat.isDirectory()) {
        results = results.concat(walk(filepath, root));
      } else {
        const relative = path.relative(root, filepath);
        if (relative.includes(`${path.sep}.git${path.sep}`)) return;
        if (ignored.has(path.basename(relative))) return;

        results.push({ absolutePath: filepath, relativePath: relative });
      }
    });

    return results;
  };

  const files = walk(rootFolder, rootFolder);

  for (const file of files) {
    const form = new FormData();
    form.append("file", fs.createReadStream(file.absolutePath));
    form.append("relativePath", file.relativePath);
    form.append("repoName", repoName);

    try {
      await axios.post("http://localhost:5000/api/files/upload-file", form, {
        headers: {
          ...form.getHeaders(),
          Origin: "http://localhost:5174"
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    } catch (err) {
      console.error(`❌ Failed to upload ${file.relativePath}:`, err.message);
      return {
        success: false,
        message: `Upload failed at ${file.relativePath}`,
        folderPath: rootFolder
      };
    }
  }

  return {
    success: true,
    message: "✅ All files uploaded!",
    folderPath: rootFolder
  };
});

server.listen(PORT, () => console.log(`🚀 Express (Electron) running on http://localhost:${PORT}`));
app.whenReady().then(() => {
  createElectronWindow();
  axios.get("http://localhost:5000/api/electron-handshake", {
    headers: { Origin: "http://localhost:5174" }
  }).then(() => console.log("🤝 Electron-Website handshake success"))
    .catch(console.error);
});
