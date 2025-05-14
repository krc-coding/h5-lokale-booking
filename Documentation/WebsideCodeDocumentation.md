
# 📘 Code Documentation for Room Booking System

This documentation describes the implementation details of a time-based booking grid web interface, including the **home page**, **booking requests page**, and **single room page**.

---

## 📜 Table of Contents

1. [🏠 Home Page (Room Booking System)](#🏠-home-page-room-booking-system)
2. [📋 Booking Requests Page](#📋-booking-requests-page)
3. [🏢 Single Room Page](#🏢-single-room-page)
4. [🗣 Booking Modal (For Room Booking)](#🗣-booking-modal-for-room-booking)

---

## 🏠 Home Page (Room Booking System)

### 🗂 Initial Setup

The room grid and associated time slots are dynamically populated using JavaScript. Data is passed as JSON from Blade templates:

```js
const rooms = @json($rooms->values());
const bookingsByRoom = @json($rooms->mapWithKeys(fn($r) => [$r->id => $r->bookings]));
```

- `rooms`: Contains all available rooms.
- `bookingsByRoom`: Mapping of room IDs to their respective bookings.

---

### 🕒 Time Slot Rendering

Time slots from 00:00 to 24:00 are displayed at 30-minute intervals.

```js
for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += interval) {
        ...
    }
}
```

- `startHour` / `endHour`: Define the range (00:00 - 24:00)
- `interval`: 30-minute interval
- `formatTime()`: Formats times (e.g., 08:00)
- `parseTimeOnly()`: Converts datetime to minutes since midnight

---

### 📦 Booking Block Placement

Each booking is rendered dynamically based on its start time:

```js
if (b.start >= slotStart && b.start < slotEnd) {
    const block = document.createElement('div');
    block.className = 'booking-block';
    ...
}
```

- Bookings are shown only at their starting slot.
- Multi-slot support is not implemented.

---

### 🔒 Token Handling and UI

UI elements adapt based on authentication status:

```js
window.onload = function() {
    const token = localStorage.getItem('authToken');
    if (token) {
        authButton.textContent = 'Logout';
        ...
    }
};
```

- Logged-in users see Logout and management buttons.
- Guests see only the Login button.

---

## 📋 Booking Requests Page

### 🗂 Fetching and Rendering Requests

Booking requests are fetched based on user role and rendered dynamically:

```js
async function fetchBookingRequests() {
    const res = await fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } });
    const requests = await res.json();
    ...
}
```

- `endpoint` is chosen based on user role (admin/teacher)
- Requests are shown using a card-style UI

---

### 🛠 Approve and Deny Actions

Users can approve or deny requests using API calls:

```js
async function handleAction(action, id) {
    const url = action === 'delete'
        ? `/api/bookingRequest/delete/${id}`
        : `/api/bookingRequest/approve/${id}`;
    const method = action === 'delete' ? 'DELETE' : 'POST';
    ...
}
```

- `approve-btn`: Calls approve endpoint
- `deny-btn`: Calls delete endpoint
- UI updates after each action

---

## 🏢 Single Room Page

### 🗂 Room Schedule Rendering

Displays room bookings over a date range:

```js
const currentDate = new Date(startDate);
const finalDate = new Date(endDate);

while (currentDate <= finalDate) {
    const day = currentDate.toISOString().split('T')[0];
    const dayBookings = bookings.filter(b => b.date === day);
```

- `startDate` and `endDate` are selected by the user
- Iterates over each day in the range
- Filters bookings by day and appends them to the DOM
- Displays "No bookings" message if no bookings exist for a date

---

### 🗓 Date Range Control

User selects a custom date range to view room bookings:

```js
const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);

document.getElementById("startDate").value = formatDateInput(today);
document.getElementById("endDate").value = formatDateInput(nextWeek);
```

- Default range: today + 7 days
- Schedule updates with each date change

---

## 🗣 Booking Modal (For Room Booking)

### 👥 Dynamic Form Fields

Logged-in and guest users see different booking fields:

```js
const payload = {
    title: document.getElementById('title').value,
    description: document.getElementById('description').value,
    start_time: document.getElementById('start_time').value,
    end_time: document.getElementById('end_time').value,
  room_id: document.getElementById('room_id').value,
}; 
if (!isLoggedIn) {
    payload.user_id = document.getElementById('user_id').value;
    payload.student_name = document.getElementById('student_name').value;
}
```

- Logged-in users book directly
- Guests must select a teacher and provide their name

---

### 🛠 Booking Form Submission

Form submits to different endpoints based on login status:

```js
const token = localStorage.getItem('authToken');
const isLoggedIn = !!token;
const endpoint = isLoggedIn
    ? '/api/booking/create'
    : '/api/bookingRequest/create';
```

- Authenticated: Booking created directly
- Guest: Booking request submitted
- Page reloads on success

---
