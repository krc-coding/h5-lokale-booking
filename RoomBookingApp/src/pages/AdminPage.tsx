import React, { useEffect, useState } from "react";
import { Box, Card, Divider, IconButton } from "@mui/material";
import { IUser } from "../types/IUser";
import { IRoom } from "../types/IRoom";
import resourceManager from "../Utilities/ResourceManager";
import CreateUserDialog from "../Components/UserManagementComponents/CreateUserDialog";
import Delete from "@mui/icons-material/Delete";
import EditUserDialog from "../Components/UserManagementComponents/EditUserDialog";

const AdminPage = () => {
    const [currentUser, setCurrentUser] = useState<IUser>();
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);

    const getRooms = () => {
        resourceManager.makeRequest("/api/room", "GET").getResponse()
            .then((response) => {
                setRooms(response.data);
            }).catch((error) => {
                console.error(error);
            });
    }

    const getUsers = () => {
        resourceManager.makeRequest("/api/user/getAllUsers", "GET").getResponse()
            .then((response) => {
                setUsers(response.data);
            }).catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getUsers();
        getRooms();
        setCurrentUser(JSON.parse(document.body.dataset["user"] ?? "{}"));
    }, [document.body.dataset["user"]]);

    const deleteUser = (userId: number) => {
        resourceManager.makeRequest("/api/user/deleteUser/" + userId, "DELETE").getResponse()
            .then(() => {
                setUsers(users.filter(user => user.id !== userId));
            }).catch((error) => {
                console.error(error);
            });
    };

    const deleteRoom = (roomId: number) => {
        resourceManager.makeRequest("/api/room/delete/" + roomId, "DELETE").getResponse()
            .then(() => {
                setRooms(rooms.filter(room => room.id !== roomId));
            }).catch((error) => {
                console.error(error);
            });
    };

    return (
        <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <span>User management</span>
            <Divider sx={{ width: "100%", marginY: "10px" }} />
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                {users.map((user) =>
                    <Card variant="outlined" sx={{
                        width: "200px",
                        height: "120px",

                        backgroundColor: "#EDEDED",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        alignContent: "center"
                    }}>
                        <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                            <Box sx={{ width: "fit-content" }}>Name: {user?.username}</Box>
                            <Box sx={{ width: "fit-content" }}>Role: {user?.role}</Box>
                            <Box sx={{ width: "fit-content" }}>Disabled: {user?.disabled ? "yes" : "no"}</Box>
                            <Box>
                                <EditUserDialog updateUsers={getUsers} user={user} />
                                <IconButton disabled={user.id == currentUser?.id} onClick={() => deleteUser(user.id)}><Delete /></IconButton>
                            </Box>
                        </Box>
                    </Card>
                )}
                <CreateUserDialog updateUsers={getUsers} />
            </Box>
            <Divider sx={{ width: "100%", marginY: "10px", borderWidth: "10px" }} />
            <span>Room management</span>
            <Divider sx={{ width: "100%", marginY: "10px" }} />
            <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
                {rooms.map((room) =>
                    <Card variant="outlined" sx={{
                        width: "200px",
                        height: "120px",

                        backgroundColor: "#EDEDED",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        alignContent: "center"
                    }}>
                        <Box sx={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around" }}>
                            <Box sx={{ width: "fit-content" }}>Name: {room.name}</Box>
                            <Box sx={{ width: "fit-content" }}>Room number: {room.room_number}</Box>
                            <Box sx={{ width: "fit-content" }}>Max people: {room.max_people}</Box>
                            <Box>
                                {/* <EditUserDialog updateUsers={getUsers} room={room} /> */}
                                <IconButton disabled={currentUser?.role !== "admin"} onClick={() => deleteRoom(room.id)}><Delete /></IconButton>
                            </Box>
                        </Box>
                    </Card>
                )}
                <CreateUserDialog updateUsers={getUsers} />
            </Box>
        </Box>
    );
};

export default AdminPage;
