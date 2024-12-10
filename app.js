const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/Thrift', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("MongoDB connection error: ", err);
});

// Define the order schema
const orderSchema = new mongoose.Schema({
    userId: String,
    items: Array,
    totalPrice: Number,
    status: { type: String, default: "Pending" },
    orderDate: { type: Date, default: Date.now },
    deliveryAddress: String
});

// Create a model
const Order = mongoose.model('Order', orderSchema);

// Function to insert a single order
async function insertOrder() {
    try {
        const newOrder = new Order({
            userId: "12345",
            items: [
                { name: "Cardigan", price: 500, quantity: 2 },
                { name: "Shorts", price: 150, quantity: 1 }
            ],
            totalPrice: 650,
            deliveryAddress: "123 Street, City"
        });

        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder);
    } catch (error) {
        console.error("Error saving order:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Function to insert multiple orders
async function insertMultipleOrders() {
    try {
        const orders = [
            {
                userId: "12345",
                items: [
                    { name: "Item1", price: 10, quantity: 2 },
                    { name: "Item2", price: 15, quantity: 1 }
                ],
                totalPrice: 35,
                deliveryAddress: "123 Street, City"
            },
            {
                userId: "67890",
                items: [
                    { name: "Item3", price: 20, quantity: 1 },
                    { name: "Item4", price: 25, quantity: 2 }
                ],
                totalPrice: 70,
                deliveryAddress: "456 Avenue, Town"
            }
        ];

        const savedOrders = await Order.insertMany(orders);
        console.log("Orders saved successfully:", savedOrders);
    } catch (error) {
        console.error("Error saving orders:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Routes for testing
app.get('/insert-single', async (req, res) => {
    await insertOrder();
    res.send('Single order inserted!');
});

app.get('/insert-multiple', async (req, res) => {
    await insertMultipleOrders();
    res.send('Multiple orders inserted!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});

