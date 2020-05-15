const express = require('express');
const destinationsRouter = express.Router();

const hotDealservice = require('../service/destinationsDeals')

//hotdeals
destinationsRouter.get('/hotDeals',(req,res,next)=>{
    hotDealservice.getDeals()
        .then(result=>{                     
            res.json(result)
        })
        .catch(err=>next(err))
})
//deals by search
destinationsRouter.get('/:continent',(req,res,next)=>{
    let continent=req.params.continent
    hotDealservice.searchedDeals(continent)
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            next(err)
        })
})


module.exports=destinationsRouter;