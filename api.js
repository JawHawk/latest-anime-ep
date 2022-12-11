const express = require('express');
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");
const pretty = require("pretty");

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
    console.log(anime);
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
    console.log(req.socket.remoteAddress)
  });

app.listen(process.env.PORT || 3030, function() {
    console.log("Server is running");
  });