import { MongoClient } from "mongodb";

export async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log("Connectiont to MongoDb Atlas cluster");
        await mongoClient.connect();
        console.log("Successfully connected to MongoDB Atlas")

        return mongoClient;
    } catch (error) {
        console.log("Connection to MongoDb Atlas failed!", error);
        process.exit();
    }
}


export async function executesUserCrudOperations() {
    const uri = process.env.MONGODB_URI;
    let mongoClient;

    try {
        mongoClient = await connectToCluster(uri);
    } finally {
        await mongoClient.close();
    }
}