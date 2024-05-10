const express = require('express');
const cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');




const app = express();
const port = process.env.PORT || 5500;


// middlewires
app.use(cors());
app.use(bodyParser.json());


app.get('/', (req,res)=>{
    res.send('Server running ...');
})


//Brain-blogs
//JTYY7y5bhFHCWKSc


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.db_name}:${process.env.db_pass}@cluster-sajib.cqfdgne.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-Sajib`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");



    //collections
    const BlogsCollection = client.db('BrainBlogs').collection('blogs');
    const CommentsCollection = client.db('BrainBlogs').collection('comments');







// services api

    

    // add blog
    app.post('/addBlogs', async(req,res)=>{
        const blog = req.body;
        
        const r = await BlogsCollection.insertOne(blog)
        res.send(r);

    })







    // get all blogs
    app.get('/getBlogs', async(req,res)=>{
        const query = BlogsCollection.find();
        const r = await query.toArray();

        res.send(r);
    })

    // get specific blog
    app.get('/getBlogDetails/:id', async(req, res)=>{
        const id = req.params.id;

        const query = { _id: new ObjectId(id)};
        const r = await BlogsCollection.findOne(query);

        res.send(r);
    })



    // add comment
    app.post('/addComment', async(req,res)=>{
        const comment = req.body;
        console.log(comment);

    })

















  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);













app.listen(port, ()=>{
    console.log(`Server running in port ${port}`);
})