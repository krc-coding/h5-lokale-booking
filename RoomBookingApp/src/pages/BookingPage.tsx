import React, { useEffect, useState } from "react";
import resourceManager from "../Utilities/ResourceManager";
import { IRoom } from "../types/IRoom";
import { IBooking } from "../types/IBooking";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";


const BookingPage = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [bookings, setBookings] = useState<IBooking[]>([]);

    const getRooms = () => {
        resourceManager.makeRequest("/api/room", "GET").getResponse().then((response) => {
            setRooms(response.data);
        });

    }

    const getBookings = () => {
        resourceManager.makeRequest("/api/booking", "GET").getResponse().then((response) => {
            const data = response.data as IBooking[];
            const bookings: IBooking[] = [];
            if (data.length > 0) {
                data.forEach(booking => {
                    const newBooking: IBooking = {
                        ...booking,
                        start_time: new Date(booking.start_time),
                        end_time: new Date(booking.end_time),
                    }
                    bookings.push(newBooking);
                });
            }
            setBookings(bookings);
        });
    }

    useEffect(() => {
        getRooms();
        getBookings();
    }, []);

    const timePeriods = () => {
        const timePeriods = [];
        for (let timePeriod = 700; timePeriod < 1700; timePeriod += 30) {
            if (timePeriod.toString().includes("60")) timePeriod += 40;
            let hour = (timePeriod / 100).toFixed(0);
            if (hour.length == 1) {
                hour = `0${hour}`;
            }
            let minutes = (timePeriod % 100).toFixed(0);
            if (minutes.length == 1) {
                minutes = `${minutes}0`;
            }
            timePeriods.push({ hour: hour, minutes: minutes });
        }
        return timePeriods;
    };

    const getBookingsForTimePeriod = (timePeriod: { hour: string, minutes: string }) => {
        if (bookings.length < 1) {
            return null;
        }

        const periodDateTime = new Date();
        periodDateTime.setHours(parseInt(timePeriod.hour));
        periodDateTime.setMinutes(parseInt(timePeriod.minutes));

        const filteredBookings = bookings.filter((booking) => {
            return (
                booking.start_time <= periodDateTime &&
                booking.end_time >= periodDateTime
            );
        });

        return (
            <Box sx={{ display: "flex", height: "100%" }}>
                {filteredBookings.map((booking) => {
                    if (booking.start_time.getHours() == parseInt(timePeriod.hour)) {
                        const temp = booking.start_time.getMinutes() / 60;

                        let startHour = booking.start_time.getHours().toFixed(0);
                        if (startHour.length == 1) {
                            startHour = `0${startHour}`;
                        }
                        let startMinutes = booking.start_time.getMinutes().toFixed(0);
                        if (startMinutes.length == 1) {
                            startMinutes = `${startMinutes}0`;
                        }
                        let endHour = booking.end_time.getHours().toFixed(0);
                        if (endHour.length == 1) {
                            endHour = `0${endHour}`;
                        }
                        let endMinutes = booking.end_time.getMinutes().toFixed(0);
                        if (endMinutes.length == 1) {
                            endMinutes = `${endMinutes}0`;
                        }

                        if ((temp < 0.5 && parseInt(timePeriod.minutes) == 0) || (temp >= 0.5 && parseInt(timePeriod.minutes) == 30)) {
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
                                        }}
                                    >
                                        {booking.title}
                                    </Box>
                                    <Box
                                        component={"span"}
                                        sx={{
                                            alignSelf: "start",
                                            justifySelf: "end",
                                        }}
                                    >
                                        [{rooms.find((room) => room.id == booking.room_id)?.room_number}]
                                    </Box>
                                    <br />
                                    <Box
                                        component={"span"}
                                        sx={{
                                        }}
                                    >
                                        {startHour}:{startMinutes} - {endHour}:{endMinutes}
                                    </Box>
                                </Box>
                            )
                        }
                    }

                    const end_time = booking.end_time;
                    if (end_time.getMinutes() == 0) {
                        end_time.setHours(end_time.getHours() - 1);
                        end_time.setMinutes(59);
                    }

                    if (end_time.getHours() == parseInt(timePeriod.hour)) {
                        const temp = end_time.getMinutes() / 60;

                        if ((temp < 0.5 && parseInt(timePeriod.minutes) == 0) || (temp >= 0.5 && parseInt(timePeriod.minutes) == 30)) {
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
                    }

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
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", height: "100%", width: "100%", flexDirection: "column" }}>
            <h1>Room Booking System</h1>
            <Box sx={{ height: "100%", width: "100%", backgroundColor: "white" }}>
                <Table stickyHeader size="small" sx={{ height: "fit-content" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "10%" }}>Time period</TableCell>
                            <TableCell>Bookings</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {timePeriods().map((timePeriod) => (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {timePeriod.hour}:{timePeriod.minutes}
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ padding: "0px" }}>
                                    {getBookingsForTimePeriod(timePeriod)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </Box>
    );
};

export default BookingPage;
