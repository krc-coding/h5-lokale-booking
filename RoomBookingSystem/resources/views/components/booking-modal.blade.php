<div class="modal fade" id="bookingModal" tabindex="-1" aria-labelledby="bookingModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <form class="modal-content" id="bookingForm">
            <div class="modal-header">
                <h5 class="modal-title" id="bookingModalLabel">Book Room: {{ $room->name }}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <input type="hidden" name="room_id" id="room_id" value="{{ $room->id }}">

                <div class="mb-3">
                    <label for="title" class="form-label">Booking Title</label>
                    <input type="text" class="form-control" name="title" id="title" required>
                </div>

                <div class="mb-3">
                    <label for="description" class="form-label">Description</label>
                    <textarea class="form-control" name="description" id="description" rows="3"></textarea>
                </div>

                <div class="mb-3">
                    <label for="start_time" class="form-label">Start Time</label>
                    <input type="datetime-local" class="form-control" name="start_time" id="start_time" required>
                </div>

                <div class="mb-3">
                    <label for="end_time" class="form-label">End Time</label>
                    <input type="datetime-local" class="form-control" name="end_time" id="end_time" required>
                </div>

                <div id="guestFields">
                    <div class="mb-3">
                        <label for="user_id" class="form-label">Select Teacher</label>
                        <select class="form-select" name="user_id" id="user_id" required>
                            <option value="" disabled selected>Select a teacher</option>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="student_name" class="form-label">Your Name</label>
                        <input type="text" class="form-control" name="student_name" id="student_name" required>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
                <button class="btn btn-primary" type="submit">Submit Booking</button>
            </div>
        </form>
    </div>
</div>

<script>
    async function loadTeachers() {
        const res = await fetch('/api/user/teachers');
        const teachers = await res.json();

        const select = document.getElementById('user_id');
        select.innerHTML = '<option value="" disabled selected>Select a teacher</option>';
        teachers.forEach(teacher => {
            const option = document.createElement('option');
            option.value = teacher.id;
            option.textContent = teacher.username;
            select.appendChild(option);
        });
    }

    function showBookingModal() {
        const isLoggedIn = !!localStorage.getItem('authToken');
        const guestFields = document.getElementById('guestFields');

        guestFields.style.display = isLoggedIn ? 'none' : 'block';

        document.getElementById('user_id').required = !isLoggedIn;
        document.getElementById('student_name').required = !isLoggedIn;

        if (!isLoggedIn) {
            loadTeachers();
        }

        const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
        modal.show();
    }


    document.getElementById('bookingForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        const isLoggedIn = !!token;
        const endpoint = isLoggedIn ? '/api/booking/create' : '/api/bookingRequest/create';

        const payload = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            start_time: document.getElementById('start_time').value,
            end_time: document.getElementById('end_time').value,
            room_id: document.getElementById('room_id').value,
        };

        if (!isLoggedIn) {
            payload.user_id = document.getElementById('user_id').value;
            payload.student_name = document.getElementById('student_name').value;
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(isLoggedIn ? {
                        'Authorization': `Bearer ${token}`
                    } : {})
                },
                body: JSON.stringify(payload)
            });

            let data;
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                throw new Error('Invalid response format');
            }

            if (!res.ok) throw new Error(data.message || 'Submission failed');

            alert(isLoggedIn ? 'Booking successful!' : 'Booking request sent!');
            location.reload();
        } catch (err) {
            console.error(err);
            alert(err.message || 'Something went wrong.');
        }
    });
</script>
