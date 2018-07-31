var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var request =  require('request');
var fs = require('fs');
var json2csv = require('json2csv').parse;
var fields = ['sku','qty'];
var app = express();



const port = 8000;
var cors = require('cors');
app.options('*', cors());
app.use(cors());

app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/fetchrecords',function(req,res){

clientemail = req.body.email;
clientsecret = req.body.clientsecret;

request.post({url:"https://www.manchesterfurnituresupplies.co.uk/api/getallqty",form:{email:clientemail,secret_key:clientsecret}},function(err,httpResponse,body){

  if(err){
console.log('Error',err);

}
var jsonobject = JSON.parse(body);
var rawdatainjson = jsonobject["data"];
var finaljsondata = rawdatainjson.map(({sku, qty}) => ({sku, qty}));
 const opts = { fields };
try {
  const csv = json2csv(finaljsondata, opts);
/*  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  }); */

  res.setHeader('Content-disposition', 'attachment; filename=data.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csv);

} catch (err) {
  console.error(err);

}




})



});


app.listen(port);


