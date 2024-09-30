import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import styled from 'styled-components'; // Optional for styling

const NavBar = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    // Navigate to the login or home page
    navigate('/'); // Adjust the path as needed
  };

  return (
    <NavContainer>
      <NavItem>
        <StyledLink to="/AddPrescription">Create Prescription</StyledLink>
      </NavItem>
      <NavItem>
        <StyledLink to="/getprescription">Get Department Prescriptions</StyledLink>
      </NavItem>
      <NavItem>
        <StyledLink className='logout' as="button" onClick={handleLogout}>Logout</StyledLink>
      </NavItem>
    </NavContainer>
  );
};

// Styled Components (optional)
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-around; /* Space out the links */
  padding: 10px;
  background-color: #007bff;
  color: white;
  .logout{
    padding: 10px;
    color: white;
    border: none;
    background: transparent;
  }
`;

const NavItem = styled.div`
  margin: 0 15px;
`;

const StyledLink = styled(Link)`
  color: white; /* Link color */
  text-decoration: none; /* Remove underline */
  font-weight: bold; /* Make link bold */
  cursor: pointer; /* Change cursor to pointer for button-like behavior */

  &:hover {
    text-decoration: underline; /* Underline on hover */
  }
 
`;

export default NavBar;
