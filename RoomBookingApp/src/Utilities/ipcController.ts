/**
 * This utility can only be used by the main electron process, and not by the renderer process 
 */

import { ipcMain } from "electron";
import fs from "fs";
import os from "os";
import path from "path";

const homedir = os.homedir();
const dataPath = path.resolve(homedir + "/.room_booking_system/data");

// Handles creating the data forlder incase it doesn't exists.
if (!fs.existsSync(homedir + "/.room_booking_system")) {
    fs.mkdirSync(homedir + "/.room_booking_system");
}
if (!fs.existsSync(homedir + "/.room_booking_system/data")) {
    fs.mkdirSync(homedir + "/.room_booking_system/data");
}

ipcMain.handle("authToken", (event: Electron.IpcMainEvent, args: { command: "get"; }) => {
    if (args.command === "get") {
        if (fs.existsSync(dataPath + "/authToken.json")) {
            const file = fs.readFileSync(dataPath + "/authToken.json").toString();
            const data = JSON.parse(file);

            return data.authToken;
        } else {
            return "";
        }
    }
});

ipcMain.on("authToken", (event: Electron.IpcMainEvent, args: { command: "save" | "delete"; token?: string; }) => {
    if (args.command === "save") {
        if (args.token) {
            if (fs.existsSync(dataPath + "/authToken.json")) {
                fs.unlinkSync(dataPath + "/authToken.json");
            }
            fs.writeFileSync(dataPath + "/authToken.json", JSON.stringify({ authToken: args.token }));
        }
        event.reply("authToken", { command: "save", status: "success" });
    } else if (args.command === "delete") {
        if (fs.existsSync(dataPath + "/authToken.json")) {
            fs.unlinkSync(dataPath + "/authToken.json");
        }
        event.reply("authToken", { command: "delete", status: "success" });
    }
});
