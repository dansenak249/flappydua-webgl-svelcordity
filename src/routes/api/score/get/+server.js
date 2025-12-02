import { json } from "@sveltejs/kit";
import { connectDB } from "$lib/server/db.js";

export async function GET({ url }) {
    const userId = url.searchParams.get("userId");
    const db = await connectDB();

    const result = await db.collection("scores").findOne({ userId });
    return json(result || { maxScore: 0 });
}
