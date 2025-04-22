# Room Booking System

## Case:


## User roles:

System admin:

- Can create admin users 
- Requires login.

Admin:

- Can do everything a teacher can do.
- Can create new users.
    - assign either admin or teacher role to user.
- Can update users.
- Can delete users.
    - Can't delete system admin.
    - Can't delete the current user.
- Can disable users.
    - Can disable the system admin user.
    - Can't disable the current user.
    - This only disables the users login, and de authorize them.
- Can re enable users.
    - Can re enable the system admin user.
- Can create rooms.
- Can update rooms.
- Can delete rooms.
- Can create room groups.
- Can update room groups.
- Can delete room groups.
- Can update and delete all bookings.
- Requires login.

Teacher:

- Can do everything a student can do.
- Can update own user profile.
    - Change username.
    - Change password.
- Can create bookings.
- Can update bookings.
    - Only bookings that they have created.
- Can delete bookings.
    - Only bookings that they have created.
- Requires login.

Student (Guest):

- Can view bookings
- Doesn't need login.

## Functional requirements:

### Backend:


### Frontend:




Tids system.

mobil side.
desktop side.

når man trygger på en booking, skal man kunne se mere info omkring booking.
når man trygger på et lokale så viser den kun bookings for det lokale.
når man åbner detajleret info for en booking, så vil den underviser som har oprettet booking, samt admins kunne se et pencil ikon, som man kan trygge for at redigere booking.

Alle bruger:

- liste over ledige lokaler
- liste over alle lokaler
- grupperinger af lokaler
    - Det skal være muligt at søge/filterer baseret på grupperinger.


Underviser bruger:
- kan booke lokaler
- kan redigerer egne bookings
- kan slette egne bookings

Admin bruger:
- Det skal være muligt at oprette grupperinger af lokaler.
- Kan redigerer alle bookings (CRUD)
- Kan oprette lokaler
- Kan slette lokaler
- Kan tilføje nye bruger
- Kan slette brugerer.

bruger grupper:
- elever (Kræver ikke login)
- underviser (Kræver login)
- admin (kræver login)

Backend:
- auth using jwt
- api for crud operations:
    - user
    - rooms
    - room-groups
    - bookings
- database

Frontend:
- User management
    - profile
    - admin

- Room management
    - CRUD rooms
    - CRUD groups

- Opret booking side.
- Default side
    - Day page with all rooms + bookings
    - Week page for single room + bookings
    - Custom time duration page for single room + bookings.


Andet:
- Electron desktop/mobile app
- Websocket communication, so that when a change is made, then all devices are notified about the change and can refresh