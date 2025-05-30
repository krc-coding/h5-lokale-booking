<!DOCTYPE html>
<html>

<head>
    <title>Time-Based Booking Grid</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/schedule.css') }}">
</head>

<body>
    <div class="container mt-4" style="position: relative;">
        <div style="position: absolute; top: 20px; right: 20px;">
            <button class="btn btn-primary mb-3" id="userManageButton" style="display: none;">User management</button>
            <button class="btn btn-primary mb-3" id="RoomGroupManageButton" style="display: none;">Room/Group
                management</button>
            <button id="bookingRequestButton" class="btn btn-primary mb-3" style="display: none;">Booking
                Requests</button>
            <button class="btn btn-primary mb-3" id="authButton" onclick="showLoginModal()">Login</button>
        </div>

        <h1 class="mb-4">Bookings by Time Slot</h1>

        <button class="btn btn-primary mb-3" onclick="showRoomsModal()">View All Rooms</button>

        <!-- container for the time table over bookings -->
        <div id="schedule-container"></div>
    </div>

    <!-- Login Modal -->
    <x-login-modal />

    <!-- Modal for All Rooms -->
    <div class="modal fade" id="roomsModal" tabindex="-1" aria-labelledby="roomsModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="roomsModalLabel">Available Rooms</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="roomsList">
                    <!-- Room links will be inserted here dynamically -->
                </div>
            </div>
        </div>
    </div>

    <script>
        // Show all rooms in a modal
        function showRoomsModal() {
            const modal = new bootstrap.Modal(document.getElementById('roomsModal'));
            const list = document.getElementById('roomsList');
            list.innerHTML = ''; // Clear previous room list

            rooms.forEach(room => {
                const a = document.createElement('a');
                a.href = `/rooms/${room.id}`;
                a.className = 'd-block mb-2';
                a.textContent = room.name;
                list.appendChild(a);
            });

            modal.show();
        }

        // Preexisting logic for bookings and schedule rendering (unchanged)
        const rooms = @json($rooms->values());
        const bookingsByRoom = @json($rooms->mapWithKeys(fn($r) => [$r->id => $r->bookings]));

        window.addEventListener("DOMContentLoaded", () => {
            const container = document.getElementById("schedule-container");
            const interval = 30;
            const startHour = 0;
            const endHour = 24;

            const pad = num => String(num).padStart(2, '0');
            const formatTime = (h, m) => `${pad(h)}:${pad(m)}`;

            const parseTimeOnly = (str) => {
                const [_, time] = str.split(' ');
                const [h, m] = time.split(':').map(Number);
                return h * 60 + m;
            };

            const allBookings = [];

            rooms.forEach(room => {
                const bookings = bookingsByRoom[room.id] || [];
                bookings.forEach(b => {
                    allBookings.push({
                        id: b.id,
                        title: b.title,
                        room: room.name,
                        start: parseTimeOnly(b.start_time),
                        end: parseTimeOnly(b.end_time),
                        startLabel: b.start_time,
                        endLabel: b.end_time
                    });
                });
            });

            for (let h = startHour; h < endHour; h++) {
                for (let m = 0; m < 60; m += interval) {
                    const timeLabel = formatTime(h, m);
                    const slotStart = h * 60 + m;
                    const slotEnd = slotStart + interval;

                    const row = document.createElement('div');
                    row.className = 'schedule-row';

                    const labelDiv = document.createElement('div');
                    labelDiv.className = 'time-label';
                    labelDiv.textContent = timeLabel;

                    const bookingContainer = document.createElement('div');
                    bookingContainer.className = 'booking-container';

                    allBookings.forEach(b => {
                        if (b.start >= slotStart && b.start < slotEnd) {
                            const block = document.createElement('div');
                            block.className = 'booking-block';
                            block.innerHTML = `
                                <div><strong>${b.title || 'Booking'}</strong></div>
                                <div>${b.startLabel.slice(11, 16)} - ${b.endLabel.slice(11, 16)}</div>
                                <span class="room-name">Room: ${b.room}</span>
                            `;
                            bookingContainer.appendChild(block);
                        }
                    });

                    row.appendChild(labelDiv);
                    row.appendChild(bookingContainer);
                    container.appendChild(row);
                }
            }
        });

        // Update the buttons on page load based on token availability
        window.onload = function() {
            const authButton = document.getElementById('authButton');
            const userManageButton = document.getElementById('userManageButton');
            const roomGroupButton = document.getElementById('RoomGroupManageButton');
            const bookingRequestButton = document.getElementById('bookingRequestButton');

            const token = localStorage.getItem('authToken');
            if (token) {
                authButton.textContent = 'Logout';
                authButton.setAttribute('onclick', 'localStorage.removeItem("authToken"); window.location.href = "/"');
                authButton.classList.remove('btn-primary');
                authButton.classList.add('btn-danger');

                userManageButton.style.display = '';
                userManageButton.setAttribute('onclick', 'window.location.href = "/userManagement";');

                roomGroupButton.style.display = '';
                roomGroupButton.setAttribute('onclick', 'window.location.href = "/RoomGroupManagement";');

                bookingRequestButton.style.display = '';
                bookingRequestButton.setAttribute('onclick', 'window.location.href = "/bookingRequests";');
            }
        };
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
