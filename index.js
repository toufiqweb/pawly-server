const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });

    const db = client.db("pawly");
    const petsCollection = db.collection("pets");

    // pets apis
    app.post("/add-pet", async (req, res) => {
      const pet = req.body;
      const result = await petsCollection.insertOne(pet);
      res.send(result);
    });

    app.get("/pets", async (req, res) => {
      const { search } = req.query;
      let cursor;
      if (search) {
        cursor = await petsCollection.find({
          $or: [
            {
              petName: {
                $regex: search,
                $options: "i",
              },
            },
            {
              breed: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        });
      } else {
        cursor = petsCollection.find();
      }

      const results = await cursor.toArray();
      res.json(results);
    });

    app.get("/pets/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const pet = await petsCollection.findOne(query);
      res.json(pet);
    });

    // featured pets api
    app.get("/featured-pets", async (req, res) => {
      const cursor = await petsCollection.find().limit(6);
      const results = await cursor.toArray();
      res.json(results);
    });

    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
