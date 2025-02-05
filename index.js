// imports
import express from "express";
import axios from "axios";

// App setup
const app = express();
const port = 3000;
const API_URL = 'https://api.coinpaprika.com/v1';

// app config middleware 
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// app rotues 
app.get('/', async(req, res)=>{
    // get cryptocurrencies info names and ids
    const coinsData = await getRequest('coins');
    //check if there is response
    if(coinsData){
        // slice array to only top 10 coins 
        const topCoins = coinsData.slice(0, 5);
        // create array to save coins price
        const coinsPrice = [];
        // create array to save coins img url
        const coinsImgURL = [];
        // Iterate over each coin ids to get each current price and img url and save it into array
        for(var coin of topCoins){
            //get coin current prince
            const coinPrice = await getRequest(`tickers/${coin.id}`);
            //get coin img URL
            const coinImgURL = await getRequest(`coins/${coin.id}`)
            //save coin current prince in coinsPrice array
            coinsPrice.push(coinPrice.quotes.USD.price);
            //save coin img URL in coinsImgURL array
            coinsImgURL.push(coinImgURL.logo);

        }
        res.render('index.ejs');
    }else{
        console.log('There was an error');
        res.sendStatus(500);
    }
});

//request function 
async function getRequest(endPoint){
    try{
        const response = await axios.get(API_URL + `/${endPoint}`);
        return response.data;
    }catch(error){
        console.error('Faile to make request:', error.message);
    }
}

// app listen
app.listen(port, ()=>{
    console.log('Sever is liste on port:', port);
});

