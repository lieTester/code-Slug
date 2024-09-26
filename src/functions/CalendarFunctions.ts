import axios from "axios";

////////////////////////////////////////////////////////////////
// GET Request ////////////////////////////////////////////////
export const getAllUserCalendars = async ({ userId }: { userId: string }) => {
   try {
      const res = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            params: {
               type: "getAllCalendars",
               userId,
            },
         }
      );

      return res.data;
   } catch (error) {
      console.error("Error fetching user calendars:", error);
      return { error: "Error fetching user calendars" };
   }
};
export const getAllUserAndPublicCalendars = async ({
   userId,
}: {
   userId: string;
}) => {
   try {
      const res = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar`,
         {
            params: {
               type: "getPublicAndUserCalendars",
               userId,
            },
         }
      );

      return res.data;
   } catch (error) {
      console.error("Error fetching user calendars:", error);
      return { error: "Error fetching user calendars" };
   }
};
export const weekDayIdTopics = async ({
   userId,
   weekDayId,
}: {
   userId: string;
   weekDayId: number;
}) => {
   try {
      const res = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            params: { type: "weekDayIdTopics", userId, weekDayId },
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error linking topics:", error);
      return { error: "Error linking topics" };
   }
};
export const getWeekDaysAndTopics = async ({
   userId,
   weekCalendarId,
}: {
   userId: string;
   weekCalendarId: string;
}) => {
   try {
      const res = await axios.get(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            params: { type: "getWeekDaysAndTopics", userId, weekCalendarId },
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error fetching weekdays and topics:", error);
      return { error: "Error fetching weekdays and topics" };
   }
};
////////////////////////////////////////////////////////////////
// POST Request ////////////////////////////////////////////////
export const createWeekCalendar = async ({
   userId,
   cal,
}: {
   userId: string;
   cal: string;
}) => {
   try {
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "createWeekCalendar",
            userId,
            cal, // Calendar name
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error creating week calendar:", error);
      return { error: "Error creating week calendar" };
   }
};

export const linkTopics = async ({
   userId,
   weekDayId,
   topics,
}: {
   userId: string;
   weekDayId: number;
   topics: number[];
}) => {
   try {
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "linkTopics",
            userId,
            weekDayId,
            topics, // Array of topic IDs
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error linking topics:", error);
      return { error: "Error linking topics" };
   }
};

export const assignCalendarToUser = async ({
   userId,
   weekCalendarId,
}: {
   userId: string;
   weekCalendarId: string;
}) => {
   try {
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "assignCalendarToUser",
            userId,
            weekCalendarId,
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error fetching weekdays and topics:", error);
      return { error: "Error fetching weekdays and topics" };
   }
};
export const deleteWeekCalendar = async ({
   userId,
   weekCalendarId,
}: {
   userId: string;
   weekCalendarId: string;
}) => {
   try {
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "deleteWeekCalendar",
            userId,
            weekCalendarId,
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error fetching weekdays and topics:", error);
      return { error: "Error fetching weekdays and topics" };
   }
};
