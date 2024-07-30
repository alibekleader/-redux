import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetTeacherDataQuery } from '../teachersApiSlice';
import Loading from '../../../Components/Loading';
import Error from '../../../Components/Error';
import { TeacherCardWrapper } from '../../../Components/TeacherCardWrapper';
import { AddStudent } from './AddStudent';
import { ViewStudents } from './ViewStudents';

export const StudentContainer = () => {
  const { classId } = useParams(); 

  const { data, isLoading, isSuccess, isError, error } =
    useGetTeacherDataQuery(classId);

  const { studentInfo } = data || {};

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <TeacherCardWrapper
        title='Student'
        dialogChildren={<AddStudent />}
        children={<ViewStudents data={studentInfo} />}
      />
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};
