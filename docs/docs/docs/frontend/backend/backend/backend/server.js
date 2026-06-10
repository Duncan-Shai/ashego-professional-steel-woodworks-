const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const quotesFile = path.join(__dirname, "data", "quotes.json");

// Read quotes from file
function readQuotes() {
    if (!fs.existsSync(quotesFile)) {
        return [];
    }

    const data = fs.readFileSync(quotesFile, "utf8");
    return data ? JSON.parse(data) : [];
}

// Save quotes to file
function saveQuotes(quotes) {
    fs.writeFileSync(quotesFile, JSON.stringify(quotes, null, 2));
}

// Home route
app.get("/", (req, res) => {
    res.send("Mashego Professional Steel and Woodworks backend is running");
});

// Get all quote requests
app.get("/quotes", (req, res) => {
    const quotes = readQuotes();
    res.json(quotes);
});

// Create a new quote request
app.post("/quotes", (req, res) => {
    const quotes = readQuotes();

    const newQuote = {
        id: Date.now(),
        customerName: req.body.customerName,
        phone: req.body.phone,
        email: req.body.email,
        serviceType: req.body.serviceType,
        description: req.body.description,
        status: "New",
        createdAt: new Date().toISOString()
    };

    quotes.push(newQuote);
    saveQuotes(quotes);

    res.status(201).json({
        message: "Quote request created successfully",
        quote: newQuote
    });
});

// Update quote status
app.patch("/quotes/:id", (req, res) => {
    const quotes = readQuotes();
    const quoteId = Number(req.params.id);

    const quoteIndex = quotes.findIndex(q => q.id === quoteId);

    if (quoteIndex === -1) {
        return res.status(404).json({ message: "Quote not found" });
    }

    quotes[quoteIndex].status = req.body.status || quotes[quoteIndex].status;
    saveQuotes(quotes);

    res.json({
        message: "Quote updated successfully",
        quote: quotes[quoteIndex]
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Mashego Professional Steel and Woodworks backend running on port ${PORT}`);
});
