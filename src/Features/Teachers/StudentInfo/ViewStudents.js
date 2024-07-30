import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Dialog, DialogContent, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { setSearchTerm } from '../../Search/Searchslice';
import { CustomNoRowsOverlay } from '../../../Components/NoRowsOverlay';
import { UpdateStudent } from './UpdateStudent';
import { useDeleteStudentMutation } from '../teachersApiSlice';
import Loading from '../../../Components/Loading';

export const ViewStudents = ({ data }) => {
  const { classId } = useParams(); 

  const [deleteStudent, { isLoading }] = useDeleteStudentMutation();

  const { searchTerm } = useSelector(setSearchTerm);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedItemId, setSelectedItemId] = useState(null);

  const [editedItem, setEditedItem] = useState({
    id: '',
    fullname: '',
    gender: '',
    guardianDetails: '',
    contactInfo: '',
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
      deleteStudent({ classId: classId, id })
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
    { field: 'id', headerName: 'Roll No.', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    { field: 'guardianName', headerName: 'Guardian', width: 150 },
    { field: 'contactInfo', type: 'number', headerName: 'Contact', width: 150 },
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
        (stdnt) =>
          stdnt.id?.includes(term) ||
          stdnt.name?.toLowerCase().includes(term) ||
          stdnt.gender?.toLowerCase().includes(term) ||
          stdnt.guardianName?.toLowerCase().includes(term) ||
          stdnt.contactInfo?.toLowerCase().includes(term)
      );
      setFilteredData(filteredExaminations || []);
    }
  }, [searchTerm, data]);

  return (
    <Box sx={{ height: 760, width: '100%', marginTop: '20px' }}>
      <ToastContainer />
      {isLoading ? (
        <Loading open={isLoading} />
      ) : (
        <>
          <DataGrid
            style={{ padding: '20px' }}
            rows={filteredData}
            columns={columns}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            localeText={{
              toolbarDensity: 'Size',
              toolbarDensityLabel: 'Size',
              toolbarDensityCompact: 'Small',
              toolbarDensityStandard: 'Medium',
              toolbarDensityComfortable: 'Large',
            }}
            autoHeight
            disableSelectionOnClick
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              toolbar: GridToolbar,
            }}
            slotProps={{
              panel: {
                sx: {
                  '& .MuiDataGrid-filterForm': {
                    position: 'absolute',
                    top: '-100px',
                    backgroundColor: '#F8F8F8',
                  },
                },
              },
            }}
          />
          {/* ------------ Form for Updating ---------- */}
          <Dialog open={editDialogOpen} onClose={handleSaveEdit}>
            <DialogContent>
              <UpdateStudent data={editedItem} id={selectedItemId} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </Box>
  );
};
