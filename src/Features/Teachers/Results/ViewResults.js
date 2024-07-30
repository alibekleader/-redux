import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

import { useDeleteResultMutation } from '../teachersApiSlice';
import { setSearchTerm } from '../../Search/Searchslice';
import { UpdateResults } from './UpdateResult';
import { CustomNoRowsOverlay } from '../../../Components/NoRowsOverlay';

export const ViewResults = ({ data }) => {
  console.log(data);
  const { classId } = useParams();

  const [deleteResults] = useDeleteResultMutation();

  const { searchTerm } = useSelector(setSearchTerm);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const [editedItem, setEditedItem] = useState({
    id: '',
    examType: '',
    passPercentage: '',
    description: '',
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
      'Do you really want to delete this item?'
    );
    if (confirmDelete) {
      deleteResults({ classId: classId, id })
        .unwrap()
        .then((response) => toast.success(response.message)) 
        .catch((error) => {
          const errorMessage =
            error?.error?.message ||
            error?.data?.error?.message ||
            'An error occurred.';
          toast.error(errorMessage); 
        });
    } else return;
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'examType', headerName: 'Examination Name', width: 200 },
    { field: 'passPercentage', headerName: 'Pass Percentage', width: 150 },
    {
      field: 'description',
      headerName: 'Description',
      width: 900,
      renderCell: (params) => (
        <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div>
          <IconButton color='primary' onClick={() => handleEdit(params.row.id)}>
            <Edit />
          </IconButton>
          <IconButton color='error' onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const term = searchTerm?.toLowerCase() || '';

    if (term.trim() === '') {
      setFilteredData(data || []);
    } else {
      const filteredExaminations = data?.filter(
        (rslt) =>
          rslt.examType?.toLowerCase().includes(term) ||
          rslt.passPercentage?.toLowerCase().includes(term) ||
          rslt.description?.toLowerCase().includes(term)
      );
      setFilteredData(filteredExaminations || []);
    }
  }, [searchTerm, data]);

  return (
    <Box sx={{ height: '100%', width: '100%', marginTop: '20px' }}>
      <ToastContainer />
      <DataGrid
        style={{ padding: '20px' }}
        rows={filteredData}
        columns={columns}
        rowsPerPageOptions={[5, 10, 20]}
        autoHeight
        disableSelectionOnClick
        slots={{
          noRowsOverlay: CustomNoRowsOverlay,
        }}
      />
      <Dialog open={editDialogOpen} onClose={handleSaveEdit}>
        <DialogContent>
          <UpdateResults data={editedItem} id={selectedItemId} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
