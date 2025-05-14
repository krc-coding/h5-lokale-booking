# 🚧 Missing Features

## 🌐 Frontend Website

### 🔧 Functional Improvements

- **Edit Bookings**  
  Allow users (e.g., teachers) to modify existing bookings instead of deleting and recreating them.

- **Recurring Bookings**  
  Enable support for repeating reservations (e.g., weekly classes, monthly meetings).

### 🐞 Known Issues / Bugs

- **Invalid Token Handling**  
  Automatically log out users if an `authToken` exists in localStorage but is no longer valid (e.g., expired or revoked).

- **Static Booking Length Visualization**  
  Currently, bookings are shown with a default height/length based only on their start time.  
  The visual display should **scale to reflect the actual duration** of each booking (e.g., a 2-hour booking should look longer than a 30-minute one).
