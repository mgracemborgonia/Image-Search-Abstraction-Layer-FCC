const express = require("express");
const axios = require("axios");
const app = express();
const path = require("path");
app.use(express.static("public"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
})
app.get("/api/images", (req, res) => {
    const query = req.query.query;
    const page = req.query.page || 1;
    if(!query){
        return res.status(400).send("Must require the query parameter.");
    }else{
        const url = `https://image-search-abstraction-layer.freecodecamp.rocks/query/${encodeURIComponent(query)}?page=${page}`;
        axios.get(url)
        .then(response => {
            //console.log('API Response:', response.data);
            res.json(response.data)
        })
        .catch(error => {
            console.error(error);
            res.status(500).json("An error occurred while fetching images.");
        });
    };
});
app.get("/api/recent", (req, res) => {
    const url = "https://image-search-abstraction-layer.freecodecamp.rocks/recent/";
    axios.get(url)
    .then(response => res.json(response.data))
    .catch(error => {
        console.error(error);
        res.status(500).json("An error occurred while fetching searches.");
    });
});
app.listen(process.env.PORT || 3000, () => {
    console.log("Port 3000 is serving.");
    if(process.env.NODE_ENV==='test') {
        console.log('Running Tests...');
    };
});