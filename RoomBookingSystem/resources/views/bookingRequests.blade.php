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
        <!-- Template for each booking request card -->
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
        function changePage(page) {
            window.location.href = page;
        }

        // Fetches booking requests and populates the UI
        async function fetchBookingRequests() {
            const token = localStorage.getItem('authToken');
            if (!token) return alert('You must be logged in.');

            const userRes = await fetch('/api/user/getRole', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const user = await userRes.json();
            const isAdmin = user.role === 'admin';

            // Choose the correct endpoint based on user role
            const endpoint = isAdmin ?
                '/api/bookingRequest' : // Admin gets all requests
                '/api/bookingRequest/received'; // Teachers get only assigned requests

            const res = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const requests = await res.json();

            const grid = document.getElementById('requestsGrid');
            const template = document.getElementById('request-card-template');

            grid.innerHTML = '';

            // Loop through each request and populate the card
            requests.forEach(req => {
                const clone = template.content.cloneNode(true);

                clone.querySelector('.booking-title').textContent = req.title;
                clone.querySelector('.student-name').textContent = req.student_name;
                clone.querySelector('.booking-time').textContent = `${req.start_time} → ${req.end_time}`;
                clone.querySelector('.booking-room').textContent = req.room?.name ?? 'Unknown';
                clone.querySelector('.booking-desc').textContent = req.description || '-';

                // Attach event listeners for approve and deny buttons
                clone.querySelector('.approve-btn').addEventListener('click', () => handleAction('approve', req
                    .id));
                clone.querySelector('.deny-btn').addEventListener('click', () => handleAction('delete', req
                    .id));

                grid.appendChild(clone);
            });

        }

        // Handles approve or deny actions for a booking request
        async function handleAction(action, id) {
            const token = localStorage.getItem('authToken');
            const url = action === 'delete' ?
                `/api/bookingRequest/delete/${id}` :
                `/api/bookingRequest/approve/${id}`;

            const method = action === 'delete' ? 'DELETE' : 'POST';

            try {
                const res = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    alert(`Booking ${action}d successfully.`);
                    fetchBookingRequests(); // Refresh the list
                } else {
                    const data = await res.json();
                    alert(data.message || `Failed to ${action} booking.`);
                }
            } catch (err) {
                alert('An error occurred. Please try again.');
                console.error(err);
            }
        }

        // Initial fetch of booking requests when the page loads
        fetchBookingRequests();
    </script>

</body>

</html>
