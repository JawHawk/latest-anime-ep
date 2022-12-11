const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())

const axios = require("axios");
const cheerio = require("cheerio");

const url = "https://gogoanime.tel/";
let animes = {};

async function scraper(){
try {
  const { data } = await axios.get(url,{ 
    headers: { "Accept-Encoding": "gzip,deflate,compress" } 
});
  const $ = cheerio.load(data);

  const items = $(".items li");

  items.each((ind,ele)=>{
    const anime = {}
    let k = $(ele).children()
    let link = $(k['1']).children().first()
    anime['name'] = $(k['1']).text();
    anime['episode'] = parseInt(($(k['2']).text()).slice(8));
    anime['link'] = url + $(link).attr('href');
    animes[parseInt(ind)+1] = anime;
  })
  
} catch (error) {
  console.log(error);
}
}

scraper();
setTimeout(()=>{scraper()},1000*60*5);
//====================================================================================

app.get('/', function(req, res) {
    res.json(animes);
  });

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running");
  });