import React from 'react';
import styles from './Profile.module.css';
import { useState, useEffect, useContext } from 'react';
import { UserAccountContext } from "../../App.jsx";
import { contractAddress, abi } from "../abiAddress.js";
import { ethers } from 'ethers';

function Profile() {
  const { account, connected, balance, signer } = useContext(UserAccountContext);
  const [userNFTs, setUserNFTs] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [listingPrice, setListingPrice] = useState("0.01");
  const [premiumFee, setPremiumFee] = useState("0.05");

  useEffect(() => {
    if (connected && signer && account) {
      checkUserStatus();
      fetchUsersNftData();
    }
  }, [connected, signer, account]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "price") {
      setListingPrice(value);
    } else if (name === "premiumFee") {
      setPremiumFee(value);
    }
  }

  const checkUserStatus = async () => {
    const contract  = new ethers.Contract(contractAddress, abi, signer);
    try {
      const ownerAddress = await contract.contractOwner();
      if (account === ownerAddress) {
        console.log("Welcome admin!");
        setIsAdmin(true);
        window.alert("Welcome Admin!"); 
      } else {
        console.log("Welcome user!");
      }
    } catch (e) { 
      console.error("Error fetching Contract Owner!!"); 
    }
  }

  const updateListingPrice = async () => {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const ListingPriceWei = ethers.parseEther(listingPrice);
    try {
      const tx = await contract.updateListingPrice(ListingPriceWei);
      await tx.wait();
      console.log("Success: Listing price updated to", listingPrice);
      window.alert(`Success: Listing price updated to ${listingPrice}`);
    } catch (e) {
      console.error("Error updating listing price:", e);
      window.alert("Error updating Listing Price. Please try again.");
    }
  }

  const updatePremiumFee = async () => {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const premiumFeeWei = ethers.parseEther(premiumFee);
    try {
      const tx = await contract.updatePremiumFee(premiumFeeWei);
      await tx.wait();
      console.log("Success: Premium Fee updated to", premiumFee);
      window.alert(`Success: Premium Fee updated to ${premiumFee}`);
    } catch (e) {
      console.error("Error updating premium fee:", e);
      window.alert("Error updating Premium Fee. Please try again.");
    }
  }

  const fetchUsersNftData = async () => {
    setIsLoading(true);
    try {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const nfts = await contract.getUserOwnedNFTs(account);

      const processedNFTs = await Promise.all(nfts.map(async (nft) => {
        const tokenURI = await contract.tokenURI(nft.tokenId);
        let metadata = {};
        let imageUrl = "";

        try {
          const response = await fetch(tokenURI);
          metadata = await response.json();
          imageUrl = metadata.image;
        } catch (error) {
          console.error("Error fetching metadata:", error);
          imageUrl = "https://via.placeholder.com/150?text=Error";
        }

        return {
          id: nft.tokenId.toString(),
          price: ethers.formatEther(nft.price),
          seller: nft.seller,
          owner: nft.owner,
          isListed: nft.Listed,
          image: imageUrl,
          description: metadata.description || "No description available",
          name: metadata.name || `NFT #${nft.tokenId}`
        };
      }));
      
      setUserNFTs(processedNFTs);
      const total = processedNFTs.reduce((sum, nft) => sum + parseFloat(nft.price), 0);
      setTotalValue(total.toFixed(4));
    } catch (e) {
      console.error("Error fetching NFT Data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      {!connected && <p id={styles.pre}> PLEASE CONNECT TO METAMASK TO VIEW PROFILE</p>}
      <div className= {styles.Container02}>
          <p className={styles.setCenter} style={{ fontWeight: "900", marginTop: "10px", marginBottom: "0px" }}>Wallet Address</p>
          <p className={styles.setCenter} style={{ fontWeight: "400", margin: "0px", fontSize: "1.2rem" }}>{account}</p>
      </div>
    </div>
  );
}

export default Profile;