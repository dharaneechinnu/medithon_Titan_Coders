import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { abi } from '../abi';
import styled, { createGlobalStyle } from 'styled-components';
import NavBar from './NavBar';

// Global style reset to remove default margins and paddings
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    font-family: Arial, sans-serif;
  }
`;

const RegisterDoctor = () => {
  const [doctorAddress, setDoctorAddress] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [dept, setDept] = useState(0); // 0 - Cardiology, 1 - Psychiatry, 2 - General
  const [error, setError] = useState('');
  const [adminAccount, setAdminAccount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false); // For tracking loading state

  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x0a9e31512Cc63866839aCaE9EE542EaCB460CFa6";
  const contract = new web3.eth.Contract(abi, contractAddress);

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAdminAccount(accounts[0]);
          setWalletConnected(true);
          alert('Wallet connected successfully!');
        } catch (error) {
          console.error('Error connecting wallet:', error);
          setError('Failed to connect wallet. Please try again.');
        }
      } else {
        setError('MetaMask is not installed. Please install it to use this feature.');
      }
    };

    connectWallet();
  }, []);

  const handleRegisterDoctor = async () => {
    setError('');
    if (!walletConnected) {
      setError('Please connect your wallet first.');
      return;
    }
    setLoading(true); // Set loading state

    try {
      // Check if the connected account is the admin
      const adminAddress = await contract.methods.admin().call();
      if (adminAccount.toLowerCase() !== adminAddress.toLowerCase()) {
        setError('Only admin can register doctors.');
        return;
      }

      await contract.methods.registerDoctor(doctorAddress, doctorId, dept).send({ from: adminAccount });
      alert('Doctor registered successfully');
      setDoctorAddress('');
      setDoctorId('');
      setDept(0);
    } catch (error) {
      console.error('Error registering doctor:', error);
      setError('Failed to register doctor. Please check your input and try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <NavBar />
        <Content>
          <Title>Add Doctor</Title>
          <Input
            type="text"
            placeholder="Doctor Address"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Doctor Name"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
          />
          <Select value={dept} onChange={(e) => setDept(Number(e.target.value))}>
            <option value={0}>Cardiology</option>
            <option value={1}>Psychiatry</option>
            <option value={2}>General</option>
          </Select>
          <Button onClick={handleRegisterDoctor} disabled={loading}>
            {loading ? 'Registering...' : 'Register Doctor'}
          </Button>
          {error && <Alert>{error}</Alert>}
        </Content>
      </Container>
    </>
  );
};

// Styled components

// Main container to occupy the full screen
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #f0f4f8;
`;

// Content area to hold the form centrally
const Content = styled.div`
  max-width: 600px;
  width: 100%;
  margin-top: 50px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;

  @media (max-width: 768px) {
    margin: 20px;
    padding: 15px;
  }
`;

// Title styling
const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

// Input styling
const Input = styled.input`
  width: 100%;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

// Select dropdown styling
const Select = styled.select`
  width: 100%;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

// Button styling
const Button = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.9rem;
  }
`;

// Alert for error messages
const Alert = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

export default RegisterDoctor;
