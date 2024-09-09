const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const invoiceController = require('./controllers/invoiceController');

const config = require('./config/config.env');

const app = express();


app.use(bodyParser.json());
app.post('/generate-invoice', invoiceController.generateInvoice);

const port = process.env.PORT || 8002; 

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});