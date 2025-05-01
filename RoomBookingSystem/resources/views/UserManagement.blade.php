<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>User Management</title>
    <link rel="stylesheet" href="{{ asset('css/UserManagement.css') }}">
</head>

<body>
    <div class="header-bar">
        <h1 id="title"></h1>
        <div>
            <button class="btn" onclick="changePage('/')">Back</button>
            <div id="adminAddBtn" style="display: none;">
                <button class="btn" onclick="openChangePassword()">Change password</button>
                <button class="btn" onclick="openAddUser()">Add User</button>
            </div>
        </div>
    </div>

    <div id="teacher" style="display: none;">
        <p>Change password:</p>
        <p id="Incorrect-password-teacher" style="display: none; color: red;">Incorrect password</p>
        <input id="old-password-teacher" type="password" placeholder="Old password" /><br /><br />

        <p id="password-not-matching-change-password-teacher" style="display: none; color: red;">Password doesn't match</p>
        <input id="password-teacher" type="password" placeholder="New password" /><br /><br />
        <input id="password-confirmed-teacher" type="password" placeholder="Repeat password" /><br /><br />

        <button onclick="submitChangePassword()">Save</button>
        <button onclick="closeChangePassword()">Cancel</button>
    </div>

    <div id="admin" style="display: none;">
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
                        <button class="delete-btn btn delete">Delete</button>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <div id="modals">
        <!-- User creation modal -->
        <div id="add-user" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Enter user details:</p>
                <input id="username-input" type="text" placeholder="Username" /><br /><br />
                <input id="role-input-new-user" type="text" placeholder="Role" /><br /><br />

                <p id="password-not-matching-new-user" style="display: none; color: red;">Password doesn't match</p>
                <input id="password-input" type="password" placeholder="password" /><br /><br />
                <input id="password-confirmed-input" type="password" placeholder="Repeat password" /><br /><br />

                <button onclick="submitAddUser()">Create</button>
                <button onclick="closeAddUser()">Cancel</button>
            </div>
        </div>

        <!-- User role and disable modal -->
        <div id="user-edit" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Enter user details:</p>
                <label>Role:</label>
                <select id="role-input-edit-user">
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                </select>
                <br /><br />

                <label>Disable:</label>
                <input id="disabled-input" type="checkbox" /><br /><br />

                <button onclick="submitUserEdit()">Save</button>
                <button onclick="closeUserEdit()">Cancel</button>
            </div>
        </div>

        <!-- Password change modal -->
        <div id="password-change" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Change password:</p>
                <p id="Incorrect-password-admin" style="display: none; color: red;">Incorrect password</p>
                <input id="old-password-admin" type="password" placeholder="Old password" /><br /><br />

                <p id="password-not-matching-change-password-admin" style="display: none; color: red;">Password doesn't match</p>
                <input id="password-admin" type="password" placeholder="New password" /><br /><br />
                <input id="password-confirmed-admin" type="password" placeholder="Repeat password" /><br /><br />

                <button onclick="submitChangePassword()">Save</button>
                <button onclick="closeChangePassword()">Cancel</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/UserManagement.js') }}"></script>
</body>

</html>
