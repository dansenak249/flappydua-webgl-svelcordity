import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/db.js';

export async function GET({ url }) {
    const userId = url.searchParams.get('userId');
    const db = await connectDB();

    const user = await db.collection("scores").findOne({ userId });

    return json({
        maxScore: user?.maxScore ?? 0
    });
}
