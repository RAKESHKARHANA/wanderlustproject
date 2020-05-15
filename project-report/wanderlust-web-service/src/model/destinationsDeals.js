const connection = require('../utilities/connections')

const destinationsDeals={}

destinationsDeals.getDeals=()=>{
    return connection.getHotDealsCollection()
        .then(collection=>{
            return collection.find()
                .then(response=>response)
        })
}
destinationsDeals.searchedData=(continent)=>{
    listData=[]
    return connection.getDestinationsCollection()
        .then((collection)=>{
            return collection.find({ $or: [{ continent: continent }, { "details.itinerary.tourHighlights": continent }] },{_id:0})
                .then(destinations=>{
                    return connection.getHotDealsCollection()
                        .then(hotCollection=>{
                            return hotCollection.find({ $or: [{ continent: continent }, { "details.itinerary.tourHighlights": continent }] },{_id:0})
                                .then(hotDeals=>{
                                    let allDeals=[...hotDeals,...destinations]
                                    return allDeals
                                })
                        })
                })
                
        })

}
module.exports=destinationsDeals;