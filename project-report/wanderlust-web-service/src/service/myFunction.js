const myFunctions={}

myFunctions.convertToPascal=(input)=>{
   
    let output=(input.slice(0,1)).toUpperCase().concat((input.slice(1)).toLowerCase())
    return (output)
}


module.exports=myFunctions
