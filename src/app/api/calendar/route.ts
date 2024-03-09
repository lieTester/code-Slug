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
               select: {
                  topics: true, // Include topic details
               },
            },
         },
      });
      interface WeekDayWithTopics {
         [key: string]: {
            id: number;
            name: string;
            topics: { id: number; name: string }[];
         };
      }

      // Format the result
      const formattedWeekDays: WeekDayWithTopics = {};

      weekDays.forEach((weekDay) => {
         // Assuming weekDay.name exists and is the key you want to use
         formattedWeekDays[weekDay.name.split("~")[0]] = {
            id: weekDay.id,
            name: weekDay.name,
            topics: weekDay.topics.map((link) => ({
               id: link.topics.id, // Accessing the actual topic's id
               name: link.topics.name, // Accessing the actual topic's name
            })),
         };
      });

      return NextResponse.json({ status: 200, formattedWeekDays });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
const linkTopics = async (
   userId: string,
   weekDayId: number,
   newTopics: number[]
) => {
   try {
      // Step 1: Find the WeekDay and ensure it belongs to the user's calendar
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

      // Step 2: Fetch currently linked topics
      const existingLinks = await prisma.topicToWeekDay.findMany({
         where: { weekDayId },
         select: { topicId: true },
      });

      const existingTopicIds = existingLinks.map((link) => link.topicId);

      // Step 3: Determine topics to unlink (those not in the newTopics array)
      const topicsToUnlink = existingTopicIds.filter(
         (topicId) => !newTopics.includes(topicId)
      );

      // Step 4: Unlink topics that are not in the new array
      await prisma.topicToWeekDay.deleteMany({
         where: {
            weekDayId,
            topicId: { in: topicsToUnlink },
         },
      });

      // Step 5: Determine topics to link (those in the newTopics array but not already linked)
      const topicsToLink = newTopics.filter(
         (topicId) => !existingTopicIds.includes(topicId)
      );

      // Step 6: Link new topics (avoid duplicates with skipDuplicates)
      const links = await prisma.topicToWeekDay.createMany({
         data: topicsToLink.map((topicId: number) => ({
            topicId,
            weekDayId,
         })),
         skipDuplicates: true,
      });

      // Step 7: Return success response
      return NextResponse.json({
         status: 200,
         message: "Topics linked to the weekday",
         linkedTopics: links,
         unlinkedTopics: topicsToUnlink,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
   }
};

const weekDayIdTopics = async (userId: string, weekDayId: number) => {
   try {
      const weekDay = await prisma.weekDay.findFirst({
         where: {
            id: weekDayId,
            weeklyCalendar: {
               ownerId: userId,
            },
         },
         select: {
            id: true,
            topics: {
               select: {
                  topics: {
                     // If the relation is called 'topics'
                     select: {
                        id: true,
                        name: true,
                     },
                  },
               },
            },
         },
      });

      if (!weekDay) {
         return NextResponse.json({
            status: 403,
            error: "You do not have access to this WeekDay or it does not exist.",
         });
      }

      const linkedTopics = weekDay.topics.map((relation) => ({
         id: relation.topics.id,
         name: relation.topics.name,
      }));

      return NextResponse.json({
         status: 200,
         message: "Linked topics fetched successfully",
         topics: linkedTopics,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Server error" });
   }
};

const deleteWeekCalendar = async (userId: string, weekCalendarId: string) => {
   try {
      // Step 1: Check if the WeeklyCalendar belongs to the user
      const calendar = await prisma.weeklyCalendar.findUnique({
         where: { id: weekCalendarId },
         include: { owner: true }, // Include the owner for the check
      });

      if (!calendar) {
         return NextResponse.json({
            status: 404,
            error: "WeeklyCalendar not found.",
         });
      }

      if (calendar.ownerId !== userId) {
         return NextResponse.json({
            status: 403,
            error: "You do not have permission to delete this calendar.",
         });
      }

      // Step 2: Fetch linked WeekDay entries
      const weekDays = await prisma.weekDay.findMany({
         where: { weeklyCalendarId: weekCalendarId },
         include: { topics: true },
      });

      // Step 3: Delete related TopicToWeekDay relationships and WeekDay entries
      await Promise.all(
         weekDays.map(async (day) => {
            // Delete TopicToWeekDay relationships
            await prisma.topicToWeekDay.deleteMany({
               where: { weekDayId: day.id },
            });

            // Delete the WeekDay entry
            await prisma.weekDay.delete({
               where: { id: day.id },
            });
         })
      );

      // Step 4: Delete the WeeklyCalendar itself
      await prisma.weeklyCalendar.delete({
         where: { id: weekCalendarId },
      });

      // Step 5: Respond with success
      return NextResponse.json({
         status: 204,
         message: "Calendar and associated data deleted successfully.",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error: "Internal Server Error" });
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
         case "deleteWeekCalendar":
            return deleteWeekCalendar(data?.userId, data?.weekCalendarId);
         case "weekDayIdTopics":
            return weekDayIdTopics(data?.userId, data?.weekDayId);

         default:
            break;
      }
   } catch (error) {}
};

export { getHandlerRequests as GET, postHandlerRequests as POST };
