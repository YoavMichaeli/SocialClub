const getAllPosts = async () => {
   return await postsCollection.find({}).toArray();
};