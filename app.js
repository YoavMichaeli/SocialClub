// This is our main app logic

require('dotenv').config();

const express = require('express');
const server = require('./server/server');
const { MongoClient } = require('mongodb');

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());  // To support JSON-encoded bodies
const PORT = 5000 || process.env.PORT;

app.use(express.static('public'));
app.set('layout', './layouts/main');

app.use('/', require('./server/routes/main'))


const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const postsCollection = client.db(process.env.DB_NAME).collection('posts');  

// Endpoint to get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await postsCollection.find({}).toArray();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});

// Endpoint to publish a new post
app.post('/posts', async (req, res) => {
    try {
        const post = req.body;
        console.log(post);

        const result = await postsCollection.insertOne(post);
        res.status(201).json({ message: 'Post published successfully', postId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error publishing post', error: error.message });
    }
});

client.connect()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB', error);
    });



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});



app.post('/calc', function(req,res){
    var x = parseInt(req.body.x)
    var y = parseInt(req.body.y)
    var operation = req.body.operation

    var result = server.calc(x,y,operation)    

    res.end(`<html>
                <body>
                    The answer is ${result}. 
                    <a href="/about">reset</a>
                </body>
            </html>`)
})

module.exports = {
    app: app,
    bodyParser: bodyParser
};
