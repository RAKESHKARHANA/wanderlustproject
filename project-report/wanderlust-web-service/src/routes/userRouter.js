const express = require('express');
const router = express.Router();
const setupUser = require("../model/setupUser")
const userservice = require('../service/userslogin')

router.get("/setup", (req, res, next) => {
    setupUser.userSetup().then((data) => {
        res.send(data)
    }).catch(err => next(err));
})

//router to login
router.post('/login', function (req, res, next) {
    let contactNo = req.body.contactNo;
    let password = req.body.password;
    userservice.login(parseInt(contactNo), password).then(function (userDetails) {
        res.json(userDetails);
    }).catch(err => next(err));
})
//router to register
router.post('/register',(req,res,next)=>{
    let newUser=req.body
    userservice.addUser(newUser)
        .then(response=>{
            res.json(response)
        })
})
//checkUser
router.post('/checkuser',(req,res,next)=>{
    let contactNo=req.body.contactNo
    userservice.checkUser(contactNo)
        .then(response=>{
            res.json(response)
        })
        .catch(err=>next(err))
})


module.exports = router;

