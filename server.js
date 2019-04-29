var express = require("express");
var app = require("express")(),server = require("http").createServer(app);

server.listen(8888);
app.use(express.static("./dist"));
app.get("/",function(req,res) {
	res.sendfile(_dirname+'index.html')
});