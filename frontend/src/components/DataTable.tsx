import Box from "@mui/material/Box";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useAuth } from "../context/AuthContext";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const DataTable = () => {
  const { reports, user, deleteReport } = useAuth();
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const handleToggleActions = (rowId: string) => {
    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
  };

  const handleEdit = (rowId: string) => {
    if (!selectedRow) return;
    setExpandedRowId((prev) => (prev === rowId ? null : rowId));
  };

  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRow) return;

    deleteReport(selectedRow._id);
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedRow(null);
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "date",
      headerName: "Date",
      width: 150,
    },
    {
      field: "name",
      headerName: "Account Name",
      width: 200,
    },
    {
      field: "locale",
      headerName: "Locale",
      width: 150,
    },
    {
      field: "hours",
      headerName: "Work Hours",
      width: 220,
    },
    {
      field: "isOutsourced",
      headerName: "Outsourced",
      width: 150,
    },
    {
      field: "accountWorker",
      headerName: "Worker",
      width: 150,
    },
    {
      field: "workerId",
      headerName: "Action",
      width: 150,
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "1px" }}>
          <IconButton
            color="primary"
            onClick={() => handleToggleActions(params.row.id)}
          >
            <MoreVertIcon />
          </IconButton>
          {user?.role === "admin" && expandedRowId === params.row.id && (
            <>
              <IconButton onClick={() => handleEdit(params.row.id)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(params.row)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Box>
      ),
    },
  ];

  const rows = reports.map((report) => ({
    id: report.id,
    _id: report._id,
    name: report.name,
    hours: report.workhour,
    date: report.date,
    locale: report.locale,
    accountOwner: report.accountOwner,
    accountWorker: report.accountWorker.name,
    role: report.accountOwner.role,
    isOutsourced: report.isOutsourced,
  }));

  const DataGridDemo = () => {
    return (
      <div className="mt-5 flex justify-center items-center w-full">
        <Box
          sx={{
            height: 500,
            width: "auto",
            overflowX: "100%",
          }}
        >
          <Box sx={{ minWidth: "900px" }}>
            <DataGrid
              sx={{
                boxShadow: 2,
                border: 2,
                borderColor: "",
                ".MuiDataGrid-columnHeaderTitle": {
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                },
                "&.MuiDataGrid-columnHeaders": {
                  backgroundColor: "gray",
                },
              }}
              getRowId={(row) => row.id}
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              checkboxSelection
              showToolbar
              disableRowSelectionOnClick
            />
          </Box>
        </Box>
        {/*menu for action*/}
        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to Delete
              <strong className="ml-2">{selectedRow?.name}</strong>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    <div className="mt-5 flex justify-center items-center overflow-auto">
      <DataGridDemo />
    </div>
  );
};

export default DataTable;
