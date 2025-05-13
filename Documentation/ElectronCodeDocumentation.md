# Code documentation

*This documents some of the more complex parts of the electron app*

## Booking page:


### Get bookings for time period method:

```ts
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
```

```ts
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
```
