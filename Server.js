const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.json());
app.use(fileUpload());

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
            }
            else {
                res.send(404)
            }
        });
        // get a User
        app.post('/userr', async (req, res) => {
            const data = req.body;
            const userName = data.userName;
            const pass = data.pass;
            const allUserInfo = await UserInfCollection.findOne({ userName: userName });
            if (allUserInfo?.password == pass) {
                res.send('ok');
            }
            else {
                res.send(404)
            }
        });
        // reset password
        app.put('/user', async (req, res) => {
            const data = req.body;
            const userName = data.userName;
            const pass = data.pass;
            const filter = { userName: userName };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    password: pass
                },
            };
            const result = UserInfCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
        // //post a status
        // app.post('/status', async (req, res) => {
        //     const data = req.body;
        //     const status = await statusCollection.insertOne(data);
        //     res.send(status);
        // });


        // sgfsb
        app.post('/status', async (req, res) => {
            const userStatus = req.body.userStatus;
            const pic = req.files.Image;
            console.log(req.files);
            const picData = pic.data;
            const encodedPic = picData.toString('base64');
            const imageBuffer = Buffer.from(encodedPic, 'base64');
            const status = {
                userStatus,
                image: imageBuffer
            }
            const result = await statusCollection.insertOne(status);
            res.json(result);
        })
        // get post
        app.get('/status', async (req, res) => {
            const cursor = statusCollection.find({});
            const status = await cursor.toArray();
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