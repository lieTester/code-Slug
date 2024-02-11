import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

const createWeekCalendar = async (userId: string, calendarName: string) => {
   try {
      // Create WeeklyCalendar and WeekDays together in a transaction
      const weekDays = [
         "Monday",
         "Tuesday",
         "Wednesday",
         "Thursday",
         "Friday",
         "Saturday",
         "Sunday",
      ];
      const calendar = await prisma.weeklyCalendar.create({
         data: {
            title: calendarName,
            ownerId: userId,
            days: {
               create: weekDays.map((dayName: string) => ({
                  name: `${dayName}~${calendarName}`,
                  date: new Date(), // Optional: Set actual dates if needed, otherwise default to now
               })),
            },
         },
      });

      return NextResponse.json({ status: 200, calendar });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
const getUserCalendars = async (userId: string) => {
   try {
      const calendars = await prisma.weeklyCalendar.findMany({
         where: {
            ownerId: userId,
         },
         include: {
            days: {
               select: {
                  id: true,
                  name: true,
                  _count: {
                     select: {
                        topics: true, // This will count the number of topics associated with each day
                     },
                  },
               },
            },
         },
      });
      // Transform the data into the desired format
      const formattedCalendars = calendars.map((calendar) => ({
         id: calendar.id,
         title: calendar.title, // Assuming 'title' is a field in your calendar model
         days: calendar.days.map((day) => ({
            id: day.id,
            name: day.name.split("~")[0], // Split by '~' and take the first part
            count: day._count.topics, // The count of topics
         })),
      }));
      return NextResponse.json({ status: 200, formattedCalendars });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
const getWeekDaysAndTopics = async (userId: string, weekCalendarId: string) => {
   try {
      // Find the WeekDay and ensure it belongs to the user's calendar
      // Check if the calendar belongs to the user
      const calendar = await prisma.weeklyCalendar.findFirst({
         where: {
            id: weekCalendarId,
            ownerId: userId, // Ensure the calendar belongs to the user
         },
      });

      if (!calendar) {
         return NextResponse.json({
            status: 403,
            error: "You do not have access to this calendar",
         });
      }

      // Fetch weekdays and topics for the calendar
      const weekDays = await prisma.weekDay.findMany({
         where: {
            weeklyCalendarId: weekCalendarId,
         },
         include: {
            topics: {
               include: {
                  topics: true, // Include topic details
               },
            },
         },
      });
      const formattedWeekDays = weekDays.map((day) => ({
         id: day.id,
         name: day.name.split("~")[0], // Split by '~' and take the first part
         topics: day.topics, // The count of topics
      }));
      return NextResponse.json({ status: 200, formattedWeekDays });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
const linkTopics = async (
   userId: string,
   weekDayId: number,
   topics: number[]
) => {
   try {
      // Find the WeekDay and ensure it belongs to the user's calendar
      const weekDay = await prisma.weekDay.findFirst({
         where: {
            id: weekDayId,
            weeklyCalendar: {
               ownerId: userId, // Ensure the WeekDay belongs to a calendar owned by the user
            },
         },
      });

      if (!weekDay) {
         return NextResponse.json({
            status: 403,
            error: "You do not have access to this WeekDay",
         });
      }

      // Link multiple topics to the specific week-day
      const links = await prisma.topicToWeekDay.createMany({
         data: topics.map((topicId: number) => ({
            topicId,
            weekDayId,
         })),
         skipDuplicates: true, // Avoid duplicate links
      });

      return NextResponse.json({
         status: 200,
         message: "Topics linked to the weekday",
         links,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

const getHandlerRequests = async (req: NextRequest, res: NextResponse) => {};
const postHandlerRequests = async (req: NextRequest, res: NextResponse) => {
   try {
      const data = await req.json();
      switch (data.type) {
         case "getAllCalendars":
            return getUserCalendars(data?.userId);
         case "createWeekCalendar":
            return createWeekCalendar(data?.userId, data?.cal);
         case "linkTopics":
            return linkTopics(data?.userId, data?.weekDayId, data?.topics);
         case "getWeekDaysAndTopics":
            return getWeekDaysAndTopics(data?.userId, data?.weekCalendarId);

         default:
            break;
      }
   } catch (error) {}
};

export { getHandlerRequests as GET, postHandlerRequests as POST };
