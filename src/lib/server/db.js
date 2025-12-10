// src/lib/server/db.js
import { MongoClient, ServerApiVersion } from "mongodb";
import { env } from "$env/dynamic/private";

let client;
let db;

export async function connectDB() {
    if (!client) {
        client = new MongoClient(env.MONGODB_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connected successfully!");

        db = client.db("1minute-flappydua");
    }

    return db;
}
