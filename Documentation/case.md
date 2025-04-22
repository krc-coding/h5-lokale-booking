LokaleBooking

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