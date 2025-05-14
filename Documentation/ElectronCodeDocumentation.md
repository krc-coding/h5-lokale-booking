# Code documentation (Kasper R)

*This documents some of the more complex/interesting parts of the electron app*

## Prerequisites

The code docs are written, with the assumption of some basic knowlegde in the following areas:

* React hooks.
* React components.
* Electron core features.

## Booking page

The code for the booking page can be found in `RoomBookingApp/src/pages/BookingPage.tsx`.

### Time periods method

The time periods method doesn't require any params.  
It returns an array of time periods, between 7 and 17 in intervals of 30 minutes.

```ts
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
```

---

### Get bookings method

This method handles making a request to the server, to get all bookings.  
After it gets a response from the server, then it will first convert the date time strings into date objects, which is then used to sort the bookings.  
Once the bookings are sorted based on the start time, then it will calculate a index for each booking, trying to use the lowest aviable index, without causing bookings to overlap on the same index.  
After the index for each booking is saved on the booking object, then it sets a statefull variable, which can then be used by the rest of the code.

```ts
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
```

---

### Get bookings for time period method

The method takes in a time period, for which it should generate the booking boxes.  
It returns a jsx element, containing all the correct booking boxes in the correct places to create the booking page, where bookings goes across multiple time periods.

The first part of the method, contains a check to a state variable containing all bookings, if the array is empty then it won't continue in the function.  
It also creates a temporary date time variable and sets it to the current time period, .

```ts
const getBookingsForTimePeriod = (timePeriod: { hour: string, minutes: string }) => {
if (bookings.length < 1) {
    return null;
}

const periodDateTime = new Date();
periodDateTime.setHours(parseInt(timePeriod.hour));
periodDateTime.setMinutes(parseInt(timePeriod.minutes));
periodDateTime.setSeconds(0);
periodDateTime.setMilliseconds(0);
```

The second part of the methods handles getting all bookings relevant for the current day, if the booking page should support showing bookings for other days besides the current day, then this is where one would need to make some updates, to get bookings for those days.

```ts
// Gets all the bookings relevant for today.
const filteredBookings = bookings.filter((booking) => {
    const startMinutesRatio = booking.start_time.getMinutes() / 60;
    const endMinutesRatio = booking.end_time.getMinutes() / 60;
    const start_time = new Date(booking.start_time);
    const end_time = new Date(booking.end_time);

    // Normalizes the start and end times minutes, 
    // to match the 30 minutes interval of the time periods.
    start_time.setMinutes(startMinutesRatio < 0.5 ? 0 : 30);
    end_time.setMinutes(endMinutesRatio < 0.5 ? 0 : 30);

    return (
        start_time <= periodDateTime &&
        end_time > periodDateTime
    );
});
```

The last part of the method handles creating the jsx element.  
It first sorts the bookings by the index, which is explained in an earlier section.  
After sorting the bookings, it loops over every booking, to first determine which type of box to use, `Top box`, `Middle box` or `Bottom box`, these boxes are components that defines how it should be rendered.  
After determining which box the booking should have, then it checks if there should be any empty boxes before it to align it correctly compared to earlier timestamps, of if there isn't needed any empty boxes.

```ts
// Sorts the bookings by index, to make it easier to render.
filteredBookings.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

return (
    <Box sx={{ display: "flex", height: "100%" }}>
        {filteredBookings.map((booking, arrayIndex) => {
            // Checks the booking timestamps, and determines which type of box component should be rendered for the current time period.
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

---

## IPC controller

The ipc controller is split into two sections, the first section which is used by the main node process, is located in: `RoomBookingApp/src/Utilities/ipcController.ts`  
The second part is in: `RoomBookingApp/src/preload.ts`

### Main process ipc controller


```ts
ipcMain.on("authToken", (event: Electron.IpcMainEvent, args: { command: "get" | "save" | "delete"; token?: string; }) => {
    if (args.command === "save") {
        if (args.token) {
            if (fs.existsSync(dataPath + "/authToken.json")) {
                fs.unlinkSync(dataPath + "/authToken.json");
            }
            fs.writeFileSync(dataPath + "/authToken.json", JSON.stringify({ authToken: args.token }));
        }
        event.reply("authToken", { command: "save", status: "success" });
    } else if (args.command === "delete") {
        if (fs.existsSync(dataPath + "/authToken.json")) {
            fs.unlinkSync(dataPath + "/authToken.json");
        }
        event.reply("authToken", { command: "delete", status: "success" });
    } else if (args.command === "get") {
        if (fs.existsSync(dataPath + "/authToken.json")) {
            const file = fs.readFileSync(dataPath + "/authToken.json").toString();
            const data = JSON.parse(file);

            return data.authToken;
        } else {
            return "";
        }
    }
});
```
