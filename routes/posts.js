// Endpoint to get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = getAllPosts()
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
});