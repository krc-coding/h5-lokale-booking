import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Components/Header";
import BookingPage from "./BookingPage";
import ProfilePage from "./ProfilePage";

const RootPage = () => {
    const [currentPage, setCurrentPage] = useState("Dashboard");
    return (
        <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column" }}>
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {currentPage == "Dashboard" &&
                <BookingPage />
            }
            {currentPage == "Profile" &&
                <ProfilePage />
            }
        </Box>
    );
};

export default RootPage;
