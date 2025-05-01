let userRole = '';
const users = [];
let teacher;

function changePage(page) {
    console.log(page);
    window.location.href = page;
}

// Help functions

function getUserId(exitingToken = null) {
    const token = exitingToken ?? getToken();
    return JSON.parse(atob(token.split('.')[1])).sub;
}

function getToken() {
    return localStorage.getItem('authToken');
}

function fetchUserole() {
    fetch('/api/user/getRole', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(role => {
            userRole = role.role;
            choosePageContextAndFillIt();
        })
        .catch(error => console.error('Error:', error));
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
    else if (userRole === 'admin' || userRole === 'systemAdmin') {
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
    const token = getToken();
    fetch('/api/user/getUser/' + getUserId(token), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            teacher = data.user;
            renderTeacher();
        })
        .catch(error => console.error('Error:', error));
}

function fetchUsers() {
    fetch('/api/user/getAllUsers', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
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

    fetch('/api/user/createUser', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
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

            alert('Successfully created: ' + data.user.username);
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
    const token = getToken();

    if (window.userEdit) {
        let userEdit = window.userEdit;
        if (userEdit.role === 'systemAdmin' && userEdit.role !== role) {
            closeUserEdit();
            alert(`You can not update ${userEdit.username}, only disable this user.`);
            return;
        }

        if (userRole !== 'admin' && userEdit.id !== getUserId(token)) {
            closeUserEdit();
            alert('You are not allowed to update this user.');
            return;
        }

        fetch('/api/user/editUser/' + userEdit.id, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
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

                alert('Successfully editing: ' + data.user.username);
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
    const token = getToken();
    const userId = getUserId(token);
    const theUserRole = userRole === 'admin' ? 'admin' : 'teacher';

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
    fetch('/api/user/changePassword/' + userId, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            oldPassword: oldPassword,
            password: newPassword,
            password_confirmation: newPasswordConfirmed,
        })
    })
        .then(async response => {
            if (!response.ok) {
                document.getElementById('Incorrect-password-' + (userRole === 'admin' ? 'admin' : 'teacher'))
                    .style.display = 'block';
                return;
            }
            alert('Successfully');
            closeChangePassword();
        })
        .catch(error => console.error('Password change failed:', error.message));
}

///////////////////// User deletion /////////////////////
function deleteUser(user) {
    const token = getToken();

    if (userRole !== 'admin') {
        alert('You are not allowed to delete users.');
        return;
    }
    if (user.role === 'systemAdmin') {
        alert(`You can not delete ${user.username}, only disable this user.`);
        return;
    }
    if (user.id === getUserId(token)) {
        alert('You are not allow to delete yourself.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${user.username}?`);
    if (!confirmed) {
        return;
    }

    fetch('/api/user/deleteUser/' + user.id, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error(errorData.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully deleting user');
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
                users.splice(index, 1);
                renderUsers();
            }
        })
        .catch(error => console.error('Delete failed:', error.message));
}

// Start fetching users:
fetchUserole();
