import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

import { useDeleteExaminationMutation } from '../teachersApiSlice';
import { setSearchTerm } from '../../Search/Searchslice';
import { UpdateExamination } from './UpdateExamination';
import { CustomNoRowsOverlay } from '../../../Components/NoRowsOverlay';

export const ViewExaminations = ({ data }) => {
  const { classId } = useParams(); 

  const [deleteExamination] = useDeleteExaminationMutation();

  const { searchTerm } = useSelector(setSearchTerm);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const { staff } = data || {};

  const [editedItem, setEditedItem] = useState({
    id: '',
    examtype: '',
    subject: '',
    description: '',
  });

  const handleEdit = (id) => {
    const selectedItem = data?.examinations?.find((item) => item.id === id);
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
      deleteExamination({ classId: classId, id })
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
    { field: 'examType', headerName: 'Examination Name', width: 200 },
    { field: 'subject', headerName: 'Subject', width: 200 },
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
      setFilteredData(data?.examinations || []);
    } else {
      const filteredExaminations = data?.examinations?.filter(
        (examination) =>
          examination.examType?.toLowerCase().includes(term) ||
          examination.subject?.toLowerCase().includes(term) ||
          examination.description?.toLowerCase().includes(term)
      );
      setFilteredData(filteredExaminations || []);
    }
  }, [searchTerm, data?.examinations]);

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
          <UpdateExamination
            data={editedItem}
            staffData={staff}
            id={selectedItemId}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
