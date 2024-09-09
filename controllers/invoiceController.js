// const Invoice = require('../models/invoiceModel');
// const fs = require('fs');
// const path = require('path');
// const puppeteer = require('puppeteer');

// exports.generateInvoice = async (req, res) => {
//     console.log('Received Request Body:', req.body); // Log the incoming request body

//     try {
//         const invoiceData = new Invoice(req.body);

//         if (!invoiceData.sellerDetails || !invoiceData.sellerDetails.name) {
//             return res.status(400).send({ message: 'Seller details are missing or incomplete' });
//         }

//         // Calculate invoice amounts
//         invoiceData.calculateAmounts();

//         // Build HTML content dynamically
//         let itemsRows = '';
//         invoiceData.items.forEach((item, index) => {
//             itemsRows += `
//                 <tr>
//                     <td>${index + 1}</td>
//                     <td>${item.description}</td>
//                     <td>${item.unitPrice.toFixed(2)}</td>
//                     <td>${item.quantity}</td>
//                     <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
//                     <td>0%</td>
//                     <td>None</td>
//                     <td>0.00</td>
//                     <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
//                 </tr>`;
//         });

//         // Build the complete HTML content
//         const htmlContent = `
//             <!DOCTYPE html>
//             <html lang="en">
//             <head>
//                 <meta charset="UTF-8">
//                 <title>Invoice</title>
//                 <style>
//                     /* Basic styling */
//                     body {
//                         font-family: Arial, sans-serif;
//                         margin: 0;
//                         padding: 0;
//                     }
//                     .container {
//                         padding: 20px;
//                           padding: 20px;
//     background-color: #eee;
//                     }
//                     .header {
//                         text-align: center;
//                         margin-bottom: 20px;
//                     }
//                         .header img {
//     width: 200px; /* Adjust width as needed */
// }

// .header h2 {
//     font-size: 20px; /* Adjust font size */
//     color: #333; /* Adjust color */
// }
//                     .details, .items, .totals {
//                         width: 100%;
//                         border-collapse: collapse;
//                         margin-bottom: 20px;
//                          border: 1px solid #ddd; /* Add table border */
//     background-color: #fff;
//                     }
//                     .details td, .items th, .items td {
//                         border: 1px solid #ddd;
//                         padding: 10px;
//                     }
//                     .totals {
//                         text-align: right;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <img src="../public/images/logo.png" alt="Logo" width="150">
//                         <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
//                     </div>
//                     <table class="details">
//                         <tr>
//                             <td><strong>Sold By:</strong> ${invoiceData.sellerDetails.name}<br>${invoiceData.sellerDetails.address}<br>GST No: ${invoiceData.sellerDetails.gstNo}<br>PAN No: ${invoiceData.sellerDetails.panNo}</td>
//                             <td><strong>Billing Address:</strong> ${invoiceData.billingDetails.name}<br>${invoiceData.billingDetails.address}</td>
//                         </tr>
//                         <!-- Add more details rows if needed -->
//                     </table>
//                     <table class="items">
//                         <thead>
//                             <tr>
//                                 <th>Sl. No</th>
//                                 <th>Description</th>
//                                 <th>Unit Price</th>
//                                 <th>Qty</th>
//                                 <th>Net Amount</th>
//                                 <th>Tax Rate</th>
//                                 <th>Tax Type</th>
//                                 <th>Tax Amount</th>
//                                 <th>Total Amount</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             ${itemsRows}
//                         </tbody>
//                     </table>
//                     <div class="totals">
//                         <p><strong>Amount in Words:</strong> Total Amount in Words Here</p>
//                     </div>
//                     <div class="footer">
//                         <p>Authorized Signatory</p>
//                     </div>
//                 </div>
//             </body>
//             </html>
//         `;

//         // Generate the PDF
//         const browser = await puppeteer.launch({
//             headless: true,
//             args: ['--no-sandbox', '--disable-setuid-sandbox']
//         });
//         const page = await browser.newPage();
//         await page.setContent(htmlContent);
//         const pdf = await page.pdf({ format: 'A4' });
//         await browser.close();

//         const pdfDir = path.join(__dirname, '../generated');
//         if (!fs.existsSync(pdfDir)) {
//             fs.mkdirSync(pdfDir);
//         }

//         const uniqueFilename = `${invoiceData.invoiceDetails.invoiceNumber}-${Date.now()}.pdf`;
//         const pdfPath = path.join(pdfDir, uniqueFilename);

//         fs.writeFileSync(pdfPath, pdf);

//         // Send the PDF as the response
//         res.contentType('application/pdf');
//         res.send(pdf);
//     } catch (error) {
//         console.error('Error generating invoice:', error.message);
//         console.error('Stack trace:', error.stack);
//         res.status(500).send({ message: 'Failed to generate invoice', error });
//     }
// };


const Invoice = require('../models/invoiceModel'); // Import the Invoice model
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Controller function to generate an invoice PDF
exports.generateInvoice = async (req, res) => {
    console.log('Received Request Body:', req.body); // Log incoming request for debugging

    try {
        // Create a new Invoice object with the request data
        const invoiceData = new Invoice(req.body);

        // Validate seller details
        if (!invoiceData.sellerDetails || !invoiceData.sellerDetails.name) {
            return res.status(400).send({ message: 'Seller details are missing or incomplete' });
        }

        // Calculate invoice amounts
        invoiceData.calculateAmounts();

        // Generate the HTML for the items dynamically
        let itemsRows = '';
        invoiceData.items.forEach((item, index) => {
            itemsRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.description}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                    <td>0%</td>
                    <td>None</td>
                    <td>0.00</td>
                    <td>${(item.unitPrice * item.quantity).toFixed(2)}</td>
                </tr>`;
        });

        // Build the complete HTML content
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Invoice</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f4f4f4;
                    }
                    .container {
                        padding: 20px;
                        max-width: 800px;
                        margin: auto;
                        background-color: #fff;
                        border: 1px solid #ddd;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        width: 120px;
                    }
                    .header h2 {
                        font-size: 18px;
                        margin: 5px 0;
                    }
                    .details, .items, .totals {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    .details td {
                        border: none;
                        padding: 5px;
                        vertical-align: top;
                        font-size: 14px;
                    }
                    .items th, .items td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: center;
                        font-size: 13px;
                    }
                    .items th {
                        background-color: #f0f0f0;
                    }
                    .totals {
                        text-align: right;
                        font-size: 14px;
                    }
                    .footer {
                        text-align: right;
                        font-size: 12px;
                        margin-top: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img src="../public/images/logo.png" alt="Logo">
                        <h2>Tax Invoice/Bill of Supply/Cash Memo</h2>
                    </div>
                    <table class="details">
                        <tr>
                            <td>
                                <strong>Sold By:</strong> ${invoiceData.sellerDetails.name}<br>
                                ${invoiceData.sellerDetails.address}<br>
                                GST No: ${invoiceData.sellerDetails.gstNo}<br>
                                PAN No: ${invoiceData.sellerDetails.panNo}
                            </td>
                            <td>
                                <strong>Billing Address:</strong> ${invoiceData.billingDetails.name}<br>
                                ${invoiceData.billingDetails.address}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Order Number:</strong> ${invoiceData.invoiceDetails.orderNumber}<br>
                                <strong>Order Date:</strong> ${invoiceData.invoiceDetails.orderDate}
                            </td>
                            <td>
                                <strong>Shipping Address:</strong> ${invoiceData.shippingDetails.name}<br>
                                ${invoiceData.shippingDetails.address}
                            </td>
                        </tr>
                    </table>
                    <table class="items">
                        <thead>
                            <tr>
                                <th>Sl. No</th>
                                <th>Description</th>
                                <th>Unit Price</th>
                                <th>Qty</th>
                                <th>Net Amount</th>
                                <th>Tax Rate</th>
                                <th>Tax Type</th>
                                <th>Tax Amount</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsRows}
                        </tbody>
                    </table>
                    <div class="totals">
                        <p><strong>Total:</strong> ₹${invoiceData.totalAmount}</p>
                        <p><strong>Amount in Words:</strong> ${invoiceData.amountInWords}</p>
                    </div>
                    <div class="footer">
                        <p>Authorized Signatory</p>
                        <p>For ${invoiceData.sellerDetails.name}</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Generate the PDF with Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent);
        const pdf = await page.pdf({ format: 'A4' });
        await browser.close();

        // Save the PDF file
        const pdfDir = path.join(__dirname, '../generated');
        if (!fs.existsSync(pdfDir)) {
            fs.mkdirSync(pdfDir);
        }

        const uniqueFilename = `${invoiceData.invoiceDetails.invoiceNumber}-${Date.now()}.pdf`;
        const pdfPath = path.join(pdfDir, uniqueFilename);

        fs.writeFileSync(pdfPath, pdf);

        // Send the PDF as a response
        res.contentType('application/pdf');
        res.send(pdf);
    } catch (error) {
        console.error('Error generating invoice:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).send({ message: 'Failed to generate invoice', error });
    }
};
