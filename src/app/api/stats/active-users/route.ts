import { NextResponse } from 'next/server';
import { Url } from "@/lib/db/models/Url";
import { dbConnect } from "@/lib/db/db"; // if using custom connection logic

const ACTIVE_TIMEFRAME = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

export async function GET() {
  try {
    await dbConnect(); // if not using auto DB connection

    const now = Date.now();

    const activeUsers = await Url.aggregate([
      { $unwind: "$clicks" },
      {
        $match: {
          "clicks.timestamp": { $gte: new Date(now - ACTIVE_TIMEFRAME) }
        }
      },
      {
        $group: {
          _id: "$userId"
        }
      }
    ]);
    console.log(activeUsers)
    return NextResponse.json({ activeUsers: activeUsers.length });
  } catch (error) {
    console.error("Failed to fetch active users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
