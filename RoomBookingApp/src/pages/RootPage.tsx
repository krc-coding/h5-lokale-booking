import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../Components/Header";
import BookingPage from "./BookingPage";

const RootPage = () => {
    const [currentPage, setCurrentPage] = useState("Dashboard");
    return (
        <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column" }}>
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <BookingPage />
        </Box>
    );
};

export default RootPage;
