import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

import { useGetTeacherDataQuery } from './teachersApiSlice';
import Loading from '../../Components/Loading';
import Error from '../../Components/Error';
import { SummaryBox } from '../../Components/Boxes/SummaryBox';
import { AttendanceCharts } from '../../Components/Boxes/AttendanceCharts';
import { ResultsChart } from '../../Components/Boxes/ResultsChart';
import { TimeTableBox } from './TimeTable/TimeTableBox';

const TeacherDashboard = () => {
  const { classId } = useParams(); 
  const { data, isLoading, isSuccess, isError, error } =
    useGetTeacherDataQuery(classId);

  const { miscellaneousInfo, attendance, results, studentInfo } = data || {};
  const totalStudents = studentInfo?.length;

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <Box sx={{ mt: 2 }}>
        <SummaryBox data={miscellaneousInfo} />
        <AttendanceCharts data={attendance} />
        <ResultsChart data={results} students={totalStudents} />
        <TimeTableBox />
      </Box>
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};

export default TeacherDashboard;
