<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Room Management</title>
    <link rel="stylesheet" href="{{ asset('css/Management.css') }}">
    <script src="{{ asset('js/ResourceManager.js') }}"></script>
</head>

<body>
    <h1>Room and Group management</h1>

    <div class="header-bar">
        <h2>Rooms</h2>
        <div>
            <button class="btn" onclick="changePage('/')">Back</button>
            <div id="roomAddBtn" style="display: none;">
                <button class="btn" onclick="openAddRoom()">Add Room</button>
            </div>
        </div>
    </div>

    <div id="admin">
        <div class="grid" id="roomGrid">
            <!-- Room card template -->
            <template id="room-card-template">
                <div class="card">
                    <div class="header-bar">
                        <h2 class="name"></h2>
                        <p class="room-number"></p>
                    </div>
                    <div style="flex-direction: row; display: flex;">
                        Max people:
                        <div class="max-people"></div>
                    </div>

                    <p class="description"></p>

                    <div class="editRoomBtns" style="display: none;">
                        <button class="edit-btn btn">Edit</button>
                        <button class="delete-btn btn delete">Delete</button>
                    </div>
                </div>
            </template>
        </div>
    </div>

    <div class="header-bar">
        <h2>Groups:</h2>
        <div id="groupAddBtn" style="display: none;">
            <button class="btn" onclick="openAddGroup()">Add Group</button>
        </div>
    </div>
    <div class="grid" id="groupGrid">
        <!-- Group card template -->
        <template id="group-card-template">
            <div class="card">
                <h2 class="name"></h2>

                <div>
                    <div class="grid">
                        <!-- Small room card template -->
                        <template id="room-card-inside-group-card-template">
                            <div class="header-bar header-bar-with-color">
                                <h3 class="name"></h3>
                                <p class="room-number" style="margin: 0;"></p>
                            </div>
                        </template>
                    </div>
                </div>

                <div class="editRoomBtns" style="display: none; padding-top: 3px;">
                    <button class="edit-btn btn">Edit</button>
                    <button class="add-btn btn">Add rooms</button>
                    <button class="remove-rooms-btn btn delete">Remove rooms</button>
                    <button class="delete-btn btn delete">Delete</button>
                </div>
            </div>
        </template>
    </div>

    <div id="modals">
        <!-- Add and edit room -->
        <div id="room-modal" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Enter room details:</p>
                <label>Name:</label>
                <input id="room-name" type="text" placeholder="Name" /><br /><br />

                <label>Room number:</label>
                <input id="room-number" type="text" placeholder="Room number" /><br /><br />

                <label>Max people:</label>
                <input id="room-max-people" type="number" placeholder="Max people" /><br /><br />

                <label>Description:</label>
                <input id="room-description" type="text" placeholder="Description" /><br /><br />

                <button id="submitRoomBtn" onclick="submitRoomModal()">Create</button>
                <button onclick="closeRoomModal()">Cancel</button>
            </div>
        </div>
        <!-- Add group -->
        <div id="add-group" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Enter group details:</p>
                <input id="group-add-name-input" type="text" placeholder="Name" /><br /><br />

                <p>Add rooms:</p>
                <form id="rooms-to-group-add"></form>
                <br>

                <button onclick="submitAddGroup()">Create</button>
                <button onclick="closeAddGroup()">Cancel</button>
            </div>
        </div>

        <!-- Edit group modal -->
        <div id="edit-group" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Enter group name:</p>
                <input id="group-edit-name-input" type="text" placeholder="Name" /><br /><br />

                <button onclick="submitGroupEdit()">Save</button>
                <button onclick="closeGroupEdit()">Cancel</button>
            </div>
        </div>

        <!-- Add room to group modal -->
        <div id="add-room-to-group-modal" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Add rooms:</p>
                <form id="add-rooms-to-group"></form>
                <br>

                <button onclick="submitAddRoomToGroup()">Add</button>
                <button onclick="closeAddRoomToGroup()">Cancel</button>
            </div>
        </div>

        <!-- Remove room to group modal -->
        <div id="remove-room-from-group-modal" class="custom-alert" style="display: none;">
            <div class="custom-alert-box">
                <p>Remove rooms:</p>
                <form id="remove-rooms-from-group"></form>
                <br>

                <button onclick="submitRemoveRoomsFromGroup()">Remove</button>
                <button onclick="closeRemoveRoomsFromGroup()">Cancel</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/RoomManagement.js') }}"></script>
</body>

</html>
