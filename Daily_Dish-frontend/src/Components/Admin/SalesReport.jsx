import React, { useState, useEffect } from "react";
import { Button, Modal, Table, Image } from "react-bootstrap";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import "../Admin/Admin.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import * as XLSX from "xlsx";
import moment from "moment";

const SalesReport = () => {
  const [show, setShow] = useState();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show4, setShow4] = useState();
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const [Addproducts, setAddproducts] = useState([]);
  const getAddproducts = async () => {
    try {
      let res = await axios.get(
        "https://dailydish.in/api/admin/getFoodItems"
      );
      if (res.status === 200) {
        setAddproducts(res.data.data);
        setNoChangeData(res.data.data);
        console.log("product", res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAddproducts();
  }, []);

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
      setAddproducts(filteredData);
    } else {
      setAddproducts(nochangedata);
    }
  };

  const [startDate, setstartDate] = useState("");
  const [endDate, setendDate] = useState("");
  // function filterByDateRange() {
  //   // Parse the input date strings into Date objects
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   const newarry = ApartmentOrder.filter(order => {
  //     // Convert the `Placedon` date to a Date object
  //     const placedDate = new Date(order.Placedon);
  //     // Check if the placedDate falls within the range (inclusive)
  //      return placedDate >= start && placedDate <= end;
  //   });
  //   setApartmentOrder(newarry)
  // }

  function clearbutton() {
    setendDate("");
    setstartDate("");
    // setApartmentOrder(nochangedata)
    // getAdduser();
  }

  const [ApartmentOrder, setApartmentOrder] = useState([]);
  const getApartmentOrder = async () => {
    try {
      let res = await axios.get(
        "https://dailydish.in/api/admin/getallorders"
      );
      if (res.status === 200) {
        setApartmentOrder(res.data.order);
        console.log("booking", res.data.order);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const calculateQuantity = (productId) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (startDate) {
      // Set the end time to the end of the day
      end.setHours(23, 59, 59, 999);

      return ApartmentOrder.reduce((totalQuantity, order) => {
        // Check if the order falls within the date range
        if (
          new Date(order.createdAt) >= start &&
          new Date(order.createdAt) <= end
        ) {
          // Calculate the product quantity for this order
          const productQuantity =
            order?.allProduct
              ?.filter((product) => product?.foodItemId?._id === productId)
              .reduce((acc, product) => acc + product.quantity, 0) || 0;

          return totalQuantity + productQuantity;
        }

        return totalQuantity;
      }, 0);
    }

    return ApartmentOrder.reduce((totalQuantity, order) => {
      // Calculate the product quantity for all orders
      const productQuantity =
        order?.allProduct
          ?.filter((product) => product?.foodItemId?._id === productId)
          .reduce((acc, product) => acc + product.quantity, 0) || 0;

      return totalQuantity + productQuantity;
    }, 0);
  };

  const calculateTotalOrder = (productId) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (startDate) {
      // Set the end time to the end of the day
      end.setHours(23, 59, 59, 999);

      // Filter orders based on date range and product presence
      const ordersWithProduct = ApartmentOrder.filter((order) => {
        const createdAt = new Date(order.createdAt);
        // Check if order date is within the range
        const isWithinDateRange = createdAt >= start && createdAt <= end;

        // Check if the product exists in the order
        const hasProduct = order.allProduct?.some(
          (product) => product?.foodItemId?._id === productId
        );

        return isWithinDateRange && hasProduct;
      });

      // Return the count of such orders
      return ordersWithProduct.length;
    }

    // Filter orders that have the product in their allProduct array
    const ordersWithProduct = ApartmentOrder.filter((order) =>
      order.allProduct?.some(
        (product) => product?.foodItemId?._id === productId
      )
    );

    // Return the count of such orders
    return ordersWithProduct.length;
  };

  const order = Addproducts.map((item) => ({
    Food: item?.foodname,
    Price: item?.foodprice,
    Quantity: calculateQuantity(item?._id),
    Orders: calculateTotalOrder(item?._id),
    Amount: calculateQuantity(item?._id) * item?.foodprice,
  }));

  // Export Excel
  const handleExportExcel = () => {
    // Remove 'createdAt' and 'updatedAt' fields from records
    // const filteredRecords = Addproducts.map(({ createdAt, updatedAt,__v,Foodgallery, ...rest }) => rest);

    // Convert filtered JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(order);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Table Data");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "SalesReport.xlsx");
  };

  useEffect(() => {
    getApartmentOrder();
  }, [Addproducts]);

  // const calculateTotalAmount = (productId) => {
  //   return ApartmentOrder.reduce((totalQuantity, order) => {
  //     // Check if the order has an `allProduct` array
  //     const productQuantity = order?.allProduct
  //       ?.filter((product) => product?.foodItemId?._id === productId)
  //       .reduce((acc, product) => acc + product.totalPrice, 0) || 0;

  //     return totalQuantity + productQuantity;
  //   }, 0);
  // };

  return (
    <div>
      <div>
        <div className="d-flex">
          <div className="col-lg-4 d-flex justify-content-center">
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
          <div className="col-md-3 d-flex justify-content-center align-items-center ms-2">
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
          <div className="col-md-3 d-flex justify-content-center align-items-center ms-2">
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
          {/* <div className="ms-2">
          <Button variant="" className="modal-add-btn" onClick={filterByDateRange}>
            Submit
          </Button>
        </div> */}
          <div className="ms-2">
            <Button variant="danger" onClick={clearbutton}>
              Clear
            </Button>
          </div>
        </div>
        <div className="customerhead p-2">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="header-c ">Sales Report</h2>
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
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Order</th>
                  <th>Total Amount</th>
                </tr>
              </thead>

              <tbody>
                {Addproducts.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>

                      <td style={{ paddingTop: "20px" }}>{item?.foodname}</td>
                      <td style={{ paddingTop: "20px" }}>{item?.foodprice}</td>
                      <td style={{ paddingTop: "20px" }}>
                        {calculateQuantity(item?._id)}
                      </td>
                      <td style={{ paddingTop: "20px" }}>
                        {calculateTotalOrder(item?._id)}
                      </td>
                      <td style={{ paddingTop: "20px" }}>
                        {(
                          calculateQuantity(item?._id) * item?.foodprice
                        ).toFixed(2)}
                      </td>
                      {/* <td>
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
                            // setData(item?._id);
                          }}
                        />{" "}
                      </div>
                    </div>
                  </td> */}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
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
            <Button
              variant=""
              className="modal-close-btn"
              onClick={handleClose4}
            >
              Close
            </Button>
            <Button variant="" className="modal-add-btn">
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default SalesReport;

{
  /* <Button
      variant=""
      className="add-to-cart-btn"
      style={{
        border: "2px solid orangered",
        fontSize: "16px",
        width: "100%",
        padding: "5px",
        textAlign:"center"
      }}
      onClick={() => addCart1(item)}
    >
      Add to Cart
    </Button> */
}

//     <div className="incrementbtnn">

//     <div className="incrementbtn">
//    <FaMinus
//    onClick={() => decreaseQuantity(item?._id)}
//    />
//  </div>

//  {data?.Quantity}
//  <div className="incrementbtn">
//    <FaPlus
//    onClick={() => increaseQuantity(item?._id)}
//    />
//  </div>
//  </div>
