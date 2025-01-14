const express = require("express")
const dotenv = require("dotenv").config()
const fileUpload = require("express-fileupload")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const api = require("../lender/app/v1/api")

const app = express()
const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload({ useTempFiles: true }))
app.use(cors())
app.use(
    helmet({
        crossOriginEmbedderPolicy: true, // Contoh fitur lain
    })
)
app.use((req, res, next) => {
    res.setHeader(
        "Permissions-Policy",
        "camera=(), microphone=(), geolocation=()" // Ganti sesuai kebutuhan
    )
    next()
})
app.use(morgan("combined"))

// Routes
app.use("/v1/", api)

app.use((req, res, next) => {
    res.status(404).send(`
    <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->

    <title>404 HTML Template by Colorlib</title>

    <!-- Google font -->
    <style id="" media="all">
      @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet");

@import url("https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700");

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  overflow:hidden;
  background-color: #f4f6ff;
}

.container{
  width:100vw;
  height:100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  position: relative;
  left:6vmin;
  text-align: center;
}

.cog-wheel1, .cog-wheel2{
  transform:scale(0.7);
}

.cog1, .cog2{
  width:40vmin;
  height:40vmin;
  border-radius:50%;
  border:6vmin solid #f3c623;
  position: relative;
}


.cog2{
  border:6vmin solid #4f8a8b;
}

.top, .down, .left, .right, .left-top, .left-down, .right-top, .right-down{
  width:10vmin;
  height:10vmin;
  background-color: #f3c623;
  position: absolute;
}

.cog2 .top,.cog2  .down,.cog2  .left,.cog2  .right,.cog2  .left-top,.cog2  .left-down,.cog2  .right-top,.cog2  .right-down{
  background-color: #4f8a8b;
}

.top{
  top:-14vmin;
  left:9vmin;
}

.down{
  bottom:-14vmin;
  left:9vmin;
}

.left{
  left:-14vmin;
  top:9vmin;
}

.right{
  right:-14vmin;
  top:9vmin;
}

.left-top{
  transform:rotateZ(-45deg);
  left:-8vmin;
  top:-8vmin;
}

.left-down{
  transform:rotateZ(45deg);
  left:-8vmin;
  top:25vmin;
}

.right-top{
  transform:rotateZ(45deg);
  right:-8vmin;
  top:-8vmin;
}

.right-down{
  transform:rotateZ(-45deg);
  right:-8vmin;
  top:25vmin;
}

.cog2{
  position: relative;
  left:-10.2vmin;
  bottom:10vmin;
}

h1{
  color:#142833;
}

.first-four{
  position: relative;
  left:6vmin;
  font-size:40vmin;
}

.second-four{
  position: relative;
  right:18vmin;
  z-index: -1;
  font-size:40vmin;
}

.wrong-para{
  font-family: "Montserrat", sans-serif;
  position: absolute;
  bottom:15vmin;
  padding:3vmin 12vmin 3vmin 3vmin;
  font-weight:600;
  color:#092532;
}
    </style>

    <meta name="robots" content="noindex, follow">
  </head>

  <body>
      <div class="container">
      <h1 class="first-four">4</h1>
      <div class="cog-wheel1">
          <div class="cog1">
            <div class="top"></div>
            <div class="down"></div>
            <div class="left-top"></div>
            <div class="left-down"></div>
            <div class="right-top"></div>
            <div class="right-down"></div>
            <div class="left"></div>
            <div class="right"></div>
        </div>
      </div>
      
      <div class="cog-wheel2"> 
        <div class="cog2">
            <div class="top"></div>
            <div class="down"></div>
            <div class="left-top"></div>
            <div class="left-down"></div>
            <div class="right-top"></div>
            <div class="right-down"></div>
            <div class="left"></div>
            <div class="right"></div>
        </div>
      </div>
    <h1 class="second-four">4</h1>
      <p class="wrong-para">Uh Oh! Page not found!</p>
    </div>
  </body>
  </html>

  `)
})

// Redirect all other routes
app.get("*", (req, res) => {
    res.redirect("https://minjem.com")
})

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Something went wrong!", error: err.message })
})

// Start Server
app.listen(port, () => {
    console.log("Server connected on port " + port)
})
