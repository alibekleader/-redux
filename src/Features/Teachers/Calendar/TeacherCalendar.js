import React from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Box } from '@mui/material';

import { CardWrapper } from '../../../Components/CardWrapper';
import {
  useAddEventMutation,
  useDeleteEventMutation,
} from '../teachersApiSlice';
import Loading from '../../../Components/Loading';

export const TeacherCalendar = (events) => {
  const { classId } = useParams(); 

  const [addEvent, { isLoading }] = useAddEventMutation();

  const [deleteEvent] = useDeleteEventMutation();

  const handleDateClick = (selected) => {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selected.view.calendar;
    calendarApi.unselect();

    if (title) {
      const eventInfo = {
        id: `${selected.startStr}-${title}`,
        title,
        start: selected.startStr,
        end: selected.endStr,
        allDay: selected.allDay,
      };
      addEvent({ classId: classId, ...eventInfo })
        .unwrap()
        .then(() => calendarApi.addEvent(eventInfo))
        .then((response) => toast.success(response.message)) 
        .catch((error) => {
          const errorMessage =
            error?.error?.message ||
            error?.data?.error?.message ||
            'An error occurred.';
          toast.error(errorMessage); 
        });
    }
  };

  const handleEventClick = (selected) => {
    const title = selected.event.title;
    const data = {
      title: title,
    };
    if (
      window.confirm(`Are you sure you want to delete the event '${title}'`)
    ) {
      selected.event.remove();
      deleteEvent({ classId: classId, ...data })
        .unwrap()
        .then((response) => toast.success(response.message)) 
        .catch((error) => {
          const errorMessage =
            error?.error?.message ||
            error?.data?.error?.message ||
            'An error occurred.';
          toast.error(errorMessage); 
        });
    }
  };

  return (
    <CardWrapper title='Calendar'>
      <ToastContainer /> {/* Container for displaying toast messages */}
      {isLoading ? (
        <Loading open={isLoading} /> // Show loading state while fetching data
      ) : (
        <Box sx={{ height: '550px' }}>
          <Box sx={{ p: 1, height: '100%' }}>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
              ]}
              height='100%'
              headerToolbar={{
                left: 'today',
                center: 'title',
                right: 'prev,next',
              }}
              footerToolbar={{
                left: '',
                center: '',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
              }}
              initialView='dayGridMonth'
              initialEvents={events}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              select={handleDateClick}
              eventClick={handleEventClick}
            />
          </Box>
        </Box>
      )}
    </CardWrapper>
  );
};
