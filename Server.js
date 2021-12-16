const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.utqcf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("Atgworld");
        const statusCollection = database.collection("Status");
        const UserInfCollection = database.collection("UserInfo");

        // post a User info
        app.post('/user', async (req, res) => {
            const data = req.body;
            const email = data.email;
            const allUserInfo = await UserInfCollection.findOne({ email: email });
            if (!allUserInfo) {
                const dataa = req.body;
                const userData = await UserInfCollection.insertOne(dataa);
                res.send(userData);
                console.log(userData);
            }
            else {
                res.send(404)
            }
        });
        // get a User
        app.post('/userr', async (req, res) => {
            const data = req.body;
            const email = data.userNameOrEmail;
            // const userName = data.userNameOrEmail;
            const pass = data.pass;
            const allUserInfo = await UserInfCollection.findOne({ email: email });
            console.log(allUserInfo.password);
            if (allUserInfo.password == pass) {
                res.send('ok');
                console.log('okay');
            }
            else {
                res.send(404)
            }
        });
        //post a status
        app.post('/status', async (req, res) => {
            const data = req.body;
            console.log(data);
            const status = await statusCollection.insertOne(data);
            res.send(status);
        });
    } finally {
        // await client.close();f
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Atg world is developers world')
});


app.listen(port, () => {
    console.log('server start at port', port);
});