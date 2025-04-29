<!DOCTYPE html>
<html>

<head>
    <title>Time-Based Booking Grid</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/schedule.css') }}">
</head>

<body>
    <div class="container mt-4">
        <h1 class="mb-4">Bookings by Time Slot</h1>

        <!-- View All Rooms Button -->
        <button class="btn btn-primary mb-3" onclick="showRoomsModal()">View All Rooms</button>

        <script>
            const rooms = @json($rooms->values());
            const bookingsByRoom = @json($rooms->mapWithKeys(fn($r) => [$r->id => $r->bookings]));
        </script>

        <div id="schedule-container"></div>
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
        // Function to display rooms in a modal
        function showRoomsModal() {
            const modal = new bootstrap.Modal(document.getElementById('roomsModal'));
            const list = document.getElementById('roomsList');
            list.innerHTML = '';

            rooms.forEach(room => {
                const a = document.createElement('a');
                a.href = `/rooms/${room.id}`;
                a.className = 'd-block mb-2';
                a.textContent = room.name;
                list.appendChild(a);
            });

            modal.show();
        }

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
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>
