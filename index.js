// imports
import express from "express";
import axios from "axios";

// App setup
const app = express();
const port = 3000;

// app config middleware 
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// app rotues 
app.get('/', (req, res)=>{
    res.render('index.ejs');
});

// app listen
app.listen(port, ()=>{
    console.log('Sever is liste on port:', port);
});