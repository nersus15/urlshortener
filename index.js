require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const Urls = {};

app.post('/api/shorturl', bodyParser.urlencoded({extended: false}), (req, res) => {
  const {url} = req.body;
  const pattern = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\//;
 
 
  console.log(url, pattern.test(url), `${url}`.match(pattern));

  // dns.lookup(url, (err, url) => {
  //   console.log(url, err);
  //   if(err){
  //     res.json({ error: 'invalid url' });
  //   }else{
  //     const urlid = makeid(8);
  //     Urls[urlid] = url;
  //     res.json({
  //       original_url: url,
  //       short_url: urlid
  //     });
  //   }
  // });

  if(!pattern.test(url)){
    res.json({ error: 'invalid url' });
  }else{
    const urlid = makeid(8);
    Urls[urlid] = url;
    res.json({
      original_url: url,
      short_url: urlid
    });
  }
  
});

app.get('/api/shorturl/:urlid', (req, res) => {
  const {urlid} = req.params;

  const orgurl = Urls[urlid];

  if(orgurl)
    res.redirect(orgurl);
  else
    res.json({error: "shortener url not found"});

});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}