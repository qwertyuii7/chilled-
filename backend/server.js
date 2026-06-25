const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors');

const connectionDB = require("./config/db")
require('dotenv').config()


const app = express()
app.use(cors());
app.use(express.json())


connectionDB();


const { queue_router } = require("./routes/queue_router")
const { bookingrouter } = require("./routes/booking");
const { joinrouter } = require("./routes/join");
const { shop_router } = require("./routes/shop_routes")


app.get("/", (req, res) => {
  res.send("Server running");
});


app.use("/join", joinrouter);
app.use("/booking", bookingrouter);
app.use("/queue", queue_router);
app.use("/shop", shop_router);






app.listen(process.env.PORT || 5000, () => {
  console.log("server is listening to port 5000")
});