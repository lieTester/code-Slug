import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib"; // You'll need to set up Prisma

// Create Week Calendar
const createWeekCalendar = async ({
   userId,
   calendarName,
}: {
   userId: string;
   calendarName: string;
}) => {
   if (!userId || !calendarName) {
      return NextResponse.json({
         status: 400,
         error: "User ID and Calendar Name are required",
      });
   }
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
      await prisma.weeklyCalendar.create({
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

      return NextResponse.json({
         status: 200,
         message: "New User Calendar Created",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};

// Get User Calendars
const getUserCalendars = async ({ userId }: { userId: string }) => {
   if (!userId) {
      return NextResponse.json({ status: 400, error: "User ID is required" });
   }

   try {
      // Fetch calendars for the user
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

      // Return the transformed data
      return NextResponse.json({
         status: 200,
         message: "All User Calendars",
         formattedCalendars,
      });
   } catch (error) {
      console.error("Error fetching calendars:", error);
      return NextResponse.json({
         status: 500,
         error: error,
      });
   }
};
// Get Public User Calendars
const getPublicAndUserCalendars = async ({ userId }: { userId: string }) => {
   if (!userId) {
      return NextResponse.json({ status: 400, error: "User ID is required" });
   }

   try {
      // Find the "default" user (assuming "default" is a username or similar field)
      const defaultUser = await prisma.user.findFirst({
         where: { username: "default" }, // Assuming 'username' is the field that identifies the default user
         select: { id: true }, // Only select the 'id'
      });

      if (!defaultUser) {
         return NextResponse.json({
            status: 404,
            error: "Default user not found",
         });
      }

      const defaultUserId = defaultUser.id;
      // Fetch calendars for the user or for the "default" user
      const calendars = await prisma.weeklyCalendar.findMany({
         where: {
            OR: [
               { ownerId: userId }, // Fetch calendars of the provided user
               { ownerId: defaultUserId }, // Fetch calendars of the default user
            ],
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

      // Return the transformed data
      return NextResponse.json({
         status: 200,
         message: "All user and public calendars",
         formattedCalendars,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: error,
      });
   }
};

// Get WeekDays and Topics
const getWeekDaysAndTopics = async ({
   userId,
   weekCalendarId,
}: {
   userId: string;
   weekCalendarId: string;
}) => {
   if (!userId || !weekCalendarId) {
      return NextResponse.json({
         status: 400,
         error: "User ID and Week Calendar ID are required",
      });
   }

   try {
      // Find the "default" user (assuming "default" is a username or similar field)
      const defaultUser = await prisma.user.findFirst({
         where: { username: "default" }, // Assuming 'username' is the field that identifies the default user
         select: { id: true }, // Only select the 'id'
      });

      if (!defaultUser) {
         return NextResponse.json({
            status: 404,
            error: "Default user not found",
         });
      }

      const defaultUserId = defaultUser.id;
      // Find the WeekDay and ensure it belongs to the user's calendar
      // Check if the calendar belongs to the user
      const calendar = await prisma.weeklyCalendar.findFirst({
         where: {
            id: weekCalendarId,
            OR: [
               { ownerId: userId }, // Fetch week days and topics of given user
               { ownerId: defaultUserId }, // Fetch week days and topics of the default user
            ],
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

      return NextResponse.json({
         status: 200,
         message: "All Weekdays have with topics",
         formattedWeekDays,
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
// Get today's weekCalendat Topics of user
const getTodaysTopics = async ({ userId }: { userId: string }) => {
   if (!userId) {
      return NextResponse.json({
         status: 400,
         error: "User ID is required",
      });
   }

   try {
      // Find the "default" user (assuming "default" is a username or similar field)
      const User = await prisma.user.findFirst({
         where: { id: userId }, // Assuming 'username' is the field that identifies the default user
      });

      if (!User) {
         return NextResponse.json({
            status: 404,
            error: "User not found",
         });
      }
      if (User.appliedWeeklyCalendar) {
         const calendar = await prisma.weeklyCalendar.findFirst({
            where: {
               id: User.appliedWeeklyCalendar,
            },
         });
         if (!calendar) {
            return NextResponse.json({
               status: 403,
               error: "You do not have access to this calendar",
            });
         }
         // Get today's day name (e.g., Monday, Tuesday)
         const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
         ];
         const todayName = dayNames[new Date().getDay()]; // Returns current day as a string

         // Fetch topics for today's weekday only
         const todayWeekDay = await prisma.weekDay.findFirst({
            where: {
               weeklyCalendarId: User.appliedWeeklyCalendar,
               name: {
                  startsWith: todayName, // Match the weekday's name
               },
            },
            include: {
               topics: {
                  select: {
                     topics: true, // Include the actual topic details
                  },
               },
            },
         });

         // Format the result
         if (!todayWeekDay) {
            return NextResponse.json({
               status: 404,
               message: `No topics found for ${todayName}.`,
            });
         }

         const formattedTodayTopics = {
            id: todayWeekDay.id,
            name: todayWeekDay.name,
            topics: todayWeekDay.topics.map((link) => ({
               id: link.topics.id, // Accessing the actual topic's id
               name: link.topics.name, // Accessing the actual topic's name
            })),
         };

         return NextResponse.json({
            status: 200,
            message: `Topics for today (${todayName}) fetched successfully.`,
            formattedTodayTopics,
         });
      }
      return NextResponse.json({
         status: 200,
         message: "Apply a calendar if want to user features",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ status: 500, error });
   }
};
// Link Topics
const linkTopics = async ({
   userId,
   weekDayId,
   newTopics,
}: {
   userId: string;
   weekDayId: number;
   newTopics: number[];
}) => {
   if (!userId || !weekDayId || !newTopics) {
      return NextResponse.json({
         status: 400,
         error: "User ID, WeekDay ID, and Topics are required",
      });
   }
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

// Fetch Topics for WeekDay
const weekDayIdTopics = async ({
   userId,
   weekDayId,
}: {
   userId: string;
   weekDayId: number;
}) => {
   if (!userId || !weekDayId) {
      return NextResponse.json({
         status: 400,
         error: "User ID and WeekDay ID are required",
      });
   }
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

// Assign Calendar
const assignCalendarToUser = async ({
   userId,
   weekCalendarId,
}: {
   userId: string;
   weekCalendarId: string;
}) => {
   if (!userId || !weekCalendarId) {
      return NextResponse.json({
         status: 400,
         error: "User ID and Week Calendar ID are required",
      });
   }

   try {
      // Step 1: Check if the WeeklyCalendar exists and belongs to the user or default user
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

      // Find the "default" user
      const defaultUser = await prisma.user.findFirst({
         where: { username: "default" },
         select: { id: true }, // Only select the 'id'
      });

      // Step 2: Check if the weekCalendarId is either linked to the user or the default user
      if (calendar.ownerId !== userId && defaultUser?.id !== calendar.ownerId) {
         return NextResponse.json({
            status: 403,
            error: `You do not have permission to assign this calendar to user ID: ${userId}.`,
         });
      }

      // Step 3: Assign the WeeklyCalendar to the user by updating the appliedWeeklyCalendar field
      await prisma.user.update({
         where: { id: userId },
         data: {
            appliedWeeklyCalendar: weekCalendarId,
         },
      });

      // Step 4: Respond with success
      return NextResponse.json({
         status: 200,
         message: "Calendar successfully assigned to user.",
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({
         status: 500,
         error: "Internal Server Error",
      });
   }
};

// Delete Calendar
const deleteWeekCalendar = async ({
   userId,
   weekCalendarId,
}: {
   userId: string;
   weekCalendarId: string;
}) => {
   if (!userId || !weekCalendarId) {
      return NextResponse.json({
         status: 400,
         error: "User ID and Week Calendar ID are required",
      });
   }
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

      if (calendar.ownerId !== userId || calendar.ownerId !== userId) {
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

const getHandlerRequests = async (req: NextRequest, res: NextResponse) => {
   // getPublicAndUserCalendars;
   try {
      const { searchParams } = new URL(req.url);

      // Get all parameters at once
      const data = Object.fromEntries(searchParams.entries());

      switch (data.type) {
         case "getPublicAndUserCalendars":
            return getPublicAndUserCalendars({ userId: data.userId });
         case "getAllCalendars":
            return getUserCalendars({ userId: data.userId });
         case "getTodaysTopics":
            return getTodaysTopics({ userId: data.userId });
         case "getWeekDaysAndTopics":
            return getWeekDaysAndTopics({
               userId: data.userId,
               weekCalendarId: data.weekCalendarId,
            });
         case "weekDayIdTopics":
            return weekDayIdTopics({
               userId: data.userId,
               weekDayId: Number(data.weekDayId),
            });
         default:
            return NextResponse.json({
               status: 400,
               message: "Invalid request type",
            });
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         error,
      });
   }
};
const postHandlerRequests = async (req: NextRequest) => {
   try {
      const data = await req.json();
      switch (data.type) {
         case "createWeekCalendar":
            return createWeekCalendar({
               userId: data.userId,
               calendarName: data.cal,
            });
         case "linkTopics":
            return linkTopics({
               userId: data.userId,
               weekDayId: data.weekDayId,
               newTopics: data.topics,
            });

         case "deleteWeekCalendar":
            return deleteWeekCalendar({
               userId: data.userId,
               weekCalendarId: data.weekCalendarId,
            });
         case "assignCalendarToUser":
            return assignCalendarToUser({
               userId: data.userId,
               weekCalendarId: data.weekCalendarId,
            });

         default:
            return NextResponse.json({
               status: 400,
               message: "Invalid request type",
            });
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         error,
      });
   }
};

export { getHandlerRequests as GET, postHandlerRequests as POST };
