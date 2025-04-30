<div>
    <!DOCTYPE html>
    <html>

    <head>
        <title>Time-Based Booking Grid</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="{{ asset('css/schedule.css') }}">
    </head>

    <body>
        <div class="container mt-4" style="position: relative;">
            <button class="btn btn-primary mb-3" id="authButton" style="position: absolute; top: 20px; right: 20px;"
                onclick="handleAuthAction()">Login</button>

            <h1 class="mb-4">Bookings by Time Slot</h1>

            <button class="btn btn-primary mb-3" onclick="showRoomsModal()">View All Rooms</button>

            <!-- container for the time table over bookings -->
            <div id="schedule-container"></div>
        </div>

        <!-- Login Modal -->
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginModalLabel">Login</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" id="username" placeholder="Enter username"
                                    required>
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter password"
                                    required>
                            </div>
                            <button type="submit" class="btn btn-primary">Login</button>
                        </form>
                        <div id="loginError" class="mt-2 text-danger" style="display:none;">Incorrect username or
                            password.
                        </div>
                    </div>
                </div>
            </div>
        </div>

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
            // Handle the authentication action based on the current state (login or profile page)
            function handleAuthAction() {
                const token = localStorage.getItem('authToken');

                if (token) {
                    // If the user is already logged in (has a token), redirect to profile
                    window.location.href = '/profile';
                } else {
                    // If no token is found, show the login modal
                    showLoginModal();
                }
            }

            // Function to show the login modal
            function showLoginModal() {
                const modal = new bootstrap.Modal(document.getElementById('loginModal'));
                modal.show();
            }

            // Handle login form submission
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();

                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;

                // Send login data to the backend API
                fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.token) {
                            localStorage.setItem('authToken', data.token); // Store token in localStorage

                            const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                            modal.hide();

                            window.location.href = '/'; // Reload the page to update button
                        } else {
                            // Display error if login fails
                            document.getElementById('loginError').style.display = 'block';
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        document.getElementById('loginError').style.display = 'block';
                    });
            });

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

            // Update the button text on page load based on token availability
            window.onload = function() {
                const authButton = document.getElementById('authButton');
                const token = localStorage.getItem('authToken');
                if (token) {
                    authButton.textContent = 'Profile';
                    authButton.setAttribute('onclick',
                        'window.location.href = "/profile";');
                }
            };
        </script>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    </body>

    </html>

</div>
