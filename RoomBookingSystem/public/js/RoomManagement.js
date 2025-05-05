const rooms = [];
const groups = [];
let userRole = 'nothing';

function changePage(page) {
    window.location.href = page;
}

function getToken() {
    return localStorage.getItem('authToken');
}

function updateButtons() {
    if (userRole === 'admin' || userRole === 'systemAdmin') {
        // Remove the local styling: display.
        document.getElementById('roomAddBtn').style.display = '';
        document.getElementById('groupAddBtn').style.display = '';
    }
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
        .then(role => userRole = role.role)
        .then(async () => {
            updateButtons();
            await fetchRooms(); // wait for it to finishes
            fetchGroups();
        })
        .catch(error => console.error('Error:', error));
}

async function fetchRooms() {
    await fetch('/api/room', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(newRooms => newRooms.forEach(room => {
            rooms.push({
                id: room.id,
                name: room.name,
                description: room.description,
                room_number: room.room_number,
                max_people: room.max_people,
            });
        }))
        .then(() => renderRooms())
        .catch(error => console.error('Error:', error));
}

function fetchGroups() {
    fetch('/api/group/getGroups', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Accept': 'application/json'
        }
    })
        .then(response => response.json())
        .then(newGroups => newGroups.forEach(group => {
            groups.push({
                id: group.id,
                name: group.name,
                roomIds: group.rooms.map(room => room.id)
            });
        }))
        .then(() => renderGroups())
        .catch(error => console.error('Error:', error));
}

///////////////////// Render functions /////////////////////

function createRoomCheckbox(room) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "room";
    checkbox.value = room.name;
    checkbox.dataset.id = room.id;

    label.appendChild(checkbox);
    label.append(` ${room.name.charAt(0).toUpperCase() + room.name.slice(1)}`);

    return label;
}

function renderRooms() {
    const grid = document.getElementById('roomGrid');
    const template = document.getElementById('room-card-template');
    grid.innerHTML = ''; // Clear grid
    grid.appendChild(template); // Save the template again

    const addGroupModal = document.getElementById('rooms-to-group-add');
    const addRoomToGroupModal = document.getElementById('add-rooms-to-group');
    const removeRoomFromGroupModal = document.getElementById('remove-rooms-from-group');

    rooms.forEach(room => {
        const clone = template.content.cloneNode(true);

        clone.querySelector('.name').textContent = room.name;
        clone.querySelector('.room-number').textContent = room.room_number;
        clone.querySelector('.max-people').textContent = room.max_people;
        clone.querySelector('.description').textContent = room.description;

        if (userRole === 'admin') {
            clone.querySelector('.editRoomBtns').style.display = 'block';

            clone.querySelector('.edit-btn').onclick = () => openRoomEdit();
            clone.querySelector('.delete-btn').onclick = () => deleteRoom();
        }

        grid.appendChild(clone);

        // Modal
        addGroupModal.appendChild(createRoomCheckbox(room));
        addGroupModal.appendChild(document.createElement("br"));

        addRoomToGroupModal.appendChild(createRoomCheckbox(room));
        addRoomToGroupModal.appendChild(document.createElement("br"));

        removeRoomFromGroupModal.appendChild(createRoomCheckbox(room));
        removeRoomFromGroupModal.appendChild(document.createElement("br"));
    });
}

function renderGroups() {
    const grid = document.getElementById('groupGrid');
    const groupTemplate = document.getElementById('group-card-template');
    const roomTemplate = groupTemplate.content.querySelector('#room-card-inside-group-card-template');
    grid.innerHTML = ''; // Clear grid
    grid.appendChild(groupTemplate); // Save the template again

    groups.forEach(group => {
        const groupTemplateClone = groupTemplate.content.cloneNode(true);

        groupTemplateClone.querySelector('.name').textContent = group.name;

        const roomGrid = groupTemplateClone.querySelector('.grid');
        group.roomIds.forEach(roomId => {
            const roomTemplateClone = roomTemplate.content.cloneNode(true);
            const room = rooms.find(r => r.id === roomId);

            roomTemplateClone.querySelector('.name').textContent = room.name;
            roomTemplateClone.querySelector('.room-number').textContent = room.room_number;

            roomGrid.appendChild(roomTemplateClone);
        })

        if (userRole === 'admin') {
            groupTemplateClone.querySelector('.editRoomBtns').style.display = 'block';

            groupTemplateClone.querySelector('.edit-btn').onclick = () => openGroupEdit(group);
            groupTemplateClone.querySelector('.add-btn').onclick = () => openAddRoomToGroup(group);
            groupTemplateClone.querySelector('.remove-rooms-btn').onclick = () => openRemoveRoomsFromGroup(group);
            groupTemplateClone.querySelector('.delete-btn').onclick = () => deleteGroup(group);
        }

        grid.appendChild(groupTemplateClone);
    });
}

///////////////////// Add group /////////////////////

function openAddGroup() {
    document.getElementById('add-group').style.display = '';
}

function closeAddGroup() {
    document.getElementById('add-group').style.display = 'none';
    document.getElementById('group-add-name-input').value = '';
    Array.from(document.getElementById('rooms-to-group-add').elements['room']).forEach(i => i.checked = false);
}

function submitAddGroup() {
    if (userRole !== 'admin') {
        alert('You are not allowed to create groups.');
        return;
    }

    const groupName = document.getElementById('group-add-name-input').value ?? '';
    if (groupName === '') {
        alert('The group needs a name.');
        return;
    }

    const roomIds = Array.from(document.getElementById('rooms-to-group-add').elements['room'])
        .filter(input => input.checked)
        .map(input => input.dataset.id);

    fetch('/api/group/createGroup', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: groupName,
            room_ids: roomIds,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully created: ' + data.name);
            groups.push({
                id: data.id,
                name: data.name,
                roomIds: data.rooms.map(room => room.id)
            });
            renderGroups();
        })
        .then(() => closeAddGroup())
        .catch(error => console.error('Failed to create group: ', error.message));
}

///////////////////// Edit group /////////////////////

function openGroupEdit(group) {
    document.getElementById('edit-group').style.display = '';
    document.getElementById('group-edit-name-input').value = group.name;
    window.updateGroupName = group;
}

function closeGroupEdit() {
    document.getElementById('edit-group').style.display = 'none';
    window.updateGroupName = null;
}

function submitGroupEdit() {
    if (userRole !== 'admin') {
        alert('You are not allowed to edit groups.');
        return;
    }

    const newName = document.getElementById('group-edit-name-input').value ?? '';
    const group = window.updateGroupName;

    if (newName === '') {
        alert('Name can\'t be empty.');
        return;
    }

    fetch('/api/group/updateGroupName/' + group.id, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: newName,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully renamed group to ' + data.name);

            const index = groups.findIndex(g => g.id === data.id);
            if (index !== -1) {
                groups[index].name = data.name;
                renderGroups();
            }
        })
        .then(() => closeGroupEdit())
        .catch(error => console.error('Failed to add room to the group: ', error.message));
}

///////////////////// Add room to group /////////////////////

function openAddRoomToGroup(group) {
    Array.from(document.getElementById('add-rooms-to-group').elements['room'])
        .forEach(i => {
            if (group.roomIds.includes(parseInt(i.dataset.id))) {
                i.style.display = 'none';
            }
        })

    window.groupAddNewRooms = group;
    document.getElementById('add-room-to-group-modal').style.display = '';
}

function closeAddRoomToGroup() {
    window.groupAddNewRooms = null;
    document.getElementById('add-room-to-group-modal').style.display = 'none';
    Array.from(document.getElementById('add-rooms-to-group').elements['room'])
        .forEach(i => {
            i.checked = false;
            i.style.display = '';
        });
}

function submitAddRoomToGroup() {
    if (userRole !== 'admin') {
        alert('You are not allowed to add rooms to groups.');
        return;
    }

    const group = window.groupAddNewRooms;
    const roomIds = Array.from(document.getElementById('add-rooms-to-group').elements['room'])
        .filter(input => input.checked)
        .map(input => input.dataset.id);

    fetch('/api/group/addRoomsToGroup/' + group.id, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            room_ids: roomIds,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully added rooms');

            const index = groups.findIndex(g => g.id === data.id);
            if (index !== -1) {
                groups[index].roomIds = data.rooms.map(room => room.id);
                renderGroups();
            }
        })
        .then(() => closeAddRoomToGroup())
        .catch(error => console.error('Failed to add room to the group: ', error.message));
}

///////////////////// Remove rooms from group /////////////////////

function openRemoveRoomsFromGroup(group) {
    Array.from(document.getElementById('remove-rooms-from-group').elements['room'])
        .forEach(i => {
            if (!group.roomIds.includes(parseInt(i.dataset.id))) {
                i.style.display = 'none';
            }
        })

    window.groupRemoveRooms = group;
    document.getElementById('remove-room-from-group-modal').style.display = '';
}

function closeRemoveRoomsFromGroup() {
    window.groupRemoveRooms = null;
    document.getElementById('remove-room-from-group-modal').style.display = 'none';
    Array.from(document.getElementById('remove-rooms-from-group').elements['room'])
        .forEach(i => {
            i.checked = false;
            i.style.display = '';
        });
}

function submitRemoveRoomsFromGroup() {
    if (userRole !== 'admin') {
        alert('You are not allowed to remove rooms from groups.');
        return;
    }

    const group = window.groupRemoveRooms;
    const roomIds = Array.from(document.getElementById('remove-rooms-from-group').elements['room'])
        .filter(input => input.checked)
        .map(input => input.dataset.id);

    fetch('/api/group/removeRoomsFromGroup/' + group.id, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            room_ids: roomIds,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully removed rooms');

            const index = groups.findIndex(g => g.id === group.id);
            if (index !== -1) {
                groups[index].roomIds = group.roomIds.filter(i => !roomIds.includes(String(i)));
                renderGroups();
            }
        })
        .then(() => closeRemoveRoomsFromGroup())
        .catch(error => console.error('Failed to remove room(s) from the group: ', error.message));
}

///////////////////// Group deletion /////////////////////
function deleteGroup(group) {
    const token = getToken();

    if (userRole !== 'admin') {
        alert('You are not allowed to delete groups.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete this group: ${group.name}?`);
    if (!confirmed) {
        return;
    }

    fetch('/api/group/deleteGroup/' + group.id, {
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

            alert('Successfully deleted group');
            const index = groups.findIndex(g => g.id === group.id);
            if (index !== -1) {
                groups.splice(index, 1);
                renderGroups();
            }
        })
        .catch(error => console.error('Delete failed:', error.message));
}

fetchUserole();
