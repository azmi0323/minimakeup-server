const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ee5t8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("database connect");
    const collection = client.db("makeup").collection("products");

    app.get("/products", async (req, res) => {
      const limit = parseInt(req.query.limit) || 100;
      const skip = parseInt(req.query.skip) || 0;

      console.log(limit);
      const cursor = collection.find();

      const result = await cursor.limit(limit).skip(skip).toArray();
      res.send(result);
    });
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await collection.deleteOne(filter);
      res.send({ result });

      console.log(id);
    });

    app.post("/products", async (req, res) => {
      const service = req.body;
      const result = await collection.insertOne(service);

      res.send({ result });
    });
  } finally {
  }
}
run().catch(console.dir);

//tora sobar niche thakbi
app.get("/", (req, res) => {
  res.send("database is running");
});

app.listen(port, () => {
  console.log("data base running on", port);
});
