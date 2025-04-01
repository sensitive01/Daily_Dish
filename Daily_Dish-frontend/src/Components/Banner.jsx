import React, { useState, useEffect, useMemo } from "react";
import "../Styles/Banner.css";

import { Button, Modal, Form, Dropdown, InputGroup } from "react-bootstrap";
import { FaUser, FaEye, FaEyeSlash, FaWallet } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { SelectPicker } from "rsuite";
import { MdApartment, MdBuild } from "react-icons/md";
import { RiBuilding2Fill } from "react-icons/ri";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import ApartmentIcon from "@mui/icons-material/Apartment"; // Icon to represent apartments
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Nav from "react-bootstrap/Nav";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlineLogout } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { IoLogoYoutube } from "react-icons/io5";
import { ImSpoonKnife } from "react-icons/im";
import Offcanvas from "react-bootstrap/Offcanvas";
import { IoMdHeart } from "react-icons/io";
import { GrDocumentUser } from "react-icons/gr";

import swal from "sweetalert";
import useId from "@mui/material/utils/useId";
import { FaSquareWhatsapp } from "react-icons/fa6";
// import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

const Banner = ({ selectArea, setSelectArea, Carts }) => {
  let addresstype = localStorage.getItem("addresstype");
  let corporateaddress = JSON.parse(localStorage.getItem("coporateaddress"));

  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate("");
  const [Fname, setFname] = useState("");
  const [Address, setAddress] = useState("");
  const [Flatno, setFlatno] = useState("");
  const [OTP, setOTP] = useState(["", "", "", ""]);
  const [PasswordShow, setPasswordShow] = useState(false);
  //Address save modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [showCart, setShowCart] = useState(false);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => {
    handleClose4();
    setShow3(true);
  };

  const [show4, setShow4] = useState(false);
  const handleShow4 = () => setShow4(true);
  const handleClose4 = () => setShow4(false);

  const [show5, setShow5] = useState(false);

  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);
  const [show7, setShow7] = useState(false);
  const handleClose7 = () => setShow7(false);
  const handleShow7 = () => setShow7(true);
  const [Mobile, setMobile] = useState("");
  const userLogin = async () => {
    if (!Mobile) {
      return alert("Enter Your Mobile Number");
    }
    try {
      const config = {
        url: "/User/Sendotp",
        method: "post",
        baseURL: "http://100.25.233.42:7013/api",

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
        handleClose3();
        handleShow7();
      }
    } catch (error) {
      // console.log("error", error.message);
    }
  };

  const [show8, setShow8] = useState(false);

  const handleClose8 = () => setShow8(false);
  const handleShow8 = () => setShow8(true);

  const handleShowCart = () => setShowCart(true);

  const phoneNumber = "9845550715"; // Replace with your WhatsApp number
  const message = "Hello! I need assistance."; // Default message

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const logOut = () => {
    swal({
      title: "Yeah!",
      text: "Successfully Logged Out",
      icon: "success",
      button: "Ok!",
    });
    setTimeout(() => {
      window.location.assign("/");
    }, 5000);
    localStorage.clear();
    // localStorage.removeItem("user");
  };

  //OTP save modal
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  //integrating get method
  const [AddBanner, setAddBanner] = useState([]);
  const getAddBanner = async () => {
    try {
      let res = await axios.get(
        "http://100.25.233.42:7013/api/admin/getbanner"
      );
      if (res.status === 200) {
        setAddBanner(res.data.getbanner);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const [apartmentdata, setapartmentdata] = useState([]);
  const getapartmentd = async () => {
    try {
      let res = await axios.get(
        "http://100.25.233.42:7013/api/admin/getapartment"
      );
      if (res.status === 200) {
        setapartmentdata(res.data.corporatedata);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getapartmentd();
  }, []);
  const [corporatedata, setcorporatedata] = useState([]);
  const getcorporate = async () => {
    try {
      let res = await axios.get(
        "http://100.25.233.42:7013/api/admin/getcorporate"
      );
      if (res.status === 200) {
        setcorporatedata(res.data.corporatedata);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    getcorporate();
  }, []);

  const [storyLength, setStoryLength] = useState(0);

  useEffect(() => {
    const getAddWebstory = async () => {
      try {
        let res = await axios.get(
          "http://100.25.233.42:7013/api/admin/getstories"
        );
        if (res.status === 200) {
          setStoryLength(res.data.getbanner.length);
        }
      } catch (error) {
        // console.log(error);
      }
    };
    getAddWebstory();
  }, []);
  const address = JSON.parse(localStorage.getItem("address"));

  const Handeledata = (ab, def) => {
    try {
      if (ab) {
        if (!user) return handleShow3();
        let data = JSON.parse(ab);
        const addressData = {
          Address: data?.Address,
          Delivarycharge: data?.apartmentdelivaryprice,
          doordelivarycharge: data?.doordelivaryprice,
          apartmentname: data?.Apartmentname,
          pincode: data?.pincode,
          approximatetime: data?.approximatetime,
          prefixcode: data?.prefixcode,
          name: ab?.Name ? ab?.Name : "",
          flatno: ab?.fletNumber ? ab?.fletNumber : "",
          mobilenumber: ab?.Number ? ab?.Number : "",
          towerName: ab?.towerName ? ab?.towerName : "",
        };
        if (!def) {
          saveSelectedAddress(data);
        }

        if (addresstype === "apartment") {
          localStorage.setItem("address", JSON.stringify(addressData));
          // setAddress1(data);
        } else {
          localStorage.setItem("coporateaddress", JSON.stringify(addressData));
        }

        // Convert addressData to JSON string and store in localStorage

        setSelectArea(JSON.stringify(addressData));
        // window.location.reload();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  //Request Location
  const [Name, setName] = useState("");
  const [Number, setNumber] = useState("");
  const [ApartmentName, setApartmentName] = useState("");
  const [Message, setMessage] = useState("");

  function validateIndianMobileNumber(mobileNumber) {
    // Regex to validate Indian mobile number
    const regex = /^[6-9]\d{9}$/;

    // Test the mobile number against the regex
    return regex.test(mobileNumber);
  }

  const Requestaddress = async () => {
    try {
      if (!Name) {
        return alert("Please Add Your Name");
      }

      if (!Number) {
        return alert("Please Add Your Contact Number");
      }
      if (!ApartmentName) {
        return alert("Please Add Apartment Name");
      }
      if (!Message) {
        return alert("Please Add Your Address");
      }

      if (!validateIndianMobileNumber(Number)) {
        return alert("Invalid mobile number");
      }
      const config = {
        url: "User/EnquiryEnquiry",
        method: "post",
        baseURL: "http://100.25.233.42:7013/api/",
        header: { "content-type": "application/json" },
        data: {
          Name: Name,
          Number: Number,
          ApartmentName: ApartmentName,
          Message: Message,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        // alert("Location Add Request Sent. We'll Update You Soon..!");
        toast.success("Request Submitted Successfully.");
        handleClose2();
        setName("");
        setNumber("");
        setApartmentName("");
        setMessage("");
        // navigate("/home")
        // window.location.reload();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const currentTime = new Date();
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes(); // Convert time to minutes since midnight

  // Define time slots in minutes
  const openTime = 8 * 60; // 8:00 AM
  const lunchMenuEnd = 12 * 60 + 30; // 12:30 PM
  const lunchDeliveryEnd = 16 * 60; // 4:00 PM
  const dinnerMenuStart = 15 * 60; // 3:00 PM
  const dinnerMenuEnd = 22 * 60; // 10:00 PM
  const closeTime = 22 * 60; // 11:00 PM
  const shopCloseTime = 22 * 60; // 10:00 PM
  // Determine which message or menu to show
  let displayMessage = "";
  let timeShow = "";

  if (currentMinutes >= closeTime || currentMinutes < openTime) {
    // Before 8:00 AM or after 11:00 PM
    displayMessage = "Currently, we are closed";
    timeShow = "Ordering resumes at 08:00 AM.";
  } else if (currentMinutes >= openTime && currentMinutes <= lunchMenuEnd) {
    // Between 8:00 AM and 12:30 PM
    displayMessage = "Ordering Lunch";
    timeShow = "08:00 AM to 12:30 PM";
  } else if (
    currentMinutes > lunchMenuEnd &&
    currentMinutes < dinnerMenuStart
  ) {
    // Between 12:30 PM and 3:00 PM
    displayMessage = "Currently, Instant Delivery";
    timeShow = "Dinner ordering starts at 03:00 PM.";
  } else if (
    currentMinutes >= dinnerMenuStart &&
    currentMinutes <= dinnerMenuEnd
  ) {
    // Between 3:00 PM and 8:30 PM
    displayMessage = "Ordering Dinner";
    timeShow = "03:00 PM to 10:00 PM";
  } else {
    // Between 8:30 PM and 11:00 PM
    displayMessage = "Currently, we are closed";
    timeShow = "Ordering resumes at 08:00 AM.";
  }

  const verifyOTP = async () => {
    try {
      if (!OTP) {
        return alert("Enter a valid OTP");
      }
      const config = {
        url: "User/mobileotpverification",
        method: "post",
        baseURL: "http://100.25.233.42:7013/api/",
        header: { "content-type": "application/json" },
        data: {
          Mobile: Mobile,
          otp: OTP,
        },
      };
      const res = await axios(config);
      if (res.status === 200) {
        // setadmindata(res.data.success);
        localStorage.setItem("user", JSON.stringify(res.data.details));
        sessionStorage.setItem("user", JSON.stringify(res.data.details));
        alert("OTP verified successfully");
        window.location.reload();
      }
    } catch (error) {
      // console.log(error);
      alert(error.response.data.error);
    }
  };

  const [selectedAddress, setSelectedAddress] = useState({});

  const getSelectedAddress = async () => {
    try {
      let res = await axios.get(
        `http://100.25.233.42:7013/api/user/getSelectedAddressByUserIDAddType/${user?._id}/${addresstype}`
      );
      if (res.status === 200) {
        setSelectedAddress(res.data.getdata);

        // console.log("Selected Address",res.data.getdata);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getSelectedAddress();
    }
  }, []);

  useMemo(() => {
    if (addresstype == "apartment") {
      let am = apartmentdata.find(
        (ele) => ele?._id?.toString() == selectedAddress?.addressid
      );
      Handeledata(JSON.stringify({ ...am, ...selectedAddress }), "def");
    } else {
      Handeledata(
        JSON.stringify({
          ...corporatedata.find(
            (ele) => ele?._id?.toString() == selectedAddress?.addressid
          ),
          ...selectedAddress,
        }),
        "def"
      );
    }
  }, [selectedAddress]);

  const saveSelectedAddress = async (data) => {
    try {
      if (!user) return;
      let res = await axios.post(
        `http://100.25.233.42:7013/api/user/addressadd`,
        {
          Name: user?.Fname,
          Number: user?.Mobile,
          userId: user?._id,
          ApartmentName: data?.Apartmentname,
          addresstype: addresstype,
          addressid: data?._id,
        }
      );
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <div className="ban-container">
      <ToastContainer />

      <div className="mobile-banner">
        <div className="screen-2 mb-3">
          <div className="d-flex justify-content-between ">
            <div className="d-flex gap-3 profileCard">
              <div
                // data-bs-toggle="offcanvas"
                // data-bs-target="#offcanvasRight"
                // aria-controls="offcanvasRight"
                className="profileSection"
                onClick={handleShow8}
              >
                <FaUser className="mobile-user-screen2" />
              </div>
              {/* <div> */}
              <div className="mobile-user-screen2-title ">
                <div className="text-center">
                  <h6>
                    {displayMessage}
                    {/* Ordering Dinner */}
                  </h6>
                  {/* <p style={{ fontSize: "13px" }}> 03:00 pm to 08:00 pm</p> */}
                  <p style={{ fontSize: "13px" }}>{timeShow}</p>
                </div>
              </div>

              {/* </div> */}
              <div className="trustSection" onClick={handleShow5}>
                <img
                  src="/Assets/trustlogo.png"
                  alt=""
                  srcset=""
                  className="blinking-red-border"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="location-selector ">
            <div className="d-flex w-100 gap-1 align-items-center locationselector">
              {addresstype === "corporate" ? (
                <Autocomplete
                  className="w-100"
                  options={[...corporatedata].sort((a, b) =>
                    a?.Apartmentname.localeCompare(b?.Apartmentname)
                  )}
                  getOptionLabel={(option) => option?.Apartmentname || ""}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      Handeledata(JSON.stringify(newValue));
                    } else {
                      Handeledata(JSON.stringify({}));
                    }
                  }}
                  // value={
                  //   addresstype === "corporate"
                  //     ? corporateaddress?.apartmentname
                  //     : ""
                  // }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        corporateaddress?.apartmentname || "Select Corporate"
                      }
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#F81D0F",
                          },
                          "&:hover fieldset": {
                            borderColor: "#F81D0F",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#F81D0F",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#F81D0F",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#F81D0F",
                        },
                        "& .MuiInputBase-input": {
                          color: "#F81D0F",
                        },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{
                        color: "#F81D0F",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ApartmentIcon
                        style={{ marginRight: 8, color: "#F81D0F" }}
                      />{" "}
                      {/* {addresstype === "corporate" ? (selectArea):""} */}
                      {option?.Apartmentname}
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) =>
                    option?.id === value?.id
                  }
                />
              ) : (
                <>
                  <Autocomplete
                    className="w-100"
                    options={[...apartmentdata].sort((a, b) =>
                      a.Apartmentname.localeCompare(b.Apartmentname)
                    )}
                    getOptionLabel={(option) => option?.Apartmentname || ""}
                    onChange={(event, newValue) => {
                      Handeledata(JSON.stringify(newValue));
                    }}
                    // value={
                    //   addresstype === "apartment" ? address?.apartmentname : ""
                    // }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={address?.apartmentname || "Select Apartment"}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "#F81D0F", // outline color
                            },
                            "&:hover fieldset": {
                              borderColor: "#F81D0F", // outline color on hover
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#F81D0F", // outline color when focused
                            },
                          },
                          "& .MuiInputLabel-root": {
                            color: "#F81D0F", // default label color
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#F81D0F", // label color when focused
                          },
                          "& .MuiInputBase-input": {
                            color: "#F81D0F", // inside text color
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          color: "#F81D0F",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <ApartmentIcon
                          style={{ marginRight: 8, color: "#F81D0F" }}
                        />{" "}
                        {option?.Apartmentname}
                      </li>
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option?.id === value?.id
                    }
                  />
                </>
              )}

              <div className=" d-flex justify-content-center align-items-center">
                <Button
                  variant=""
                  // className="modal-add-btn"
                  onClick={() => handleShow2()}
                  style={{
                    fontSize: "12px",
                    padding: "10px",
                    height: "60px",
                    backgroundColor: "#F81D0F",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center",
                    fontWeight: 700,

                    // border:'1px solid black'
                  }}
                >
                  Add New
                </Button>
              </div>
            </div>

            <div>
              {addresstype === "corporate" ? (
                <>
                  <div>{corporateaddress?.apartmentname}</div>
                  <div>{corporateaddress?.Address}</div>
                </>
              ) : (
                <>
                  <div>{address?.apartmentname}</div>
                  <div>{address?.Address}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Request Aprtment modal */}
      <Modal show={show2} onHide={handleClose2} style={{ zIndex: "99999" }}>
        <Modal.Header closeButton>
          <Modal.Title>Request Add {addresstype}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              Requestaddress();
            }}
          >
            <Form.Control
              type="text"
              placeholder="Enter Name"
              style={{ marginTop: "18px" }}
              required
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control
              type="number"
              placeholder="Enter Contact Number"
              style={{ marginTop: "18px" }}
              required
              onChange={(e) => setNumber(e.target.value)}
              className="numberremove"
            />

            <Form.Control
              type="text"
              placeholder="Enter Apartment Name"
              style={{ marginTop: "18px" }}
              required
              onChange={(e) => setApartmentName(e.target.value)}
            />

            <Form.Control
              type="text"
              placeholder="Enter Address "
              style={{ marginTop: "18px" }}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              style={{
                width: "100%",
                marginTop: "24px",
                color: "white",
                textAlign: "center",
                height: "30px",
                borderRadius: "6px",
                backgroundColor: "orangered",
              }}
              type="submit"
            >
              Send Request
            </button>
          </Form>
        </Modal.Body>
      </Modal>

      <Offcanvas
        show={show8}
        onHide={handleClose8}
        className="custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Daily Dish</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Offcanvas show={show8} onHide={handleClose8}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Daily Dish</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav
                className="justify-content-end flex-grow-1 pe-1 ps-1 "
                style={{ alignItems: "start" }}
                onClick={handleClose8}
              >
                <Nav.Link href="/" className="tail-text w-100">
                  {user ? (
                    <>
                      <div className="side-nav-img ">
                        <Nav.Link href="/profile" className="tail-text ">
                          <div className="d-flex gap-3 align-items-center  ">
                            <div>
                              <span className="iocn">
                                <MdAccountCircle className="fabicon" />
                              </span>{" "}
                            </div>
                            <div className="textcolor">My Profile</div>
                          </div>
                        </Nav.Link>
                        <Nav.Link href="/wallet" className="tail-text ">
                          <div className="d-flex gap-3 align-items-center  ">
                            <div>
                              <span className="iocn">
                                <FaWallet className="fabicon" />
                              </span>{" "}
                            </div>
                            <div className="textcolor">My Wallet</div>
                          </div>
                        </Nav.Link>
                        <Nav.Link
                          href="/orders"
                          className="tail-text"
                          onClick={handleClose8}
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <div>
                              <span className="iocn">
                                <ImSpoonKnife className="fabicon" />{" "}
                              </span>{" "}
                            </div>
                            <div className="textcolor">My Orders </div>
                          </div>
                        </Nav.Link>
                        <Nav.Link
                          href={whatsappLink}
                          target="_blank"
                          className="tail-text "
                        >
                          <div className="d-flex gap-3 align-items-center ">
                            <div>
                              <span className="iocn">
                                <BiMessageDetail className="fabicon" />
                              </span>{" "}
                            </div>
                            <div className="textcolor">Chat with Us</div>
                          </div>
                        </Nav.Link>
                        <Nav.Link
                          href=""
                          onClick={() => navigate("/privacy-policy")}
                          className="tail-text"
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <div>
                              <span className="iocn">
                                <GrDocumentUser className="fabicon" />{" "}
                              </span>{" "}
                            </div>
                            <div className="textcolor">Privacy Policy </div>
                          </div>
                        </Nav.Link>

                        <Nav.Link
                          href=""
                          onClick={() => navigate("/termsconditions")}
                          className="tail-text"
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <div>
                              <span className="iocn">
                                <GrDocumentUser className="fabicon" />{" "}
                              </span>{" "}
                            </div>
                            <div className="textcolor">Terms & Conditions </div>
                          </div>
                        </Nav.Link>
                        <Nav.Link
                          href="/"
                          onClick={() => logOut()}
                          className="tail-text"
                        >
                          <div className="d-flex gap-3 align-items-center">
                            <div>
                              <span className="iocn">
                                <MdOutlineLogout className="fabicon" />{" "}
                              </span>{" "}
                            </div>
                            <div className="textcolor">Log Out </div>
                          </div>
                        </Nav.Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="side-nav-img">
                        <div>
                          <Nav.Link
                            href=""
                            className="tail-text"
                            onClick={handleShow3}
                          >
                            <div className="d-flex gap-3 align-items-center">
                              <div>
                                <span className="iocn">
                                  <FaLock className="fabicon" />{" "}
                                </span>{" "}
                              </div>
                              <div className="textcolor">Login </div>
                            </div>
                          </Nav.Link>
                          <Nav.Link href="/livestreams" className="tail-text">
                            <div className="d-flex gap-3 align-items-center">
                              <div>
                                <span className="iocn">
                                  <IoLogoYoutube className="fabicon" />{" "}
                                </span>{" "}
                              </div>
                              <div className="textcolor">Live Stream </div>
                            </div>
                          </Nav.Link>
                          <Nav.Link href={whatsappLink} className="tail-text ">
                            <div className="d-flex gap-3 align-items-center ">
                              <div>
                                <span className="iocn">
                                  <BiMessageDetail className="fabicon" />
                                </span>{" "}
                              </div>
                              <div className="textcolor">Chat with Us</div>
                            </div>
                          </Nav.Link>
                          <Nav.Link
                            href=""
                            onClick={() => navigate("/privacy-policy")}
                            className="tail-text"
                          >
                            <div className="d-flex gap-3 align-items-center">
                              <div>
                                <span className="iocn">
                                  <GrDocumentUser className="fabicon" />{" "}
                                </span>{" "}
                              </div>
                              <div className="textcolor">Privacy Policy </div>
                            </div>
                          </Nav.Link>
                          <Nav.Link
                            href=""
                            onClick={() => navigate("/termsconditions")}
                            className="tail-text"
                          >
                            <div className="d-flex gap-3 align-items-center">
                              <div>
                                <span className="iocn">
                                  <GrDocumentUser className="fabicon" />{" "}
                                </span>{" "}
                              </div>
                              <div className="textcolor">
                                Terms & Conditions{" "}
                              </div>
                            </div>
                          </Nav.Link>
                        </div>
                      </div>
                    </>
                  )}
                </Nav.Link>

                <Nav.Link href="#" className="tail-text">
                  <div
                    variant=""
                    className="mycrt"
                    onClick={() => {
                      if (!selectArea || selectArea === "") {
                        return alert("Please select Apartment/Corporate");
                      }
                      handleShowCart();
                    }}
                    style={{ padding: "0 15px" }}
                  >
                    {/* <BsCart3
                          style={{ fontSize: "24px", color: "orangered" }}
                        /> */}
                    <div className="cartvalue">
                      <span>{Carts?.length}</span>
                    </div>
                  </div>
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={show5}
        onHide={handleClose5}
        className="navbody custom-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Daily Dish</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav
            className="justify-content-end flex-grow-1  "
            style={{ alignItems: "start" }}
            onClick={handleClose5}
          >
            <Nav.Link href="/" className="tail-text ">
              <>
                <div className="side-nav-img d-flex align-items-center  ">
                  <Nav.Link
                    href=""
                    onClick={() => navigate("/foodstatus")}
                    className="tail-text2  d-flex justify-content-start align-items-center"
                  >
                    <div className="d-flex gap-3 align-items-center ">
                      <div>
                        <span className="iocn">
                          {/* <MdAccountCircle className="fabicon" /> */}
                          <img src="/Assets/trust2.png" alt="" srcset="" />
                        </span>{" "}
                      </div>
                      <div className="textcolor">Ingredient Stories</div>
                    </div>
                  </Nav.Link>
                  {/* <div className="mt-2 mb-2">{user?.Fname}</div>
                            <div>{user?.Mobile}</div> */}
                </div>

                <div className="side-nav-img d-flex align-items-center  ">
                  <Nav.Link
                    href="#"
                    className="tail-text2  d-flex justify-content-start align-items-center"
                  >
                    <div className="d-flex gap-3 align-items-center ">
                      <div>
                        <span className="iocn">
                          <img src="/Assets/live.gif" alt="" srcset="" />
                        </span>{" "}
                      </div>
                      <div className="textcolor">
                        Live Kitchen{" "}
                        <span style={{ fontSize: "12px", color: "red" }}>
                          (Launching Soon)
                        </span>
                      </div>
                    </div>
                  </Nav.Link>
                  {/* <div className="mt-2 mb-2">{user?.Fname}</div>
                            <div>{user?.Mobile}</div> */}
                </div>

                <div className="side-nav-img d-flex align-items-center  ">
                  <Nav.Link
                    href="#"
                    className="tail-text2  d-flex justify-content-start align-items-center"
                  >
                    <div className="d-flex gap-3 align-items-center ">
                      <div>
                        <span className="iocn">
                          <img src="/Assets/foodreports.png" alt="" srcset="" />
                        </span>{" "}
                      </div>
                      <div className="textcolor">Food Lab Reports</div>
                    </div>
                  </Nav.Link>
                  {/* <div className="mt-2 mb-2">{user?.Fname}</div>
                            <div>{user?.Mobile}</div> */}
                </div>

                <div className="side-nav-img d-flex align-items-center  ">
                  <Nav.Link
                    href="#"
                    className="tail-text2  d-flex justify-content-start align-items-center"
                  >
                    <div className="d-flex gap-3 align-items-center ">
                      <div>
                        <span className="iocn2">
                          <img src="/Assets/fssai.png" alt="" srcset="" />
                        </span>{" "}
                      </div>
                      <div className="textcolor">578686678569876</div>
                    </div>
                  </Nav.Link>
                  {/* <div className="mt-2 mb-2">{user?.Fname}</div>
                            <div>{user?.Mobile}</div> */}
                </div>

                <div className="madewith">
                  <h6>
                    Made with <IoMdHeart style={{ color: "red" }} /> by{" "}
                    <img src="/Assets/dailydishlogo.png" alt="" srcset="" />
                  </h6>
                </div>
              </>
            </Nav.Link>

            <Nav.Link href="#" className="tail-text">
              <div
                variant=""
                className="mycrt"
                onClick={() => {
                  if (!selectArea || selectArea === "") {
                    return alert("Please select Apartment/Corporate");
                  }
                  handleShowCart();
                }}
                style={{ padding: "0 15px" }}
              >
                {/* <BsCart3
                          style={{ fontSize: "24px", color: "orangered" }}
                        /> */}
                <div className="cartvalue">
                  <span>{Carts?.length}</span>
                </div>
              </div>
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* <Modal
        show={show4}
        backdrop="static"
        onHide={handleClose4}
        style={{ zIndex: "9999999" }}
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
              value={Fname}
              onChange={(e) => {
                setFname(e.target.value);
              }}
            />

            <Form.Control
              type="number"
              placeholder="Enter Phone Number"
              style={{ marginTop: "18px" }}
              value={Mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Enter Flat No,Building Name"
              style={{ marginTop: "18px" }}
              value={Address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="Tower/Phase/Block"
              style={{ marginTop: "18px" }}
              value={Flatno}
              onChange={(e) => setFlatno(e.target.value)}
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

      <Modal
        show={show7}
        onHide={handleClose7}
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
            An OTP has been sent to your whatsapp
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
    </div>
  );
};

export default Banner;
