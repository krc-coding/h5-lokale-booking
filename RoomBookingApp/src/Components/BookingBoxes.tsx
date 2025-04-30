import React from "react";
import { IBooking } from "../types/IBooking";
import { IRoom } from "../types/IRoom";
import { Box } from "@mui/material";
import { timeToString } from "../Utilities/timeToStringFunction";

interface ITopBox {
    booking: IBooking;
    rooms: IRoom[];
}

export const TopBox = (props: ITopBox) => {
    return (
        <Box
            sx={{
                marginTop: "2px",
                marginX: "2px",
                height: "100%",
                width: "200px",
                border: "1px solid #0c5460",
                borderBottom: "unset",
                borderTopRightRadius: "16px",
                borderTopLeftRadius: "16px",
                backgroundColor: "#d1ecf1",
                display: "flex",
                justifyContent: "space-evenly",
            }}
        >
            <Box
                component={"span"}
                sx={{
                    fontSize: "0.7em"
                }}
            >
                {timeToString(props.booking.start_time)} - {timeToString(props.booking.end_time)}
            </Box>
            <Box
                component={"span"}
            >
                {props.booking.title}
            </Box>
            <Box
                component={"span"}
            >
                [{props.rooms.find((room) => room.id == props.booking.room_id)?.room_number}]
            </Box>
        </Box>
    )
}

export const BottomBox = () => {
    return (
        <Box
            sx={{
                height: "100%",
                width: "200px",
                border: "1px solid #0c5460",
                borderTop: "unset",
                borderBottomRightRadius: "16px",
                borderBottomLeftRadius: "16px",
                backgroundColor: "#d1ecf1",
                marginX: "2px",
            }}
        />
    )
}

export const MiddleBox = () => {
    return (
        <Box
            sx={{
                height: "100%",
                width: "200px",
                border: "1px solid #0c5460",
                borderTop: "unset",
                borderBottom: "unset",
                backgroundColor: "#d1ecf1",
                marginX: "2px",
            }}
        />
    )
}

export const EmptyBox = () => {
    return (
        <Box
            sx={{
                height: "100%",
                width: "200px",
                marginX: "3px",
            }}
        />
    );
}
