import React, { useContext, useEffect, useMemo, useState } from "react";
import { Card, Carousel, Container } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa";
import { Button, Dropdown, Form, InputGroup, Modal } from "react-bootstrap";
import { FaPlus, FaMinus, FaSquareWhatsapp } from "react-icons/fa6";
import "../Styles/Home.css";
import Banner from "./Banner";
import { useNavigate } from "react-router-dom";
import { BsCart3 } from "react-icons/bs";
import { HiMiniShoppingBag } from "react-icons/hi2";
import axios from "axios";
import { MdArrowBackIosNew } from "react-icons/md";
import { Drawer } from "antd";
import { IoTriangle } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ApartmentIcon from "@mui/icons-material/Apartment";
import swal from "sweetalert";
import CoinBalance from "./CoinBalance";
import Lottie from "lottie-react";
import partybomb from "./../assets/Animation - 1741012219735.json";
import { WalletContext } from "../WalletContext";

const Home = ({ selectArea, setSelectArea, Carts, setCarts }) => {
  const navigate = useNavigate();
  const { wallet, transactions, loading, walletSeting } =
    useContext(WalletContext);

  const [loader, setloader] = useState(false);
  const address = JSON.parse(localStorage.getItem("address"));
  const addresstype = localStorage.getItem("addresstype");

  const [corporatedata, setcorporatedata] = useState([]);
  const getcorporate = async () => {
    try {
      let res = await axios.get(
        "http://3.110.45.67:7013/api/admin/getcorporate"
      );
      if (res.status === 200) {
        setcorporatedata(res.data.corporatedata);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getcorporate();
  }, []);

  const [cartCount, setCartCount] = useState(0);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const handleShow = () => {
    setCartCount(cartCount + 1);
    setIsCartVisible(true);
  };

  const [foodData, setFoodData] = useState({});
  const [open, setOpen] = useState(false);

  const showDrawer = (food) => {
    setFoodData(food);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const [show4, setShow4] = useState(false);

  const handleShow4 = () => setShow4(true);
  const handleClose4 = () => setShow4(false);

  const [show3, setShow3] = useState(false);

  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => {
    handleClose4();
    setShow3(true);
  };

  // otp
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [fooditemdata, setfooditemdata] = useState([]);
  const getfooditems = async () => {
    setloader(true);
    try {
      let res = await axios.get(
        "http://3.110.45.67:7013/api/admin/getFoodItemsUnBlocks"
      );
      if (res.status === 200) {
        setfooditemdata(res.data.data);
        setloader(false);
      }
    } catch (error) {
      setloader(false);
      swal({
        title: "Error",
        text: "Check your internet connection!",
        icon: "error",
        buttons: "Try Again",
      });
      console.log(error);
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const addCart1 = async (item) => {
    if (item?.Remainingstock == 0 || !item?.Remainingstock) {
      return alert("Product is out of stock");
    }
    // console.log("dfdf", item);
    const newCartItem = {
      foodItemId: item?._id,
      price: item?.foodprice,
      totalPrice: item?.foodprice,
      image: item?.Foodgallery[0]?.image2,
      unit: item?.unit,
      foodname: item?.foodname,
      quantity: item?.quantity,
      Quantity: 1,
      gst: item?.gst,
      discount: item?.discount,
      foodcategory: item?.foodcategory,
      remainingstock: item?.Remainingstock,
    };

    // Retrieve existing cart data or initialize as an empty array
    const cart = JSON.parse(localStorage.getItem("cart"));
    const cartArray = Array.isArray(cart) ? cart : [];

    // Check if item already exists to avoid duplicates
    const itemIndex = cartArray.findIndex(
      (cartItem) => cartItem?.foodItemId === newCartItem?.foodItemId
    );

    if (itemIndex === -1) {
      cartArray.push(newCartItem); // Only add if it doesn't already exist

      localStorage.setItem("cart", JSON.stringify(cartArray));

      setCarts(cartArray);
      // window.location.reload();
      handleShow();
    } else {
      alert("Item is already in cart");
    }
  };

  const [apartmentdata, setapartmentdata] = useState([]);
  const getapartmentd = async () => {
    try {
      let res = await axios.get(
        "http://3.110.45.67:7013/api/admin/getapartment"
      );
      if (res.status === 200) {
        setapartmentdata(res.data.corporatedata);
        // console.log("apartment", res.data.corporatedata);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getapartmentd();
    // console.log("apartmentdata",apartmentdata)
  }, []);

  const [cart, setCart] = useState([]);

  // Fetch data from local storage on component mount and whenever cart changes
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const addonedCarts = async () => {
      try {
        let res = await axios.post("http://3.110.45.67:7013/api/cart/addCart", {
          userId: user?._id,
          items: storedCart,
          lastUpdated: Date.now,
          username: user?.Fname,
          mobile: user?.Mobile,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (Carts && Carts.length > 0) {
      addonedCarts();
    }

    // setCart(Carts)
  }, [JSON.stringify(Carts)]);

  // Function to update local storage and state
  const updateCartData = (updatedCart) => {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart); // Update state to re-render the component
  };

  const increaseQuantity = (foodItemId) => {
    const updatedCart = Carts.map((item) => {
      if (item.foodItemId === foodItemId) {
        if (item.Quantity < item.remainingstock) {
          item.Quantity += 1;
          item.totalPrice = item.price * item.Quantity;
        } else {
          alert("No more stock available!");
        }
      }
      return item;
    });
    updateCartData(updatedCart);
  };

  // Function to decrease quantity
  const decreaseQuantity = (foodItemId) => {
    const updatedCart = Carts.map((item) => {
      if (item.foodItemId === foodItemId) {
        if (item.Quantity === 0) {
          alert("Minimum quantity reached!");
        }
        if (item.Quantity > 0) {
          item.Quantity -= 1;
          item.totalPrice = item.price * item.Quantity;
        } else {
          alert("Minimum quantity reached!");
        }
      }
      return item;
    }).filter((item) => item.Quantity > 0);
    updateCartData(updatedCart);
  };

  useEffect(() => {
    if (Carts?.length > 0) {
      handleShow();
    }
  }, []);

  const d = new Date();
  let subtotal = 0;
  let total = 0;
  let tax = 0;

  if (Carts?.length !== 0) {
    for (let i = 0; i < Carts?.length; i++) {
      subtotal =
        subtotal +
        (Carts[i]?.totalPrice * Carts[i]?.Quantity -
          Math.round(
            Number(Carts[i]?.price * Carts[i]?.Quantity) * (Carts[i]?.gst / 100)
          ));
      total = total + Carts[i]?.totalPrice * Carts[i]?.Quantity;
      tax =
        tax +
        Math.round(
          Number(Carts[i]?.price * Carts[i]?.Quantity) * (Carts[i]?.gst / 100)
        );
    }
  }
  const goToCheckout = () => {
    const address =
      addresstype == "apartment"
        ? JSON.parse(localStorage.getItem("address"))
        : JSON.parse(localStorage.getItem("coporateaddress"));
    if (!address) {
      return alert(`Please Select ${addresstype}`);
    }

    navigate("/checkout", {
      state: {
        newsubtotal,
        total,
        tax,
      },
    });
  };

  const cutoffTime = new Date();
  cutoffTime.setHours(12, 30, 0);
  const [gifUrl, setGifUrl] = useState("");
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   const checkTime = () => {
  //     const now = new Date();
  //     const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes

  //     // Define the time ranges in minutes
  //     const lunchStart = 8 * 60; // 8:00 AM
  //     const lunchPrepStart = 9 * 60; // 9:00 AM
  //     const lunchCookingStart = 11 * 60; // 11:00 AM
  //     const lunchEnd = 12 * 60 + 30; // 12:30 PM

  //     const dinnerStart = 15 * 60; // 3:00 PM
  //     const dinnerPrepStart = 16 * 60 + 30; // 4:30 PM
  //     const dinnerCookingStart = 18 * 60; // 6:00 PM
  //     const dinnerEnd = 20 * 60 + 30; // 8:30 PM

  //     if (
  //       currentTimeInMinutes >= lunchStart &&
  //       currentTimeInMinutes < lunchPrepStart
  //     ) {
  //       setGifUrl("sourcing.gif");
  //       setMessage(
  //         "Sourcing Quality Ingredients. Orders placed now will be delivered at your selected slot."
  //       );
  //     } else if (
  //       currentTimeInMinutes >= lunchPrepStart &&
  //       currentTimeInMinutes < lunchCookingStart
  //     ) {
  //       setGifUrl("cuttingveg.gif");
  //       setMessage(
  //         "Preparing ingredients. Orders placed now will be delivered at your selected slot."
  //       );
  //     } else if (
  //       currentTimeInMinutes >= lunchCookingStart &&
  //       currentTimeInMinutes < lunchEnd
  //     ) {
  //       setGifUrl("cookinggif.gif");
  //       setMessage(
  //         "Cooking your meal. Orders placed now will be delivered at your selected slot."
  //       );
  //     } else if (
  //       currentTimeInMinutes >= dinnerStart &&
  //       currentTimeInMinutes < dinnerPrepStart
  //     ) {
  //       setGifUrl("sourcing.gif");
  //       setMessage(
  //         "Sourcing Quality Ingredients. Orders placed now will be delivered at your selected slot."
  //       );
  //     } else if (
  //       currentTimeInMinutes >= dinnerPrepStart &&
  //       currentTimeInMinutes < dinnerCookingStart
  //     ) {
  //       setGifUrl("cuttingveg.gif");
  //       setMessage(
  //         "Preparing ingredients. Orders placed now will be delivered at your selected slot."
  //       );
  //     } else if (
  //       currentTimeInMinutes >= dinnerCookingStart &&
  //       currentTimeInMinutes <= dinnerEnd
  //     ) {
  //       setGifUrl("cookinggif.gif");
  //       setMessage(
  //         "Cooking your meal. Orders placed now will be delivered at your selected slot."
  //       );
  //     } else if (
  //       (currentTimeInMinutes > lunchEnd &&
  //         currentTimeInMinutes < dinnerStart) ||
  //       currentTimeInMinutes > dinnerEnd ||
  //       currentTimeInMinutes < lunchStart
  //     ) {
  //       setGifUrl("Closed.gif");
  //       setMessage(
  //         "Orders are currently closed. Lunch: 8:00 AM - 12:30 PM. Dinner: 3:00 PM - 8:30 PM."
  //       );
  //     }
  //   };

  //   // Check the time initially and set up an interval to check every minute
  //   checkTime();
  //   const interval = setInterval(checkTime, 60000);

  //   // Clean up the interval on component unmount
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes

      // Define the time ranges in minutes
      const lunchStart = 8 * 60; // 8:00 AM
      const lunchPrepStart = 9 * 60; // 9:00 AM
      const lunchCookingStart = 11 * 60; // 11:00 AM
      const lunchEnd = 12 * 60 + 30; // 12:30 PM

      const dinnerStart = 15 * 60; // 3:00 PM
      const dinnerPrepStart = 16 * 60 + 30; // 4:30 PM
      const dinnerCookingStart = 18 * 60; // 6:00 PM
      const dinnerEnd = 20 * 60 + 30; // 8:30 PM

      const shopCloseTime = 22 * 60; // 10:00 PM

      // Free time range for instant delivery
      const freeTimeStart = 12 * 60 + 30; // 12:30 PM
      const freeTimeEnd = 15 * 60; // 3:00 PM

      if (
        currentTimeInMinutes >= lunchStart &&
        currentTimeInMinutes < lunchPrepStart
      ) {
        setGifUrl("sourcing.gif");
        setMessage(
          "Sourcing Quality Ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= lunchPrepStart &&
        currentTimeInMinutes < lunchCookingStart
      ) {
        setGifUrl("cuttingveg.gif");
        setMessage(
          "Preparing ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= lunchCookingStart &&
        currentTimeInMinutes < lunchEnd
      ) {
        setGifUrl("cookinggif.gif");
        setMessage(
          "Cooking your meal. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        (currentTimeInMinutes >= freeTimeStart &&
          currentTimeInMinutes < freeTimeEnd) ||
        (currentTimeInMinutes > dinnerEnd &&
          currentTimeInMinutes <= shopCloseTime)
      ) {
        setGifUrl("instantdelivery.gif");
        setMessage(
          "Instant Delivery available now! Place your order and get it delivered immediately."
        );
      } else if (
        currentTimeInMinutes >= dinnerStart &&
        currentTimeInMinutes < dinnerPrepStart
      ) {
        setGifUrl("sourcing.gif");
        setMessage(
          "Sourcing Quality Ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= dinnerPrepStart &&
        currentTimeInMinutes < dinnerCookingStart
      ) {
        setGifUrl("cuttingveg.gif");
        setMessage(
          "Preparing ingredients. Orders placed now will be delivered at your selected slot."
        );
      } else if (
        currentTimeInMinutes >= dinnerCookingStart &&
        currentTimeInMinutes <= dinnerEnd
      ) {
        setGifUrl("cookinggif.gif");
        setMessage(
          "Cooking your meal. Orders placed now will be delivered at your selected slot."
        );
      } else if (currentTimeInMinutes >= shopCloseTime) {
        setGifUrl("Closed.gif");
        setMessage(
          "The shop is now closed. Operating hours: Lunch: 8:00 AM - 12:30 PM, Dinner: 3:00 PM - 10:00 PM."
        );
      } else {
        setGifUrl("Closed.gif");
        setMessage(
          "Orders are currently closed. Lunch: 8:00 AM - 12:30 PM. Dinner: 3:00 PM - 10:00 PM."
        );
      }
    };

    // Check the time initially and set up an interval to check every minute
    checkTime();
    const interval = setInterval(checkTime, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  //Registration modal
  const [Fname, setFname] = useState("");
  const [Mobile, setMobile] = useState("");
  const [Address, setAddress] = useState("");
  const [Flatno, setFlatno] = useState("");
  const [OTP, setOTP] = useState(["", "", "", ""]);
  const [PasswordShow, setPasswordShow] = useState(false);
  const [admindata, setadmindata] = useState({});

  const userLogin = async () => {
    if (!Mobile) {
      return alert("Enter Your Mobile Number");
    }
    setloader(true);
    try {
      const config = {
        url: "/User/Sendotp",
        method: "post",
        baseURL: "http://3.110.45.67:7013/api",

        headers: { "content-type": "application/json" },
        data: {
          Mobile: Mobile,
        },
      };

      const res = await axios(config);
      if (res.status === 401) {
        alert("Invalid Mobile Number");
      }
      if (res.status === 402) {
        alert("Error sending OTP");
      }
      if (res.status === 200) {
        setloader(false);
        handleClose3();
        handleShow2();
      }
    } catch (error) {
      setloader(false);
      console.log("error", error.message);
    }
  };

  function validateIndianMobileNumber(mobileNumber) {
    // Regex to validate Indian mobile number
    const regex = /^[6-9]\d{9}$/;

    // Test the mobile number against the regex
    return regex.test(mobileNumber);
  }

  // const handleRegister = async () => {
  //   if (!Fname) {
  //     return alert("Enter Your Name");
  //   }
  //   if (!Mobile) {
  //     return alert("Enter Your Mobile Number");
  //   }
  //   if (!Address) {
  //     return alert("Enter Your Address");
  //   }
  //   if (!Flatno) {
  //     return alert("Enter Your Flat Number");
  //   }
  //   if (!validateIndianMobileNumber(Mobile)) {
  //     return alert("Invalid mobile number");
  //   }
  //   try {
  //     const config = {
  //       url: "/User/registercustomer",
  //       method: "post",
  //       baseURL: "http://3.110.45.67:7013/api",

  //       headers: { "content-type": "application/json" },
  //       data: {
  //         Fname: Fname,
  //         Address: Address,
  //         Mobile: Mobile,
  //         Flatno: Flatno,
  //       },
  //       maxRedirects: 0,
  //     };
  //     let res = await axios(config);
  //     if (res.status === 200) {
  //       saveSelectedAddress();
  //       localStorage.setItem("user", JSON.stringify(res.data.details));
  //       setFname(" ");
  //       setAddress(" ");
  //       setFlatno(" ");
  //       handleClose4();

  //       handleShow3();
  //     }
  //     if (res.status === 302) {
  //       alert(res.data.message);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       if (error.response.status === 302) {
  //         // Handle 302 as a custom case
  //         alert(error.response.data.message || "Redirection occurred");
  //       } else {
  //         // Handle other errors
  //         alert(error.response.data.message || "An error occurred");
  //       }
  //     } else if (error.request) {
  //       alert("No response from the server. Please try again.");
  //     } else {
  //       alert(error.message);
  //     }
  //   }
  // };

  // Verify OTP
  const verifyOTP = async () => {
    try {
      if (!OTP) {
        return alert("Enter a valid OTP");
      }
      const config = {
        url: "User/mobileotpverification",
        method: "post",
        baseURL: "http://3.110.45.67:7013/api/",
        header: { "content-type": "application/json" },
        data: {
          Mobile: Mobile,
          otp: OTP,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        setadmindata(res.data.success);
        localStorage.setItem("user", JSON.stringify(res.data.details));
        alert("OTP verified successfully");
        if (!address) {
          handleClose2();
          handleClose3();
          return navigate("/home");
        }
        navigate("/home");
        handleClose2();
        setOTP("");
        setMobile(" ");
      }
    } catch (error) {
      // console.log(error);
      alert(error.response.data.error);
    }
  };

  const newsubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + Number(item?.price) * Number(item?.Quantity);
    }, 0);
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + Number(item?.Quantity);
    }, 0);
  }, [cart]);

  useEffect(() => {
    getfooditems();
  }, [cart]);

  return (
    <div>
      <ToastContainer />

      <div style={{ marginTop: "20px" }}>
        <Banner
          selectArea={selectArea}
          setSelectArea={setSelectArea}
          Carts={Carts}
        />
      </div>
      {transactions?.length > 0 && (
        <CoinBalance wallet={wallet} transactions={transactions} />
      )}

      <Container>
        <div className="maincontainer ">
          <div
            className="d-flex gap-3 mb-2 messageDiv  rounded-2"
            style={{ backgroundColor: "white", padding: "5px" }}
          >
            <div>
              <img
                src={`Assets/${gifUrl}`}
                alt="fdfdfds"
                className="praparing-food"
              />
            </div>

            <div>
              <div className="prepare-food-text">{message}</div>
            </div>
          </div>
        </div>
        {loader ? (
          <div
            className="d-flex justify-content-center align-item-center"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <div class="lds-ripple">
              <div></div>
              <div></div>
            </div>
            {/* <Lottie animationData ={partybomb} /> */}
          </div>
        ) : null}
        {loader ? (
          <div
            className="d-flex justify-content-center align-item-center"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 9999,
            }}
          >
            <Lottie animationData={partybomb} />
          </div>
        ) : null}
        <div className="maincontainer mt-2">
          <div className="mobile-product-box " style={{ marginBottom: "70px" }}>
            <div className="d-flex gap-1 mb-2 flex-column">
              <div className="row ">
                {fooditemdata?.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="col-6 col-md-6 mb-2 d-flex justify-content-center  " // Adjusting to show 2 items per row
                    >
                      <div className="mobl-product-card">
                        <div className="productborder">
                          <div className="parentdiv">
                            <div className="productprice ">
                              <b>
                                <span
                                  style={{
                                    fontSize: "25px",
                                    marginRight: "2px",
                                  }}
                                >
                                  ₹
                                </span>
                                {item?.foodprice}
                              </b>
                            </div>
                            <div className="shadowdiv"></div>
                          </div>

                          <div className="prduct-box rounded-1 ">
                            <div
                              onClick={() => showDrawer(item)}
                              className="imagebg"
                            >
                              <div className="graybg"></div>
                              <img
                                src={`http://3.110.45.67:7013/Products/${item?.Foodgallery[0]?.image2}`}
                                alt=""
                                className="mbl-product-img"
                              />
                            </div>
                          </div>
                          {item?.Remainingstock > 0 ? (
                            <div className="parentdivqty">
                              <div className="quantity ">
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                  <b>
                                    <span
                                      style={{
                                        fontSize: "14px",
                                        marginRight: "2px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      {" "}
                                      {item?.Remainingstock} Plates Left
                                    </span>
                                  </b>
                                </div>
                              </div>
                              <div className="shadowdiv2"></div>
                            </div>
                          ) : (
                            <div className="parentdivqty">
                              <div className="quantity ">
                                <div className="h-100 d-flex justify-content-center align-items-center">
                                  <b>
                                    <span
                                      style={{
                                        fontSize: "18px",
                                        marginRight: "2px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      SOLD OUT
                                    </span>
                                  </b>
                                </div>
                              </div>
                              <div className="shadowdiv2"></div>
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-center"></div>
                        <div className="d-flex gap-2 mt-2">
                          {item?.foodcategory === "Veg" ? (
                            <div className="veg"></div>
                          ) : item?.foodcategory === "Nonveg" ? (
                            <div className="Nonveg"></div>
                          ) : (
                            <div className="Egg"></div>
                          )}
                          <div>
                            <div className=" align-items-center mbl-product-main ">
                              <div className="mbl-product-name mb-1 text-truncate">
                                {" "}
                                {item?.foodname}
                              </div>
                            </div>

                            <div style={{ fontSize: "12px" }}>{item?.unit}</div>
                          </div>
                        </div>

                        <div className="mt-2  d-flex justify-content-center">
                          {!Carts?.some(
                            (ele) => ele?.foodItemId == item?._id
                          ) ? (
                            gifUrl === "Closed.gif" ? (
                              <Button
                                variant=""
                                className="add-to-cart-btn rounded-1"
                                onClick={() => addCart1(item)}
                                disabled="true"
                              >
                                Add To Cart
                              </Button>
                            ) : (
                              <Button
                                variant=""
                                className="add-to-cart-btn rounded-1"
                                onClick={() => addCart1(item)}
                                disabled={
                                  item?.Remainingstock <= 0 ||
                                  !item?.Remainingstock
                                }
                              >
                                Add To Cart
                              </Button>
                            )
                          ) : (
                            Carts?.map((data) => {
                              if (data?.foodItemId === item?._id) {
                                return data?.Quantity > 0 ? (
                                  <Button
                                    variant=""
                                    className="add-to-cart-btn rounded-1 increaseBtn"
                                  >
                                    <div
                                      className="faplus"
                                      onClick={() =>
                                        decreaseQuantity(item?._id)
                                      }
                                    >
                                      <FaMinus />
                                    </div>
                                    <div className="faQuantity ">
                                      {data?.Quantity}
                                    </div>
                                    <div
                                      className="faplus"
                                      onClick={() =>
                                        increaseQuantity(item?._id)
                                      }
                                    >
                                      <FaPlus />
                                    </div>
                                  </Button>
                                ) : gifUrl === "Closed.gif" ? (
                                  <Button
                                    variant=""
                                    className="add-to-cart-btn rounded-1"
                                    onClick={() => addCart1(item)}
                                    disabled="true"
                                  >
                                    Add To Cart
                                  </Button>
                                ) : (
                                  <Button
                                    variant=""
                                    className="add-to-cart-btn rounded-1"
                                    onClick={() => addCart1(item)}
                                    disabled={item?.Remainingstock <= 0}
                                  >
                                    Add To Cart
                                  </Button>
                                );
                              }
                              return null;
                            }) || (
                              <Button
                                variant=""
                                className="add-to-cart-btn rounded-1"
                                onClick={() => addCart1(item)}
                                disabled={item?.Remainingstock <= 0}
                              >
                                Add To Cart
                              </Button>
                            )
                          )}
                        </div>
                        {Carts?.map((data) => {
                          if (data?.Quantity > 0) {
                            return (
                              <div className="cartbutton">
                                <div className="cartbtn">
                                  <div className="d-flex justify-content-between ">
                                    <div className="d-flex gap-0">
                                      <div>
                                        {totalQuantity} Items | ₹{newsubtotal}
                                      </div>
                                    </div>

                                    {user ? (
                                      <>
                                        <a
                                          onClick={() => {
                                            goToCheckout();
                                          }}
                                          style={{
                                            color: "unset",
                                            textDecoration: "none",
                                          }}
                                        >
                                          <div className="d-flex gap-1 align-content-center ">
                                            <HiMiniShoppingBag size={25} />
                                            <div>View Cart</div>
                                          </div>
                                        </a>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          className="d-flex gap-2 viewcartbtn"
                                          onClick={() => {
                                            const address =
                                              addresstype == "apartment"
                                                ? JSON.parse(
                                                    localStorage.getItem(
                                                      "address"
                                                    )
                                                  )
                                                : JSON.parse(
                                                    localStorage.getItem(
                                                      "coporateaddress"
                                                    )
                                                  );
                                            if (!address) {
                                              return alert(
                                                `Please select your ${addresstype}`
                                              );
                                            }
                                            handleShow3();
                                          }}
                                        >
                                          <HiMiniShoppingBag size={25} />
                                          <div>View Cart</div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          } else {
                            return <></>;
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* <Modal
        show={show4}
        backdrop="static"
        onHide={handleClose4}
        style={{ zIndex: "99999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Register Here</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              placeholder="Enter Full Name"
              style={{ marginTop: "18px" }}
              onChange={(e) => setFname(e.target.value)}
            />
            <Form.Control
              type="number"
              placeholder="Enter Phone Number"
              style={{ marginTop: "18px" }}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Enter Flat No,Building Name"
              style={{ marginTop: "18px" }}
              onChange={(e) => setFlatno(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Tower/Phase/Block"
              style={{ marginTop: "18px" }}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Button
              variant=""
              style={{
                width: "100%",
                marginTop: "24px",
                backgroundColor: "#F81D0F",
                color: "white",
                textAlign: "center",
              }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </Form>
          <h6 className="text-center">Or</h6>
          <Button
            variant=""
            style={{
              width: "100%",
              backgroundColor: "#F81D0F",
              color: "white",
              textAlign: "center",
            }}
            onClick={handleShow3}
          >
            Login
          </Button>
        </Modal.Body>
      </Modal> */}

      <Modal show={show3} backdrop="static" onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-1">
            <FaLock color="orangered" /> <span>Welcome to Dailydish</span>{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="login-whatsappwithicon">
              <FaSquareWhatsapp size={42} color="green" />

              <Form.Control
                type="number"
                placeholder="Enter Your WhatsApp Number"
                value={Mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>

            <Button
              variant=""
              style={{
                width: "100%",
                marginTop: "24px",
                backgroundColor: "orangered",
                color: "white",
                textAlign: "center",
              }}
              onClick={() => {
                if (!validateIndianMobileNumber(Mobile)) {
                  return alert("Invalid mobile number");
                }
                userLogin();
              }}
              // onClick={() => navigate("/checkout")}
            >
              Send otp
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* OTP  */}
      <Modal
        show={show2}
        onHide={handleClose2}
        size="sm"
        style={{
          zIndex: "99999",
          position: "absolute",
          top: "30%",
          left: "0%",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span style={{ fontSize: "13px" }}>
            An OTP has been sent to your Phone Number
          </span>
          <div className="d-flex gap-1 mt-3 mb-3">
            <InputGroup className="mb-2" style={{ background: "white" }}>
              <Form.Control
                type={PasswordShow ? "text" : "password"}
                className="login-input"
                placeholder="Enter OTP"
                aria-describedby="basic-addon1"
                // value={OTP}
                onChange={(e) => setOTP(e.target.value)}
              />
              <Button
                variant=""
                style={{ borderRadius: "0px", border: "1px solid black" }}
                onClick={() => setPasswordShow(!PasswordShow)}
                className="passbtn"
              >
                {PasswordShow ? <FaEye /> : <FaEyeSlash />}
              </Button>
            </InputGroup>
          </div>
          <div>
            <Button
              variant=""
              className="modal-add-btn w-100 text-center"
              onClick={verifyOTP}
            >
              Continue
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Drawer
        placement="bottom"
        closable={true}
        onClose={onClose}
        open={open}
        key="bottom"
        height={500}
      >
        <div className="foodItem">
          {foodData?.Foodgallery?.length > 0 && (
            <img
              src={`http://3.110.45.67:7013/Products/${foodData.Foodgallery[0].image2}`}
              alt=""
              className="img"
            />
          )}
          {foodData?.foodcategory === "Nonveg" ? (
            <IoTriangle style={{ color: "red" }} />
          ) : foodData?.foodcategory === "Veg" ? (
            <IoTriangle style={{ color: "green" }} />
          ) : (
            <IoTriangle style={{ color: "yellow" }} />
          )}
          <div className="fs-5 mt-3"> {foodData?.foodname} </div>
          {foodData?.fooddescription}
          <br />
          <div className="fs-6"> ₹{foodData?.foodprice} </div>
          <div className="mt-2">
            {Carts.map((data) => {
              <Button
                variant=""
                className="add-to-cart-btn mt-2"
                onClick={() => addCart1(foodData)}
              >
                {data?.Quantity > 0 ? (
                  <div style={{ width: "100%" }}>- 2 +</div>
                ) : (
                  <div style={{ width: "100%" }}>Add To Cart</div>
                )}
              </Button>;
            })}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Home;
