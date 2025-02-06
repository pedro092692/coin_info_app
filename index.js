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
app.get('/test', async(req, res)=>{
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

app.get('/', (req, res)=>{
    const topCoins=[{id:"btc-bitcoin",name:"Bitcoin",symbol:"BTC",rank:1,total_supply:19820175,max_supply:21e6,beta_value:.908529,first_data_at:"2010-07-17T00:00:00Z",last_updated:"2025-02-05T21:17:27Z"},{id:"eth-ethereum",name:"Ethereum",symbol:"ETH",rank:2,total_supply:120232214,max_supply:0,beta_value:1.14736,first_data_at:"2015-08-07T00:00:00Z",last_updated:"2025-02-05T21:14:27Z"},{id:"usdt-tether",name:"Tether",symbol:"USDT",rank:3,total_supply:148474039764,max_supply:0,beta_value:-.000823335,first_data_at:"2015-02-25T00:00:00Z",last_updated:"2025-02-05T21:19:27Z"},{id:"xrp-xrp",name:"XRP",symbol:"XRP",rank:4,total_supply:99986541057,max_supply:1e11,beta_value:1.04073,first_data_at:"2013-08-04T00:00:00Z",last_updated:"2025-02-05T21:19:27Z"},{id:"sol-solana",name:"Solana",symbol:"SOL",rank:5,total_supply:588682058,max_supply:0,beta_value:1.23587,first_data_at:"2020-08-26T00:00:00Z",last_updated:"2025-02-05T21:19:28Z"},{id:"bnb-binance-coin",name:"Binance Coin",symbol:"BNB",rank:6,total_supply:148930232,max_supply:2e8,beta_value:.826432,first_data_at:"2017-07-25T00:00:00Z",last_updated:"2025-02-05T21:14:27Z"},{id:"usdc-usd-coin",name:"USDC",symbol:"USDC",rank:7,total_supply:55278614939,max_supply:0,beta_value:-.00411445,first_data_at:"2018-10-09T00:00:00Z",last_updated:"2025-02-05T21:19:27Z"},{id:"doge-dogecoin",name:"Dogecoin",symbol:"DOGE",rank:8,total_supply:147924236384,max_supply:0,beta_value:1.69838,first_data_at:"2013-12-15T00:00:00Z",last_updated:"2025-02-05T21:20:27Z"},{id:"ada-cardano",name:"Cardano",symbol:"ADA",rank:9,total_supply:44995037804,max_supply:45e9,beta_value:1.35676,first_data_at:"2017-10-01T00:00:00Z",last_updated:"2025-02-05T21:19:27Z"},{id:"steth-lido-staked-ether",name:"Lido Staked Ether",symbol:"STETH",rank:10,total_supply:9785853,max_supply:0,beta_value:1.15134,first_data_at:"2021-08-12T00:00:00Z",last_updated:"2025-02-05T21:19:28Z"}];
    const coinsPrice=[97283.46514986249,2766.164574585269,1.000672782864118,2.4215307855865436,199.06020719690352,568.5244626702618,1.0007827715938125,.2578857930993385,.7429863919554489,2767.118564325126];
    const coinsImgURL=["https://static.coinpaprika.com/coin/btc-bitcoin/logo.png","https://static.coinpaprika.com/coin/eth-ethereum/logo.png","https://static.coinpaprika.com/coin/usdt-tether/logo.png","https://static.coinpaprika.com/coin/xrp-xrp/logo.png","https://static.coinpaprika.com/coin/sol-solana/logo.png","https://static.coinpaprika.com/coin/bnb-binance-coin/logo.png","https://static.coinpaprika.com/coin/usdc-usdc/logo.png","https://static.coinpaprika.com/coin/doge-dogecoin/logo.png","https://static.coinpaprika.com/coin/ada-cardano/logo.png","https://static.coinpaprika.com/coin/steth-lido-staked-ether/logo.png"];
    res.render('index.ejs',
        {
            topCoins,
            coinsPrice, 
            coinsImgURL
        });

});

;

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

