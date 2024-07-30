import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { setSearchTerm } from "../../Search/Searchslice";
import { useDeleteAssignmentMutation } from "../teachersApiSlice";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Edit } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UpdateAssignment } from "./UpdateAssignment";
import { CustomNoRowsOverlay } from "../../../Components/NoRowsOverlay";
import Loading from "../../../Components/Loading";

export const ViewAssignments = ({ data }) => {
  const { classId } = useParams();

  const [deleteAssignment, { isLoading }] = useDeleteAssignmentMutation();

  const { searchTerm } = useSelector(setSearchTerm);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editedItem, setEditedItem] = useState({
    id: "",
    subject: "",
    description: "",
    lastDate: "",
    assignedBy: "",
  });

  const handleEdit = (id) => {
    const selectedItem = data?.find((item) => item.id === id);
    setSelectedItemId(id);
    setEditedItem(selectedItem);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    setEditDialogOpen(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Do you really want to delete this item?"
    );
    if (confirmDelete) {
      deleteAssignment({ classId: classId, id })
        .unwrap()
        .then((response) => toast.success(response.message)) 
        .catch((error) => {
          const errorMessage =
            error?.error?.message ||
            error?.data?.error?.message ||
            "An error occurred.";
          toast.error(errorMessage); 
        });
    } else return;
  };

  const filteredData = data?.filter((item) => {
    const term = searchTerm ?? "";
    if (term.trim() === "") return true;
    return (
      (item.subject &&
        item.subject.toLowerCase().includes(term.toLowerCase() || "")) ||
      (item.description &&
        item.description.toLowerCase().includes(term.toLowerCase() || "")) ||
      (item.lastDate && item.lastDate.includes(term || "")) ||
      (item.assignedBy &&
        item.assignedBy.toLowerCase().includes(term.toLowerCase() || ""))
    );
  });

  const columns = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "subject", headerName: "Subject", width: 150 },
    {
      field: "description",
      headerName: "Description",
      width: 500,
      renderCell: (params) => (
        <div style={{ maxHeight: "100px", overflowY: "auto" }}>
          {params.value}
        </div>
      ),
    },
    { field: "lds", headerName: "Last Date of Submission", width: 200 },
    { field: "assignedBy", headerName: "Assigned By", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton color="primary" onClick={() => handleEdit(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", marginTop: "20px" }}>
      <ToastContainer />
      {isLoading ? (
        <Loading open={isLoading} />
      ) : (
        <>
          <DataGrid
            style={{ padding: "20px" }}
            rows={filteredData || []}
            columns={columns}
            rowsPerPageOptions={[5, 10, 20]}
            autoHeight
            disableSelectionOnClick
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
            }}
          />
          {/* ------------ Form for Updating ---------- */}
          <Dialog open={editDialogOpen} onClose={handleSaveEdit}>
            <DialogContent>
              <UpdateAssignment data={editedItem} id={selectedItemId} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
};
