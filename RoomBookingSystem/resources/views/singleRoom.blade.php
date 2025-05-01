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

        <div class="mb-3 d-flex align-items-end gap-2">
            <div>
                <label for="startDate" class="form-label">From:</label>
                <input type="date" id="startDate" class="form-control">
            </div>
            <div>
                <label for="endDate" class="form-label">To:</label>
                <input type="date" id="endDate" class="form-control">
            </div>
            <button class="btn btn-outline-primary mb-1" onclick="renderSchedule()">Apply</button>
        </div>

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
                .then(async r => {
                    const data = await r.json();
                    if (!r.ok) {
                        alert(data.message || 'Booking failed.');
                        return;
                    }
                    alert('Booking successful!');
                    location.reload();
                })
                .catch(err => {
                    console.error(err);
                    alert('Something went wrong. Booking failed.');
                });

        });

        function toLocalDate(dateString) {
            const date = new Date(dateString);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
        }

        function formatDateInput(date) {
            return date.toISOString().split('T')[0];
        }

        function renderSchedule() {
            const container = document.getElementById("schedule-container");
            container.innerHTML = "";

            const bookings = @json($room->bookings);

            const startInput = document.getElementById("startDate").value;
            const endInput = document.getElementById("endDate").value;
            const startDate = new Date(startInput);
            const endDate = new Date(endInput);
            const dayCount = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

            const grouped = {};
            bookings.forEach(b => {
                const localDate = toLocalDate(b.start_time);
                const key = formatDateInput(localDate);
                if (!grouped[key]) grouped[key] = [];
                grouped[key].push({
                    ...b,
                    localDate
                });
            });

            for (let i = 0; i < dayCount; i++) {
                const current = new Date(startDate);
                current.setDate(current.getDate() + i);
                const key = formatDateInput(current);
                const weekday = current.toLocaleDateString(undefined, {
                    weekday: 'long'
                });

                const dayHeader = document.createElement('h4');
                dayHeader.className = 'mt-4';
                dayHeader.textContent = `${weekday} (${key})`;
                container.appendChild(dayHeader);

                const list = document.createElement('ul');
                list.className = 'list-group mb-3';

                const dayBookings = grouped[key] || [];

                if (dayBookings.length) {
                    dayBookings.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
                    dayBookings.forEach(b => {
                        const li = document.createElement('li');
                        li.className = 'list-group-item';
                        const start = b.start_time.slice(11, 16);
                        const end = b.end_time ? b.end_time.slice(11, 16) : '';
                        li.innerHTML = `<strong>${b.title}</strong><br>${start} - ${end}`;
                        list.appendChild(li);
                    });
                } else {
                    const li = document.createElement('li');
                    li.className = 'list-group-item text-muted';
                    li.textContent = 'No bookings';
                    list.appendChild(li);
                }

                container.appendChild(list);
            }
        }

        window.addEventListener("DOMContentLoaded", () => {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);

            document.getElementById("startDate").value = formatDateInput(today);
            document.getElementById("endDate").value = formatDateInput(nextWeek);

            renderSchedule();
        });

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
