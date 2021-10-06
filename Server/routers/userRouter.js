 const router = require("express").Router();
 const User = require("../models/userModels");
 const bcrypt = require("bcryptjs");

 router.post("/", async(req, res) => {
    try{
     const {email,password,passwordVerify} = req.body;
     
     // validation
     if(!email || !password || !passwordVerify)
         return res
         .status(400)
         .json({errorMessage: "Please enter all the required fields"});
     
      if(password.length < 6)
        return res
        .status(400)
        .json({errorMessage: "Please enter a password of atleast 6 characters"});

      if(password !== passwordVerify)
        return res
        .status(400)
        .json({errorMessage: "Please enter the same password twice"});

    const existingUser = await User.findOne({email})
           if (existingUser)
             return res.status(400).json({
                errorMessage: "An account with this email alredy exist",
            
       }); 

       // password hashing
       const salt = await bcrypt.genSalt();
       const passwordHash = await bcrypt.hash(password, salt);
       console.log(passwordHash);

       //save new user account to  db
       const newUser = new User({
          email,passwordHash
       });

       const savedUser = await newUser.save();

    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
 })   

 module.exports = router;