import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("desktopApp", {
  platform: process.platform,
  version: process.env.npm_package_version || "1.0.0",
  send: (channel: string, data: unknown) => ipcRenderer.send(channel, data),
  on: (channel: string, func: (...args: unknown[]) => void) =>
    ipcRenderer.on(channel, (_event, ...args) => func(...args)),
});
