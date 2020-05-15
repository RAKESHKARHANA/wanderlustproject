const userDetails = require('./beanClasses/users');
const connection = require("../utilities/connections")

const usersDB = {}
usersDB.generateId=()=>{
    return connection.getUserCollection()
        .then((collection)=>{
            return collection.find({},{_id:0,userId:1}).then(res=>{
                let ids=[]
                for(let i=0;i<res.length;i++){
                    ids.push(Number(res[i].userId.slice(1,)))
                }
                let uid=Math.max(...ids)
                return `U${uid+1}`
            })
        })
}
usersDB.register=(newUser)=>{
    return connection.getUserCollection()
        .then(collection=>{
            return usersDB.generateId().then(uid=>{
                console.log(uid)
                newUser.userId=uid
            return collection.create(newUser).then(res=>{
                return res
            })
            })
        })

}
usersDB.checkUser = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.findOne({ "contactNo": contactNo }).then((customerContact) => {
            if (customerContact) {
                return new userDetails(customerContact);
            }
            else return null;
        })
    })
}

usersDB.getPassword = (contactNo) => {
    return connection.getUserCollection().then((collection) => {
        return collection.find({ "contactNo": contactNo }, { _id: 0, password: 1 }).then((password) => {
            if (password.length != 0)
                return password[0].password;
            else
                return null;
        })
    })
}



module.exports = usersDB;//
