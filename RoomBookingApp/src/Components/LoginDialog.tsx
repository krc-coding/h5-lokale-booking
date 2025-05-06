import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../Utilities/ResourceManager";

interface ILoginDialog {
    setIsAuthed: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginDialog = (props: ILoginDialog) => {
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
        const request = resourceManager.makeRequest("/api/login", "POST", JSON.stringify(formJson), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then((response) => {
            handleCloseDialog();
            resourceManager.setAuthTokenHeader(response.data.token);
            window.api.saveAuthToken(response.data.token);
            props.setIsAuthed(true);
        }).catch((error) => {
            setErrorMessage(error.response.data.error_message);
        });
    };

    return (
        <React.Fragment>
            <Button variant="contained" onClick={handleOpenDialog} sx={{
                position: "absolute",
                top: "1%",
                right: "1%",
            }}>
                Login
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
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        id="username"
                        name="username"
                        label="User name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        required
                        margin="dense"
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        fullWidth
                        variant="standard"
                    />
                    {errorMessage && <span>{errorMessage}</span>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button type="submit">Login</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default LoginDialog;
