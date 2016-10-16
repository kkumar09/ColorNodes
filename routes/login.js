var express = require('express');
var router = express.Router();

// router.post('/signupdata',function(req,res){
//   var userdata = {
// 	  email:req.body.email,
// 	  username:req.body.username,
// 	  password:req.body.password,
// 	  phonenumber:req.body.phoneNumber
// 	}
//   //console.log(userdata);
// 	db.query("INSERT INTO userdetails SET ?",userdata, function(err){
// 		if(err){
// 			console.log("Insertion failed");
// 			res.end("fail");
// 		}else{
// 			console.log("insertion success");
// 			res.end("success");
// 		}
// 	});	
// });

module.exports = router;
