const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

//app.get("/", (req, res) => res.send("API Runnning"));

// Define Routes
app.use("/api/register", require("./routes/api/admin/register"));
app.use("/api/login", require("./routes/api/admin/login"));
app.use("/api/invoices", require("./routes/api/users/getInvoices"));
app.use("/api/invoiceUpload", require("./routes/api/users/invoiceUpload"));
app.use("/api/users", require("./routes/api/users/allUsers"));
app.use("/api/token", require("./routes/api/users/accessToken"));

// Static assets in production
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
