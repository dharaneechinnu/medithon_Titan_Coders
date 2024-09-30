import React, { useState } from 'react';
import Web3 from 'web3';
import { abi } from '../abi';
import styled, { createGlobalStyle } from 'styled-components';
import NavBar from './NavBar';

// Global style reset to remove margins and paddings
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

const AuditLogPage = () => {
  const [auditLog, setAuditLog] = useState([]);
  const [error, setError] = useState('');
  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x0a9e31512Cc63866839aCaE9EE542EaCB460CFa6";
  const contract = new web3.eth.Contract(abi, contractAddress);

  // Fetch audit logs from the smart contract
  const fetchAuditLog = async () => {
    try {
      const logs = await contract.methods.getAuditLogs().call();
      console.log('Fetched logs:', logs); // Check raw logs
      
      const formattedLogs = logs.map(log => ({
        initiator: log.initiator,
        action: log.action,
        timestamp: Number(log.timestamp) // Ensure conversion
      }));
      console.log('Formatted logs:', formattedLogs); // Check formatted logs
      
      setAuditLog(formattedLogs);
    } catch (error) {
      console.error('Error fetching audit log:', error);
      setError('Failed to fetch audit log. Please try again.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <NavBar />
        <Content>
          <Title>Audit Log</Title>
          <Button onClick={fetchAuditLog}>Refresh Audit Log</Button>
          <AuditLogContainer>
            {auditLog.length > 0 ? (
              auditLog.map((log, index) => (
                <LogEntry key={index}>{`${log.initiator} - ${log.action} at ${new Date(log.timestamp * 1000).toLocaleString()}`}</LogEntry>
              ))
            ) : (
              <p>No audit logs available.</p>
            )}
            {error && <Alert>{error}</Alert>}
          </AuditLogContainer>
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

// Content area to hold the main content centrally
const Content = styled.div`
  max-width: 800px;
  width: 100%;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;

  @media (max-width: 768px) {
    margin: 10px;
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

// Alert for displaying error messages
const Alert = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

// Container for audit logs
const AuditLogContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  max-height: 400px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Individual log entry
const LogEntry = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

export default AuditLogPage;
