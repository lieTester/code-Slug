import axios from "axios";

export const getAllUserCalendars = async ({ userId }: { userId: string }) => {
   try {
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "getAllCalendars",
            userId,
         }
      );

      return res.data;
   } catch (error) {
      console.error("Error fetching user calendars:", error);
      throw error;
   }
};

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
      throw error;
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
      throw error;
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
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "weekDayIdTopics",
            userId,
            weekDayId,
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error linking topics:", error);
      throw error;
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
      const res = await axios.post(
         `${process.env.NEXT_PUBLIC_API_BASE_URL}/calendar/`,
         {
            type: "getWeekDaysAndTopics",
            userId,
            weekCalendarId,
         }
      );
      return res.data;
   } catch (error) {
      console.error("Error fetching weekdays and topics:", error);
      throw error;
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
      throw error;
   }
};
