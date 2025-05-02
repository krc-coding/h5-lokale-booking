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
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Cancel</button>
                <button class="btn btn-primary" type="submit">Submit Booking</button>
            </div>
        </form>
    </div>
</div>

<script>
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
</script>
