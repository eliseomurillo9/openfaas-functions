const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://eliseomurillo9:jH57Kfrc4ka027QX@iot-tp.sfzmdp5.mongodb.net/';
const client = new MongoClient(uri, {
    maxPoolSize: 200
});

client.connect();
async function save(alertBody, collection) {
    //TODO: Create a connection pool
    const uri = 'mongodb+srv://eliseomurillo9:jH57Kfrc4ka027QX@iot-tp.sfzmdp5.mongodb.net/';
    const client = new MongoClient(uri);
    try {
        const database = client.db('open-faas-tp');
        const alertCollection = database.collection(collection);

        return await alertCollection.insertOne(alertBody);

    } catch (error) {
        console.error('Error saving alert to MongoDB:', error);
        throw error;
    }
}


module.exports = { save };
