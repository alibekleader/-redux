import React from 'react';
import { useGetTeacherDataQuery } from '../teachersApiSlice';
import { TeacherCardWrapper } from '../../../Components/TeacherCardWrapper';
import Loading from '../../../Components/Loading';
import Error from '../../../Components/Error';
import { AddExamination } from './AddExamination';
import { ViewExaminations } from './ViewExaminations';
import { useParams } from 'react-router-dom';

export const TeacherExaminationContainer = () => {
  const { classId } = useParams(); 

  const { data, isLoading, isSuccess, isError, error } =
    useGetTeacherDataQuery(classId);

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <TeacherCardWrapper
        title='Examination'
        dialogChildren={<AddExamination data={data} />}
        children={<ViewExaminations data={data} />}
      />
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};
