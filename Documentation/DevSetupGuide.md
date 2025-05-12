# Dev setup guide
## Api and webside
### Requirements
- php 8.3.x NTS (Not Thread Safe)
- Composer
- MariaDB or MySql

### Setup
1. Git clone
    - Clone the project down on your machine (both project is in the same git repository)

2. Install composer in project
    - Using a terminal, navigate to `h5-lokale-booking/RoomBookingSystem`
    - Run: `composer install`

3. Make env
    - In a terminal run all in order:
        * `cp .env.example .env`
        * `php artisan key:generate`
    - Update your DB settings in env to fit your database

4. Database
    - Create a new database with the same name as you used in your env
    - In the terminal run:
        * `php artisan migrate`
        * `php artisan passport:client --personal`

5. Run debug
    - Run: `php artisan serve`

## App
### Requirements
- Npm

### Setup
1. Git clone
    - Clone the project down on your machine (both project is in the same git repository)

2. Install dependencies
    - Using a terminal
    - navigate to: `h5-lokale-booking/RoomBookingApp`
    - Run: `npm ci`

3. Debug
    - Run: `npm start`

##

# Suggested debugging method
### Webside
- Use your favourite web browser on: localhost:8000

### Api
- Use postman
- There are a postman collection: `RoomBookingSystem\H5 - Room Booking.postman_collection.json`

### App
- Running: `npm start`; starts an app
