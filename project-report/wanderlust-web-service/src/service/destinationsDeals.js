const destinationsDealDB=require('../model/destinationsDeals')
const myFunctions=require('./myFunction')

const destinationsService={}

destinationsService.getDeals=()=>{
    return destinationsDealDB.getDeals()
        .then(response=>response)
}
destinationsService.searchedDeals=(continent)=>{
    let value=myFunctions.convertToPascal(continent)
    return destinationsDealDB.searchedData(value)
        .then(res=>{return res})
}


module.exports=destinationsService