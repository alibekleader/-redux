import React from "react";
import { useParams } from "react-router-dom";

import { useGetClassDataQuery } from "../adminApiSlice";
import Loading from "../../../Components/Loading";
import Error from "../../../Components/Error";
import { AdminCardWrapper } from "../../../Components/AdminCardWrapper";
import { TimeTable } from "../../../Components/TimeTable";
import { UpdateTimetable } from "./UpdateTimetable";

export const AdminTimeTable = () => {
  const { classId } = useParams();

  const { data, isLoading, isSuccess, isError, error } =
    useGetClassDataQuery(classId);

  const { timetable } = data || {};

  let content;

  if (isLoading) {
    content = <Loading open={isLoading} />;
  }
  else if (isSuccess) {
    content = (
      <AdminCardWrapper
        title="Time Table"
        dialogChildren={<UpdateTimetable data={timetable} />}
        children={<TimeTable data={timetable} />}
      />
    );
  }
  else if (isError) {
    content = <Error error={error} />;
  }
  return content;
};
