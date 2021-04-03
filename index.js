const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoObjectID = require('mongodb').ObjectID
const MongoClient = require('mongodb').MongoClient;

const app = express();
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0.abj4y.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("bookstore").collection("products");
  const orderCollection = client.db("bookstore").collection("order");
  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, productsArray) => {
        res.send(productsArray);
      })
  })
  app.get('/product/:id', (req, res) => {
    const {id} = req.params;
    productCollection.find({_id: MongoObjectID(id)})
      .toArray((err, product) => {
        res.send(product[0]);
      })
  })
  app.post('/product', (req, res) => {
    productCollection.insertOne(req.body)
      .then(product => {
        return res.send(product);
      })
      .catch(err => res.send(err));
  })
  app.delete('/product/:id', (req, res) => {
    const {id} = req.params;
    productCollection.deleteOne({_id: MongoObjectID(id)})
      .then(product => {
        return res.send(product);
      })
      .catch(err => res.send(err));
  })

  app.post('/order', (req, res) => {
    orderCollection.insertOne(req.body)
      .then(product => {
        return res.send(product);
      })
      .catch(err => res.send(err));
  })
  app.get('/orders/:email', (req, res) => {
    const {email} = req.params;
    orderCollection.find({userEmail: email})
      .toArray((err, orderArray) => {
        res.send(orderArray);
      })
  })
})
app.listen(process.env.PORT || 5000);