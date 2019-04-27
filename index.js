const express = require("express")
const app = express()
const port = 3005
const { mongoose } = require("./config/database")
const { usersRouter } = require("./app/controllers/UsersController")
const { storiesRouter } = require("./app/controllers/StoriesController")
const { topicRouter } = require("./app/controllers/TopicController")
const cors = require("cors")
const multer = require('multer')
app.use(express.json())
app.use(cors())

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
const upload = multer({
    storage
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.body)
    if (req.body.file)
        res.json({
            imageUrl: `images/uploads/${req.body.file.filename}`
        });
    else
        res.status("409").json("No Files to Upload.");
});

 
app.use("/stories", storiesRouter)

app.use("/user",usersRouter)
app.use("/topics", topicRouter)

app.listen(port, function(){
    console.log("Listening to port ", port)
})