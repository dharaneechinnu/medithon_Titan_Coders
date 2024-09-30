import React, { useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3'; // Import Web3
import { abi } from '../abi'; // Import ABI for the smart contract
import NavBar from './NavBar';

const AddPrescription = () => {
    const [userId, setUserId] = useState(''); // State for user ID
    const [description, setDescription] = useState(''); // State for prescription description
    const [medicines, setMedicines] = useState([]); // State for medicines
    const [documents, setDocuments] = useState([]); // State for documents
    const [allergies, setAllergies] = useState([]); // State for allergies
    const [dept, setDept] = useState(''); // State for department
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const contractAddress = '0x0a9e31512Cc63866839aCaE9EE542EaCB460CFa6'; // Replace with your contract address

    const createPrescription = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.getAccounts(); // Get user's accounts

            try {
                const contract = new web3.eth.Contract(abi, contractAddress);

                // Call the createPrescription method
                await contract.methods.createPrescription(
                    userId,
                    description,
                    dept,
                    medicines,
                    documents,
                    allergies
                ).send({ from: accounts[0] }); // Send transaction from user's account

                setSuccessMessage('Prescription created successfully!');
                setError('');
            } catch (err) {
                console.error('Error creating prescription:', err);
                setError('Failed to create prescription. Please try again.');
                setSuccessMessage('');
            }
        } else {
            setError('Please install MetaMask or another wallet provider.');
            setSuccessMessage('');
        }
    };

    const handleInputChange = (setter) => (e) => {
        const values = e.target.value
            .split(',')
            .map(value => value.trim())
            .filter(value => value); // Remove empty values
        setter(values);
    };

    const handleDeptChange = (e) => {
        const selectedDept = e.target.value;
        setDept(selectedDept);
        
        // Store selected department in local storage
        localStorage.setItem('Department', selectedDept);
    };

    return (
        <FullScreenContainer>
            <NavBar />
            <FormContainer>
                <Title>Add Prescription</Title>
                <Input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="Medicines"
                    value={medicines.join(', ')}
                    onChange={handleInputChange(setMedicines)}
                />
                <Input
                    type="text"
                    placeholder="What test should taken"
                    value={documents.join(', ')}
                    onChange={handleInputChange(setDocuments)}
                />
                <Input
                    type="text"
                    placeholder="Suspect Disease"
                    value={allergies.join(', ')}
                    onChange={handleInputChange(setAllergies)}
                />
                <Select value={dept} onChange={handleDeptChange}>
                    <option value="">Select Department</option>
                    <option value="0">Cardiology</option>
                    <option value="1">Psychiatry</option>
                    <option value="2">General</option>
                </Select>
                <Button onClick={createPrescription}>Create Prescription</Button>
                {successMessage && <Message>{successMessage}</Message>}
                {error && <Alert>{error}</Alert>}
            </FormContainer>
        </FullScreenContainer>
    );
};

// Styled Components
const FullScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #f9f9f9;
`;

const FormContainer = styled.div`
    width: 100%;
    max-width: 500px;
    padding: 40px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    text-align: center;
    color: #333;
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Select = styled.select`
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    width: 100%;
    padding: 12px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #0056b3;
    }
`;

const Message = styled.div`
    color: green;
    text-align: center;
    margin-top: 10px;
`;

const Alert = styled.div`
    color: red;
    text-align: center;
    margin-top: 10px;
`;

export default AddPrescription;
