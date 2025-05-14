import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../../Utilities/ResourceManager";
import { IUser } from "../../types/IUser";

interface IChangePasswordDialog {
    user?: IUser;
}

const ChangePasswordDialog = (props: IChangePasswordDialog) => {
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
        if (!props.user) return;
        setErrorMessage("");
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const request = resourceManager.makeRequest("/api/user/changePassword/" + props.user.id, "PUT", JSON.stringify(formJson), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then((response) => {
            handleCloseDialog();
        }).catch((error) => {
            setErrorMessage(error.response.data.error_message);
        });
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleOpenDialog}>
                Change password
            </Button>
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
                <DialogTitle>Change password</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        name="oldPassword"
                        label="Old password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="password"
                        label="New password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        name="password_confirmation"
                        label="New password (repeat)"
                        type="password"
                        fullWidth
                        variant="standard"
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

export default ChangePasswordDialog;
