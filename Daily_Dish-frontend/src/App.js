import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-carousel/lib/styles.css";

import Navbar1 from "./Components/Navbar1";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Checkout from "./Components/Checkout";
import Invoice from "./Components/Invoice";
import Profile from "./Components/Profile";
import LiveStreams from "./Components/LiveStream";
import Dashboard from "./Components/Admin/Dashboard";
import Main from "./Components/Admin/Main";
import HomeBanner from "./Components/Admin/HomeBanner";
import Add_Products from "./Components/Admin/Add_Products";
import DeliveryCharge from "./Components/Admin/DeliveryCharge";
import BookingList from "./Components/Admin/BookingList";
import UserList from "./Components/Admin/UserList";
import AdminContactus from "./Components/Admin/AdminContactus";
import AdminLogin from "./Components/Admin/AdminLogin";
import ProductDescription from "./Components/ProductDescription";
import LandingPage from "./Components/LandingPage";
import OrderHistory from "./Components/OrderHistory";
import Slot from "./Components/Admin/Slot";
import SalesReport from "./Components/Admin/SalesReport";
import WebStory from "./Components/Admin/WebStory";
import Statusbar from "./Components/Statusbar";
import CorporateBookings from "./Components/Admin/CorporateBookings";
import ApartmentList from "./Components/Admin/ApartmentList";
import CorporateList from "./Components/Admin/CorporateList";
import LocationAddRequest from "./Components/Admin/LocationAddRequest";
import ChatWithUs from "./Components/ChatWithUs";
import Livestreams from "./Components/Admin/LiveStream";
import AdminInvoice from "./Components/Admin/AdminInvoice";
import Gst from "./Components/Admin/Gst";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsAndConditions from "./Components/TermsAndCondition";
import PaymentSuccess from "./Components/PaymentSuccess";
import AdminCoupon from "./Components/Admin/AdminCoupon";
import AddonedCart from "./Components/Admin/AddonedCart";
import AdminWalletSettings from "./Components/Admin/AdminWalletSettings";
import AdminWalletManagement from "./Components/Admin/AdminWalletMangement";
import UserWallet from "./Components/UserWallet";
import ThermalInvoice from "./Components/Admin/ThermalInvoice";

function App() {
  const [selectArea, setSelectArea] = useState("");
  const address = localStorage.getItem("address");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let [Carts, setCarts] = useState([]);
  useEffect(() => {
    if (address) {
      setSelectArea(address);
    }
    if (cart) {
      setCarts(cart);
    }
  }, []);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/home"
            element={
              <>
                {/* <Navbar1
                  selectArea={selectArea}
                  Carts={Carts}
                  setCarts={setCarts}
                /> */}
                <Home
                  selectArea={selectArea}
                  setSelectArea={setSelectArea}
                  Carts={Carts}
                  setCarts={setCarts}
                />
                <Footer />
              </>
            }
          />
            <Route
            path="/wallet"
            element={
              <>
                {/* <Navbar1
                  selectArea={selectArea}
                  Carts={Carts}
                  setCarts={setCarts}
                /> */}
               <UserWallet/>
                <Footer />
              </>
            }
          />
          <Route
            path="/product-description"
            element={
              <>
                <Navbar1
                  selectArea={selectArea}
                  Carts={Carts}
                  setCarts={setCarts}
                />
                <ProductDescription />
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Checkout />
                <Footer />
              </>
            }
          />
          <Route
            path="/invoice"
            element={
              <>
                <Invoice />
                <Footer />
              </>
            }
          />
          <Route
            path="/AdminInvoice"
            element={
              <>
                <AdminInvoice />
                <Footer />
              </>
            }
          />

            <Route
            path="/thermalinvoice"
            element={
              <>
                <ThermalInvoice />
                <Footer />
              </>
            }
          />
          <Route
            path="/termsconditions"
            element={
              <>
                <TermsAndConditions />
                <Footer />
              </>
            }
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/chats" element={<ChatWithUs />} />
          <Route
            path="/profile"
            element={
              <>
                <Profile />
                <Footer />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <>
                <OrderHistory />
                <Footer />
              </>
            }
          />
          <Route
            path="/livestreams"
            element={
              <>
                <LiveStreams />
                <Footer />
              </>
            }
          />
          <Route
            path="/payment-success"
            element={
              <>
                <PaymentSuccess />
                <Footer />
              </>
            }
          />
          <Route path="/foodstatus" element={<Statusbar />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/dashboard"
            element={<Main children={<Dashboard />} />}
          />
          <Route
            path="/home_banner"
            element={<Main children={<HomeBanner />} />}
          />
          <Route
            path="/apartmentlist"
            element={<Main children={<ApartmentList />} />}
          />
          <Route
            path="/admin/walletseting"
            element={<Main children={<AdminWalletSettings />} />}
          />
          <Route
            path="/admin/walletmangement"
            element={<Main children={<AdminWalletManagement />} />}
          />

          <Route
            path="/corporatelist"
            element={<Main children={<CorporateList />} />}
          />
          <Route path="/gst" element={<Main children={<Gst />} />} />
          <Route
            path="/all-products"
            element={<Main children={<Add_Products />} />}
          />
          <Route
            path="/available-slots"
            element={<Main children={<Slot />} />}
          />
          <Route
            path="/delivery-charge"
            element={<Main children={<DeliveryCharge />} />}
          />
          <Route
            path="/coupon-list"
            element={<Main children={<AdminCoupon />} />}
          />
          <Route
            path="/apartment-booking-list"
            element={<Main children={<BookingList />} />}
          />
          <Route
            path="/corporate-booking-list"
            element={<Main children={<CorporateBookings />} />}
          />
          <Route
            path="/sales-report"
            element={<Main children={<SalesReport />} />}
          />
          <Route
            path="/abandoned-cart"
            element={<Main children={<AddonedCart />} />}
          />
          <Route path="/webstory" element={<Main children={<WebStory />} />} />
          <Route path="/user-list" element={<Main children={<UserList />} />} />
          <Route
            path="/admin-live-stream"
            element={<Main children={<Livestreams />} />}
          />
          <Route
            path="/contact-us"
            element={<Main children={<AdminContactus />} />}
          />
          <Route
            path="/location-add-request"
            element={<Main children={<LocationAddRequest />} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
