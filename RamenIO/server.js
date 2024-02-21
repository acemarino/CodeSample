const express = require('express')
const pool = require('./db')
const app = express()
const port = 3001
const cors = require('cors');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//cors requests
app.use(cors({
    origin: 'https://localhost:3000',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

//search bar get request
app.post('/get', async (req, res) => {
    let conn;
    try {
        
        //establish a connection to MariaDB
        conn = await pool.getConnection();
        searchV=req.body.search;
        typeV=req.body.value;
        
        //testing
        //print search category and search value to terminal log to check correct value received
        console.log("search "+searchV);
        console.log("type "+typeV);

        //create a new query
        var query = "SELECT \
        users.name AS `reviewer`, \
        ramens.name, \
        ramens.brand, \
        ramens.country, \
        ramens.style, \
        ramen_reviews.rating \
        FROM \
        ramens INNER JOIN (ramen_reviews INNER JOIN users \
        ON ramen_reviews.user_id = users.user_id) \
        ON ramens.ramen_id = ramen_reviews.ramen_id";
        
        // add where clause
        if(typeV=="Brand"){
            query += " WHERE ramens.brand = (?)";
        }
        if(typeV=="Country"){
            query += " WHERE ramens.country = (?)";
        }
        if(typeV=="Name"){
            query += " WHERE ramens.name = (?)";
        }
        if(typeV=="Rating"){
            query += " WHERE ramen_reviews.rating >= (?)";
        }
        if(typeV=="Restaurant"){
            query += " WHERE restaurants.name = (?)";
        }
        //execute the query and set the result to a new variable
        var rows = await conn.query(query,[searchV]);
        
        //return the results
        res.send(rows);
        
    //error handling if search fails   
    } catch (err) {
        console.log('cant get')
        throw err;
    } finally {
        if (conn) return conn.release();
    }
});



//POST request for creating account
app.post('/SignUp', async (req, res) => {
    
    // establish a connection to MariaDB
    conn = await pool.getConnection();

    //pull username,name and password values
    usernameV=req.body.username;
    nameV=req.body.name;
    passwordV=req.body.password;
    
    //encryption
    const bcrypt = require('bcryptjs');
    
    //generating the salt
    const salt = bcrypt.genSaltSync();
    
    //hashing the password(combines password + salt and hashes them)
    const hash = bcrypt.hashSync(passwordV, salt);
    
    try {
        await conn.beginTransaction();
        var query="INSERT INTO users (username,password,name) VALUES (?,?,?)";
        await conn.query(query,[usernameV,hash,nameV]);
        await conn.commit();
        console.log("success");
    } catch (err) {
        console.log(1);
        throw err;
    }
});


//sign in request
app.post('/LogIn', async (req, res) => {
    
    //establish a connection to MariaDB
    conn = await pool.getConnection();
    
    //pull username and passpword values
    usernameV=req.body.username;
    passwordV=req.body.password;
    const bcrypt = require('bcryptjs');

    //!DO NOT pull the password from the database and decrypt it!
    
    //generating the salt
    const salt = bcrypt.genSaltSync();
    //hashing the password(combines password + salt and hashes them)
    const hash = bcrypt.hashSync(passwordV, salt);
    try {
        //only pull account if the hashed entered password matches the stored hashed value
        var query="Select username, password from users where username = (?) And password = (?)";
        var rows = conn.query(query,[usernameV,passwordV]);
        
        res.send(rows);
        console.log("success");
    
    //throw error if invalid login for either password or username
    } catch (err) {
        console.log("Invalid");
        
        return err;
    } finally{
        if (conn) return conn.release();
    }

});

//to check correct port listening
app.listen(port, () => console.log(`Listening on port ${port}`));

