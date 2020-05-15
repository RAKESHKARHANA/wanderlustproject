const userDB = require('../model/userslogin');

const userService = {}

//login a user
userService.login = (contactNo, userPassword) => {
    return userDB.checkUser(contactNo).then((user) => {
        if (user == null) {
            let err = new Error("Enter registered contact number! If not registered, please register")
            err.status = 404
            throw err
        }
        else {
            return userDB.getPassword(contactNo).then((password) => {
                if (password != userPassword) {
                    let err = new Error("Incorrect password")
                    err.status = 406
                    throw err
                }
                else {
                    return user;
                }
            })
        }
    })
}
//checking contact No
userService.checkUser=(contactNo)=>{
    return userDB.checkUser(contactNo)
        .then(res=>res)
}
userService.addUser=(newUser)=>{
    return userDB.register(newUser).then(res=>res)
}

module.exports = userService
//
