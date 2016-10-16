var express = require('express');
var router = express.Router();
var fs = require("fs");
var contents = fs.readFileSync("ColorNodes.json");
var jsonContent = JSON.parse(contents);

router.get('/getColorNodes',function(req,res){
	res.send(jsonContent);	
});
module.exports = router;
