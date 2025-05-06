const rooms = [];
const groups = [];
let userRole = 'nothing';

function updateButtons() {
    if (!notAdmin(userRole)) {
        // Remove the local styling: display.
        document.getElementById('roomAddBtn').style.display = '';
        document.getElementById('groupAddBtn').style.display = '';
    }
}

function fetchUserole() {
    Get('/api/user/getRole', async (role) => {
        userRole = role.role;
        updateButtons();
        await fetchRooms(); // wait for it to finishes
        fetchGroups();
    });
}

async function fetchRooms() {
    Get('/api/room', async newRooms => {
        newRooms.forEach(room => {
            rooms.push({
                id: room.id,
                name: room.name,
                description: room.description,
                room_number: room.room_number,
                max_people: room.max_people,
            });
        });
        renderRooms();
    });
}

function fetchGroups() {
    Get('/api/group/getGroups', async newGroups => {
        newGroups.forEach(group => {
            groups.push({
                id: group.id,
                name: group.name,
                roomIds: group.rooms.map(room => room.id)
            });
        });
        renderGroups();
    });
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
    const roomToGroupModal = document.getElementById('rooms-to-group');

    // Clear to not have dubble
    grid.innerHTML = '';
    addGroupModal.innerHTML = '';
    roomToGroupModal.innerHTML = '';

    grid.appendChild(cardTemplate); // Save the template again

    rooms.forEach(room => {
        const card = cardTemplate.content.cloneNode(true);

        card.querySelector('.name').textContent = room.name;
        card.querySelector('.room-number').textContent = room.room_number;
        card.querySelector('.max-people').textContent = room.max_people;
        card.querySelector('.description').textContent = room.description;

        if (!notAdmin(userRole)) {
            card.querySelector('.editRoomBtns').style.display = 'block';

            card.querySelector('.edit-btn').onclick = () => openRoomEdit(room);
            card.querySelector('.delete-btn').onclick = () => deleteRoom(room);

            // This is to the modal, to crud on group with rooms
            addGroupModal.appendChild(createRoomCheckbox(room));
            addGroupModal.appendChild(document.createElement("br"));

            roomToGroupModal.appendChild(createRoomCheckbox(room));
            roomToGroupModal.appendChild(document.createElement("br"));
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

        if (!notAdmin(userRole)) {
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

    if (notAdmin(userRole)) {
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
    const data = {
        name: name,
        description: description,
        room_number: roomNumber,
        max_people: maxPeople,
    }

    Post('/api/room/create', data, async room => {
        alert('Successfully created room: ' + room.data.name);
        rooms.push({
            id: room.data.id,
            name: room.data.name,
            description: room.data.description,
            room_number: room.data.room_number,
            max_people: room.data.max_people,
        });
        renderRooms();
        closeRoomModal();
    });
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
    const data = {
        name: name,
        description: description,
        room_number: roomNumber,
        max_people: maxPeople,
    }

    Put('/api/room/update/' + roomId, data, async room => {
        alert('Successfully updated: ' + room.data.name);
        const index = rooms.findIndex(r => r.id === room.data.id);
        if (index !== -1) {
            rooms[index] = room.data;
            renderRooms();
        }
        closeRoomModal();
    });
}

///////////////////// Delete room /////////////////////
function deleteRoom(room) {
    const token = getToken();

    if (notAdmin(userRole)) {
        alert('You are not allowed to delete rooms.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete this room: ${room.name}?`);
    if (!confirmed) {
        return;
    }

    Delete('/api/room/delete/' + room.id, async data => {
        alert('Successfully deleted room');
        const index = rooms.findIndex(r => r.id === room.id);
        if (index !== -1) {
            rooms.splice(index, 1);
            renderRooms();
        }
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
    if (notAdmin(userRole)) {
        alert('You are not allowed to create groups.');
        return;
    }

    const groupName = document.getElementById('group-add-name-input').value ?? '';
    if (groupName === '') {
        alert('The group needs a name.');
        return;
    }

    const data = {
        name: groupName,
        room_ids: Array.from(document.getElementById('rooms-to-group-add').elements['room'])
            .filter(input => input.checked)
            .map(input => input.dataset.id),
    };

    Post('/api/group/createGroup', data, async group => {
        alert('Successfully created group: ' + group.name);
        groups.push({
            id: group.id,
            name: group.name,
            roomIds: group.rooms.map(room => room.id)
        });
        renderGroups();
        closeAddGroup();
    });
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
    if (notAdmin(userRole)) {
        alert('You are not allowed to edit groups.');
        return;
    }

    const newName = document.getElementById('group-edit-name-input').value ?? '';
    const group = window.updateGroupName;

    if (newName === '') {
        alert('Name can\'t be empty.');
        return;
    }

    const data = {
        name: newName,
    }
    Put('/api/group/updateGroupName/' + group.id, data, async group => {
        alert('Successfully renamed group to ' + group.name);

        const index = groups.findIndex(g => g.id === group.id);
        if (index !== -1) {
            groups[index].name = group.name;
            renderGroups();
        }
        closeGroupEdit();
    });
}

///////////////////// Group add/remove rooms /////////////////////

function openRoomToGroup(group, action, add) {
    document.getElementById('room-to-group-title').innerText = action + ' rooms:';
    document.getElementById('rooms-to-group-btn').innerText = action;
    Array.from(document.getElementById('rooms-to-group').elements['room'])
        .forEach(i => {
            if (group.roomIds.includes(parseInt(i.dataset.id)) == add) {
                i.style.display = 'none';
            }
            else {
                i.style.display = '';
            }
        })
    document.getElementById('room-to-group-modal').style.display = '';
}

function closeRoomToGroup() {
    document.getElementById('room-to-group-modal').style.display = 'none';
    Array.from(document.getElementById('rooms-to-group').elements['room'])
        .forEach(i => {
            i.checked = false;
        });
}

function submitRoomToGroup() {
    if (window.roomToGroupFunction) {
        window.roomToGroupFunction(
            Array.from(document.getElementById('rooms-to-group').elements['room'])
                .filter(input => input.checked)
                .map(input => input.dataset.id));
        window.roomToGroupFunction = null;
    }
}

///////////////////// Add room to group /////////////////////

function openAddRoomToGroup(group) {
    window.groupAddNewRooms = group;
    window.roomToGroupFunction = submitAddRoomToGroup;
    openRoomToGroup(group, 'Add', true);
}

function submitAddRoomToGroup(roomIds) {
    if (notAdmin(userRole)) {
        alert('You are not allowed to add rooms to groups.');
        return;
    }

    const group = window.groupAddNewRooms;
    window.groupAddNewRooms = null;
    const data = {
        room_ids: roomIds
    };

    Put('/api/group/addRoomsToGroup/' + group.id, data, async group => {
        alert('Successfully added rooms');
        const index = groups.findIndex(g => g.id === group.id);
        if (index !== -1) {
            groups[index].roomIds = group.rooms.map(room => room.id);
            renderGroups();
        }
        closeRoomToGroup();
    });
}

///////////////////// Remove rooms from group /////////////////////

function openRemoveRoomsFromGroup(group) {
    window.groupRemoveRooms = group;
    window.roomToGroupFunction = submitRemoveRoomsFromGroup;
    openRoomToGroup(group, 'Remove', false);
}

function submitRemoveRoomsFromGroup(roomIds) {
    if (notAdmin(userRole)) {
        alert('You are not allowed to remove rooms from groups.');
        return;
    }

    const group = window.groupRemoveRooms;
    window.groupRemoveRooms = null;
    const data = {
        room_ids: roomIds
    };

    Put('/api/group/removeRoomsFromGroup/' + group.id, data, async message => {
        alert('Successfully removed rooms');
        const index = groups.findIndex(g => g.id === group.id);
        if (index !== -1) {
            groups[index].roomIds = group.roomIds.filter(i => !data.room_ids.includes(String(i)));
            renderGroups();
        }
        closeRoomToGroup();
    });
}

///////////////////// Group deletion /////////////////////
function deleteGroup(group) {
    const token = getToken();

    if (notAdmin(userRole)) {
        alert('You are not allowed to delete groups.');
        return;
    }

    const confirmed = confirm(`Are you sure you want to delete this group: ${group.name}?`);
    if (!confirmed) {
        return;
    }

    Delete('/api/group/deleteGroup/' + group.id, async data => {
        alert('Successfully deleted group');
        const index = groups.findIndex(g => g.id === group.id);
        if (index !== -1) {
            groups.splice(index, 1);
            renderGroups();
        }
    });
}

fetchUserole();
