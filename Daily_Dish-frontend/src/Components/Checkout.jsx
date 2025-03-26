import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa6";

import { Button, Container, Form, Modal } from "react-bootstrap";
import { RxCross2 } from "react-icons/rx";
import { MdRemoveShoppingCart } from "react-icons/md";
import "../Styles/Checkout.css";
import { FaCheck, FaEdit } from "react-icons/fa";

import { useNavigate, useLocation } from "react-router-dom";

import { MdOutlineEditLocationAlt } from "react-icons/md";
import axios from "axios";
import swal from "sweetalert";
import moment from "moment";
import { WalletContext } from "../WalletContext";
// import crypto from "crypto";

const Checkout = () => {
  const navigate = useNavigate();
  const { wallet, transactions, loading, walletSeting } =
    useContext(WalletContext);

  // console.log("wallet==>", walletSeting);

  const location = useLocation();
  const data = location?.state;
  const addresstype = localStorage.getItem("addresstype");
  const [address, setAddress] = useState({});

  useMemo(() => {
    setAddress(
      addresstype == "apartment"
        ? JSON.parse(localStorage.getItem("address"))
        : JSON.parse(localStorage.getItem("coporateaddress"))
    );
  }, [addresstype]);

  const Carts = JSON.parse(localStorage.getItem("cart"));
  const [cartdata, setCartData] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [apartmentdata, setapartmentdata] = useState([]);
  const getapartmentd = async () => {
    try {
      let res = await axios.get(
        "https://daily-dish.onrender.com/api/admin/getapartment"
      );
      if (res.status === 200) {
        setapartmentdata(res.data.corporatedata);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [corporatedata, setcorporatedata] = useState([]);
  const getCorporatedata = async () => {
    try {
      let res = await axios.get(
        "https://daily-dish.onrender.com/api/admin/getcorporate"
      );
      if (res.status === 200) {
        setcorporatedata(res.data.corporatedata);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch data from local storage on component mount and whenever cart changes
  useEffect(() => {
    getapartmentd();
    getCorporatedata();
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartData(storedCart);
  }, []);

  // Function to update local storage and state
  const updateCartData = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartData(updatedCart); // Update state to re-render the component
    setDiscountWallet(
      calculateTaxPrice + subtotal + Cutlery <=
        walletSeting.minCartValueForWallet
        ? discountWallet
        : 0
    );
  };

  const increaseQuantity = (itemdata) => {
    const updatedCart = cartdata.map((item) => {
      if (item.foodItemId === itemdata?.foodItemId) {
        if (item.Quantity < item.remainingstock) {
          item.Quantity += 1;
          item.totalPrice = Number(item.price) * Number(item.Quantity);
        } else {
          alert("No more stock available!");
        }
      }
      return item;
    });

    updateCartData(updatedCart);
  };

  // Function to decrease quantity
  const decreaseQuantity = (itemdata) => {
    const updatedCart = cartdata
      .map((item) => {
        if (item.foodItemId === itemdata?.foodItemId) {
          if (item.Quantity > 0) {
            item.Quantity -= 1;
            item.totalPrice = item.price * item.Quantity;
          } else {
            alert("Minimum quantity reached!");
          }
        }
        return item;
      })
      .filter((item) => item.Quantity > 0);
    updateCartData(updatedCart);
  };

  const [show1, setShow1] = useState();
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [delivarychargetype, setdelivarychargetype] = useState(0);
  const [delivaryaddress, setdelivaryaddress] = useState(address?.Address);

  const [slotdata, setslotdata] = useState();
  const [payid, setpayid] = useState("pay001");
  const [Cutlery, setCutlery] = useState(0);
  const [paymentmethod, setpaymentmethod] = useState("Online");

  const [name, setname] = useState("");
  const [buildingaddress, setbuildingaddress] = useState("");
  const [pincode, setpincode] = useState("");
  const [mobilenumber, setmobilenumber] = useState("");
  const [selectedValue, setSelectedValue] = useState("Apartment");
  const [flat, setFlat] = useState("");

  const [selectedOption, setSelectedOption] = useState("");

  const handleSelection = (deliveryCharge, option) => {
    setdelivarychargetype(deliveryCharge); // Sets the delivery charge
    setSelectedOption(option); // Sets the selected option
  };

  const d = new Date();

  const formattedProducts = cartdata?.map((item) => ({
    foodItemId: item.foodItemId,
    totalPrice: item.totalPrice,
    quantity: item.Quantity, // Using Quantity as per the structure
  }));

  const generateUniqueId = () => {
    const timestamp = Date.now().toString().slice(-4); // Get last 4 digits of the current timestamp
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
    return `${address?.prefixcode}${timestamp}${randomNumber}`; // Resulting in an 8-character ID
  };
  const [couponId, setCouponId] = useState("");
  const [coupon, setCoupon] = useState(0);
  const applycoupon = async () => {
    try {
      if (!couponId)
        return swal({
          title: "Error",
          text: "Please enter coupon code",
          icon: "error",
        });
      const config = {
        url: "/admin/applyCoupon",
        method: "post",
        baseURL: "https://daily-dish.onrender.com/api/",
        header: { "content-type": "application/json" },
        data: {
          mobileNumber: user?.Mobile,
          couponName: couponId,
          cards: cartdata,
        },
      };
      const response = await axios(config);
      if (response.status === 200) {
        setCoupon(response.data.discountPrice);

        swal({
          title: "Success",
          text: "Coupon Applied Successfully",
          icon: "success",
          buttons: "ok",
        });
      }
    } catch (error) {
      swal({
        title: "Warning",
        text: error?.response
          ? error.response.data.message
          : "Something went wrong",
        icon: "error",
        buttons: "ok",
      });
      setCoupon(0);
      setCouponId("");
      // console.log(error);
    }
  };
  const [adcartId, setAdCartId] = useState({});
  useEffect(() => {
    const addonedCarts = async () => {
      try {
        console.log("calling");
        let res = await axios.post(
          "https://daily-dish.onrender.com/api/cart/addCart",
          {
            userId: user?._id,
            items: Carts,
            lastUpdated: Date.now(),
            username: address?.name,
            mobile: user?.Mobile,
          }
        );

        if (res.status === 200) {
          setAdCartId(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (Carts && Carts.length > 0) {
      // Ensure Carts is not empty before calling API
      addonedCarts();
    }
  }, [JSON.stringify(Carts)]); // Convert Carts to a string to avoid unnecessary re-renders

  const placeorder = async () => {
    try {
      if (Carts.length < 1) {
        return alert("Please add items to cart");
      }
      if (!selectedOption) {
        return alert("Please select the delivery type!");
      }

      if (!slotdata && availableSlots.length && !endstatus) {
        return alert("Please select slots time!");
      }
      if (!address?.name) return alert("Please enter your address");

      if (!addresstype) {
        return alert("Please select the address type!");
      }
      const totalP =
        calculateTaxPrice +
        subtotal +
        Cutlery +
        delivarychargetype -
        discountWallet -
        coupon;
      if (totalP < -1) {
        swal({
          title: "Warning",
          text: "You cant able to order ",
          icon: "error",
          buttons: "ok",
        });
        return;
      }

      const config = {
        url: "/admin/addfoodorder",
        method: "post",
        baseURL: "https://daily-dish.onrender.com/api/",
        header: { "content-type": "application/json" },
        data: {
          customerId: user?._id,
          allProduct: formattedProducts,
          Placedon: d,
          delivarylocation: address?.apartmentname,
          username: address?.name,
          Mobilenumber: Number(user?.Mobile),
          paymentmethod: paymentmethod,
          delivarytype: Number(delivarychargetype || 0),
          payid: payid,
          addressline: `${address?.name} ${
            addresstype == "apartment" ? `${address?.flatno},` : ""
          } ${addresstype == "apartment" ? `${address?.towerName},` : ""}  ${
            address?.mobilenumber
          } `,
          subTotal: subtotal,
          foodtotal: Number(data?.total),
          allTotal: (
            calculateTaxPrice +
            subtotal +
            Cutlery +
            delivarychargetype -
            discountWallet -
            coupon
          )?.toFixed(2),
          tax: calculateTaxPrice,
          slot: slotdata
            ? slotdata
            : `Instant Delivery Time ${moment(moment())
                .add(address?.approximatetime, "minutes")
                .format("hh:mm A")}`,
          status: slotdata ? "Cooking" : "Packing",
          Cutlery: Number(Cutlery),
          approximatetime: address?.approximatetime,
          orderdelivarytype: addresstype,
          orderstatus: slotdata ? "Cooking" : "Instant",
          apartment: address?.apartmentname,
          prefixcode: address?.prefixcode,
          orderid: generateUniqueId(),
          deliveryMethod: selectedOption,
          coupon: coupon,
          couponId: couponId,
          discountWallet: discountWallet,
          cartId: adcartId?.cartId,
          cart_id: adcartId?.data,
        },
      };
      const config1 = {
        url: "/user/addpaymentphonepay",
        method: "post",
        baseURL: "https://daily-dish.onrender.com/api/",
        header: { "content-type": "application/json" },
        data: {
          userId: user?._id,
          username: address?.name,
          Mobile: user?.Mobile,
          amount: totalP,
          config: JSON.stringify(config),
          cartId: adcartId?.cartId,
          cart_id: adcartId?.data,
        },
      };
      const res = await axios(totalP == 0 ? config : config1);
      if (res.status === 200) {
        if (totalP == 0) {
          swal({
            title: "Success",
            text: "Order Successfully Done",
            icon: "success",
            buttons: "ok",
          });
          localStorage.removeItem("cart");
          setTimeout(() => {
            navigate("/orders");
          }, 100);
        } else return window.location.assign(res.data?.url?.url);

        // window.location.reload(true);
      }
    } catch (error) {
      console.log(error);
      swal({
        title: "Error!",
        text: "Order not complete",
        icon: "error",
        button: "Try Again",
      });
    }
  };

  const [towerName, setTowerName] = useState("");

  const getSelectedAddress = async (id) => {
    setApartmentname(id);
    try {
      let res = await axios.get(
        `https://daily-dish.onrender.com/api/user/getSelectedAddressByUserIDAddressID/${user?._id}/${id}`
      );
      if (res.status === 200) {
        let am = res.data.getdata;

        setname(am?.Name ? am?.Name : "");
        setmobilenumber(am?.Number ? am?.Number : "");
        setTowerName(am?.towerName ? am?.towerName : "");
        setFlat(am?.fletNumber ? am?.fletNumber : "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const [name, setName] = useState("");

  const saveSelectedAddress = async (data) => {
    try {
      if (!user) return;
      let res = await axios.post(
        `https://daily-dish.onrender.com/api/user/addressadd`,
        {
          Name: name,
          Number: mobilenumber,
          userId: user?._id,
          ApartmentName: data?.apartmentname,
          addresstype: addresstype,
          addressid: data?._id,
          fletNumber: flat,
          towerName: towerName,
        }
      );

      // console.log("Savedshs",data);
    } catch (error) {
      console.log("errrrrr", error);
    }
  };

  const [discountWallet, setDiscountWallet] = useState(0);

  const Handeledata = () => {
    if (!apartmentname) {
      return alert("Please Select Apartment");
    }
    if (!name) {
      return alert("Please Enter Name!");
    }

    if (!mobilenumber) {
      return alert("Please Enter Mobile Number!");
    }
    if (addresstype == "apartment" && !flat)
      return alert("Please Enter flat number");
    if (addresstype == "apartment" && !towerName)
      return alert("Please Enter Tower Name");

    try {
      //corporatedata
      const Savedaddress = {
        _id: (addresstype == "apartment" ? apartmentdata : corporatedata)?.find(
          (data) => data?.Apartmentname === apartmentname
        )?._id,
        apartmentname: (addresstype == "apartment"
          ? apartmentdata
          : corporatedata
        )?.find((data) => data?.Apartmentname === apartmentname)?.Apartmentname,
        approximatetime: (addresstype == "apartment"
          ? apartmentdata
          : corporatedata
        )?.find((data) => data?.Apartmentname === apartmentname)
          ?.approximatetime,

        Delivarycharge: (addresstype == "apartment"
          ? apartmentdata
          : corporatedata
        )?.find((data) => data?.Apartmentname === apartmentname)
          ?.apartmentdelivaryprice,
        doordelivarycharge: (addresstype == "apartment"
          ? apartmentdata
          : corporatedata
        )?.find((data) => data?.Apartmentname === apartmentname)
          ?.doordelivaryprice,
        buildingaddress: buildingaddress,
        flatno: flat,
        name: name,
        towerName: towerName,
        mobilenumber: mobilenumber,
        prefixcode: (addresstype == "apartment"
          ? apartmentdata
          : corporatedata
        )?.find((data) => data?.Apartmentname === apartmentname)?.prefixcode,
      };

      addresstype == "apartment"
        ? localStorage.setItem("address", JSON.stringify(Savedaddress))
        : sessionStorage.setItem(
            "coporateaddress",
            JSON.stringify(Savedaddress)
          );

      setAddress(Savedaddress);

      sessionStorage.setItem("Savedaddress", JSON.stringify(Savedaddress));
      saveSelectedAddress(Savedaddress);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  // Function to convert 24-hour time format to 12-hour AM/PM format
  const formatTo12Hour = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    return `${formattedHour}:${formattedMinute} ${suffix}`;
  };

  // Function to convert a range of times (e.g. "1:00-1:45") into AM/PM format
  const formatSlotRange = (startTime, endTime) => {
    const formattedStart = formatTo12Hour(startTime);
    const formattedEnd = formatTo12Hour(endTime);
    return `${formattedStart} - ${formattedEnd}`;
  };

  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const updateCartDataWithStock = (cartData, foodItemData) => {
    const updatedCart = cartData
      .map((cartItem) => {
        // Find the matching food item from the foodItemData
        const matchingFood = foodItemData.find(
          (food) => food._id === cartItem.foodItemId
        );

        if (matchingFood && matchingFood.Remainingstock > 0) {
          // If Remainingstock is greater than 0, update the cart item
          return {
            ...cartItem,
            remainingstock: matchingFood.Remainingstock, // Add Remainingstock to the cart item
          };
        }

        return null; // Mark items with Remainingstock <= 0 or not found as null
      })
      .filter(Boolean); // Remove null items from the cart

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    return updatedCart; // Return the updated cart data
  };

  const filterOutLowStockItems = (foodItemData) => {
    setCartData((prevCart) => {
      const updatedCart = updateCartDataWithStock(prevCart, foodItemData);

      // console.log("Updated Cart:", updatedCart);

      return updatedCart; // Update the state with the filtered cart
    });
  };

  const getfooditems = async () => {
    try {
      let res = await axios.get(
        "https://daily-dish.onrender.com/api/admin/getFoodItemsUnBlocks"
      );
      if (res.status === 200) {
        filterOutLowStockItems(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getfooditems();
  }, []);

  const slots = {
    lunch: {
      early: [
        { start: "12:30", end: "12:45" },
        { start: "12:45", end: "13:00" },
        { start: "13:00", end: "13:15" },
        { start: "13:15", end: "13:30" },
      ],
      // midday: [
      //   { start: "1:00", end: "1:45" },
      //   { start: "1:30", end: "2:15" },
      // ],
      // late: [{ start: "1:30", end: "2:15" }],
    },
    dinner: {
      early: [
        { start: "20:00", end: "20:15" },
        { start: "20:15", end: "20:30" },
        { start: "20:30", end: "20:45" },
        { start: "20:45", end: "21:00" },
      ],
      //   evening: [
      //     { start: "20:00", end: "20:45" },
      //     { start: "20:30", end: "21:15" },
      //   ],
      //   night: [{ start: "20:30", end: "21:15" }],
    },
  };
  const [apartmentname, setApartmentname] = useState("");
  const [endstatus, setendtstatus] = useState(false);

  useEffect(() => {
    const getCurrentTimeSlots = () => {
      const current = new Date();
      const hours = current.getHours();

      const minutes = current.getMinutes();
      const time = `${hours > 9 ? hours : "0" + hours}:${
        minutes < 10 ? "0" : ""
      }${minutes}`;
      // const time = "13:30";
      let slotsToShow = [];

      // Lunch Slots: 8:00 AM - 12:30 PM
      if (time >= "08:00" && time < "12:30") {
        slotsToShow = slots.lunch.early;
      } else if (time >= "15:00" && time < "20:30") {
        slotsToShow = slots.dinner.early;
      } else if (time >= "22:00" || time < "08:00") {
        setendtstatus(true);
      }

      const formattedSlots = slotsToShow.map((slot) =>
        formatSlotRange(slot.start, slot.end)
      );
      setAvailableSlots(formattedSlots);
      // setAvailableSlots(slots.dinner.early)
    };

    // Set the initial slots based on the current time
    getCurrentTimeSlots();

    // Update slots every minute to keep them current
    const interval = setInterval(getCurrentTimeSlots, 60000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
    setslotdata(event.target.value);
  };

  const subtotal = useMemo(() => {
    return cartdata?.reduce((acc, item) => {
      return Number(acc) + Number(item.price) * Number(item.Quantity);
    }, 0);
  }, [cartdata]);

  const [gstlist, setGstList] = useState([]);
  const getGst = async () => {
    try {
      let res = await axios.get(
        "https://daily-dish.onrender.com/api/admin/getgst"
      );
      if (res.status === 200) {
        setGstList(res.data.gst);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGst();
  }, []);

  const calculateTaxPrice = useMemo(() => {
    return (gstlist[0]?.TotalGst / 100) * subtotal;
  }, [subtotal, gstlist]);

  const [isHandleShowCalled, setIsHandleShowCalled] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isDataIncomplete =
        !address?.name ||
        !addresstype ||
        !corporatedata?.length ||
        !apartmentdata?.length;

      if (!isHandleShowCalled && isDataIncomplete) {
        // Ensure safety when accessing data
        getSelectedAddress(address?.apartmentname);
        setIsHandleShowCalled(true); // Prevent multiple calls
        handleShow(); // Trigger the modal
      }
    }, 500); // Delay of 500ms

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(timeout);
  }, [address, addresstype, corporatedata, apartmentdata, isHandleShowCalled]);

  return (
    <div className="mainbg">
      <Container className="checkoutcontainer">
        <div className="mycart">
          <h5>My Cart</h5>

          <a href="/home">
            <RxCross2
              onClick={() => navigate("/home")}
              style={{ fontSize: "20px" }}
            />
          </a>
        </div>

        <div className="mobile-checkout">
          {availableSlots.length == 0 && !endstatus ? (
            <div
              className="cartproducts"
              style={{
                background:
                  "linear-gradient(to bottom right, #F81D0F, #feb47b)",
                justifyContent: "center",
                color: "white",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            >
              <h6 className="d-flex justify-content-center">
                Delivery in {address ? address?.approximatetime : ""} Mins
              </h6>
            </div>
          ) : null}

          <div className="cartproducts">
            <div className="cartHead mb-2 border-bottom">Dish in Basket</div>
            {cartdata?.map((item) => {
              return (
                <div className="d-flex justify-content-between mb-2  ">
                  <div className="w-50">
                    <div className="d-flex gap-2 w-100 align-items-center ">
                      <div
                        className={
                          item?.foodcategory === "Veg" ? "veg" : "non-veg"
                        }
                      ></div>
                      <div className="chekout-p-name ">{item?.foodname} </div>
                    </div>
                  </div>
                  <div className="d-flex uprdiv  w-50 align-items-center justify-content-between">
                    <span className="btnDiv ">
                      <div className="increment">
                        <FaMinus
                          onClick={() => decreaseQuantity(item)}
                          className="plusbtn"
                        />
                      </div>
                      {item?.Quantity}
                      <div className="increment">
                        <FaPlus
                          onClick={() => increaseQuantity(item)}
                          className="plusbtn"
                        />
                      </div>
                    </span>

                    <div style={{ fontWeight: 700 }}>
                      ₹{item?.price * item?.Quantity}
                    </div>
                  </div>
                </div>
              );
            })}
            {cartdata?.length === 0 && (
              <div className="text-center">
                <MdRemoveShoppingCart style={{ fontSize: "18px" }} />{" "}
                &nbsp;&nbsp;No items in cart
              </div>
            )}
          </div>

          <div className="cutleryDiv">
            <div className="d-flex">
              <input
                type="checkbox"
                className="form-check-input "
                id="customCheckbox1"
                name="Send Cutlery"
                value="Send Cutlery"
                onChange={(e) => setCutlery(e.target.checked ? 3 : 0)}
                style={{ border: "1px solid orangered" }}
              />
              <label
                class="custom-checkbox-label form-check-label"
                for="customCheckbox1"
              ></label>
              <span style={{ fontWeight: 700, marginLeft: "5px" }}>
                Cutlery
              </span>
            </div>
            <div>
              <span> ₹ 3.00</span>
            </div>
          </div>

          <div className="deliverycard">
            <div className="deliveryHead">
              <span style={{ fontWeight: 700 }}>Choose Delivery Type</span>
            </div>
            <div className="maincard">
              {/* Render Deliver to Door only if addresstype is NOT corporate */}

              {addresstype === "apartment" ? (
                <>
                  <div
                    variant={selectedOption === "Door" ? "white" : ""}
                    className={`leftcard ${
                      selectedOption === "Door" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleSelection(address?.doordelivarycharge, "Door")
                    }
                  >
                    {selectedOption === "Door" && (
                      <div className="top-right-icon">
                        <FaCheck />
                      </div>
                    )}

                    <div className="top">
                      <div className="icon">
                        <img src="/Assets/door2.png" alt="" srcset="" />
                      </div>
                    </div>
                    <div className="center mt-1">
                      {address?.doordelivarycharge > 0 ? (
                        <b> ₹ {address?.doordelivarycharge}</b>
                      ) : (
                        <b
                          style={{
                            backgroundColor: "#355f2e",
                            borderRadius: "5px",
                            padding: "1px 8px",
                            color: "white",
                            marginTop: "5px",
                          }}
                        >
                          FREE
                        </b>
                      )}
                    </div>
                    <div className="bottom">
                      <div className="icon">
                        <h6>Deliver to Doors</h6>
                      </div>
                    </div>
                  </div>
                  <div
                    variant={selectedOption === "Gate/Tower" ? "white" : ""}
                    className={`rightcard ${
                      selectedOption === "Gate/Tower" ? "active" : ""
                    }`}
                    onClick={() =>
                      handleSelection(address?.Delivarycharge, "Gate/Tower")
                    }
                  >
                    {selectedOption === "Gate/Tower" && (
                      <div className="top-right-icon">
                        <FaCheck />
                      </div>
                    )}

                    <div className="top">
                      <div className="icon">
                        <img src="/Assets/guard.png" alt="" srcset="" />
                      </div>
                    </div>
                    <div className="center mt-1">
                      {address?.Delivarycharge > 0 ? (
                        <b> ₹ {address?.Delivarycharge}</b>
                      ) : (
                        <b
                          style={{
                            backgroundColor: "#355f2e",
                            borderRadius: "5px",
                            padding: "1px 8px",
                            color: "white",
                            marginTop: "5px",
                          }}
                        >
                          FREE
                        </b>
                      )}
                    </div>
                    <div className="bottom">
                      <div className="icon">
                        <h6>Deliver to Gate</h6>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  variant={selectedOption === "Gate/Tower" ? "white" : ""}
                  className={`rightcard ${
                    selectedOption === "Gate/Tower" ? "active" : ""
                  }`}
                  onClick={() =>
                    handleSelection(address?.Delivarycharge, "Gate/Tower")
                  }
                >
                  {selectedOption === "Gate/Tower" && (
                    <div className="top-right-icon">
                      <FaCheck />
                    </div>
                  )}

                  <div className="top">
                    <div className="icon">
                      <img src="/Assets/guard.png" alt="" srcset="" />
                    </div>
                  </div>
                  <div className="center mt-1">
                    {address?.Delivarycharge > 0 ? (
                      <b> ₹ {address?.Delivarycharge}</b>
                    ) : (
                      <b
                        style={{
                          backgroundColor: "#355f2e",
                          borderRadius: "5px",
                          padding: "1px 8px",
                          color: "white",
                          marginTop: "5px",
                        }}
                      >
                        FREE
                      </b>
                    )}
                  </div>
                  <div className="bottom">
                    <div className="icon">
                      <h6>Deliver to Gate</h6>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="cutleryDiv">
            {/* <div className="d-flex"> */}
            <input
              type="text"
              // className="form-check-input "
              value={couponId}
              placeholder="Enter your promo code"
              onChange={(e) => setCouponId(e.target.value)}
              style={{
                border: "1px solid orangered",
                borderRadius: "5px",
                width: "80%",
              }}
            />

            {/* <span style={{ fontWeight: 700, marginLeft: "5px" }}>
                Cutlery
              </span> */}
            {/* </div> */}
            <div
              className="btnDiv"
              style={{
                justifyContent: "center",
                cursor: "pointer",
                paddingTop: "3px",
                height: "28px",
              }}
              onClick={() => applycoupon()}
            >
              <span>Apply</span>
            </div>
          </div>

          <div className="deliverycard">
            <div
              className="deliveryHead  w-100 ps-2 border-bottom"
              style={{ float: "left" }}
            >
              <span style={{ fontWeight: 700 }}>Bill Details</span>
            </div>
            <div className="maincard2">
              <div className="d-flex justify-content-between  align-items-center w-100 billdetail">
                <div>
                  <div>
                    <div>Sub Total</div>
                    <div>Tax {`(${gstlist[0]?.TotalGst} %)`}</div>
                    {Cutlery != 0 && <div>Cutlery</div>}
                    {coupon != 0 && <div>Coupon Discount</div>}
                    {selectedOption ? (
                      <div>{`${selectedOption} Delivery`}</div>
                    ) : (
                      ""
                    )}
                    {discountWallet != 0 && <div>Wallet Pay</div>}
                    <div>
                      <b>Bill total</b>
                    </div>
                  </div>
                </div>
                <div className="mb-2">
                  <div style={{ textAlign: "right" }}>
                    <div>₹ {subtotal?.toFixed(2)}</div>

                    <div>₹ {calculateTaxPrice.toFixed(2)}</div>
                    {Cutlery != 0 && <div>₹ {Cutlery} </div>}
                    {coupon != 0 && (
                      <div style={{ color: "green" }}> - ₹ {coupon} </div>
                    )}
                    {selectedOption ? <div>₹ {delivarychargetype} </div> : ""}
                    {discountWallet != 0 && (
                      <div style={{ color: "green" }}>
                        {" "}
                        - ₹ {discountWallet}{" "}
                      </div>
                    )}
                    <div>
                      {Cutlery ? (
                        <b>
                          ₹{" "}
                          {(
                            calculateTaxPrice +
                            subtotal +
                            Cutlery +
                            (delivarychargetype || 0) -
                            discountWallet -
                            coupon
                          ).toFixed(2)}{" "}
                        </b>
                      ) : (
                        <b>
                          ₹{" "}
                          {(
                            calculateTaxPrice +
                            subtotal +
                            (delivarychargetype || 0) -
                            discountWallet -
                            coupon
                          ).toFixed(2)}
                        </b>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Apply Cart */}
          <div className="cutleryDiv">
            <div>
              <div className="d-flex">
                <input
                  type="checkbox"
                  className="form-check-input "
                  id="customCheckbox1"
                  name="Send Cutlery"
                  checked={discountWallet ? true : false}
                  disabled={
                    calculateTaxPrice + subtotal + Cutlery <=
                    walletSeting.minCartValueForWallet
                  }
                  value="Send Cutlery"
                  // onChange={(e) => setDiscountWallet(e.target.checked ? (wallet?.balance > (calculateTaxPrice +
                  //   subtotal +
                  //   Cutlery)) ? (calculateTaxPrice +
                  //     subtotal +
                  //     Cutlery) : wallet?.balance : 0)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      let maxUsableAmount =
                        calculateTaxPrice + subtotal + Cutlery;
                      let walletBalance = wallet?.balance || 0;
                      let maxWalletUsage =
                        walletSeting?.maxWalletUsagePerOrder || Infinity; // Ensure a valid limit

                      let finalAmount = Math.min(
                        walletBalance,
                        maxUsableAmount,
                        maxWalletUsage
                      );
                      setDiscountWallet(finalAmount);
                    } else {
                      setDiscountWallet(0);
                    }
                  }}
                  style={{ border: "1px solid orangered" }}
                />
                <label
                  class="custom-checkbox-label form-check-label"
                  for="customCheckbox1"
                ></label>
                <span style={{ fontWeight: 700, marginLeft: "5px" }}>
                  Apply Wallet
                </span>
              </div>
              <p style={{ fontSize: "smaller", marginTop: "5px" }}>
                Note: Minimum cart value for wallet use is ₹{" "}
                {walletSeting?.minCartValueForWallet}.
              </p>
            </div>
            <div>
              <span> ₹ {(wallet?.balance - discountWallet)?.toFixed(2)}</span>
            </div>
          </div>

          <div className="select-container mt-2 mb-2">
            {availableSlots.length > 0 ? (
              <div>
                <form>
                  <select
                    name=""
                    id=""
                    onChange={handleSlotChange}
                    className="vi_0 slot"
                    style={{ color: "white", width: "180px" }}
                  >
                    <option
                      value=""
                      style={{ color: "white" }}
                      className="option"
                    >
                      Select Slots
                    </option>
                    {availableSlots?.map((slot, index) => (
                      <option
                        value={slot}
                        style={{ color: "white" }}
                        className="option"
                      >
                        {slot}
                      </option>
                    ))}
                  </select>
                </form>
              </div>
            ) : (
              <div className="cutleryDiv">
                No available slots at the moment.
              </div>
            )}
          </div>

          {/* </div> */}

          <div className="addressCard">
            <div className="d-flex justify-content-between">
              <span style={{ fontWeight: 700 }} className="addresselipse">
                Delivering To :{address?.apartmentname}
              </span>
              <span
                onClick={() => {
                  setFlat(addresstype == "apartment" ? address?.flatno : "");
                  setTowerName(
                    addresstype == "apartment" ? address?.towerName : ""
                  );
                  setname(address?.name);
                  setApartmentname(address?.apartmentname);
                  setmobilenumber(address?.mobilenumber);
                  handleShow();
                  // setdelivaryaddress("");
                }}
                style={{ cursor: "pointer" }}
              >
                Change:
                <MdOutlineEditLocationAlt
                  style={{ color: "#F81D0F", fontSize: "18px" }}
                />
              </span>
            </div>

            <div>
              <div className="d-flex">
                {address?.name},{" "}
                {addresstype == "apartment" ? `${address?.flatno},` : ""}{" "}
                {addresstype == "apartment" ? `${address?.towerName},` : ""}
                {address?.mobilenumber}
              </div>
            </div>
          </div>

          <div>
            {Cutlery ? (
              <>
                <Button
                  variant=""
                  style={{
                    width: "100%",
                    backgroundColor: "#F81D0F",
                    color: "white",
                  }}
                  onClick={() => placeorder()}
                  className="placeorder"
                >
                  Continue to Pay |{" "}
                  {Cutlery ? (
                    <b>
                      ₹{" "}
                      {(
                        calculateTaxPrice +
                        subtotal +
                        Cutlery +
                        (delivarychargetype || 0) -
                        discountWallet -
                        coupon
                      ).toFixed(2)}
                    </b>
                  ) : (
                    <b>
                      ₹{" "}
                      {(
                        calculateTaxPrice +
                        subtotal +
                        delivarychargetype -
                        discountWallet -
                        coupon
                      ).toFixed(2)}
                    </b>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant=""
                  style={{
                    width: "100%",
                    backgroundColor: "#F81D0F",
                    color: "white",
                  }}
                  className="placeorder"
                  onClick={() => placeorder()}
                >
                  Continue to Pay |{" "}
                  {Cutlery ? (
                    <b>
                      ₹{" "}
                      {(
                        calculateTaxPrice +
                        subtotal +
                        Cutlery +
                        (delivarychargetype || 0) -
                        discountWallet -
                        coupon
                      ).toFixed(2)}
                    </b>
                  ) : (
                    <b>
                      ₹{" "}
                      {(
                        calculateTaxPrice +
                        subtotal +
                        (delivarychargetype || 0) -
                        discountWallet -
                        coupon
                      ).toFixed(2)}
                    </b>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>

      {/* New address  */}
      <Modal show={show} style={{ zIndex: "99999" }}>
        <Modal.Header>
          <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {addresstype === "apartment" ? (
              <select
                value={apartmentname}
                onChange={(e) => getSelectedAddress(e.target.value)}
                className="vi_0 slot"
                style={{
                  color: "black",
                  width: "180px",
                  backgroundColor: "transparent",
                }}
              >
                <option value="" style={{ color: "black" }} className="option">
                  Select Apartment
                </option>
                {apartmentdata?.map((data, index) => (
                  <option
                    value={data?.Apartmentname}
                    style={{ color: "black" }}
                    className="option"
                    // onClick={()=>setpincode(data?.pincode)}
                  >
                    {data?.Apartmentname}
                  </option>
                ))}
              </select>
            ) : (
              <select
                value={apartmentname}
                onChange={(e) => getSelectedAddress(e.target.value)}
                className="vi_0 slot"
                style={{
                  color: "black",
                  width: "180px",
                  backgroundColor: "transparent",
                }}
              >
                <option value="" style={{ color: "black" }} className="option">
                  Select Corporate
                </option>
                {corporatedata?.map((data, index) => (
                  <option
                    value={data?.Apartmentname}
                    style={{ color: "black" }}
                    className="option"
                  >
                    {data?.Apartmentname}
                  </option>
                ))}
              </select>
            )}

            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              style={{ marginTop: "18px" }}
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
            <Form.Control
              type="number"
              placeholder="Enter Phone Number"
              style={{ marginTop: "18px" }}
              value={mobilenumber}
              onChange={(e) => setmobilenumber(e.target.value)}
            />
            {addresstype === "apartment" ? (
              <Form.Control
                type="text"
                value={flat}
                placeholder="Enter Flat No"
                style={{ marginTop: "18px" }}
                onChange={(e) => setFlat(e.target.value)}
              />
            ) : null}

            {addresstype === "apartment" ? (
              <Form.Control
                type="text"
                value={towerName}
                placeholder="Enter tower name "
                style={{ marginTop: "18px" }}
                onChange={(e) => setTowerName(e.target.value)}
              />
            ) : null}
            <Button
              variant=""
              className="modal-add-btn2"
              style={{ width: "100%", marginTop: "24px", textAlign: "center" }}
              onClick={() => Handeledata()}
            >
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* price brakup  */}
      <Modal show={show1} onHide={handleClose1} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title>Price Breakups </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div>
              <h6>
                <b>Bill Details</b>
              </h6>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Checkout;
