const express = require('express');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utqcf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("Atgworld");
        const haiku = database.collection("Status");

        // post a Status
        app.post('/drones', async (req, res) => {
            const data = req.body;
            const package = await packagesCollection.insertOne(data);
            res.send(package);
        });
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Drone Peak Start')
});


app.listen(port, () => {
    console.log('server start at port', port);
});