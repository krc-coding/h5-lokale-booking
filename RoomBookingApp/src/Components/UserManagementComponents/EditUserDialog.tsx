import React, { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import resourceManager from "../../Utilities/ResourceManager";
import { FormControlLabel, IconButton, MenuItem, Switch } from "@mui/material";
import Edit from "@mui/icons-material/Edit";
import { IUser } from "../../types/IUser";

interface IEditUserDialog {
    updateUsers: () => void;
    user: IUser;
}

const EditUserDialog = (props: IEditUserDialog) => {
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
        const requestBody = {
            role: formJson.role,
            disabled: formJson.disabled == "on" ? true : false,
        };
        const request = resourceManager.makeRequest("/api/user/editUser/" + props.user.id, "PUT", JSON.stringify(requestBody), { headers: { "Content-Type": "application/json" } });
        request.getResponse().then(() => {
            props.updateUsers();
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
                <DialogTitle>Edit user</DialogTitle>
                <DialogContent>
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
                    <FormControlLabel control={<Switch defaultChecked={props.user.disabled ? true : false} />} name="disabled" label="Disabled" />
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

export default EditUserDialog;
