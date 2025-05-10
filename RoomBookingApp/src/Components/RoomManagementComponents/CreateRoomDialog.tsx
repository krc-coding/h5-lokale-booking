import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../../Utilities/ResourceManager";
import { IconButton } from "@mui/material";
import Add from "@mui/icons-material/Add";

interface ICreateRoomDialog {
    updateRooms: () => void;
}

const CreateRoomDialog = (props: ICreateRoomDialog) => {
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
        const request = resourceManager.makeRequest("/api/room/create/", "POST", JSON.stringify(formJson), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then(() => {
            props.updateRooms();
            handleCloseDialog();
        }).catch((error) => {
            setErrorMessage(error.response.data.error_message);
        });
    };

    return (
        <React.Fragment>
            <IconButton sx={{ width: "40px", height: "40px", marginY: "auto", backgroundColor: "#1976d2", color: "#FFFFFF" }} onClick={handleOpenDialog}><Add /></IconButton>
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
                <DialogTitle>Create user</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        name="name"
                        label="Name"
                        fullWidth
                        type="text"
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        fullWidth
                        type="text"
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="room_number"
                        label="Room number"
                        fullWidth
                        type="text"
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="max_people"
                        label="Max people"
                        fullWidth
                        type="number"
                        variant="standard"
                    />
                    {errorMessage && <span>{errorMessage}</span>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit">Create</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default CreateRoomDialog;
