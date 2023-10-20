# SocialClub: A Social Network Web App

Welcome to SocialClub, a dynamic social networking platform crafted to create meaningful connections and interactions. Built on the MVC architecture, our application provides a seamless experience from user sign-up to posting content.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Main Features](#main-features)
- [Additional Features](#additional-features)
- [Getting Started](#getting-started)
- [Contribution](#contribution)
- [License](#license)

## Technologies Used

- **Server**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud-hosted)
- **Frontend**: [EJS](https://ejs.co/)
- **Real-time Communication**: [Socket.io](https://socket.io/)

## Main Features

### User Model:

- Full CRUD operations for user profiles.
- User sign-up and authentication.

### Group Model:

- Create, update, and manage social groups.
- Follow groups for updates and posts.

### Analytics Model:

- Track and visualize user and group statistics.

### Room (Chat) Model:

- Real-time chat capabilities using Socket.io.
- Direct messaging between users.

### Post Interaction:

- Add, retrieve, comment, and like posts.
- Timeline featuring posts from followed users and groups.

### Search Capabilities:

- Regex-powered search for users and groups.

## Additional Features

### Twitter Integration:

- Automatic updates using the Twitter API for every new user sign-up.

### Google Maps Integration:

- Fetch and visualize data about unique countries our app users hail from.
- Interactive map featuring markers for each represented country.

### Weatherstack Integration:

- Personalized weather data for users based on their country.

## Getting Started

1. **Node.js Version**: Ensure that you have Node.js version `v18.18.0` installed. If you haven't installed it yet, you can download it from [Node.js official website](https://nodejs.org/).

2. **Environment Variables**: Create a `.env` file in the root directory of the project. This file should contain all necessary environment variables. Below is a template for the `.env` file content:

    ```env
    # MongoDB
    dbConnectionURI=YOUR_MONGODB_CONNECTION_STRING

    # Twitter API
    CONSUMER_KEY=YOUR_CONSUMER_KEY
    CONSUMER_SECRET=YOUR_CONSUMER_SECRET
    ACCESS_TOKEN=YOUR_ACCESS_TOKEN
    ACCESS_TOKEN_SECRET=YOUR_ACCESS_TOKEN_SECRET

    # Weatherstack API
    WEATHERSTACK_API_KEY=YOUR_WEATHERSTACK_API_KEY

    # Google Maps API
    GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
    ```

    Please replace the placeholders with your actual keys and connection strings. Remember to keep the `.env` file confidential and never commit it to public repositories.

3. **Starting the Application**: Once you've set up your environment variables, initiate the application by running:

    ```bash
    npm start
    ```

This should start your application, and it should be accessible via `http://localhost:YOUR_PORT_NUMBER` in your web browser.



