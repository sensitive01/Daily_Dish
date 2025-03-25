import React, { useState, useEffect, useMemo } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import "../Admin/Admin.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { IoIosEye } from "react-icons/io";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const [data, setdata] = useState();
  console.log("data", data);
  const handleShow = (item) => {
    setdata(item);
    setShow(true);
  };
  const navigate = useNavigate();

  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const [show3, setShow3] = useState(false);
  const [dataa, setdataa] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = (items) => {
    setShow3(true);
    setdataa(items);
  };

  //Get method Integration
  const [ApartmentOrder, setApartmentOrder] = useState([]);
  const getApartmentOrder = async () => {
    try {
      let res = await axios.get(
        "https://dailydishbangalore.com/api/admin/getallorders"
      );
      if (res.status === 200) {
        setApartmentOrder(res.data.order.reverse());
        setNoChangeData(res.data.order.reverse());
        console.log("dfdf", res.data.order.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApartmentOrder();
    // const interval = setInterval(() => {
    //   getApartmentOrder();
    // }, 5000);

    // return () => clearInterval(interval);
  }, []);

  //integrating get method
  const [Addproducts, setAddproducts] = useState([]);
  const getAddproducts = async () => {
    try {
      let res = await axios.get(
        "https://dailydishbangalore.com/api/admin/getFoodItems"
      );
      if (res.status === 200) {
        setAddproducts(res.data.data);
        setNoChangeData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [delData, setdelData] = useState();
  let deleteBooking = async (data) => {
    try {
      let res = await axios.delete(
        `https://dailydishbangalore.com/api/admin/deletefoodorder/${data}`
      );
      if (res) {
        alert(`Bookings Data Deleted Successfully`);
        // window.location.reload()
        getApartmentOrder();
        handleClose4();
        getAddproducts();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getAddproducts();
  }, []);

  //Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;
  const neworder = ApartmentOrder.filter(
    (item) => item?.orderdelivarytype === "apartment"
  );
  const pageCount = Math.ceil(neworder.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  //   useEffect(()=>{
  // console.log("records",nochangedata)
  //   },[ApartmentOrder])

  // function changePage(id) {
  //   setCurrentpage(id);
  // }

  // function prevpage() {
  //   if (currenpage !== firstIndex) {
  //     setCurrentpage(currenpage - 1);
  //   }
  // }

  // function nextpage() {
  //   if (currenpage !== lastIndex) {
  //     setCurrentpage(currenpage + 1);
  //   }
  // }

  // Search filter
  const [nochangedata, setNoChangeData] = useState([]);
  const [searchH, setSearchH] = useState("");

  const handleFilterH = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchH(searchTerm);
    if (searchTerm !== "") {
      const filteredData = nochangedata.filter((user) =>
        Object.values(user).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
      setApartmentOrder(filteredData);
    } else {
      setApartmentOrder(nochangedata);
    }
  };

  // ==============DATE FILTER======================//

  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");

  function filterByDateRange() {
    // Parse the input date strings into Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    const newarry = ApartmentOrder.filter((order) => {
      // Convert the `Placedon` date to a Date object
      const placedDate = new Date(order.Placedon);
      // Check if the placedDate falls within the range (inclusive)
      return placedDate >= start && placedDate <= end;
    });
    setApartmentOrder(newarry);
  }

  function clearbutton() {
    setendDate("");
    setstartDate("");
    setApartmentOrder(nochangedata);
    // getAdduser();
  }

  // Export Excel
  const handleExportExcel = () => {
    // Create a custom mapping for the column headers
    const customHeaders = ApartmentOrder.filter(
      (item) => item?.orderdelivarytype === "apartment"
    ).map((item, i) => ({
      "S.No": i + 1,
      Date: moment(item?.Placedon).format("MM/DD/YYYY, hh:mm A"),
      "Order ID": item?.orderid,
      Custome: item?.username,
      Phone: item?.Mobilenumber,
      "Order Status": item?.status,
      Slotsdata: item?.slot,
      "Category Name":
        item?.allProduct
          ?.map((items) => `${items?.foodItemId?.foodcategory}`)
          .join(", ") || "N/A",
          "Product Name": item?.allProduct?.map((items) => `${items?.foodItemId?.foodname} -  (${items?.quantity}.Qyt)`).join(", ") || "N/A",
      Unit:
        item?.allProduct
          ?.map((items) => `${items?.foodItemId?.unit}`)
          .join(", ") || "N/A",
     
      Apartment: item?.apartment,
      Address: item?.delivarylocation,
      "Delivery Charge": item?.delivarytype,
      "Delivery Type": item?.deliveryMethod,
    }));

    // Convert your custom data to an Excel sheet
    const worksheet = XLSX.utils.json_to_sheet(customHeaders);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "User List ");

    // Download the Excel file
    XLSX.writeFile(workbook, "Apartmentbookings.xlsx");
  };
  const [statusdata, setstatusdata] = useState("");
  const changestatus = async (item) => {
    try {
      const config = {
        url: "/admin/updateOrderStatus/" + item._id,
        method: "put",
        baseURL: "https://dailydishbangalore.com/api",
        headers: { "Content-Type": "application/json" },
        data: {
          newStatus: statusdata,
        },
      };

      const res = await axios(config);

      if (res.status === 200) {
        handleClose3();
        getApartmentOrder();
        // window.location.reload()
      } else {
        alert("Failed to Update Order");
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred while updating Order");
    }
  };

  // const totalTaxPercent = useMemo(() => {
  //   if (!data?.allProduct?.length) {
  //     return 0; // Fallback for missing or empty allProduct
  //   }

  //   return data.allProduct.reduce((totalTaxPercent, item) => {
  //     const tax = Number(item?.foodItemId?.gst || 0) * Number(item?.quantity || 0); // Adjust for Quantity
  //     return totalTaxPercent + tax;
  //   }, 0); // Initial value for totalTaxPercent is 0
  // }, [data]);

  return (
    <div>
      <div className="d-flex gap-3 mb-2">
        <div className="col-lg-3 d-flex justify-content-center">
          <div class="input-group ">
            <span class="input-group-text" id="basic-addon1">
              <BsSearch />
            </span>
            <input
              type="text"
              class="form-control"
              placeholder="Search..."
              aria-describedby="basic-addon1"
              onChange={handleFilterH}
              value={searchH}
            />
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <div className="input-group">
            <label htmlFor="" className="m-auto">
              From: &nbsp;
            </label>
            <input
              type="date"
              className="form-control"
              aria-describedby="date-filter"
              value={startDate}
              onChange={(e) => setstartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3 d-flex justify-content-center align-items-center">
          <div className="input-group">
            <label htmlFor="" className="m-auto">
              To: &nbsp;
            </label>
            <input
              type="date"
              className="form-control"
              aria-describedby="date-filter"
              value={endDate}
              onChange={(e) => setendDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Button
            variant=""
            className="modal-add-btn"
            onClick={filterByDateRange}
          >
            Submit
          </Button>
        </div>
        <div>
          <Button variant="danger" onClick={clearbutton}>
            Clear
          </Button>
        </div>
      </div>
      <div className="customerhead p-2">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="header-c ">Apartment Booking List</h2>
          <Button variant="success" onClick={handleExportExcel}>
            Export Excel
          </Button>
        </div>

        <div className="mb-3">
          <Table
            responsive
            bordered
            style={{ width: "-webkit-fill-available" }}
          >
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date</th>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th style={{ padding: "30px" }}>Order Status</th>
                <th>Slotsdata</th>
                <th>Category Name</th>
                <th>Product Name</th>
                <th>Cutlery</th>
                <th>Apply Wallet</th>
                <th>Coupon Discount</th>
                <th>Unit</th>
                {/* <th>Quantity</th> */}
                <th>Apartment</th>
                <th>Address</th>
                <th>Phone</th>
                <th>Delivery Type</th>
                <th>Invoice</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ApartmentOrder.filter(
                (item) => item?.orderdelivarytype === "apartment"
              )
                ?.slice(pagesVisited, pagesVisited + usersPerPage)
                ?.map((items, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1 + usersPerPage * pageNumber}</td>
                      <td style={{ paddingTop: "20px" }}>
                        {moment(items?.createdAt).format("MM/DD/YYYY, h:mm A")}
                      </td>
                      <td style={{ paddingTop: "20px" }}>{items?.orderid}</td>
                      <td style={{ paddingTop: "20px" }}>{items?.username}</td>

                      <td style={{ paddingTop: "20px", width: "400px" }}>
                        {items?.status}
                        <Button
                          className="modal-add-btn mt-2"
                          variant=""
                          style={{ fontSize: "" }}
                          onClick={() => handleShow3(items)}
                        >
                          Change Status
                        </Button>
                      </td>
                      <td style={{ paddingTop: "20px" }}>{items?.slot}</td>
                      <td style={{ paddingTop: "20px" }}>
                        {items?.allProduct[0]?.foodItemId?.foodcategory}
                      </td>
                      <td style={{ paddingTop: "20px" }}>
                        {items?.allProduct.map((item) => {
                          return (
                            `${item?.foodItemId?.foodname}` +
                            " - " +
                            `${item?.quantity}.Qyt, `
                          );
                        })}
                      </td>
                      <td>{items?.Cutlery > 0 ? "Yes" : "No"}</td>
                      <td style={{ paddingTop: "20px" }}>{items?.discountWallet>0 ? items?.discountWallet :"No"}</td>
                      <td style={{ paddingTop: "20px" }}>
                        {items?.coupon > 0 ? items?.coupon : "No"}
                      </td>
                      <td style={{ paddingTop: "20px" }}>
                        {items?.allProduct.map((item) => {
                          return `${item?.foodItemId?.unit}` + ",";
                        })}
                      </td>
                      {/* <td style={{ paddingTop: "20px" }}>
                        {items?.allProduct.map((item) => {
                          return `${item?.quantity}` + ",";
                        })}
                      </td> */}
                      <td style={{ paddingTop: "20px" }}>{items?.apartment}</td>
                      <td style={{ paddingTop: "20px" }}>
                        {items?.delivarylocation},{items?.addressline}
                      </td>
                      <td style={{ paddingTop: "20px" }}>
                        {items?.Mobilenumber}
                      </td>

                      <td style={{ paddingTop: "20px" }}>
                        {items?.deliveryMethod}
                      </td>

                      <td style={{ paddingTop: "20px" }}>
                        <IoIosEye
                          style={{ fontSize: "20px" }}
                          onClick={() => handleShow(items)}
                        ></IoIosEye>
                      </td>
                      <td>
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            gap: "20px",
                            justifyContent: "center",
                          }}
                        >
                          <div>
                            <AiFillDelete
                              className="text-danger"
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() => {
                                handleShow4();
                                setdelData(items?._id);
                              }}
                            />{" "}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <div style={{ display: "flex" }} className="reactPagination">
            <p style={{ width: "100%", marginTop: "20px" }}>
              Total Count: {neworder?.length}
            </p>
            <ReactPaginate
              previousLabel={"Back"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </div>
        </div>
      </div>

      {/* Delete booking */}
      <Modal
        show={show4}
        onHide={handleClose4}
        backdrop="static"
        keyboard={false}
        style={{ zIndex: "99999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <p className="fs-4" style={{ color: "red" }}>
                Are you sure?
                <br /> you want to delete this data?
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" className="modal-close-btn" onClick={handleClose4}>
            Close
          </Button>
          <Button
            variant=""
            onClick={() => deleteBooking(delData)}
            className="modal-add-btn"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Invoice */}
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{zIndex:9999999}}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter"></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div>
              <h4>Order Summary</h4>
              <b>{data?.allProduct?.length} Items</b>
              <hr />

              <div className="row w-100">
                {data?.allProduct?.map((Item) => {
                  return (
                    <>
                      <div className="row  border mt-1 mx-1">
                        <div className="col-md-4">
                          <img
                            src={`https://dailydishbangalore.com/Products/${Item?.foodItemId?.Foodgallery[0]?.image2}`}
                            alt=""
                            style={{ width: "90px", height: "80px" }}
                          />
                        </div>
                        <div className="col-md-4">
                          <div style={{ textAlign: "left" }}>
                            <b>{Item?.foodItemId?.foodname}</b> <br />
                            <span>
                              <b> ₹ {Item?.foodItemId?.foodprice}</b>
                            </span>
                            <br />
                            <b> Qty. {Item?.quantity}</b>
                          </div>
                        </div>

                        <div className="col-md-4 d-flex align-items-center">
                          <div style={{ textAlign: "left" }}>
                            <b>₹ {Item?.totalPrice.toFixed(2)}</b> <br />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>

              <div className="row m-2 mt-3 align-items-center">
                <b>Bill Details</b>
                <div className="col-md-10 mb-2">
                  <div>
                    <div>Sub Total</div>
                    <div>Tax (5)%</div>
                    {data?.Cutlery ? <div>Cutlery</div>:null}
                     {data?.delivarytype ? <div>Delivery charges</div>:null}
                     {data?.coupon ?<div>Coupon Discount</div>:null}
                     {data?.discountWallet ?<div>Apply Wallet</div>:null}
                    <div>
                      <b>Bill total</b>
                    </div>
                  </div>
                </div>
                <div className="col-md-2 mb-2">
                  <div style={{ textAlign: "left" }}>
                    <div>
                      <div>₹ {data?.subTotal}</div>
                      <div>₹ {data?.tax?.toFixed(2)}</div>
                      {data?.Cutlery ?<div>₹ {data?.Cutlery}</div>:null}
                     {data?.delivarytype ?<div>₹ {data?.delivarytype}</div>:null}
                     {data?.coupon ?<div>₹ {data?.coupon}</div>:null}
                     {data?.discountWallet ?<div>₹ {data?.discountWallet}</div>:null}
                      <div>
                        <b>
                          ₹{" "}
                          { data?.allTotal?.toFixed(2)}
                        </b>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-4 justify-content-end mt-3 mb-3">
            <div>
              <Button
                variant=""
                style={{
                  background: "white",
                  color: "green",
                  border: "1px solid green",
                }}
                onClick={handleClose}
              >
                Close
              </Button>
            </div>
            <div>
              <Button
                variant=""
                style={{
                  background: "green",
                  color: "white",
                  border: "1px solid white",
                }}
                onClick={() =>
                  navigate("/AdminInvoice", { state: { item: data } })
                }
              >
                Invoice
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* status change  */}
      <Modal
        show={show3}
        onHide={handleClose3}
        backdrop="static"
        keyboard={false}
        style={{ zIndex: "99999" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="col-md-12 mb-2">
            <select
              name="status"
              id="status"
              className="vi_0"
              onChange={(e) => {
                console.log("Selected Value:", e.target.value); // To verify the value
                setstatusdata(e.target.value);
              }}
            >
              <option value="">Select Status</option>
              <option value="Cooking">Cooking</option>
              <option value="Packing">Packing</option>
              <option value="Ontheway">On the way</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant=""
            className="modal-add-btn"
            onClick={() => changestatus(dataa)}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingList;
