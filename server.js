const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const listTicket = require("./listTicket.json");
const fileBuyTicket = "./buyTicket.json";
let buyTicket = require(fileBuyTicket);
const fileLimitPerDay = "./limitTicketPerday.json";
const limitPerDay = require(fileLimitPerDay);
const fs = require("fs");
const bodyParser = require('body-parser');
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/listTicket", (req, res) => {
  res.json(listTicket);
});

app.get("/limitPerDay", (req, res) => {
  res.json(limitPerDay);
});

app.put("/limitPerDay/:type", (req, res) => {
  const updateIndex = limitPerDay.findIndex(
    (limitPerDay) => limitPerDay.type === req.params.type
  );

  const body = req.body;
  limitPerDay[updateIndex].limit = limitPerDay[updateIndex].limit - body.limit;
  fs.writeFile(fileLimitPerDay, JSON.stringify(limitPerDay), function writeJSON(err) {
    if (err) return console.log(err);
  });

  res.send({
    resultCode: 200,
    developerMessage: `Update type '${limitPerDay[updateIndex].type}' completed`,
  });
});

app.post("/buyTicket", (req, res) => {
  const body = req.body;
  const mergeData = [...buyTicket,body];
  try {
    fs.writeFileSync(fileBuyTicket, JSON.stringify(mergeData))
    res.send(`Add transaction buy ticket completed.`)
  } catch (err) {
    res.send(err)
  }
});

app.post("/getListBuyTicket", (req, res) => {
  const body = req.body;
  let filterBuyticket = buyTicket;
  if (body.type === 'All') {
    filterBuyticket = filterBuyticket.filter(function(item) {
      for (var key in body.date_create) {
        if (item === undefined || item.date_create != body.date_create)
          return false;
      }
      return true;
    });
  } else {
    filterBuyticket = filterBuyticket.filter(function(item) {
      for (var key in body) {
        if (item[key] === undefined || item[key] != body[key])
          return false;
      }
      return true;
    });
  }
  res.json(filterBuyticket);
});

app.listen(port, () => {
  console.log("Starting node.js at port " + port);
});
