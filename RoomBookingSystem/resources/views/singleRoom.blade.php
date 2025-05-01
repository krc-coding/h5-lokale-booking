<!DOCTYPE html>
<html>

<head>
    <title>Room Schedule</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/schedule.css') }}">
</head>

<body>
    <div class="container mt-4 position-relative" style="padding-top: 80px;">

        <a href="/" class="btn btn-secondary mb-3" style="position: absolute; top: 20px; left: 20px;">
            Home
        </a>

        <button class="btn btn-primary mb-3" id="authButton" style="position: absolute; top: 20px; right: 20px;"
            onclick="handleAuthAction()">Login</button>

        <h1 class="mb-1">{{ $room->name }}</h1>
        <p class="text-muted">{{ $room->description ?? 'No description available.' }}</p>

        <button class="btn btn-success mb-3" onclick="showBookingModal()">Book This Room</button>

        <div id="schedule-container"></div>
    </div>

    <!-- Booking Modal -->
    <x-booking-modal :room="$room" />

    <!-- Login Modal -->
    <x-login-modal />


    <script>
        function handleAuthAction() {
            const token = localStorage.getItem('authToken');
            if (token) {
                window.location.href = '/profile';
            } else {
                const modal = new bootstrap.Modal(document.getElementById('loginModal'));
                modal.show();
            }
        }

        function showLoginModal() {
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
        }

        function showBookingModal() {
            const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
            modal.show();
        }

        // Submit booking
        document.getElementById('bookingForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const token = localStorage.getItem('authToken');
            if (!token) return alert('Please login first.');

            fetch('/api/booking/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        room_id: document.getElementById('room_id').value,
                        title: document.getElementById('title').value,
                        start_time: document.getElementById('start_time').value,
                        end_time: document.getElementById('end_time').value,
                    })
                })
                .then(r => r.json())
                .then(data => {
                    alert('Booking successful!');
                    location.reload();
                })
                .catch(err => {
                    console.error(err);
                    alert('Booking failed.');
                });
        });

        // Build schedule
        window.addEventListener("DOMContentLoaded", () => {
            const bookings = @json($room->bookings);
            const container = document.getElementById("schedule-container");

            const pad = n => n.toString().padStart(2, '0');
            const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;
            const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            const grouped = {};
            bookings.forEach(b => {
                const d = new Date(b.start_time);
                const day = weekDays[d.getDay()];
                if (!grouped[day]) grouped[day] = [];
                grouped[day].push(b);
            });

            weekDays.forEach(day => {
                const dayBookings = grouped[day] || [];
                const dayHeader = document.createElement('h4');
                dayHeader.className = 'mt-4';
                dayHeader.textContent = day;
                container.appendChild(dayHeader);

                const list = document.createElement('ul');
                list.className = 'list-group mb-3';

                dayBookings.forEach(b => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.innerHTML =
                        `<strong>${b.title}</strong><br>${b.start_time.slice(11,16)} - ${b.end_time.slice(11,16)}`;
                    list.appendChild(li);
                });

                if (!dayBookings.length) {
                    const li = document.createElement('li');
                    li.className = 'list-group-item text-muted';
                    li.textContent = 'No bookings';
                    list.appendChild(li);
                }

                container.appendChild(list);
            });
        });

        // Update login/profile button
        window.onload = () => {
            const token = localStorage.getItem('authToken');
            const btn = document.getElementById('authButton');
            if (token) {
                btn.textContent = 'Profile';
                btn.setAttribute('onclick', 'window.location.href = "/profile";');
            }
        };
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
