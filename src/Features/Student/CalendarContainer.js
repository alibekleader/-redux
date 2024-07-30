import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import { useGetStudentDataQuery } from './studentApiSlice';
import Loading from '../../Components/Loading';
import Error from '../../Components/Error';
import { Calendar } from './Calendar';
import { Events } from '../../Components/Events';

export const CalendarContainer = () => {
  const { classId } = useParams();
  const { data, isLoading, isSuccess, isError, error } =
    useGetStudentDataQuery(classId);

  const { events } = data || {};

  let content;
  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Calendar events={events} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Events events={events} />
        </Grid>
      </Grid>
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};
