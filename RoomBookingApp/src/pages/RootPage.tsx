import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Components/Header";
import BookingPage from "./BookingPage";
import ProfilePage from "./ProfilePage";
import AdminPage from "./AdminPage";

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
            {currentPage == "Admin" &&
                <AdminPage />
            }
        </Box>
    );
};

export default RootPage;
