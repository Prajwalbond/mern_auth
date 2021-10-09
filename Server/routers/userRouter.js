 const router = require("express").Router();
 const User = require("../models/userModels");
 const bcrypt = require("bcryptjs");
 const jwt = require("jsonwebtoken"); 

 //register
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
       //console.log(passwordHash);

       //save new user account to  db
       const newUser = new User({
          email,passwordHash
       });

       const savedUser = await newUser.save();

       // sign the token
       const token = jwt.sign({
          user: savedUser._id
       },process.env.JWT_SECRET);

       console.log(token);

       // send the token to HTTP-only cookie

       res.cookie("token",token,{
          httpOnly : true
       })
       .send();


    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
 });

 // login

 router.post("/login",async (req,res) => {
    try{
      const {email,password} = req.body;

      //validate

      if(!email || !password)
      return res
      .status(400)
      .json({errorMessage: "Please enter all required fields"});

      const existingUser = await User.findOne({email});
      if(!existingUser){
         return res.status(401).json({errorMessage: "Wrong email or password"});
      }

      const passwordCorrect = await bcrypt.compare(
         password,
         existingUser.passwordHash
      );
      if(!passwordCorrect){
         return res.status(401).json({errorMessage: "Wrong email or password"});
      }

      // sign the token
      const token = jwt.sign({
         user: existingUser._id
      },process.env.JWT_SECRET);

      //console.log(token);

      // send the token to HTTP-only cookie

      res.cookie("token",token,{
         httpOnly : true
      })
      .send();




    }catch (err) {
        console.error(err);
        res.status(500).send();
    }
 });

 router.get("/logout", (req,res) => {
    res
      .cookie("token","", {
      httpOnly : true,
      expires : new Date(0),
      })
      .send();
    
 });


 module.exports = router;