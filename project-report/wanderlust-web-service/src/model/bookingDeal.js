const connection=require('../utilities/connections')

bookingsDeal={}
bookingsDeal.getById=(userId)=>{
    return connection.getBookingsCollection()
        .then(collection=>{
            return collection.find({userId:userId},{_id:0})
                .then(res=>{
                    return res
                })
        })
}
bookingsDeal.deleteById=(bookingId,destinationId,noOfPersons)=>{
    return connection.getBookingsCollection()
        .then(Bookcollection=>{
            return Bookcollection.deleteOne({bookingId:bookingId})
                .then(res=>{
                    if(destinationId.slice(0,1)=='H'){
                        return connection.getHotDealsCollection().then(hotCollection=>{
                            return hotCollection.updateOne({destinationId:destinationId},{$inc:{availability:noOfPersons}})
                                .then(res1=>{res1})
                        })
                    }else{
                        return connection.getDestinationsCollection().then(destCollection=>{
                            return destCollection.updateOne({destinationId:destinationId},{$inc:{availability:noOfPersons}})
                                .then(res2=>{res2})
                    })
                        
                    }
                })
        })
}
//generating the booking id
bookingsDeal.generateBookingId=()=>{
    return connection.getBookingsCollection()
        .then((collection)=>{

            return collection.find({},{_id:0,bookingId:1}).then(res=>{
                let bids=[]
                for(let i=0;i<res.length;i++){
                    bids.push(Number(res[i].bookingId.slice(1,)))
                }
                let bid=Math.max(...bids)
                return `B${bid+1}`
            })
        })
}
//storing the value accordingly
bookingsDeal.storeBooking=(bookObj)=>{
    return connection.getBookingsCollection()
        .then(Bookcollection=>{
            return bookingsDeal.generateBookingId().then(bid=>{
                bookObj.bookingId=bid
                return Bookcollection.create(bookObj)
                .then(res=>{
                    if(bookObj.destId.slice(0,1)=='H'){
                        return connection.getHotDealsCollection().then(hotCollection=>{
                            return hotCollection.updateOne({destinationId:bookObj.destId},{$inc:{availability:-bookObj.noOfPersons}})
                                .then(res1=>{res1})
                        })
                    }else{
                        return connection.getDestinationsCollection().then(destCollection=>{
                            return destCollection.updateOne({destinationId:bookObj.destId},{$inc:{availability:-bookObj.noOfPersons}})
                                .then(res2=>{res2})
                    })
                        
                    }
                })
            })
            
        })
}

module.exports=bookingsDeal










