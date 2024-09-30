import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { abi } from '../abi'; // Import your contract's ABI
import styled from 'styled-components'; // Import styled-components
import NavBar from './NavBar';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const DepartmentNumber = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

const PrescriptionList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const PrescriptionItem = styled.li`
  margin: 15px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #e9ecef;
  }
`;

const PrescriptionHeader = styled.h2`
  margin: 0;
`;

const Details = styled.div`
  padding-left: 20px;
  border-left: 2px solid #007bff;
  margin-top: 10px;
  color: #555;
`;

const GetPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]); // State for prescriptions
  const [department, setDepartment] = useState(''); // State for department
  const [departmentNo, setDepartmentNo] = useState(''); // State for department number
  const [account, setAccount] = useState(''); // State for user's account
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null); // State for selected prescription

  // Initialize Web3 and the contract
  const web3 = new Web3(window.ethereum);
  const contractAddress = '0x0a9e31512Cc63866839aCaE9EE542EaCB460CFa6'; // Replace with your contract address
  const contract = new web3.eth.Contract(abi, contractAddress);

  useEffect(() => {
    fetchAccount(); // Fetch user's account

    const storedDoctor = JSON.parse(localStorage.getItem('Doctor')); // Get doctor data from local storage
    console.log("Stored Doctor Data: ", storedDoctor); // Debugging: check local storage data

    if (storedDoctor && storedDoctor.dept !== undefined) {
      const deptIndex = storedDoctor.dept; // Assuming storedDoctor.dept is 0, 1, or 2
      console.log("Stored Doctor Department Index: ", deptIndex); // Log the department index

      // Set department based on the index
      switch (deptIndex) {
        case 0:
          setDepartment('Cardiology');
          setDepartmentNo('0');
          break;
        case 1:
          setDepartment('Psychiatry');
          setDepartmentNo('1');
          break;
        case 2:
          setDepartment('General');
          setDepartmentNo('2');
          break;
        default:
          console.warn("Unknown department index: ", deptIndex); // Handle unknown indexes
          break;
      }

      // Fetch prescriptions only after setting the department
      fetchPrescriptionsByDepartment(deptIndex);
    } else {
      console.warn("No valid Doctor data found in local storage."); // Handle absence of doctor data
    }
  }, []);

  const fetchPrescriptionsByDepartment = async (departmentNo) => {
    try {
      // Call the smart contract method to get prescriptions for the specified department
      const prescriptionsData = await contract.methods.getDepartmentPrescriptions(departmentNo).call();
      console.log("Fetched Prescriptions Data: ", prescriptionsData); // Log fetched data

      if (prescriptionsData && prescriptionsData.length > 0) {
        // Format the fetched prescriptions data
        const formattedPrescriptions = prescriptionsData.map(prescription => ({
          prescriptionId: prescription.prescriptionId,
          userId: prescription.userId,
          // Convert timestamp to Number if it's BigInt
          timestamp: new Date(Number(prescription.timestamp) * 1000).toLocaleString(),
          description: prescription.description,
          dept: prescription.dept,
          medicines: prescription.medicines,
          documents: prescription.documents,
          allergies: prescription.allergies,
          isFulfilled: prescription.isFulfilled,
        }));

        setPrescriptions(formattedPrescriptions); // Update state with formatted prescriptions
      } else {
        console.warn("No prescriptions data returned.");
        setPrescriptions([]); // Ensure state is cleared
      }
    } catch (error) {
      console.error("Error fetching prescriptions: ", error); // Log any errors
    }
  };

  // Fetch user's account address
  const fetchAccount = async () => {
    try {
      const accounts = await web3.eth.requestAccounts(); // Request user's accounts
      setAccount(accounts[0]); // Set the account state
    } catch (error) {
      console.error("Error fetching accounts: ", error); // Log any errors
    }
  };

  // Handle prescription click
  const handlePrescriptionClick = (prescriptionId) => {
    if (selectedPrescriptionId === prescriptionId) {
      // Deselect if already selected
      setSelectedPrescriptionId(null);
    } else {
      // Select the clicked prescription
      setSelectedPrescriptionId(prescriptionId);
    }
  };

  // Find the selected prescription for displaying details
  const selectedPrescription = prescriptions.find(p => p.prescriptionId === selectedPrescriptionId);

  return (
    <Container>
        <NavBar/>
      <Title>Patient Details </Title>
      
      <PrescriptionList>
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <PrescriptionItem key={prescription.prescriptionId} onClick={() => handlePrescriptionClick(prescription.prescriptionId)}>
              <PrescriptionHeader>Patient Detail : {prescription.prescriptionId}</PrescriptionHeader>
              {selectedPrescriptionId === prescription.prescriptionId && (
                <Details>
                  <p>User ID: {prescription.userId}</p>
                  <p>Description: {prescription.description}</p>
                 
                  <p>Medicines: {prescription.medicines.join(', ')}</p>
                  <p>Supect Disease: {prescription.allergies.join(', ')}</p>
                 
                  <p>Created At: {prescription.timestamp}</p>
                </Details>
              )}
            </PrescriptionItem>
          ))
        ) : (
          <p>No prescriptions found for your department.</p>
        )}
      </PrescriptionList>
    </Container>
  );
};

export default GetPrescription;
