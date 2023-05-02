const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000


//middlewarw
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: Number,
    rating: Number

})

//scheme and model connection

const Product = mongoose.model('Product', productSchema)

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/testProduct')
        console.log("Connected")
        // .then(() => console.log("Connected"))
        // .catch((error) => {
        //     console.log('Not Connected')
        //         .console.log(error)
        // })
    } catch (error) {
        console.log('Not Connected')
        console.log(error)

    }


}

app.post("/products", async (req, res) => {
    try {

        //get data from request body
        const title = req.body.title
        const price = req.body.price
        const rating = req.body.rating

        // save the data in schema

        const newProducts = new Product({
            title: title,// req.body.title
            price: price, // req.body.price
            rating: rating
        })

        const productData = await newProducts.save()

        res.send(productData)
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})

// app.get("/products", async (req, res) => {
//     try {
//         const products = await Product.find()
//         res.send(products)
//     } catch (error) {
//         res.status(500).send({
//             message: error.message
//         })
//     }
// })


app.get("/products", async (req, res) => {
    //logical operator apply
    try {
        const products = await Product.find({
            $and: [
                { price: { $gt: 900 } },
                { rating: { $lt: 3 } }
            ]
        })
        res.send(products)
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})


app.get("/product/:id", async (req, res) => {
    try {
        const id = req.params.id
        const productData = await Product.findOne({ _id: id })
        res.send(productData)
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
})


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
    await connectDb()
})