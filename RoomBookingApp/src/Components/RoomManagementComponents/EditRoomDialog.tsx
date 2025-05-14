import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../../Utilities/ResourceManager";
import { IconButton } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { IRoom } from "../../types/IRoom";

interface IEditRoomDialog {
    updateRooms: () => void;
    room: IRoom;
}

const EditRoomDialog = (props: IEditRoomDialog) => {
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpenDialog = () => {
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const request = resourceManager.makeRequest("/api/room/update/" + props.room.id, "PUT", JSON.stringify(formJson), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then(() => {
            props.updateRooms();
            handleCloseDialog();
        }).catch((error) => {
            setErrorMessage(error.response.data.error_message);
        });
    };

    return (
        <React.Fragment>
            <IconButton onClick={handleOpenDialog}><Edit /></IconButton>
            <Dialog
                open={open}
                onClose={handleCloseDialog}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: handleSubmit,
                    },
                }}
            >
                <DialogTitle>Edit Room</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        type="text"
                        variant="standard"
                        defaultValue={props.room.name}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        fullWidth
                        type="text"
                        variant="standard"
                        defaultValue={props.room.description}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="room_number"
                        label="Room number"
                        fullWidth
                        type="text"
                        variant="standard"
                        defaultValue={props.room.room_number}
                    />
                    <TextField
                        required
                        margin="dense"
                        name="max_people"
                        label="Max people"
                        fullWidth
                        type="number"
                        variant="standard"
                        defaultValue={props.room.max_people}
                    />
                    {errorMessage && <span>{errorMessage}</span>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default EditRoomDialog;
