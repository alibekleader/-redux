import React from "react";
import { useParams } from "react-router-dom";

import { useGetClassDataQuery } from "../adminApiSlice";
import Loading from "../../../Components/Loading";
import Error from "../../../Components/Error";
import { TeacherCardWrapper } from "../../../Components/TeacherCardWrapper";
import { AddStaffInfo } from "./AddStaff";
import { ViewStaffInfo } from "./ViewStaffInfo";

export const StaffContainer = () => {
  const { classId } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetClassDataQuery(classId);

  const { staff } = data || {};

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <TeacherCardWrapper
        title="Staff"
        dialogChildren={<AddStaffInfo data={staff} />}
        children={<ViewStaffInfo data={staff} />}
      />
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};
