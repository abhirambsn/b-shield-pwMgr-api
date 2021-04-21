const app = require('./App')
const mongoose = require('mongoose')

require('dotenv').config()

mongoose.connect(process.env.MONGO_URI, { useFindAndModify: true, useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) console.error(error)
    console.log("Database Connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server Running on Port ${process.env.PORT}`);
    })
})