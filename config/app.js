require('dotenv').config();

var dbConnectionURI = process.env.dbConnectionURI || "mongodb://localhost:27017/SocialClub";
module.exports = {
  name: "SocialClub",
  title: "SocialClub",
  http: {
    host: "localhost",
    port: 8000
  },
  version: "2.0.0",
  db: {
    connectionUri: dbConnectionURI,
    params: {}
  }
};
