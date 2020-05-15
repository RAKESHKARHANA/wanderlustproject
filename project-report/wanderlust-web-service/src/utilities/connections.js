const { Schema } = require("mongoose");
const Mongoose = require("mongoose")
Mongoose.Promise = global.Promise;
const url = "mongodb://localhost:27017/Wanderlust_DB";

let userSchema = Schema({
    name: String,
    userId: String,
    emailId: String,
    contactNo: Number,
    password: String,
    bookings: [String]
}, { collection: "User" })

let hotDealsSchema=Schema(
    {
        destinationId:String,
        continent:String,
        name:String,
        imageUrl:String,
        details:{
            about:String,
            itinerary:{
                dayWiseDetails:{
                    firstDay:String,
                    restDaysSightSeeing:Array,
                    lastDay:String
                },
                packageInclusions:Array,
                tourHighlights:Array,
                tourPace:Array
            }
        },
        noOfNights: Number,
        flightCharges:Number,
        chargesPerPerson :Number,
        discount : Number,
        availability : Number
    },{collection:"Hotdeals"}
)
//destinations schema
let destinationsSchema=Schema(
    {
        destinationId:String,
        continent:String,
        name:String,
        imageUrl:String,
        details:{
            about:String,
            itinerary:{
                dayWiseDetails:{
                    firstDay:String,
                    restDaysSightSeeing:Array,
                    lastDay:String
                },
                packageInclusions:Array,
                tourHighlights:Array,
                tourPace:Array
            }
        },
        noOfNights: Number,
        flightCharges:Number,
        chargesPerPerson :Number,
        discount : Number,
        availability : Number
    },{collection:"Destinations"}
)
let bookingsSchema=Schema ({
    bookingId:String,
    userId:String,
    destId:String,
    destinationName:String,
    checkInDate:Date,
    checkOutDate:Date,
    noOfPersons:Number,
    totalCharges:Number,
    timeStamp:{type:Date,default:new Date().getTime().toString()}
},{collection:'Bookings'})
let collection = {};

collection.getUserCollection = () => {
    return Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((database) => {
        return database.model('User', userSchema)
    }).catch((error) => {
        let err = new Error("Could not connect to Database");
        err.status = 500;
        throw err;
    })
}
collection.getHotDealsCollection=()=>{
    return Mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true }).then((database)=>{
        return database.model('Hotdeals',hotDealsSchema)
    }).catch(err=>{
        let error=new Error("Could not connect to Databse");
        error.status=500;
        throw error;
    })
}
collection.getDestinationsCollection=()=>{
    return Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((database) => {
        return database.model('Destinations', destinationsSchema)
    }).catch((error) => {
        let desterr = new Error("Could not connect to Database");
        desterr.status = 500;
        throw desterr;
    })
}
collection.getBookingsCollection=()=>{
    return Mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((database) => {
        return database.model('Bookings', bookingsSchema)
    }).catch((error) => {
        let bookerr = new Error("Could not connect to Database");
        bookerr.status = 500;
        throw bookerr;
    })
}

module.exports = collection;
