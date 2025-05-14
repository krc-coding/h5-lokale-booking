import React, { useState } from "react";
import Button from '@mui/material/Button';
import { Divider, Menu, MenuItem } from "@mui/material";
import resourceManager from "../Utilities/ResourceManager";
import { IUser } from "../types/IUser";

interface INavMenu {
    setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    currentPage: string;
}

const NavMenu = (props: INavMenu) => {
    const user: IUser = JSON.parse(document.body.dataset["user"] ?? "{}");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        window.api.deleteAuthToken();
        setPage("Dashboard");
        const request = resourceManager.makeRequest("/api/logout", "POST");
        request.getResponse().then(() => {
            props.setIsAuthed(false);
            resourceManager.setAuthTokenHeader("");
        }).catch(() => {
            window.location.reload();
        });
    }

    const setPage = (page: string) => {
        props.setCurrentPage(page);
        handleCloseMenu();
    }

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleOpenMenu} sx={{
                position: "absolute",
                top: "1%",
                right: "1%",
            }}>
                {props.currentPage}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
            >
                <MenuItem disabled={props.currentPage == "Dashboard"} onClick={() => setPage("Dashboard")}>Dashboard</MenuItem>
                <MenuItem disabled={props.currentPage == "Profile"} onClick={() => setPage("Profile")}>Profile</MenuItem>
                <MenuItem disabled={props.currentPage == "Admin" || (user.role !== "admin" && user.role !== "systemAdmin")} onClick={() => setPage("Admin")}>Admin</MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default NavMenu;
