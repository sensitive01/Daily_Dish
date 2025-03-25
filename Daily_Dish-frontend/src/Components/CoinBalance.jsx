import React  from "react";
import { Card, Container } from "react-bootstrap";
// import { InfoCircle } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/coin-balance.css";
import { BiInfoCircle } from "react-icons/bi";
import coinsgif from './../assets/coinsgif.gif';
import moment from "moment";



const CoinBalance = ({wallet,transactions}) => {
  const today = moment();
  const trans=transactions?.filter((ele)=>ele?.type=="credit");

const expiryDays = moment(trans[0]?.expiryDate).diff(today, "days");
const walletAmount = wallet?.balance || 0; // Assuming walletAmount exists in trans
let expiryMessage = `Expiring in ${expiryDays} Days`;

if (expiryDays === 0 &&walletAmount > 0) {
  expiryMessage = "Expiring Today!";
} else if (expiryDays < 0) {
  expiryMessage = walletAmount > 0 ? "Continue buying to get more bonus!" : "Expired!";
}
// else{
//   expiryMessage = "Continue buying to get more bonus!";
// }

  return (
    <div className="ban-container">
    <div className="mobile-banner">
      <div className="coin-card mt-3">
        {/* Header Section */}
        <div className="coin-header">
          <div className="coin-stack">
            {/* <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="20"
                cy="10"
                r="8"
                fill="#FFD700"
                stroke="#E6C200"
                strokeWidth="1"
              />
              <circle
                cx="20"
                cy="20"
                r="8"
                fill="#FFD700"
                stroke="#E6C200"
                strokeWidth="1"
              />
              <circle
                cx="20"
                cy="30"
                r="8"
                fill="#FFD700"
                stroke="#E6C200"
                strokeWidth="1"
              />
            </svg> */}

            <img src={coinsgif} alt="" />

          </div>
          <div className="balance-text">
            <span className="balance-amount">₹ {wallet?.balance}</span>
            {/* <div className="coin-value text-bold">1 Coin = 1 Rupee</div> */}
          </div>
          <div className="info-icon">
            <BiInfoCircle size={25} />
          </div>
        </div>

        {/* Expiring Notice */}
        {trans.length>0 && <div className="expiring-notice">
          {/* <span className="bold-text">{Math.abs(trans[0]?.amount)} Coins</span>{" "} */}
          <span className="expiring-text">{expiryMessage}</span>
        </div>}
       

        {/* Transactions */}
        {/* <div className="transactions">
        
          <div className="transaction-item">
            <div className="transaction-icon">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="15"
                  cy="10"
                  r="6"
                  fill="#FFD700"
                  stroke="#E6C200"
                  strokeWidth="1"
                />
                <circle
                  cx="15"
                  cy="20"
                  r="6"
                  fill="#FFD700"
                  stroke="#E6C200"
                  strokeWidth="1"
                />
              </svg>
            </div>
            <div className="transaction-text">Welcome Bonus</div>
            <div className="transaction-amount positive">+125</div>
          </div>

   
          <div className="transaction-item">
            <div className="transaction-icon">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="5"
                  y="8"
                  width="20"
                  height="20"
                  rx="2"
                  fill="#F8D9B0"
                  stroke="#E6C200"
                  strokeWidth="1"
                />
                <path d="M10 8 V 3 H 20 V 8" stroke="#E6C200" strokeWidth="1" />
                <rect x="8" y="12" width="4" height="4" fill="#4CAF50" />
                <rect x="13" y="12" width="4" height="4" fill="#F44336" />
                <rect x="18" y="12" width="4" height="4" fill="#2196F3" />
              </svg>
            </div>
            <div className="transaction-text">Order ID - 56094</div>
            <div className="transaction-amount negative">-30</div>
          </div>

     
          <div className="transaction-item">
            <div className="transaction-icon">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 5 L 28 25 H 2 L 15 5 Z"
                  fill="#FFCC00"
                  stroke="#E6B800"
                  strokeWidth="1"
                />
                <text
                  x="15"
                  y="22"
                  textAnchor="middle"
                  fontSize="16"
                  fontWeight="bold"
                >
                  !
                </text>
              </svg>
            </div>
            <div className="transaction-text">Expired on 2nd</div>
            <div className="transaction-amount negative">-30</div>
          </div>
        </div> */}
      </div>
    </div></div>
  );
};

export default CoinBalance;