import React, { useState } from "react";
import { Box } from "@mui/material";
import LoginDialog from "./LoginDialog";
import NavMenu from "./NavMenu";

interface IHeader {
    setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
    currentPage: string;
}

const Header = (props: IHeader) => {
    const [isAuthed, setIsAuthed] = useState(false);

    return (
        <Box sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
            <Box component={"h1"} sx={{ width: "100%" }}>Room Booking System</Box>
            {!isAuthed && (
                <LoginDialog setIsAuthed={setIsAuthed} />
            )}
            {isAuthed && (
                <NavMenu setIsAuthed={setIsAuthed} {...props} />
            )}
        </Box>
    );
}
export default Header;
