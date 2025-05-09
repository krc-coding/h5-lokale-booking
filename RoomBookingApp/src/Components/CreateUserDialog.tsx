import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../Utilities/ResourceManager";
import { IconButton, MenuItem } from "@mui/material";
import Add from "@mui/icons-material/Add";

interface ICreateUserDialog {
    updateUsers: () => void;
}

const CreateUserDialog = (props: ICreateUserDialog) => {
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
        const request = resourceManager.makeRequest("/api/user/createUser/", "POST", JSON.stringify(formJson), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then(() => {
            props.updateUsers();
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
                        name="username"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        select
                        margin="dense"
                        name="role"
                        label="Role"
                        fullWidth
                        variant="standard"
                        defaultValue={"teacher"}
                    >
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"teacher"}>Teacher</MenuItem>
                    </TextField>
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

export default CreateUserDialog;
