require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const server = require('./server/server');

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.static('public'));

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'))



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}))



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