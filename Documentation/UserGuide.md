# Room Schedule & Booking System – User Guide

## Introduction

Welcome to the Room Booking System. This platform helps students, teachers, and administrators manage room availability and usage.

There are three user types, each with different responsibilities:

- **Students**: Can view schedules and request room bookings without needing an account.
- **Teachers**: Can log in to book rooms and manage booking requests submitted by students.
- **Admins**: Have full access to manage rooms and teacher accounts.

---

## Student Guide

### What Students Can Do

- View room availability and schedules.
- Filter bookings by date range (on room pages).
- Submit room booking requests (from individual room pages).

### Viewing Room Schedules

There are **two types of schedules** available in the system:

#### Home Page – All Rooms (Current Day)

- When you first open the site, you will see a **list of all bookings for today across all rooms**.
- Each booking includes:
  - Room name
  - Title
  - Time
- This is useful for quickly checking what’s currently booked.

> **Note:** You cannot submit booking requests from the homepage.

#### Room Page – Single Room (Custom Dates + Booking)

- Click on the **view all rooms** button and then on a room name to access its dedicated schedule page.
- You can:
  - View bookings for a **custom date range**
  - See detailed daily schedules
  - Submit a booking request for that room
- Use the **"From"** and **"To"** date inputs, then click **Apply** to update the schedule view.

### Booking a Room (from Room Page)

1. Click **"Book This Room"** on the room's page.
2. Fill in the required fields:
   - Title
   - Description
   - Start & End Time
   - Teacher
   - Your name
3. Submit the form.
4. Your request is sent to a teacher for review.

> **Note:** Students do **not** need an account to submit requests. You will **not receive a notification**, so follow up if needed.

---

## Teacher Guide

### Logging In

- Click the **Login** button in the top right.
- Enter your credentials to access your teacher account.

### Change Your Password

- After logging in, go to **User Management**.
- There, you can update your password.
> It is **strongly recommended** to change your password upon first login, since your account was created by an admin.

### Booking a Room Directly

1. Go to any room’s schedule page.
2. Click **"Book This Room"**.
3. Fill out the booking form and submit — your booking is **confirmed immediately**.

### Managing Booking Requests

1. Click **"Booking Requests"** after logging in.
2. View student-submitted booking requests assigned to you.
3. For each request:
   - Review the title, student name, room, time, and description.
   - Click **Approve** or **Deny**.
4. The schedule updates automatically for approved bookings.

> Denied requests are discarded and won’t appear in the schedule.

---

## Admin Guide

### Logging In

- Click **Login**, then use your admin credentials.

### User Management

- Click **"User Management"** to:
  - Create new teacher accounts
  - Disable or delete existing teacher accounts

### Room/Group Management

- Click **"Room/Group Management"** to:
  - Add new rooms or room groups
  - Edit descriptions and details
  - Remove rooms no longer in use

### Booking Requests

- Admins can view **all** booking requests.
- They can also **approve or deny** requests on behalf of teachers, if needed.

---

## Authentication Details

- Logged-in users are authenticated via `authToken` stored in **localStorage**.
- The interface updates based on login state:
  - You’ll see either a **Login** or **Logout** button.
  - If logged in, you will also see other relevant buttons.
- Clicking **Logout** clears the token and returns you to the homepage.

---

## Troubleshooting

### "No bookings" appears even though I submitted one  
- Your booking might be **pending teacher approval**.

### Booking form won’t submit  
- Ensure all required fields are filled.
- Check that your start and end times are valid.

### Admin/teacher buttons are missing  
- You may not be logged in.
- Your session might have expired — try logging in again.

---

## FAQ

**Q: Can students cancel or modify their booking requests?**  
A: No. Students must contact a teacher to request changes or resubmit a new request.

**Q: Can a teacher book a room already booked by someone else?**  
A: No. The system prevents double bookings and will show a conflict error.

**Q: What happens when a booking is denied?**  
A: The request is removed.

**Q: How long does it take for a booking request to be approved?**  
A: This depends on how quickly the assigned teacher responds. There is no auto-approval.

---

## Final Notes

- Keep date ranges small when filtering schedules to improve performance.
- Always log out after using the system on shared or public computers.
- For technical issues, contact your IT administrator.

---
