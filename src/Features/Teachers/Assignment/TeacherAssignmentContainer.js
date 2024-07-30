import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetTeacherDataQuery } from '../teachersApiSlice';
import Loading from '../../../Components/Loading';
import Error from '../../../Components/Error';
import { TeacherCardWrapper } from '../../../Components/TeacherCardWrapper';
import { AddAssignments } from './AddAssignment';
import { ViewAssignments } from './ViewAssignments';

export const TeacherAssignmentContainer = () => {
  const { classId } = useParams(); 

  const { data, isLoading, isSuccess, isError, error } =
    useGetTeacherDataQuery(classId);

  const { assignments } = data || {};

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <TeacherCardWrapper
        title='Assignment'
        dialogChildren={<AddAssignments />}
        children={<ViewAssignments data={assignments} />}
      />
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};
