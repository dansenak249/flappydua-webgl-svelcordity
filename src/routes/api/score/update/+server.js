import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db.js';

export async function POST({ request }) {
    const { userId, score } = await request.json();

    const db = await connectDB();
    const collection = db.collection("scores");

    const user = await collection.findOne({ userId });

    if (!user) {
        await collection.insertOne({ userId, maxScore: score });
    } else if (score > user.maxScore) {
        await collection.updateOne(
            { userId },
            { $set: { maxScore: score } }
        );
    }

    return json({ success: true });
}
