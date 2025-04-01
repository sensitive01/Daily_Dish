import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Button, Table, Modal, Form, Pagination } from "react-bootstrap";
import moment from "moment";
import { LuPartyPopper } from "react-icons/lu";
import { GiPartyPopper } from "react-icons/gi";
import { WalletContext } from "../../WalletContext";

const AdminWalletManagement = () => {
  const { AllWallet, AdminWallet } = useContext(WalletContext);

  // const [wallets, setWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [actionType, setActionType] = useState("add");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [txnPage, setTxnPage] = useState(1);
  const walletsPerPage = 5;
  const transactionsPerPage = 5;

  // const fetchTransactions = async (wallet) => {
  //   try {
  //     const response = await axios.get(
  //       `http://100.25.233.42:7013/api/wallet/transactions/${wallet.userId?._id}`
  //     );
  //     setTransactions(response.data.data);
  //     setSelectedWallet(wallet);
  //     setShowTransactionModal(true);
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //   }
  // };

  const handleManageWallet = (wallet, type) => {
    setSelectedWallet(wallet);
    setActionType(type);
    setAmount(0);
    setDescription("");
    setExpiryDate("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        actionType === "add"
          ? "http://100.25.233.42:7013/api/wallet/add-free-cash"
          : "http://100.25.233.42:7013/api/wallet/deduct-cash",
        {
          userId: selectedWallet?.userId?._id,
          amount: amount,
          description,
          expiryDate: actionType === "add" ? expiryDate : null,
        }
      );
      setShowModal(false);
      AdminWallet();
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };

  // Pagination logic for wallets
  const indexOfLastWallet = currentPage * walletsPerPage;
  const indexOfFirstWallet = indexOfLastWallet - walletsPerPage;
  const currentWallets = AllWallet.slice(indexOfFirstWallet, indexOfLastWallet);

  // Pagination logic for transactions
  const indexOfLastTxn = txnPage * transactionsPerPage;
  const indexOfFirstTxn = indexOfLastTxn - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTxn,
    indexOfLastTxn
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">💰 Admin Wallet Management</h2>

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-dark">
          <tr>
            <th>Mobile Number</th>
            <th>User Name</th>
            <th>Balance</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentWallets?.map((wallet) => (
            <tr key={wallet._id}>
              <td>{wallet.userId?.Mobile}</td>
              <td>{wallet?.userId?.Fname || "Unknown"}</td>
              <td>₹{wallet.balance.toFixed(2)}</td>
              <td>{moment(wallet.updatedAt).format("lll")}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleManageWallet(wallet, "add")}
                >
                  Add Bonus
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleManageWallet(wallet, "deduct")}
                >
                  Deduct Amount
                </Button>{" "}
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => {
                    setTxnPage(1);
                    setTransactions(wallet?.transactions?.reverse());
                    setSelectedWallet(wallet);
                    setShowTransactionModal(true);
                  }}
                >
                  View Transactions
                </Button>
              </td>
            </tr>
          ))}
          {currentWallets.length === 0 && (
            <tr>
              <td colSpan={5}>User Wallets Not Found</td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* Pagination for Transactions */}
      {/* Pagination for Wallets */}
      <Pagination className="justify-content-center">
        {[...Array(Math.ceil(AllWallet.length / walletsPerPage)).keys()].map(
          (num) => (
            <Pagination.Item
              key={num + 1}
              active={num + 1 === currentPage}
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
      {/* Wallet Management Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "add" ? "Add Bonus" : "Deduct Amount"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>User:</strong> {selectedWallet?.username}
          </p>
          <p>
            <strong>Current Balance:</strong> ₹
            {selectedWallet?.balance.toFixed(2)}
          </p>
          <Form>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            {actionType === "add" && (
              <Form.Group>
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={actionType === "add" ? "success" : "danger"}
            onClick={handleSubmit}
          >
            {actionType === "add" ? "Add Bonus" : "Deduct Amount"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Transaction History Modal */}
      <Modal
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        centered
        size="lg"
        style={{ zIndex: 999999 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Transaction History - {selectedWallet?.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTransactions.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Expiry</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions?.map((txn, index) => (
                  <tr key={index}>
                    <td
                      style={{ color: txn.type == "credit" ? "green" : "red" }}
                    >
                      {txn.type == "credit"
                        ? `+₹${txn.amount}`
                        : `-₹${Math.abs(txn.amount)}`}
                    </td>
                    <td
                      style={{ color: txn.type == "credit" ? "green" : "red" }}
                    >
                      {txn.type == "credit" && (
                        <GiPartyPopper color="#efa633" size={20} />
                      )}{" "}
                      {txn.description}
                    </td>
                    <td
                      style={{ color: txn.type == "credit" ? "green" : "red" }}
                    >
                      {moment(txn.date).format("lll")}
                    </td>
                    <td
                      style={{ color: txn.type == "credit" ? "green" : "red" }}
                    >
                      {txn.expiryDate
                        ? moment(txn.expiryDate).format("lll")
                        : "-"}
                    </td>
                    <td
                      style={{ color: txn.type == "credit" ? "green" : "red" }}
                    >
                      {txn.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">No transactions found.</p>
          )}
        </Modal.Body>
        {/* Pagination for Transactions */}
        <Pagination className="justify-content-center">
          {[
            ...Array(
              Math.ceil(transactions.length / transactionsPerPage)
            ).keys(),
          ].map((num) => (
            <Pagination.Item
              key={num + 1}
              active={num + 1 === txnPage}
              onClick={() => setTxnPage(num + 1)}
            >
              {num + 1}
            </Pagination.Item>
          ))}
        </Pagination>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowTransactionModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminWalletManagement;
