import mongoose from "mongoose";


const itemSchema = new mongoose.Schema({
  description: String,
  hsn: String,
  quantity: Number,
  unit: String,
  rate: Number,
  amount: Number,
  gstPercent: Number,
  igst: Number,
  cgst: Number,
  sgst: Number
});

const invoiceSchema = new mongoose.Schema({

  invoiceNumber: String,
  invoiceDate: Date,

  seller:{
    businessName:String,
    address:String,
    gstin:String,
    state:String,
    stateCode:String,
    phone:String
  },

  customer:{
    name:String,
    address:String,
    gstin:String,
    state:String,
    stateCode:String
  },

  transport:{
    // deliveryNote:String,
    // dispatchDocNo:String,
    destination:String,
    vehicleNo:String,
    // lrNo:String
  },

  items:[itemSchema],

  subtotal:Number,
  cgstTotal:Number,
  sgstTotal:Number,
  igstTotal:Number,
  grandTotal:Number,
  amountWords:String,
  taxAmountWords: String

},{timestamps:true});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;