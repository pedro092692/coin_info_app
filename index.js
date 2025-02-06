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
        const topCoins = coinsData.slice(0, 10);
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
        res.render('index.ejs',
            {
                topCoins,
                coinsPrice, 
                coinsImgURL
            }
        );
    }else{
        console.log('There was an error');
        res.sendStatus(500);
    }
});

app.get('/coin/:id', async(req, res)=>{
    const coinId = req.params.id;
    const coinInfo = await getRequest(`coins/${coinId}`);
    if(coinInfo){
        res.render('coin.ejs', {
            name: coinInfo.name,
            symbol: coinInfo.symbol,
            rank: coinInfo.rank,
            logoURL: coinInfo.logo,
            description: coinInfo.description,
            proofType: coinInfo.proof_type,
            hashAlgorithm: coinInfo.hash_algorithm,
            team: coinInfo.team,
            whitePaperLink: coinInfo.whitepaper.link,
        });
    }else{
        res.status(404).render('partials/404.ejs');
    }
});

app.get('/global-info', async(req, res)=>{
    const global_info = await getRequest('global');
    if(global_info){
        res.render('global.ejs', {
            market_cap: global_info.market_cap_usd.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
            bitcoinPercent: global_info.bitcoin_dominance_percentage,
            crytoNumber: global_info.cryptocurrencies_number,
            volume: global_info.volume_24h_ath_value.toLocaleString('en-US', {style: 'currency', currency: 'USD'}),
        });
    }else{
        res.status(404).render('partials/404.ejs');
    }
});

app.get('/glossary', async(req, res)=>{
    const termsInfo = await getRequest('tags');
    
    if(termsInfo){
        res.render('glossary.ejs', {
            termsInfo: termsInfo.slice(0, 50)
        });
    }else{
        res.status(404).render('404.ejs');
    }
});

app.post('/search', async(req, res)=>{
    const query = req.body.query;
    const searchResult = await getRequest(`search?q=${query}`);
    if(searchResult){
        res.render('search.ejs', {
            searchResult: searchResult.currencies,
        });
    }else{
        res.status(404).render('404.ejs');
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

// 404 Middleware
app.use((req, res, next) => {
    res.status(404).render('partials/404.ejs');
});


// app listen
app.listen(port, ()=>{
    console.log('Sever is liste on port:', port);
});

