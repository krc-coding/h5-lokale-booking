import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../Utilities/ResourceManager";
import { Box, MenuItem } from "@mui/material";
import { IRoom } from "../types/IRoom";

interface ICreateBookingDialog {
    rooms: IRoom[];
}

const CreateBookingDialog = (props: ICreateBookingDialog) => {
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
        const request = resourceManager.makeRequest("/api/booking/create", "POST", JSON.stringify(formJson), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then(() => {
            handleCloseDialog();
            window.location.reload();
        }).catch((error) => {
            if (error.response.data.error_message) {
                setErrorMessage(error.response.data.error_message);
            } else if (error.response.data.message) {
                setErrorMessage(error.response.data.message);
            }
        });
    };

    return (
        <React.Fragment>
            <Button variant="outlined" onClick={handleOpenDialog} sx={{
                float: "right",
                marginRight: "10px"

            }}>
                Create booking
            </Button>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleCloseDialog}
                slotProps={{
                    paper: {
                        component: 'form',
                        onSubmit: handleSubmit,
                    },
                }}
            >
                <DialogTitle>Create booking</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        focused
                        fullWidth
                        select
                        margin="dense"
                        name="room_id"
                        label="Room"
                        variant="outlined"
                        defaultValue={1}
                    >
                        {props.rooms.map((room) =>
                            <MenuItem key={room.id} value={room.id}>
                                {room.name}
                            </MenuItem>
                        )}
                    </TextField>
                    <TextField
                        required
                        focused
                        fullWidth
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        variant="outlined"
                    />
                    <TextField
                        multiline
                        focused
                        fullWidth
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        variant="outlined"
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                        <TextField
                            required
                            focused
                            margin="dense"
                            name="start_time"
                            label="Start time"
                            type="datetime-local"
                            variant="outlined"
                        />
                        <TextField
                            required
                            focused
                            margin="dense"
                            name="end_time"
                            label="End time"
                            type="datetime-local"
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-around" }}>
                        {errorMessage && <span>{errorMessage}</span>}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit">Book room</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default CreateBookingDialog;
