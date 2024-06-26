const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

const uri = "mongodb+srv://meirMesh:meir1357@cluster0.pryfdwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "Store";
const collectionName = "Products";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/products', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const productName = req.query.search;

        // Find the product by name and retrieve all details
        const product = await collection.findOne({ name: productName });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    } 
    // finally {
    //     await client.close();
    // }
});
app.post('/api/addProduct', async (req, res) => {
    try {
        const { name, category, price, stock, supplier } = req.body;

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert the new product into the database
        await collection.insertOne({ name, category, price, stock, supplier });

        res.json({ message: 'Product added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete('/api/removeProduct', async (req, res) => {
    try {
        const { name } = req.body;

        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Delete the product from the database
        const result = await collection.deleteOne({ name });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Product not found" });
        } else {
            res.json({ message: 'Product removed successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
