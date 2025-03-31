const morgan = require("morgan");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const path = require("path");

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "dist")));

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB is Connected"))
  .catch(() => console.log("DB is not Connected"));

//Admin
const login = require("./Routes/Admin/AdminLogin");
const HomeBanner = require("./Routes/Admin/HomeBanner");
const Addapartmentlist = require("./Routes/Admin/Addapartmentlist");
const Addcorparatelist = require("./Routes/Admin/Addcorparatelist");
const Addproduct = require("./Routes/Admin/Addproduct");
const adminaddcart = require("./Routes/Admin/Addcart");
const Addorder = require("./Routes/Admin/Addorder");
const Addslots = require("./Routes/Admin/Addslots");
const Addavailableslot = require("./Routes/Admin/Addavailableslot");
const Addwebstories = require("./Routes/Admin/Addwebstories");
const Deletedelivarycharge = require("./Routes/Admin/DelivaryCharge");
const Contactus = require("./Routes/Admin/Contactus");
const Social = require("./Routes/Admin/SocialMedia");
const LiveStream = require("./Routes/Admin/Livestream")
const Gst = require("./Routes/Admin/Gst");
const Coupon = require("./Routes/Admin/Coupon");
//User
const GeneralEnquiry = require("./Routes/User/GeneralEnquiry");
const Userlist = require("./Routes/User/Userlist");
const BookingList = require("./Routes/User/BookingList");
const Addrequestaddress = require("./Routes/User/Addrequestaddress");
const SelectedAddress = require("./Routes/User/SelectedAddress");
const paymentRoute = require("./Routes/User/phonepay");
const Addcart = require("./Routes/User/Cart");
const Wallet=require('./Routes/User/Wallet');

//Admin
app.use("/api/admin", login);
app.use("/api/admin", HomeBanner);
app.use("/api/admin", Addapartmentlist);
app.use("/api/admin", Addcorparatelist);
app.use("/api/admin", Addproduct);
app.use("/api/admin", adminaddcart);
app.use("/api/admin", Addorder);
app.use("/api/admin", Addslots);
app.use("/api/admin", Addavailableslot);
app.use("/api/admin", Addwebstories);
app.use("/api/admin", Deletedelivarycharge);
app.use("/api/admin", Contactus);
app.use("/api/admin", Social);
app.use("/api/admin", LiveStream);
app.use("/api/admin", Gst);
app.use("/api/admin", Coupon);

//User
app.use("/api/user", paymentRoute);
app.use("/api/User", GeneralEnquiry);
app.use("/api/User", Userlist);
app.use("/api/User", BookingList);
app.use("/api/User", Addrequestaddress);
app.use("/api/User", SelectedAddress);
app.use("/api/cart", Addcart);
app.use("/api/wallet",Wallet);

const PORT = process.env.PORT || 7013;
app.use('/', (req, res) => {
  res.send("server is ready");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
