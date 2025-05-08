<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Booking Requests</title>
    <link rel="stylesheet" href="{{ asset('css/Management.css') }}">
</head>

<body>
    <div class="header-bar header-bar-with-color">
        <h1>Booking Requests</h1>
        <div>
            <button class="btn" onclick="changePage('/')">Back</button>
        </div>
    </div>

    <div class="grid" id="requestsGrid">
        <!-- Booking card template -->
        <template id="request-card-template">
            <div class="card">
                <h2 class="booking-title"></h2>
                <p><strong>Student:</strong> <span class="student-name"></span></p>
                <p><strong>Time:</strong> <span class="booking-time"></span></p>
                <p><strong>Room:</strong> <span class="booking-room"></span></p>
                <p><strong>Description:</strong> <span class="booking-desc"></span></p>
                <div class="grid">
                    <button class="btn approve-btn">Approve</button>
                    <button class="btn delete deny-btn">Deny</button>
                </div>
            </div>
        </template>
    </div>

    <script>
        async function fetchBookingRequests() {
            const token = localStorage.getItem('authToken');
            const res = await fetch('/api/bookingRequests', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const requests = await res.json();

            const grid = document.getElementById('requestsGrid');
            const template = document.getElementById('request-card-template');

            grid.innerHTML = '';
            requests.forEach(req => {
                const clone = template.content.cloneNode(true);
                clone.querySelector('.booking-title').textContent = req.title;
                clone.querySelector('.student-name').textContent = req.student_name;
                clone.querySelector('.booking-time').textContent = `${req.start_time} → ${req.end_time}`;
                clone.querySelector('.booking-room').textContent = req.room.name;
                clone.querySelector('.booking-desc').textContent = req.description || '-';

                clone.querySelector('.approve-btn').addEventListener('click', () => handleAction(req.id,
                    'approve'));
                clone.querySelector('.deny-btn').addEventListener('click', () => handleAction(req.id, 'deny'));

                grid.appendChild(clone);
            });
        }

        async function handleAction(id, action) {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`/api/bookingRequest/${id}/${action}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                alert(`Booking ${action}d successfully.`);
                fetchBookingRequests();
            } else {
                alert(`Failed to ${action} booking.`);
            }
        }

        fetchBookingRequests();
    </script>
</body>

</html>
