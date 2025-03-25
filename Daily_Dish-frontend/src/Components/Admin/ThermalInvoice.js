import React, { useEffect, useMemo, useRef } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

function ThermalInvoice() {
  const location = useLocation();
  const { item } = location?.state;
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const hasPrinted = useRef(false);
  // Calculate subtotal based on all products


  // Calculate total amount
 

  // Function to print directly to thermal printer
  const printReceipt = () => {
    const originalContents = document.body.innerHTML;
    const printContents = receiptRef.current.innerHTML;
    
    document.body.innerHTML = printContents;
    
    window.print();
    
    document.body.innerHTML = originalContents;
    
    // Re-attach event listeners after restoring content
    window.location.assign("/corporate-booking-list");
  };


  useEffect(() => {
    if (hasPrinted.current) return; // Prevent multiple print attempts

    // Wait for the page to be fully loaded
    if (document.readyState === 'complete') {
      // Add slight delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        printReceipt();
        hasPrinted.current = true;
      }, 500);
      
      return () => clearTimeout(timer);
    } else {
      // If not loaded yet, add event listener
      const handleLoad = () => {
        const timer = setTimeout(() => {
          printReceipt();
          hasPrinted.current = true;
        }, 500);
        
        window.removeEventListener('load', handleLoad);
      };
      
      window.addEventListener('load', handleLoad);
      
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);


  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}>
        <MdArrowBackIosNew 
          onClick={() => navigate(-1)} 
          style={{color: 'black', fontSize: '26px', cursor: 'pointer'}}
        />
        <button
          style={{
            cursor: "pointer",
            backgroundColor: "#d81d4a",
            color: "white",
            border: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            fontWeight: "bold"
          }}
          onClick={printReceipt}
        >
          PRINT
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: "#f5f5f5", padding: "10px" }}>
        <div 
          id="thermal-receipt" 
          ref={receiptRef}
          style={{ 
            width: "80mm", 
            backgroundColor: "white", 
            padding: "5mm", 
            fontFamily: "monospace",
            fontSize: "11px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: "2px",fontFamily:"Imperial Script" }}>Daily Dish</div>
            <div style={{ fontSize: '10px' }}>Banglore</div>
            <div style={{ fontSize: '10px' }}>GSTIN: 29AARFC3236D1ZF</div>
            <div style={{ borderBottom: "1px dashed #000", marginTop: "8px", marginBottom: "8px" }}></div>
          </div>
          
          {/* Order Info */}
          <div style={{ marginBottom: "8px" }}>
            <table style={{ width: "100%", fontSize: "10px" }}>
              <tbody>
                <tr>
                  <td>Order #:</td>
                  <td style={{ textAlign: "right" }}>{item?.orderid}</td>
                </tr>
                <tr>
                  <td>Type:</td>
                  <td style={{ textAlign: "right" }}>{item?.orderdelivarytype}</td>
                </tr>
                {/* <tr>
                  <td>Prefix:</td>
                  <td style={{ textAlign: "right" }}>{item?.prefixcode}</td>
                </tr> */}
                <tr>
                  <td>Customer:</td>
                  <td style={{ textAlign: "right" }}>{item?.username}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td style={{ textAlign: "right" }}>{item?.delivarylocation}, {item?.addressline}</td>
                </tr>
                <tr>
                  <td>Contact:</td>
                  <td style={{ textAlign: "right" }}>{item?.Mobilenumber}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ borderBottom: "1px dashed #000", marginTop: "8px", marginBottom: "8px" }}></div>
          </div>
          
          {/* Items Table */}
          <div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #000" }}>
                  <td style={{ textAlign: "left", paddingBottom: "4px",fontWeight:"bold" }}>Item</td>
                  <td style={{ textAlign: "center", paddingBottom: "4px",fontWeight:"bold" }}>Qyt</td>
                  <td style={{ textAlign: "right", paddingBottom: "4px",fontWeight:"bold" }}>Price</td>
                  <td style={{ textAlign: "right", paddingBottom: "4px",fontWeight:"bold" }}>Amt</td>
                </tr>
              </thead>
              <tbody>
                {item?.allProduct?.map((items, index) => (
                  <tr key={index} style={{ borderBottom: "1px dotted #ddd" }}>
                    <td style={{ textAlign: "left", paddingTop: "4px", paddingBottom: "4px" }}>
                      {items?.foodItemId.foodname}
                    </td>
                    <td style={{ textAlign: "center", paddingTop: "4px", paddingBottom: "4px" }}>
                      {items?.quantity}
                    </td>
                    <td style={{ textAlign: "center", paddingTop: "4px", paddingBottom: "4px" }}>
                     {items?.foodItemId.foodprice}
                    </td>
                    <td style={{ textAlign: "right", paddingTop: "4px", paddingBottom: "4px" }}>
                    ₹ {(items?.quantity * items?.foodItemId.foodprice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ borderBottom: "1px dashed #000", marginTop: "8px", marginBottom: "8px" }}></div>
          </div>
          
          {/* Totals */}
          <div>
            <table style={{ width: "100%", fontSize: "10px" }}>
              <tbody>
                <tr>
                  <td style={{ textAlign: "left" }}>Subtotal:</td>
                  <td style={{ textAlign: "right" }}>₹ {item?.subTotal}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>Delivery:</td>
                  <td style={{ textAlign: "right" }}>{item?.delivarytype <= 0 ? "Free" : `₹ ${item?.delivarytype}`}</td>
                </tr>
                <tr>
                  <td style={{ textAlign: "left" }}>Tax (5%):</td>
                  <td style={{ textAlign: "right" }}>₹ {item?.tax?.toFixed(2)}</td>
                </tr>
                {item?.Cutlery > 0 && (
                  <tr>
                    <td style={{ textAlign: "left" }}>Cutlery:</td>
                    <td style={{ textAlign: "right" }}>₹ {item?.Cutlery}</td>
                  </tr>
                )}
                {item?.coupon > 0 && (
                  <tr>
                    <td style={{ textAlign: "left" }}>Discount:</td>
                    <td style={{ textAlign: "right", color: "#080" }}>-₹ {item?.coupon}</td>
                  </tr>
                )}
                 {item?.discountWallet > 0 && (
                  <tr>
                    <td style={{ textAlign: "left" }}>Apply Wallet:</td>
                    <td style={{ textAlign: "right", color: "#080" }}>-₹ {item?.discountWallet}</td>
                  </tr>
                )}
                <tr style={{ borderTop: "1px solid #000", fontWeight: "bold" }}>
                  <td style={{ textAlign: "left", paddingTop: "5px" }}>TOTAL:</td>
                  <td style={{ textAlign: "right", paddingTop: "5px" }}>₹ {item?.allTotal?.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div style={{ marginTop: "15px", textAlign: "center", fontSize: "9px" }}>
            <div>Invoice #: {item?.orderid}</div>
            <div style={{ marginTop: "5px" }}>Thank you for your order!</div>
            <div>Visit us again soon</div>
            <div style={{ borderTop: "1px dotted #000", marginTop: "8px", paddingTop: "8px" }}>
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Add print-specific styles */}
      <style type="text/css" media="print">
        {`
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          #thermal-receipt {
            width: 100%;
            box-shadow: none;
          }
        `}
      </style>
    </>
  );
}

export default ThermalInvoice;