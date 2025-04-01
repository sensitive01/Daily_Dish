import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Pagination } from "react-bootstrap";
import moment from "moment";

const AbandonedCart = () => {
  const [carts, setCarts] = useState([]);
  const [selectedCart, setSelectedCart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cartsPerPage = 5;

  // Fetch abandoned carts
  const fetchCarts = async () => {
    try {
      const response = await axios.get(
        "http://100.25.233.42:7013/api/cart/getAllcartaddon"
      );
      setCarts(response.data.success);
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // Open modal to show cart details
  const handleViewCart = (cart) => {
    setSelectedCart(cart);
    setShowModal(true);
  };

  // Pagination logic
  const indexOfLastCart = currentPage * cartsPerPage;
  const indexOfFirstCart = indexOfLastCart - cartsPerPage;
  const currentCarts = carts.slice(indexOfFirstCart, indexOfLastCart);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">🛒 Abandoned Cart Management</h2>

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>Cart ID</th>
            <th>User Name</th>
            <th>Mobile</th>
            <th>Items Count</th>
            <th>Last Updated</th>
            <th>Abandoned</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCarts.length > 0 ? (
            currentCarts.map((cart) => (
              <tr key={cart._id}>
                <td>{cart.cartId || "N/A"}</td>
                <td>{cart.username || "Unknown"}</td>
                <td>{cart.mobile || "N/A"}</td>
                <td>{cart.items?.length || 0}</td>
                <td>{moment(cart.lastUpdated).format("lll")}</td>
                <td>
                  <span
                    className={`badge ${
                      cart.abandoned ? "bg-danger" : "bg-success"
                    }`}
                  >
                    {cart.abandoned ? "Yes" : "No"}
                  </span>
                </td>
                <td>{cart.status}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleViewCart(cart)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No abandoned carts found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {carts.length > cartsPerPage && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: Math.ceil(carts.length / cartsPerPage) }).map(
            (_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            )
          )}
          <Pagination.Next
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(carts.length / cartsPerPage)}
          />
        </Pagination>
      )}

      {/* Modal to show cart details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🛍 Cart Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCart ? (
            <>
              <p>
                <strong>Cart ID:</strong> {selectedCart.cartId || "N/A"}
              </p>
              <p>
                <strong>User Name:</strong> {selectedCart.username || "Unknown"}
              </p>
              <p>
                <strong>Mobile:</strong> {selectedCart.mobile || "N/A"}
              </p>
              <p>
                <strong>Last Updated:</strong>{" "}
                {moment(selectedCart.lastUpdated).format("lll")}
              </p>
              <p>
                <strong>Abandoned:</strong>{" "}
                {selectedCart.abandoned ? "Yes" : "No"}
              </p>

              <h5 className="mt-3">🛒 Cart Items:</h5>
              {selectedCart.items?.length > 0 ? (
                <Table striped bordered responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Unit</th>
                      <th>Quantity</th>

                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCart?.items?.map((item, index) => (
                      <tr key={index}>
                        <td>{item.foodname}</td>
                        <td>₹{item.totalPrice?.toFixed(2)}</td>
                        <td>{item.unit}</td>
                        <td>{item.Quantity}</td>
                        <td>
                          <img
                            src={
                              `http://100.25.233.42:7013/Products/${item.image}` ||
                              "https://via.placeholder.com/50"
                            }
                            alt={item.foodname}
                            style={{ width: 50, borderRadius: "5px" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">No items in cart.</p>
              )}
            </>
          ) : (
            <p className="text-muted">No details available</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AbandonedCart;
