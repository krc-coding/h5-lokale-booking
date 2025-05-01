// These need to be removed when it can be fected from somewhere else.
const token = "";
const userRole = "";
const userId = -1;

const users = [];

///////////////////// Get users /////////////////////
function fetchUsers() {
    fetch('http://localhost:8000/api/user/getAllUsers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                users.push({
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    disabled: user.disabled
                });
            });
            renderUsers();
        })
        .catch(error => console.error('Error:', error));
}

///////////////////// Render users /////////////////////
function renderUsers() {
    const grid = document.getElementById('userGrid');
    const template = document.getElementById('user-card-template');
    grid.innerHTML = ''; // Clear grid
    grid.appendChild(template);

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
            clone.querySelector('.password-btn').onclick = () => openChangePassword(user);
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
    if (userRole !== 'admin' && userRole !== 'systemAdmin') {
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

    fetch('http://localhost:8000/api/user/createUser', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            role: role,
            password: password,
            password_confirmation: passwordConfirmed,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            users.push({
                id: data.user.id,
                username: data.user.username,
                role: data.user.role,
                disabled: data.user.disabled
            });
            renderUsers();
        })
        .catch(error => console.error('Failed to create new user: ', error.message));

    closeAddUser();
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
        if (userEdit.role === 'systemAdmin') {
            closeUserEdit();
            alert(`You can not update ${userEdit.username}, only disable this user.`);
            return;
        }

        if (userRole !== 'admin' && userEdit.id !== userId) {
            closeUserEdit();
            alert('You are not allowed to update this user.');
            return;
        }

        fetch('http://localhost:8000/api/user/editUser/' + userEdit.id, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: role,
                disabled: disabled,
            })
        })
            .then(async response => {
                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    console.error(data.message || `Request failed with status ${response.status}`);
                    return;
                }

                const index = users.findIndex(user => user.id === data.user.id);
                if (index !== -1) {
                    users[index].role = data.user.role;
                    users[index].disabled = data.user.disabled;
                    renderUsers();
                }
            })
            .catch(error => console.error('Update failed:', error.message));
    }

    closeUserEdit();
}

///////////////////// User password edit /////////////////////

function openChangePassword(user) {
    document.getElementById('password-change').style.display = 'flex';
    window.userPasswordChange = user;
}

function closeChangePassword() {
    document.getElementById('password-change').style.display = 'none';
    document.getElementById('password-not-matching-change-password').style.display = 'none';
    document.getElementById('password').value = '';
    document.getElementById('password-confirmed').value = '';
    window.userPasswordChange = null;
}

function submitChangePassword() {
    const newPassword = document.getElementById('password').value ?? '';
    const newPasswordConfirmed = document.getElementById('password-confirmed').value ?? '';

    if (newPassword == '' || newPasswordConfirmed == '') {
        alert('One or both of the fields are empty.');
        return;
    }

    if (newPassword !== newPasswordConfirmed) {
        document.getElementById('password-not-matching-change-password').style.display = 'block';
        return;
    }

    if (window.userPasswordChange) {
        let userPasswordChange = window.userPasswordChange;
        if (userRole !== 'admin' && userPasswordChange.id !== userId) {
            closeChangePassword();
            alert('You are not allowed to update this user.');
            return;
        }

        fetch('http://localhost:8000/api/user/changePassword/' + userPasswordChange.id, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: newPassword,
                password_confirmation: newPasswordConfirmed,
            })
        })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error(errorData.message || `Request failed with status ${response.status}`);
                    return;
                }
            })
            .catch(error => console.error('Password change failed:', error.message));
    }

    closeChangePassword();
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
    if (user.id === userId) {
        alert('You are not allow to delete yourself.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${user.username}?`);
    if (!confirmed) {
        return;
    }

    fetch('http://localhost:8000/api/user/deleteUser/' + user.id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(errorData.message || `Request failed with status ${response.status}`);
                return;
            }

            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users.splice(index, 1);
                renderUsers();
            }
        })
        .catch(error => console.error('Delete failed:', error.message));
}

// Start fetching users:
fetchUsers();
