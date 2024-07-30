import React from 'react';
import { useParams } from 'react-router-dom';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import styled from '@emotion/styled';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

import { useUpdateExaminationMutation } from '../teachersApiSlice';
import { CardWrapper } from '../../../Components/CardWrapper';
import ExamData from '../../../Data/Examinations.json';
import Loading from '../../../Components/Loading';

const ExamsValidationSchema = yup.object({
  id: yup.string().required('Please provide an ID for this examination'),
  examType: yup.string().required('Please select the type of examination'),
  subject: yup.string().required('Please provide the name of the subject'),
  description: yup.string().required('Please provide a description'),
});

const StyledTypography = styled(Typography)(() => ({
  color: 'red',
}));

export const UpdateExamination = ({ data, id, staffData }) => {
  const { classId } = useParams(); 

  const [updateExamination, { isLoading }] = useUpdateExaminationMutation(); 

  const updateExam = (data) => {
    updateExamination({ classId: classId, id: id, data })
      .unwrap()
      .then((response) => toast.success(response.message)) 
      .catch((error) => {
        const errorMessage =
          error?.error?.message ||
          error?.data?.error?.message ||
          'An error occurred.';
        toast.error(errorMessage); 
      });
  };

  const formik = useFormik({
    initialValues: {
      id: data?.id,
      examType: data?.examType,
      subject: data?.subject,
      description: data?.description,
    },
    validationSchema: ExamsValidationSchema,
    onSubmit: (values) => {
      updateExam(values);
    },
  });

  return (
    <CardWrapper title='Update Examination'>
      <ToastContainer />
      {/* -------- Form ------- */}
      {isLoading ? (
        <Loading open={isLoading} /> 
      ) : (
        <Grid
          container
          component='form'
          direction='row'
          alignItems='center'
          flexWrap='wrap'
          spacing={3}
          onSubmit={formik.handleSubmit}
        >
          {/* ------ ID ------- */}
          <Grid item xs={12}>
            <TextField
              id='id'
              fullWidth
              value={formik.values.id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.id && Boolean(formik.errors.id)}
              label='Id'
            />
            <StyledTypography>
              {formik.touched.id && formik.errors.id ? formik.errors.id : ''}
            </StyledTypography>
          </Grid>

          {/* ------ Exam Type ------ */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={formik.touched.examType && Boolean(formik.errors.examType)}
            >
              <InputLabel id='examType'>Examination</InputLabel>
              <Select
                labelId='examType'
                id='examType'
                name='examType'
                value={formik.values.examType}
                onChange={formik.handleChange}
                label='Select Examination'
              >
                {ExamData.examinations.map((exam) => (
                  <MenuItem key={exam.title} value={exam.title}>
                    {exam.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledTypography>
              {formik.touched.examType && formik.errors.examType
                ? formik.errors.examType
                : ''}
            </StyledTypography>
          </Grid>

          {/* ------- Subject --------- */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              error={formik.touched.subject && Boolean(formik.errors.subject)}
            >
              <InputLabel id='subject'>Subject</InputLabel>
              <Select
                labelId='subject'
                id='subject'
                name='subject'
                value={formik.values.subject}
                onChange={formik.handleChange}
                label='Select Subject'
              >
                {staffData?.map((sub) => (
                  <MenuItem key={sub.subject} value={sub.subject}>
                    {sub.subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledTypography>
              {formik.touched.subject && formik.errors.subject
                ? formik.errors.subject
                : ''}
            </StyledTypography>
          </Grid>

          {/*  ----- Description ----------- */}
          <Grid item xs={12}>
            <TextField
              id='description'
              name='description'
              fullWidth
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              label='Please provide a description or link'
            />
            <StyledTypography>
              {formik.touched.description && formik.errors.description
                ? formik.errors.description
                : ''}
            </StyledTypography>
          </Grid>

          {/* -------- Submit Button ----- */}
          <Grid item xs={12}>
            <Button
              variant='contained'
              type='submit'
              disabled={formik.isSubmitting} 
              fullWidth
            >
              Update Examination
            </Button>
          </Grid>
        </Grid>
      )}
    </CardWrapper>
  );
};
