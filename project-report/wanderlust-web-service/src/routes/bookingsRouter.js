const express = require('express');
const Bookingrouter = express.Router();
const bookingsService=require('../service/bookingsDeal')

Bookingrouter.get('/:userId',(req,res,next)=>{
    let userId=req.params.userId
    bookingsService.getById(userId)
        .then(response=>{
            res.json(response)
        })
    
})
Bookingrouter.post('/:bookingId',(req,res,next)=>{
    let bookingId=req.params.bookingId
    let destinationId=req.body.destinationId
    let noOfPersons=req.body.noOfPersons
    bookingsService.deleteByid(bookingId,destinationId,noOfPersons)
        .then(response=>{
            res.json(response)
        })
})
Bookingrouter.post('/:userId/:destinationId',(req,res,next)=>{
    let bodyObj=req.body
    bookingsService.storeBooking(bodyObj)
        .then(response=>{
            res.json(response)
        })
})

module.exports=Bookingrouter