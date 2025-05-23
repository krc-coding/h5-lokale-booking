import React, { useEffect, useState } from "react";
import resourceManager from "../Utilities/ResourceManager";
import { IRoom } from "../types/IRoom";
import { IBooking } from "../types/IBooking";
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { BottomBox, EmptyBox, MiddleBox, TopBox } from "../Components/BookingBoxes";
import CreateBookingDialog from "../Components/CreateBookingDialog";

/**
 * Creates an array of all valid timestamps between 7 and 17 both inclusive, the timestamps are in 30 minutes intervals.
 * 
 * @returns array of timestamps. 
 */
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
                // Loops through the response data to convert the date strings into date objects.
                data.forEach(booking => {
                    const newBooking: IBooking = {
                        ...booking,
                        start_time: new Date(booking.start_time),
                        end_time: new Date(booking.end_time),
                    }
                    bookings.push(newBooking);
                });

                // Sorts the bookings based on start time, this is important for when checking booking overlaps.
                bookings.sort((a, b) => a.start_time.getTime() - b.start_time.getTime());

                // Checks for booking overlaps and sets the booking index to prevent overlaps.
                let bookingIndex = 0;
                bookings.forEach((booking) => {
                    const overlapBookings = bookings.filter((tempBooking) => {
                        if (tempBooking.id == booking.id) return false;
                        if (tempBooking.start_time >= booking.end_time) return false;
                        if (tempBooking.end_time <= booking.start_time) return false;
                        return true;
                    });

                    if (overlapBookings.length > 0 && !overlapBookings.some((tempBooking) => tempBooking.index === 0)) {
                        booking.index = 0;
                        bookingIndex = 1
                    } else if (overlapBookings.length > 0) {
                        booking.index = bookingIndex;
                        bookingIndex++;
                    } else {
                        booking.index = 0;
                        bookingIndex = 0
                    }
                });
            }
            setBookings(bookings);
        });
    }

    useEffect(() => {
        getRooms();
        getBookings();
    }, []);

    const getBookingsForTimePeriod = (timePeriod: { hour: string, minutes: string }) => {
        if (bookings.length < 1) {
            return null;
        }

        const periodDateTime = new Date();
        periodDateTime.setHours(parseInt(timePeriod.hour));
        periodDateTime.setMinutes(parseInt(timePeriod.minutes));
        periodDateTime.setSeconds(0);
        periodDateTime.setMilliseconds(0);

        // Gets all the bookings relevant for today.
        const filteredBookings = bookings.filter((booking) => {
            const startMinutesRatio = booking.start_time.getMinutes() / 60;
            const endMinutesRatio = booking.end_time.getMinutes() / 60;
            const start_time = new Date(booking.start_time);
            const end_time = new Date(booking.end_time);

            // Normalizes the start and end times minutes, to match the 30 minutes interval of the time periods.
            start_time.setMinutes(startMinutesRatio < 0.5 ? 0 : 30);
            end_time.setMinutes(endMinutesRatio < 0.5 ? 0 : 30);

            return (
                start_time <= periodDateTime &&
                end_time > periodDateTime
            );
        });

        // Sorts the bookings by index, to make it easier to render.
        filteredBookings.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

        return (
            <Box sx={{ display: "flex", height: "100%" }}>
                {filteredBookings.map((booking, arrayIndex) => {
                    // Checks the booking timestamps, and determines which type of box component should be rendered for the current time period.
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let BoxComponent: any = MiddleBox;

                    if (booking.start_time.getHours() == parseInt(timePeriod.hour)) {
                        const startMinutesRatio = booking.start_time.getMinutes() / 60;
                        if ((startMinutesRatio < 0.5 && parseInt(timePeriod.minutes) == 0) || (startMinutesRatio >= 0.5 && parseInt(timePeriod.minutes) == 30)) {
                            BoxComponent = TopBox;
                        }
                    }

                    const end_time = new Date(booking.end_time);
                    if (end_time.getMinutes() == 0) {
                        end_time.setHours(end_time.getHours() - 1);
                        end_time.setMinutes(59);
                    } else {
                        end_time.setMinutes(end_time.getMinutes() - 1);

                    }

                    if (end_time.getHours() == parseInt(timePeriod.hour)) {
                        const endMinutesRatio = end_time.getMinutes() / 60;

                        if ((endMinutesRatio < 0.5 && parseInt(timePeriod.minutes) == 0) || (endMinutesRatio >= 0.5 && parseInt(timePeriod.minutes) == 30)) {
                            BoxComponent = BottomBox;
                        }
                    }

                    // Determines how many empty boxes is required before the actual box.
                    let EmptyBoxCount = 0;
                    if (filteredBookings.length == 1) {
                        EmptyBoxCount = booking.index ?? 0;
                    } else if (filteredBookings.length > 1) {
                        const currentBookingIndex = booking.index ?? 1;
                        if (arrayIndex == 0) EmptyBoxCount = currentBookingIndex;
                        if (arrayIndex > 0) {
                            const previousBookingIndex = filteredBookings[arrayIndex - 1].index ?? 1;
                            EmptyBoxCount = (currentBookingIndex - previousBookingIndex) - 1;
                        }
                    }

                    // Renders the entire timestamp row.
                    return (
                        <React.Fragment
                            key={booking.id}
                        >
                            {Array.from({ length: EmptyBoxCount }).map((_, i) => <EmptyBox key={i} />)}
                            <BoxComponent booking={booking} rooms={rooms} />
                        </React.Fragment>
                    );
                }
                )}
            </Box>
        );
    }

    return (
        <Box sx={{ height: "100%", width: "100%" }}>
            <CreateBookingDialog rooms={rooms} />
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
                            key={`${timePeriod.hour}:${timePeriod.minutes}`}
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
    );
};

export default BookingPage;
