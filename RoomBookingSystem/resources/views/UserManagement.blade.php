<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>User Management</title>
    <link rel="stylesheet" href="{{ asset('css/UserManagement.css') }}">
</head>

<body>
    <div class="header-bar">
        <h1>Users</h1>
        <button class="btn" onclick="openAddUser()">Add User</button>
    </div>
    <div class="grid" id="userGrid">
        <!-- User card template -->
        <template id="user-card-template">
            <div class="card">
                <span class="user-disable">Disabled</span>

                <div>
                    <h2 class="user-name"></h2>
                    <p class="user-role"></p>
                </div>

                <div class="editUserBtns" style="display: none;">
                    <button class="edit-btn btn">Edit Role/Disable</button>
                    <button class="password-btn btn">Change Password</button>
                    <button class="delete-btn btn delete">Delete</button>
                </div>
            </div>
        </template>
    </div>

    <!-- User creation modal -->
    <div id="add-user" class="custom-alert" style="display: none;">
        <div class="custom-alert-box">
            <p>Enter user details:</p>
            <input id="username-input" type="text" placeholder="Username" /><br /><br />
            <input id="role-input-new-user" type="text" placeholder="Role" /><br /><br />

            <p id="password-not-matching-new-user" style="display: none; color: red;">Password doesn't match</p>
            <input id="password-input" type="password" placeholder="password" /><br /><br />
            <input id="password-confirmed-input" type="password" placeholder="Repeat password" /><br /><br />

            <button onclick="submitAddUser()">Submit</button>
            <button onclick="closeAddUser()">Cancel</button>
        </div>
    </div>

    <!-- User role and disable modal -->
    <div id="user-edit" class="custom-alert" style="display: none;">
        <div class="custom-alert-box">
            <p>Enter user details:</p>
            <input id="role-input-edit-user" type="text" placeholder="Role" /><br /><br />
            <input id="disabled-input" type="checkbox" /><br /><br />

            <button onclick="submitUserEdit()">Submit</button>
            <button onclick="closeUserEdit()">Cancel</button>
        </div>
    </div>

    <!-- Password change modal -->
    <div id="password-change" class="custom-alert" style="display: none;">
        <div class="custom-alert-box">
            <p>Change password:</p>
            <p id="password-not-matching-change-password" style="display: none; color: red;">Password doesn't match</p>
            <input id="password" type="password" placeholder="Password" /><br /><br />
            <input id="password-confirmed" type="password" placeholder="Repeat password" /><br /><br />

            <button onclick="submitChangePassword()">Submit</button>
            <button onclick="closeChangePassword()">Cancel</button>
        </div>
    </div>

    <script src="{{ asset('js/UserManagement.js') }}"></script>
</body>

</html>
