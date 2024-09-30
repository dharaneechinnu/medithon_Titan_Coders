import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { abi } from '../abi'; // Your ABI file
import styled, { createGlobalStyle } from 'styled-components'; // Import styled-components

// Global style reset
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }


`;

// Main container
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Full height to center vertically */
  width: 100vw; /* Full width for centering */
  background-color: #f0f4f8; /* Light background color */
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Title styling
const Title = styled.h1`
  color: #2c3e50; /* Darker text color */
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Button styling
const Button = styled.button`
  padding: 15px 30px;
  font-size: 1.2rem;
  color: #ffffff; /* White text */
  background-color: #3498db; /* Primary blue color */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9; /* Darker blue on hover */
  }

  @media (max-width: 768px) {
    padding: 10px 20px;
    font-size: 1rem;
  }
`;

// Wallet information styling
const WalletInfo = styled.p`
  margin-top: 20px;
  font-size: 1.2rem;
  color: #34495e; /* Darker gray for text */
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const AdminLogin = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const navigate = useNavigate();

  const contractAddress = '0x0a9e31512Cc63866839aCaE9EE542EaCB460CFa6'; // Replace with your deployed contract address

  // Connect to the wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Create a Web3 instance
        const web3 = new Web3(window.ethereum);
        
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        setWalletAddress(account);
        console.log('Connected:', account);

        // Create contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);
        
        // Check if the connected wallet address is the admin
        const adminAddress = await contract.methods.admin().call(); // Get the admin address from the contract

        if (account.toLowerCase() === adminAddress.toLowerCase()) {
          // Redirect to the next page upon successful login
          navigate('/dashboard');
        } else {
          alert('You are not authorized');
        }
      } catch (error) {
        console.error("Error connecting to wallet or checking admin status:", error);
        alert('An error occurred while connecting to the wallet. Please try again.');
      }
    } else {
      alert('Please install MetaMask!');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>Admin Login</Title>
        <Button onClick={connectWallet}>Connect Wallet</Button>
        <WalletInfo>Connected Wallet: {walletAddress || 'Not connected'}</WalletInfo>
      </Container>
    </>
  );
};

export default AdminLogin;
