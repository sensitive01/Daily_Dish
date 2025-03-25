const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const customerorderSchema = new mongoose.Schema(
  {
    customerId: {
      type: ObjectId,
      ref: "customers",
    },
    cartId:{
      type: String,
    },
    cart_id:{
      type: String,
    },
    allProduct: [
      {
        foodItemId: {
          type: ObjectId,
          ref: "Fooditem",
        },
        totalPrice: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    Cutlery: {
      type: String,
    },
    Placedon: {
      type: String,
    },
    couponId:{
      type:String  
    },
    coupon:{
        type:Number,
        default:0
    },
    discountWallet:{
        type:Number,
        default:0
    },
    slot: {
      type: String,
    },
    ordertype: {
      type: String,
    },
    orderdelivarytype: {
      type: String,
    },
    approximatetime:{
      type: String,
    },
    delivarylocation: {
      type: String,
    },
    username: {
      type: String,
    },
    Mobilenumber: {
      type: Number,
    },
    paymentmethod: {
      type: String,
    },
    orderstatus: {
      type: String,
    },
    delivarytype: {
      type: Number,
    },
    payid: {
      type: String,
    },

    addressline: {
      type: String,
      // required: true,
    },

    subTotal: {
      type: Number,
     
    },
    allTotal: {
      type: Number,
    
    },
    foodtotal: {
      type: Number,
    
    },
    apartment:{
         type: String,
    },
    prefixcode:{
         type: String,
    },
       orderid:{
         type: String,
    },
    tax: {
      type: Number,
    },
    deliveryMethod:{
     type: String,
    },
    orderId: {
      type: String,
    },
    reasonforcancel: {
      type: String,
   },
    status: {
      type: String,
      default: "Cooking",
      enum: [
          "inprocess",
          "Cooking",
          "Packing",
          "Ontheway",
          "Delivered",
          "Undelivered",
          "Returned",
          "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

const customerorderModel = mongoose.model("Foodorder", customerorderSchema);
module.exports = customerorderModel;
