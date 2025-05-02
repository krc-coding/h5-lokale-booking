// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    saveAuthToken: (authToken: string) => {
        ipcRenderer.send("authToken", {
            command: "save",
            token: authToken
        });
    },
    getAuthToken: () => {
        return ipcRenderer.invoke("authToken", {
            command: "get",
        });
    },
    deleteAuthToken: () => {
        ipcRenderer.send("authToken", {
            command: "delete",
        });
    }
});
