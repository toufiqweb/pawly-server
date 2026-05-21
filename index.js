const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
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

const JWKS = createRemoteJWKSet(new URL(`${process.env.CLIENT_URL}/api/auth/jwks`));

const verifyToken = async (req, res, next) => {
  const header = req.headers.authorization;
  // console.log(header);

  if (!header) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log(payload);

    next();
  } catch (error) {
    return res.status(403).send({ message: "Forbidden" });
  }
};

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });

    const db = client.db("pawly");
    const petsCollection = db.collection("pets");
    const requestsCollection = db.collection("requests");

    // pets apis
    app.post("/pets", verifyToken, async (req, res) => {
      const pet = req.body;
      const result = await petsCollection.insertOne(pet);
      res.json(result);
    });

    app.get("/pets", async (req, res) => {
      const { search, species, age, size, email } = req.query;
      let query = {};
      if (search) {
        query.$or = [
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
        ];
      }
      // SPECIES
      if (species) {
        query.species = species;
      }

      const results = await petsCollection.find(query).toArray();
      res.json(results);
    });

    app.get("/pets/:id", verifyToken, async (req, res) => {
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

    // my listing api
    app.get("/listings", verifyToken, async (req, res) => {
      const email = req.query.email;
      const result = await petsCollection.find({ ownerEmail: email }).toArray();

      res.send(result);
    });

    app.patch("/pets/:id", verifyToken, async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await petsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData },
        );

        res.json({
          success: true,
          result,
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    app.delete("/pets/:petId", verifyToken, async (req, res) => {
      const { petId } = req.params;
      const result = await petsCollection.deleteOne({
        _id: new ObjectId(petId),
      });
      res.json(result);
    });

    // my requests
    app.post("/adoption-requests", verifyToken, async (req, res) => {
      const requestData = req.body;

      const result = await requestsCollection.insertOne(requestData);

      res.json(result);
    });

    app.get("/requests", verifyToken, async (req, res) => {
      const { userEmail, petId } = req.query;
      const query = {};

      if (userEmail) query.userEmail = userEmail;
      if (petId) query.petId = petId;

      const result = await requestsCollection.find(query).toArray();
      res.json(result);
    });

    app.patch("/requests/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        const { status } = req.body;

        const allowed = ["approved", "rejected", "pending"];
        if (!allowed.includes(status)) {
          return res.status(400).send({ message: "Invalid status" });
        }

        const request = await requestsCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!request) {
          return res.status(404).send({ message: "Request not found" });
        }

        const result = await requestsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } },
        );

        if (status === "approved") {
          await requestsCollection.updateMany(
            {
              petId: request.petId,
              _id: { $ne: new ObjectId(id) },
            },
            {
              $set: { status: "rejected" },
            },
          );
        }

        res.send(result);
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" });
      }
    });

    app.delete("/requests/:id", verifyToken, async (req, res) => {
      const id = req.params.id;

      const result = await requestsCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send(result);
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
