const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();

app.use(bodyParser.json());

// Connect to the MongoDB database.
const mongoClient = new MongoClient('mongodb://localhost:27017/my-database');
mongoClient.connect((err, db) => {
  if (err) {
    console.error(err);
    return;
  }

  // Create the posts collection.
  const postsCollection = db.collection('posts');

  // Create a new post.
  app.post('/create-post', async (req, res) => {
    const content = req.body.content;

    const post = {
      content,
      createdAt: new Date(),
    };

    await postsCollection.insertOne(post);

    res.sendStatus(201);
  });
});

// Start the HTTP server.
app.listen(3000, () => {
  console.log('Server is listening on port 3000.');
});
