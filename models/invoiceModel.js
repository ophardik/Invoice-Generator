const numberToWords = require('number-to-words'); // Use a library to convert numbers to words

class Invoice {
    constructor(data) {
        this.sellerDetails = data.sellerDetails || {};
        this.billingDetails = data.billingDetails || {};
        this.shippingDetails = data.shippingDetails || {};
        this.orderDetails = data.orderDetails || {};
        this.invoiceDetails = data.invoiceDetails || {};
        this.items = data.items || [];
        this.reverseCharge = data.reverseCharge || false;
        this.totalAmount = 0;
        this.amountInWords = '';

        console.log('Invoice Data:', this); // Log to ensure the data is correctly assigned
    }

    calculateAmounts() {
        if (!this.items || this.items.length === 0) {
            throw new Error('No items provided for invoice calculation.');
        }

        this.items = this.items.map(item => {
            item.netAmount = item.unitPrice * item.quantity - (item.discount || 0); // Ensure discount is considered
            item.taxType = this.invoiceDetails.placeOfSupply === this.invoiceDetails.placeOfDelivery ? 'CGST/SGST' : 'IGST';
            item.taxRate = item.taxType === 'IGST' ? 18 : 9;
            item.taxAmount = item.netAmount * (item.taxRate / 100);
            item.totalAmount = item.netAmount + item.taxAmount;
            return item;
        });

        // Calculate totalAmount for the entire invoice
        this.totalAmount = this.items.reduce((sum, item) => sum + item.totalAmount, 0);

        // Convert totalAmount to words
        this.amountInWords = numberToWords.toWords(this.totalAmount);
    }
}

module.exports = Invoice;
