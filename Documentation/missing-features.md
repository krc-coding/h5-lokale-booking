# Missing Features

## Frontend Website

### Functional Improvements

- **Edit Bookings**  
  Allow users (e.g., teachers) to modify existing bookings instead of deleting and recreating them.

- **Recurring Bookings**  
  Enable support for repeating reservations (e.g., weekly classes, monthly meetings).

### Known Issues / Bugs

- **Invalid Token Handling**  
  Doesn't automatically log out users if an `authToken` exists in localStorage but is no longer valid (e.g., expired or revoked).

- **Static Booking Length Visualization**  
  Currently, bookings are shown with a default height/length based only on their start time.  
  The visual display should **scale to reflect the actual duration** of each booking (e.g., a 2-hour booking should look longer than a 30-minute one).

## App

### Functional improvements

- **Edit bookings**
  Allow teachers to update existing bookings.

- **Recurring bookings**
  Option for defining bookings as recurring, and interval of recurring.

- **Room group management**
  This feature exist on the website, but haven't been ported to the app.

- **Booking requests**
  This feature exist on the website, but haven't been ported to the app.

- **Web socket communication**
  Allow updates to bookings or rooms, to be sent to all other instances of the app, without needing to have a loop running at a set interval.
