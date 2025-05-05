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
                        <input type="text" class="form-control" id="username" placeholder="Enter username" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" placeholder="Enter password"
                            required>
                    </div>
                    <button type="submit" class="btn btn-primary">Login</button>
                </form>
                <div id="loginError" class="mt-2 text-danger" style="display:none;">
                    Incorrect username or password.
                </div>
            </div>
        </div>
    </div>
</div>

<script>
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
</script>
