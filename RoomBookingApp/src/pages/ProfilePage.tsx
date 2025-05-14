import React, { useEffect, useState } from "react";
import { Box, Card } from "@mui/material";
import { IUser } from "../types/IUser";
import ChangePasswordDialog from "../Components/UserManagementComponents/ChangePasswordDialog";

const ProfilePage = () => {
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
        setUser(JSON.parse(document.body.dataset["user"] ?? "{}"));
    }, [document.body.dataset["user"]]);

    return (
        <Box sx={{ height: "100%", width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <Card variant="outlined" sx={{
                width: "50%",
                height: "50%",
                backgroundColor: "#EDEDED",
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                justifyContent: "space-around",
                alignContent: "center"
            }}>
                <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Box sx={{ marginBottom: "10px", width: "fit-content" }}>Name: {user?.username}</Box>
                    <Box sx={{ width: "fit-content" }}>Role: {user?.role}</Box>
                </Box>
                <Box sx={{ width: "100%", display: "flex", justifyContent: "space-around" }}>
                    <ChangePasswordDialog user={user} />
                </Box>
            </Card>
        </Box>
    );
};

export default ProfilePage;
