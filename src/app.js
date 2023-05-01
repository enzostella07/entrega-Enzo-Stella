// const express = require("express");
// const ProductManager = require("./desafio-03.js");
// const container = new ProductManager("./products.json");

import express from "express";
import ProductManager from "./desafio-03.js";
const productManager = new ProductManager();

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.status(200).json(products.slice(0, limit));
    } else {
      res.status(200).json(products);
    }
  } catch (error) {
    res.status(500).json({message: "There was an error"})
  }
});

app.get("/products/:id",async (req,res)=>{
  try {
    const id = req.params.id
    const product = await productManager.getProductById(parseInt(id))
    if (!product) {
      res.status(404).status(500).json({error: "product not found"})   
    }
      res.status(200).json(product)
  } catch (error) {
        res.status(500).json({error: "There was an error"})     
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
