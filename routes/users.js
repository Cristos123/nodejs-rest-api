var express = require("express");
var router = express.Router();
const User = require("../model/userModel");
const Username = require("../model/usernameModel");
const Email = require("../model/emailModel");
const Password = require("../model/passwordModel");
const Name = require("../model/nameModel");
const bcrypt = require("bcrypt");
const config = require("../config");
const jwt = require("jsonwebtoken");
//const { validateEmail, randomString } = require("../config");

/* GET users listing. */

//result = array(success: false, "message" => "No data specified.");

// function randomString($length)
// {
//   finalString = "";
//   chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
//   size = str.length(chars);
//   for (i = 0; i < length; i++) {
//       str = chars[rand(0, size - 1)];
//       finalString += str;
//   }
//   return finalString;
// }

function randomString(length) {
  var finalString = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    finalString += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
  return finalString;
}

function isValidUsername(username) {
  return (
    "/^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/", username
  );
}

function isValidEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/signup", (req, res, next) => {
  let {
    firstname,
    lastname,
    email,
    username,
    password,
    confirmPassword,
  } = req.body;
  if (
    !firstname ||
    typeof firstname != "string" ||
    firstname.length < 3 ||
    !/^[a-zA-Z]{3,}$/.test(firstname)
  ) {
    return res.send({
      success: false,
      message: "first name is required .",
    });
  } else if (
    !lastname ||
    typeof lastname != "string" ||
    lastname.length < 3 ||
    !/^[a-zA-Z]{3,}$/.test(lastname)
  ) {
    return res.send({
      success: false,
      message: "Last name is required .",
    });
  } else if (!email || !isValidEmail(email)) {
    return res.send({
      success: false,
      message: "Please provide valid email .",
    });
  } else if (
    !username ||
    typeof username != "string" ||
    username.length < 3 ||
    !/^[a-zA-Z0-9]{3,}$/.test(username)
  ) {
    return res.send({
      success: false,
      message: "Username is required .",
    });
  } else if (!password || typeof password != "string" || password.length < 8) {
    return res.send({
      success: false,
      message: "Please Password must be at least eight character long.",
    });
  } else if (
    !confirmPassword ||
    typeof confirmPassword != "string" ||
    confirmPassword.length < 8
  ) {
    return res.send({
      success: false,
      message: "Please confirm password must be at least eight character long.",
    });
  } else if (password != confirmPassword) {
    return res.send({
      success: false,
      message: "Please Confirm Password must match password field.",
    });
  } else {
    usernameExist = Username.findOne(
      { value: req.body.username },
      (err, usernameExist) => {
        if (err) return next(err);
        if (usernameExist != null) {
          return res.send({
            success: false,
            message: "Username already exist ." + username,
          });
        }
      }
    );
    emailExist = Email.findOne({ value: req.body.email }, (err, emailExist) => {
      if (err) return next(err);
      if (emailExist != null) {
        return res.send({
          success: false,
          message: "Email already exist ." + email,
        });
      }
    });
    uniqueString = randomString(16);
    User.create({ uniqueString: uniqueString, status: 2 })
      .then((user) => {
        console.log("user " + user);
        user = User.findOne({ uniqueString: uniqueString }, (err, user) => {
          if (err) return next(err);
          if (user) {
            let userId = user._id;
            console.log("userId " + user);
            Name.create({
              status: 1,
              userId: userId,
              first: firstname,
              last: lastname,
            })

              .then((data) => {
                console.log(data);
                let newUsername = new Username({
                  status: 1,
                  subjectType: 0,
                  subjectId: userId,
                  value: username,
                });
                newUsername
                  .save()
                  .then((username) => {
                    console.log("username " + username);
                    let newEmail = new Email({
                      status: 1,
                      subjectType: 0,
                      subjectId: userId,
                      value: email,
                    });
                    newEmail
                      .save()
                      .then((data) => {
                        // console.log("email " + email);
                        // password = bcrypt.hashSync(password, 10);
                        // console.log("password hash " + password);
                        let newPassword = new Password({
                          status: 1,
                          subjectType: 0,
                          subjectId: userId,
                          value: password,
                        });

                        newPassword.save().then((data) => {
                          console.log("password" + data);
                          res.statusCode = 200;
                          res.setHeader("Content-Type", "application/json");
                          res.json({
                            success: true,
                            status: "Registration Successful!",
                          });
                        });
                      })
                      .catch((err) => next(err));
                  })
                  .catch((err) => next(err));
              })
              .catch((err) => next(err));
          }
        });
      })
      .catch((err) => next(err));
  }
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    var err = new Error("username is required!");
    err.status = 403;
    next(err);
  } else {
    Email.findOne({ value: email })
      .then((email) => {
        if (email) {
          Password.findOne({ value: password })
            .then((value) => {
              if (value) {
                const token = jwt.sign(
                  {
                    _id: email._id,
                    subjectId: email.subjectId,
                    subjectType: value.subjectType,
                  },
                  config.secretKey
                );
                const encode = jwt.verify(token, config.secretKey);
                console.log("token " + token);
                console.log("encode " + encode);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  value,
                  token: token,
                  user: encode,
                  success: true,
                  status: "Login successful Successful!",
                });
              } else {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  success: false,
                  message: "password is incoreect!",
                });
              }
            })
            .catch((err) => next(err));
        } else {
          res.statusCode = 401;
          res.setHeader("Content-Type", "application/json");
          res.json({
            success: false,
            status: "Email does not exist!",
          });
        }
      })
      .catch((err) => next(err));
  }
});

module.exports = router;

// router.post("/login", (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     var err = new Error("username is required!");
//     err.status = 403;
//     next(err);
//   } else {
//     Email.findOne({ value: email })
//       .then((email) => {
//         console.log("email " + email);
//         if (email) {
//           Password.findOne({ value: password })
//             .then((value) => {
//               console.log("password " + value);
//               if (!value) {
//                 bcrypt
//                   .compare(password.value, password.value)
//                   .then((match) => {
//                     if (!match) {
//                       res.statusCode = 200;
//                       res.setHeader("Content-Type", "application/json");
//                       res.json({
//                         success: true,
//                         status: "Login successful Successful!",
//                       });
//                     } else {
//                       res.statusCode = 401;
//                       res.setHeader("Content-Type", "application/json");
//                       res.json({
//                         success: false,
//                         status: "Login unsuccessful!",
//                       });
//                     }
//                   })
//                   .catch((err) => next(err));
//               } else {
//                 res.statusCode = 401;
//                 res.setHeader("Content-Type", "application/json");
//                 res.json({
//                   success: false,
//                   message: "password is incoreect!",
//                 });
//               }
//             })
//             .catch((err) => next(err));
//         } else {
//           res.statusCode = 401;
//           res.setHeader("Content-Type", "application/json");
//           res.json({
//             success: false,
//             status: "Email does not exist!",
//           });
//         }
//       })
//       .catch((err) => next(err));
//   }
// });
