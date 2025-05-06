const rooms = [];
const groups = [];
let userRole = 'nothing';

function changePage(page) {
    window.location.href = page;
}

function getToken() {
    return localStorage.getItem('authToken');
}

function notAdmin() {
    return userRole !== 'admin' && userRole !== 'systemAdmin';
}

function updateButtons() {
    if (!notAdmin()) {
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
    const cardTemplate = document.getElementById('room-card-template');
    const addGroupModal = document.getElementById('rooms-to-group-add');
    const addRoomToGroupModal = document.getElementById('add-rooms-to-group');
    const removeRoomFromGroupModal = document.getElementById('remove-rooms-from-group');

    // Clear to not have dubble
    grid.innerHTML = '';
    addGroupModal.innerHTML = '';
    addRoomToGroupModal.innerHTML = '';
    removeRoomFromGroupModal.innerHTML = '';

    grid.appendChild(cardTemplate); // Save the template again

    rooms.forEach(room => {
        const card = cardTemplate.content.cloneNode(true);

        card.querySelector('.name').textContent = room.name;
        card.querySelector('.room-number').textContent = room.room_number;
        card.querySelector('.max-people').textContent = room.max_people;
        card.querySelector('.description').textContent = room.description;

        if (!notAdmin()) {
            card.querySelector('.editRoomBtns').style.display = 'block';

            card.querySelector('.edit-btn').onclick = () => openRoomEdit(room);
            card.querySelector('.delete-btn').onclick = () => deleteRoom(room);

            // This is to the modal, to crud on group with rooms
            addGroupModal.appendChild(createRoomCheckbox(room));
            addGroupModal.appendChild(document.createElement("br"));

            addRoomToGroupModal.appendChild(createRoomCheckbox(room));
            addRoomToGroupModal.appendChild(document.createElement("br"));

            removeRoomFromGroupModal.appendChild(createRoomCheckbox(room));
            removeRoomFromGroupModal.appendChild(document.createElement("br"));
        }

        grid.appendChild(card);
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

        if (!notAdmin()) {
            groupTemplateClone.querySelector('.editRoomBtns').style.display = 'block';

            groupTemplateClone.querySelector('.edit-btn').onclick = () => openGroupEdit(group);
            groupTemplateClone.querySelector('.add-btn').onclick = () => openAddRoomToGroup(group);
            groupTemplateClone.querySelector('.remove-rooms-btn').onclick = () => openRemoveRoomsFromGroup(group);
            groupTemplateClone.querySelector('.delete-btn').onclick = () => deleteGroup(group);
        }

        grid.appendChild(groupTemplateClone);
    });
}

///////////////////// Room modal functions /////////////////////

function closeRoomModal() {
    document.getElementById('room-modal').style.display = 'none';
    document.getElementById('room-name').value = '';
    document.getElementById('room-number').value = '';
    document.getElementById('room-max-people').value = '';
    document.getElementById('room-description').value = '';
}

function submitRoomModal() {
    const name = document.getElementById('room-name').value ?? '';
    const roomNumber = document.getElementById('room-number').value ?? '';
    const maxPeople = document.getElementById('room-max-people').value ?? '';
    const description = document.getElementById('room-description').value ?? '';

    if (notAdmin()) {
        alert('You are not allowed to ' + window.roomModalAction + ' rooms');
        return;
    }

    if (name === '' || roomNumber === '' || maxPeople === '') {
        alert('One or more of the fields are empty');
        return;
    }

    if (window.submitRoomModalFunction) {
        window.submitRoomModalFunction(name, roomNumber, maxPeople, description);
        window.submitRoomModalFunction = null;
    }
}

///////////////////// Add room /////////////////////

function openAddRoom() {
    document.getElementById('room-modal').style.display = '';
    document.getElementById('submitRoomBtn').innerText = 'Create';
    window.submitRoomModalFunction = submitAddRoom;
    window.roomModalAction = 'create';
}

function submitAddRoom(name, roomNumber, maxPeople, description) {
    fetch('/api/room/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            room_number: roomNumber,
            max_people: maxPeople,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully created room: ' + data.data.name);
            rooms.push({
                id: data.data.id,
                name: data.data.name,
                description: data.data.description,
                room_number: data.data.room_number,
                max_people: data.data.max_people,
            });
            renderRooms();
        })
        .then(() => closeRoomModal())
        .catch(error => console.error('Failed to create room: ', error.message));
}

///////////////////// Edit room /////////////////////

function openRoomEdit(room) {
    document.getElementById('room-name').value = room.name;
    document.getElementById('room-number').value = room.room_number;
    document.getElementById('room-max-people').value = room.max_people;
    document.getElementById('room-description').value = room.description;
    document.getElementById('room-modal').style.display = '';
    document.getElementById('submitRoomBtn').innerText = 'Save';
    window.submitRoomModalFunction = submitRoomEdit;
    window.updateRoomId = room.id;
    window.roomModalAction = 'update';
}

function submitRoomEdit(name, roomNumber, maxPeople, description) {
    if (!window.updateRoomId) {
        alert('Internal Error, if this continues please contract support.');
        return;
    }

    const roomId = window.updateRoomId;
    window.updateRoomId = null;
    fetch('/api/room/update/' + roomId, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            description: description,
            room_number: roomNumber,
            max_people: maxPeople,
        })
    })
        .then(async response => {
            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                console.error(data.message || `Request failed with status ${response.status}`);
                return;
            }

            alert('Successfully updated: ' + data.data.name);
            const index = rooms.findIndex(r => r.id === data.data.id);
            if (index !== -1) {
                rooms[index] = data.data;
                renderRooms();
            }
        })
        .then(() => closeRoomModal())
        .catch(error => console.error('Failed to update room: ', error.message));
}

///////////////////// Delete room /////////////////////
function deleteRoom(room) {
    const token = getToken();

    if (notAdmin()) {
        alert('You are not allowed to delete rooms.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete this room: ${room.name}?`);
    if (!confirmed) {
        return;
    }

    fetch('/api/room/delete/' + room.id, {
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

            alert('Successfully deleted room');
            const index = rooms.findIndex(r => r.id === room.id);
            if (index !== -1) {
                rooms.splice(index, 1);
                renderRooms();
            }
        })
        .catch(error => console.error('Delete failed:', error.message));
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
    if (notAdmin()) {
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

            alert('Successfully created group: ' + data.name);
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
    if (notAdmin()) {
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
    if (notAdmin()) {
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
    if (notAdmin()) {
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

    if (notAdmin()) {
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
