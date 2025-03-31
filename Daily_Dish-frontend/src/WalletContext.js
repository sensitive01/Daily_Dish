import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletSeting, setWalletSeting] = useState({});

  useEffect(() => {
    fetchWalletData();
    AdminWallet();
  }, []);

  const fetchWalletData = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user")); // Assuming user is logged in
      if (!userId) return;

      const walletRes = await axios.get(
        `http://3.110.45.67:7013/api/wallet/user/${userId?._id}`
      );
      setWallet(walletRes.data.data?.wallet);

      const transactionsRes = await axios.get(
        `http://3.110.45.67:7013/api/wallet/transactions/${userId?._id}`
      );
      setTransactions(transactionsRes.data.data);

      const walseting = await axios.get(
        "http://3.110.45.67:7013/api/wallet/getsettings"
      );
      setWalletSeting(walseting.data.success);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      setLoading(false);
    }
  };

  const [AllWallet, setAllWallet] = useState([]);
  const AdminWallet = async () => {
    try {
      const response = await axios.get(
        "http://3.110.45.67:7013/api/wallet/all"
      );
      setAllWallet(response.data.success);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        transactions,
        fetchWalletData,
        loading,
        walletSeting,
        AllWallet,
        AdminWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
