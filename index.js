const express = require('express');
const cors = require('cors');
require('dotenv').config()
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');





const app = express();
const port = process.env.PORT || 5500;


// middlewires
app.use(cors(
    {
        origin: ['http://localhost:5173', 'https://brain-blogs.web.app', 'brain-blogs.firebaseapp.com'],
        credentials:true
    }
));


// 

app.use(bodyParser.json());

//cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());



app.get('/', (req,res)=>{
    res.send('Server running ...');
})




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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });


    console.log("Pinged your deployment. You successfully connected to MongoDB!");



    //collections
    const BlogsCollection = client.db('BrainBlogs').collection('blogs');
    const CommentsCollection = client.db('BrainBlogs').collection('comments');
    const WishedCollection = client.db('BrainBlogs').collection('wishlist');








    //auth api

    app.post('/jwt', async(req,res)=>{
        const userEmail = req.body.email;
        console.log('userEmail recieved in jwt post',userEmail);

         // Generate JWT token
        const token = jwt.sign({ email: userEmail }, process.env.access_token_secret, {expiresIn: '1h'});
        console.log('Generated token:', token);
      
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          };
          //localhost:5000 and localhost:5173 are treated as same site.  so sameSite value must be strict in development server.  in production sameSite will be none
          // in development server secure will false .  in production secure will be true
       
          res.
          cookie( 'token', token ,{
            httpOnly:true,
            secure:true,
            sameSite: 'none',
        })
        .send({success:true})
    });


    
    
    
      







 
// services api

    

    app.post('/addBlogs', async(req,res)=>{
        const blog = req.body;
        
        const r = await BlogsCollection.insertOne(blog)
        res.send(r);

    })







    app.get('/getBlogs', async(req,res)=>{
        const query = BlogsCollection.find();
        const r = await query.toArray();
        res.send(r);
    })







    app.get('/getBlogDetails/:id', async(req, res)=>{
        const id = req.params.id;

        const query = { _id: new ObjectId(id)};
        const r = await BlogsCollection.findOne(query);

        res.send(r);
    })





    




  
app.get('/getSearchedBlog/:text', async (req, res) => {
    try {
        const searchText = req.params.text;
        
        
        const query = {
            $or: [
                { title: { $regex: searchText, $options: 'i' } }, 
                { short_description: { $regex: searchText, $options: 'i' } }, 
                { long_description: { $regex: searchText, $options: 'i' } } 
            ]
        };
        const cursor = BlogsCollection.find(query);
        const results = await cursor.toArray();
        
        res.send(results);
    } catch (error) {
        console.error("Error searching for blogs:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});









    app.post('/addComment', async(req,res)=>{
        const comment = req.body;

        const r = await CommentsCollection.insertOne(comment)
        res.send(r);

    })






    
    app.get('/getComments/:id', async(req,res)=>{
        const id = req.params.id;
        
        const query = {blogId : id}
        const result = await CommentsCollection.find(query).toArray();

        res.send(result);
    })









    app.put('/addToWishlist', async(req,res)=>{
        const newWished = req.body;
        const email = newWished.userEmail;

        const query = {userEmail : email};

        const updatedArray = {
            $set:{
                ids : newWished.ids
            }
        }
        const options ={ upsert : true};

        const result = await WishedCollection.updateOne(query, updatedArray, options );
        res.send(result);

    })














    app.get('/getWishlist/:userEmail', async(req,res)=>{


        console.log('User in valied token in getWishlist received: ',req.user);

        const email = req.params.userEmail;
        console.log('mail: ',email);
        const cursor = {userEmail : email}

        const query = WishedCollection.find(cursor);
        const r = await query.toArray();

        res.send(r);
    })








    app.put('/update/:id', async(req,res)=>{


        const id = req.params.id;
        const blog = req.body;

        const query = {_id: new ObjectId(id)};

        const updatedBlog = {
            $set:{
                title : blog.title ,
                category : blog.category ,
                short_description : blog.short_description ,
                long_description : blog.long_description ,
                userEmail : blog.userEmail ,
                imageurl : blog.imageurl ,
                time : blog.time ,
            }
        }

        const options ={ upsert : true};

        const result = await BlogsCollection.updateOne(query, updatedBlog, options );
        res.send(result);

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