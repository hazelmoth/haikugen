var express = require("express");
var app = express();
var request = require("request");
var haiku = require("./haiku");

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", function(req, res){
    haiku.generateHaiku(function(line1,line2,line3) {
        var haiku = {line1: line1, line2: line2, line3: line3};
        res.render("main", {haiku: haiku});
        //res.send(line1 + "/" + line2 + "/" + line3);
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started.");
});