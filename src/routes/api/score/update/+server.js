import { json } from "@sveltejs/kit";
import { connectDB } from "$lib/server/db.js";

export async function POST({ request }) {
    const { userId, score } = await request.json();
    const db = await connectDB();

    const existing = await db.collection("scores").findOne({ userId });

    if (!existing || score > existing.maxScore) {
        await db.collection("scores").updateOne(
            { userId },
            { $set: { maxScore: score } },
            { upsert: true }
        );
    }

    return json({ success: true });
}
