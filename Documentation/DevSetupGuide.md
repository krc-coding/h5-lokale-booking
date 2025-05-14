# Dev setup guide
## In
### Requirements
- php 8.3.x NTS (Not Thread Safe)
- Composer
- MariaDB or MySql
- Npm
- Node

#### Git clone
- Repository: <https://github.com/krc-coding/h5-lokale-booking>
- As a dev:
    - Clone the project
- As a normal user
    - Download the zip

## Api and webside
### Setup
1. Install composer in project
    - Open a terminal and navigate to the project
    - After navigate to `/RoomBookingSystem`
    - Run: `composer install`

2. Make env
    - In a terminal run in order:
        * `cp .env.example .env`
        * `php artisan key:generate`
    - Update your DB settings in env to fit your database

3. Database
    - Create a new database with the same name as you used in your env
    - In the terminal run:
        * `php artisan migrate`
        * `php artisan passport:client --personal`

4. Start web sever / backend
    - Run: `php artisan serve`

## App
### Pre request

*The backend api server is required for the app to work correctly.*

### Setup
1. Install dependencies
    - Open a terminal and navigate to the project
    - navigate to: `/RoomBookingApp`
    - Run: `npm ci`

2. Start app
    - Run: `npm start`

---

## Additionally development tool
### Api
- Postman
- There are a postman collection: `RoomBookingSystem\H5 - Room Booking.postman_collection.json`
