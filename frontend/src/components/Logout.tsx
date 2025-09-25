import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

const LogoutButton = () => {
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    console.log("User logged out!");
    // Example:
    // localStorage.removeItem("token");
    // navigate("/login");
    setOpen(false);
  };

  return (
    <div className=" bg-gray-100 h-full  p-4">
      {/* 🔔 Confirmation Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out? You’ll need to log back in to
            access the dashboard.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LogoutButton;
