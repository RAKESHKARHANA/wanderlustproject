const bookingsDB=require('../model/bookingDeal')

const bookingsService={}

bookingsService.getById=(userId)=>{
    return bookingsDB.getById(userId)
        .then(res=>res)
}
bookingsService.deleteByid=(bookingId,destinationId,noOfPersons)=>{
    return bookingsDB.deleteById(bookingId,destinationId,noOfPersons)
        .then(res=>res)
}
bookingsService.storeBooking=(bookObj)=>{
    return bookingsDB.storeBooking(bookObj)
        .then(res=>res)

}

module.exports=bookingsService