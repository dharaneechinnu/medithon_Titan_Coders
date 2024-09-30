import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import Web3 from 'web3'; // Import Web3
import { abi } from '../abi'; // Import ABI for the smart contract
import { useNavigate } from 'react-router-dom';

const WalletConnect = () => {
    const [account, setAccount] = useState(''); // State for storing wallet address
    const [error, setError] = useState('');
    const [isDoctor, setIsDoctor] = useState(false); // State for doctor verification
    const [doctorName, setDoctorName] = useState(''); // State to store doctor's name
    const navigate = useNavigate();
    const contractAddress = '0x0a9e31512Cc63866839aCaE9EE542EaCB460CFa6'; // Replace with your contract address

    const connectWallet = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum); // Create Web3 instance
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const connectedAccount = accounts[0];
                setAccount(connectedAccount);
                console.log('Wallet connected:', connectedAccount);
                
                // Verify if the connected account is a doctor
                await verifyDoctor(connectedAccount, web3);
            } catch (err) {
                console.error('Wallet connection error:', err);
                setError('Failed to connect wallet. Please try again.');
            }
        } else {
            setError('Please install MetaMask or another wallet provider.');
        }
    };

    const verifyDoctor = async (account, web3) => {
        try {
            const contract = new web3.eth.Contract(abi, contractAddress);
            const doctorDetails = await contract.methods.getDoctorDetails(account).call();
    
            // Convert BigInt properties to strings
            const sanitizedDoctorDetails = convertBigIntToString(doctorDetails);
    
            if (sanitizedDoctorDetails.doctorAddress !== '0x0000000000000000000000000000000000000000') {
                setIsDoctor(true);
                setDoctorName(sanitizedDoctorDetails.name); // Assuming doctor name is stored in the struct
                console.log(sanitizedDoctorDetails);
    
                // Store sanitized doctorDetails in local storage
                localStorage.setItem("Doctor", JSON.stringify(sanitizedDoctorDetails));
                setError(''); // Clear error if verification is successful

                // Navigate to the prescription page if the user is a doctor
                navigate('/AddPrescription');
            } else {
                setIsDoctor(false);
                setDoctorName(''); // Clear previous doctor name
                setError('This wallet is not associated with a doctor.');
            }
        } catch (err) {
            console.error('Error verifying doctor:', err);
            setError('Error verifying wallet. Please try again.');
        }
    };

    // Helper function to convert BigInt to string
    const convertBigIntToString = (obj) => {
        if (typeof obj === 'bigint') {
            return obj.toString(); // Convert BigInt to string
        } else if (Array.isArray(obj)) {
            return obj.map(convertBigIntToString); // Recursively process array
        } else if (typeof obj === 'object' && obj !== null) {
            return Object.fromEntries(
                Object.entries(obj).map(([key, value]) => [key, convertBigIntToString(value)]) // Recursively process object
            );
        }
        return obj; // Return the value if it's neither a BigInt, array, nor object
    };
    
    return (
        <>
            <GlobalStyle />
            <Container>
                <Content>
                    <Title>Connect Your Wallet</Title>
                    <Button onClick={connectWallet}>Connect Wallet</Button>
                    {account && <Message>Connected: {account}</Message>}
                    {isDoctor && <Message>This wallet is associated with a doctor: {doctorName}</Message>}
                    {!isDoctor && account && <Alert>This wallet is not associated with a doctor.</Alert>}
                    {error && <Alert>{error}</Alert>}
                </Content>
            </Container>
        </>
    );
};

// Global style to reset padding, margin, and set up default styles
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

// Main container to occupy full screen
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    background-color: #f0f4f8;
`;

// Content box for the form area
const Content = styled.div`
    width: 100%;
    max-width: 400px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        padding: 15px;
    }
`;

// Title styling
const Title = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 20px;
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
`;

// Success message styling
const Message = styled.div`
    color: green;
    text-align: center;
    margin-top: 15px;
`;

// Alert message styling
const Alert = styled.div`
    color: red;
    text-align: center;
    margin-top: 15px;
`;

export default WalletConnect;
