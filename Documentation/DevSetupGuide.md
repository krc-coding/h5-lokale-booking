# Dev setup guide
## Api and webside
### Requirements
- php 8.3.x NTS (Not Thread Safe)
- Composer
- MariaDB 

### Setup
1. Git clone
    - Clone the project down on your machine
    
2. Install/update composer in project
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
        * `php artisan passport:keys`

5. Run debug
    - Run: `php artisan serve` 

