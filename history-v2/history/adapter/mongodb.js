const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eliseomurillo9:jH57Kfrc4ka027QX@iot-tp.sfzmdp5.mongodb.net/';
const client = new MongoClient(uri, {
    maxPoolSize: 10
});
let database;

async function getDatabase() {
    if (!database) {
        await client.connect();
        database = client.db("open-faas-tp");
    }

    return database;
}
async function save(alertBody, collection) {
    try {
        const database = await getDatabase()
        const alertCollection = database.collection(collection);

        return await alertCollection.insertOne(alertBody);

    } catch (error) {
        console.error('Error saving alert to MongoDB:', error);
        throw error;
    }
}


module.exports = { save };
