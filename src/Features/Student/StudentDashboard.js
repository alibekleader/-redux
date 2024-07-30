import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { useGetStudentDataQuery } from './studentApiSlice';
import Loading from '../../Components/Loading';
import Error from '../../Components/Error';
import { SummaryBox } from '../../Components/Boxes/SummaryBox';
import { Timetable } from './Timetable';

const StudentDashboard = () => {
  const { classId } = useParams();
  const { data, isLoading, isSuccess, isError, error } =
    useGetStudentDataQuery(classId);

  const { miscellaneousInfo } = data || {};

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />; 
  }
  else if (isSuccess) {
    content = (
      <Box sx={{ mt: 2 }}>
        <SummaryBox data={miscellaneousInfo} />
        <Timetable />
      </Box>
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};

export default StudentDashboard;
