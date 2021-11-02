const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.doqon.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {

    try {
        await client.connect();
        const database = client.db("carMeachanic");
        const servicesCollection = database.collection("services");

        //Get api
        
        app.get('/services', async (req, res) => {

            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);

        })

        // get single service api

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specifi id', id);
            const query = {_id : ObjectId(id)}; 
            const service =  await servicesCollection.findOne(query);
            res.json(service);


        })





        // post api

        app.post('/services', async (req, res) => {

             const service = req.body;
              
            // console.log('hit the post api',service);
            console.log('hit the post api',service);
     
              
            const result = await servicesCollection.insertOne(service);
            res.json(result);

        })

        // delete operation
   app.delete('/services/:id', async (req, res) => {
        const id = req.params.id;
        const query  = {_id:ObjectId(id)};
        const result = await servicesCollection.deleteOne(query);
        res.json(result);

   })
     
        
    } finally  {
        
    }


}

run().catch(console.dir);



app.get('/',(req, res) => {

    res.send('runnig genius server');

});

app.listen(port , () => {

    console.log('runnig genius server', port);
})