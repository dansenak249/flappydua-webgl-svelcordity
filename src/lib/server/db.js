// src/lib/server/db.js
import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

let client;
let db;

export async function connectDB() {
    if (!client) {
        client = new MongoClient(env.MONGODB_URI);
        await client.connect();
        db = client.db("1minute-flappydua");
    }
    return db;
}
