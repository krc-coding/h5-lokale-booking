let userRole = '';
const users = [];
let teacher;

// Help functions

function fetchUserole() {
    Get('/api/user/getRole', async data => {
        userRole = data.role;
        choosePageContextAndFillIt();
    });
}

function choosePageContextAndFillIt() {
    const teacherPage = document.getElementById('teacher');
    const adminPage = document.getElementById('admin');
    const adminAddBtn = document.getElementById('adminAddBtn');
    const modals = document.getElementById('modals');
    const title = document.getElementById('title');

    if (userRole === 'teacher') {
        title.innerText = 'Welcome';
        teacherPage.style.display = 'block';
        adminPage.innerHTML = '';
        adminAddBtn.innerHTML = '';
        modals.innerHTML = '';
        fetchTeacher();
    }
    else if (!notAdmin(userRole)) {
        title.innerText = 'Users';
        teacherPage.innerHTML = '';
        adminPage.style.display = 'block';
        adminAddBtn.style.display = 'block';
        fetchUsers();
    }
    else {
        title.innerText = 'You are not allowed here';
        teacherPage.innerHTML = '';
        adminPage.innerHTML = '';
        adminAddBtn.innerHTML = '';
        modals.innerHTML = '';
    }
}

///////////////////// Get users /////////////////////

function fetchTeacher() {
    Get('/api/user/getUser/' + getUserId(), async data => {
        teacher = data.user;
        renderTeacher();
    });
}

function fetchUsers() {
    Get('/api/user/getAllUsers', async newUsers => {
        newUsers.forEach(user => {
            users.push({
                id: user.id,
                username: user.username,
                role: user.role,
                disabled: user.disabled
            });
        });
        renderUsers();
    });
}

///////////////////// Render users /////////////////////
function renderTeacher() {
    document.getElementById('title').innerText = 'Welcome ' + teacher.username;
}

function renderUsers() {
    const grid = document.getElementById('userGrid');
    const template = document.getElementById('user-card-template');
    grid.innerHTML = ''; // Clear grid
    grid.appendChild(template); // Save the template again

    users.forEach(user => {
        const clone = template.content.cloneNode(true);

        clone.querySelector('.user-name').textContent = user.username;
        clone.querySelector('.user-role').textContent = user.role;

        if (user.disabled) {
            clone.querySelector('.user-disable').style.display = 'block';
        }

        if (userRole === 'admin') {
            clone.querySelector('.editUserBtns').style.display = 'block';

            clone.querySelector('.edit-btn').onclick = () => openUserEdit(user);
            clone.querySelector('.delete-btn').onclick = () => deleteUser(user);
        }

        grid.appendChild(clone);
    });
}

///////////////////// Add user /////////////////////

function openAddUser() {
    document.getElementById('add-user').style.display = 'flex';
}

function closeAddUser() {
    document.getElementById('add-user').style.display = 'none';
    document.getElementById('password-not-matching-new-user').style.display = 'none';
    document.getElementById('username-input').value = '';
    document.getElementById('role-input-new-user').value = '';
    document.getElementById('password-input').value = '';
    document.getElementById('password-confirmed-input').value = '';
}

function submitAddUser() {
    if (notAdmin(userRole)) {
        closeAddUser();
        alert("You are not allowed to create users.");
        return;
    }

    const username = document.getElementById('username-input').value ?? '';
    const role = document.getElementById('role-input-new-user').value ?? '';
    const password = document.getElementById('password-input').value ?? '';
    const passwordConfirmed = document.getElementById('password-confirmed-input').value ?? '';

    if (username == '' || role == '' || password == '' || passwordConfirmed == '') {
        alert('One or more of the fields are empty.');
        return;
    }

    if (password !== passwordConfirmed) {
        document.getElementById('password-not-matching-new-user').style.display = 'block';
        return;
    }

    const data = {
        username: username,
        role: role,
        password: password,
        password_confirmation: passwordConfirmed,
    }

    Post('/api/user/createUser', data, async newUser => {
        alert('Successfully created: ' + newUser.user.username);
        users.push({
            id: newUser.user.id,
            username: newUser.user.username,
            role: newUser.user.role,
            disabled: newUser.user.disabled
        });
        renderUsers();
        closeAddUser();
    });
}

///////////////////// User edit /////////////////////

function openUserEdit(user) {
    document.getElementById('user-edit').style.display = 'flex';
    document.getElementById('role-input-edit-user').value = user.role;
    document.getElementById('disabled-input').checked = user.disabled;
    window.userEdit = user;
}

function closeUserEdit() {
    document.getElementById('user-edit').style.display = 'none';
    document.getElementById('role-input-edit-user').value = '';
    document.getElementById('disabled-input').checked = false;
    window.userEdit = null;
}

function submitUserEdit() {
    const role = document.getElementById('role-input-edit-user').value;
    const disabled = document.getElementById('disabled-input').checked;

    if (window.userEdit) {
        let userEdit = window.userEdit;
        if (userRole !== 'admin' && userEdit.id !== getUserId()) {
            closeUserEdit();
            alert('You are not allowed to update this user.');
            return;
        }

        const data = {
            role: role,
            disabled: disabled,
        };

        Put('/api/user/editUser/' + userEdit.id, data, async updatedUser => {
            alert('Successfully editing: ' + updatedUser.user.username);
            const index = users.findIndex(user => user.id === updatedUser.user.id);
            if (index !== -1) {
                users[index].role = updatedUser.user.role;
                users[index].disabled = updatedUser.user.disabled;
                renderUsers();
            }
            closeUserEdit();
        });
    }
}

///////////////////// User password edit /////////////////////

function openChangePassword() {
    document.getElementById('password-change').style.display = 'flex';
}

function closeChangePassword() {
    const theUserRole = userRole === 'admin' ? 'admin' : 'teacher';
    document.getElementById('Incorrect-password-' + theUserRole).style.display = 'none';
    document.getElementById('password-not-matching-change-password-' + theUserRole).style.display = 'none';
    document.getElementById('old-password-' + theUserRole).value = '';
    document.getElementById('password-' + theUserRole).value = '';
    document.getElementById('password-confirmed-' + theUserRole).value = '';

    if (userRole === 'admin') {
        document.getElementById('password-change').style.display = 'none';
    }
}

function submitChangePassword() {
    const userId = getUserId();
    const theUserRole = notAdmin(userRole) ? 'teacher' : 'admin';

    let oldPassword = document.getElementById('old-password-' + theUserRole).value ?? '';
    let newPassword = document.getElementById('password-' + theUserRole).value ?? '';
    let newPasswordConfirmed = document.getElementById('password-confirmed-' + theUserRole).value ?? '';

    if (oldPassword == '' || newPassword == '' || newPasswordConfirmed == '') {
        alert('One or More of the fields are empty.');
        return;
    }

    if (newPassword !== newPasswordConfirmed) {
        document.getElementById('password-not-matching-change-password-' + theUserRole).style.display = 'block';
        return;
    }

    document.getElementById('password-not-matching-change-password-' + theUserRole).style.display = 'none';
    const data = {
        oldPassword: oldPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmed,
    };

    Put('/api/user/changePassword/' + userId, data, async message => {
        alert('Successfully');
        closeChangePassword();
    });
}

///////////////////// User deletion /////////////////////
function deleteUser(user) {
    if (userRole !== 'admin') {
        alert('You are not allowed to delete users.');
        return;
    }
    if (user.role === 'systemAdmin') {
        alert(`You can not delete ${user.username}, only disable this user.`);
        return;
    }
    if (user.id === getUserId()) {
        alert('You are not allow to delete yourself.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${user.username}?`);
    if (!confirmed) {
        return;
    }

    Delete('/api/user/deleteUser/' + user.id, async message => {
        alert('Successfully deleting user');
        const index = users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            users.splice(index, 1);
            renderUsers();
        }
    });
}

// Start fetching users:
fetchUserole();
