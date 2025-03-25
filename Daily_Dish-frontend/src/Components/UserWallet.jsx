import React, { useContext } from "react";
import { WalletContext } from "../WalletContext";
import { Card, Button, Spinner } from "react-bootstrap";
import moment from "moment";
import {
  FaDownload,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaGift,
} from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const UserWallet = () => {
  const { wallet, transactions, loading ,walletSeting} = useContext(WalletContext);

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Amount,Type,Description,Date,Expiry Date"]
        .concat(
          transactions.map(
            (txn) =>
              `${txn.amount},${txn.type},${txn.description},${moment(
                txn.date
              ).format("lll")},${
                txn.expiryDate ? moment(txn.expiryDate).format("lll") : "-"
              }`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "wallet_transactions.csv");
    document.body.appendChild(link);
    link.click();
  };

  const navigate = useNavigate();

  return (
    <div className="ban-container" style={{paddingTop:"20px"}}>
   
      <div className="mobile-banner ">
      <a  onClick={() => navigate(-1)}>
            <RxCross2
             
              style={{ fontSize: "20px", float:"right"}}
            />
          </a>
        <div className="w-100">
          <h3 className="text-center mb-3">
            <FaWallet className="me-2 " color="#F81D0F" /> My Wallet
          </h3>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border"color="#F81D0F" />
            </div>
          ) : (
            <>
              {/* Wallet Balance Card */}
              <Card
                className="shadow-lg p-3 mb-4 text-center"
                style={{ maxWidth: "400px", margin: "auto" }}
              >
                <Card.Body>
                  <h5 className="fw-bold">Wallet Balance</h5>
                  <h2 className="text-success">
                    ₹{wallet?.balance?.toFixed(2)}
                  </h2>
                </Card.Body>
              </Card>

              {/* Export Transactions Button */}
              <div className="text-center mb-3">
                <Button variant="primary" onClick={exportToCSV}>
                  <FaDownload className="me-2" /> Export Transactions
                </Button>
              </div>

              {/* Transaction History - Card Layout */}
              <div className="transaction-history">
                {transactions.length > 0 ? (
                  transactions.map((txn, index) => {
                    const isCredit = txn.type === "credit";
                    return (
                      <Card
                        key={index}
                        className={`shadow-sm mb-3 ${
                          isCredit ? "border-success" : "border-danger"
                        }`}
                      >
                        <Card.Body className="d-flex justify-content-between align-items-center">
                          <div>
                            <h5
                              className={
                                isCredit ? "text-success" : "text-danger"
                              }
                            >
                              {isCredit ? (
                                <FaGift className="me-2 text-success" />
                              ) : (
                                <FaArrowDown className="me-2 text-danger" />
                              )}
                              {isCredit ? "+" : "-"}₹{Math.abs(txn.amount)}
                            </h5>
                            <p className="mb-1">{txn.description}</p>
                            <small className="text-muted">
                              {moment(txn.date).format("lll")} | Expiry:{" "}
                              {txn.expiryDate
                                ? moment(txn.expiryDate).format("lll")
                                : "-"}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    );
                  })
                ) : (
                  <p className="text-center">No transactions found</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserWallet;
