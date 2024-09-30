// NavBar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from local storage (or any state management you're using)
    localStorage.removeItem('user'); // Adjust based on your actual local storage key
    localStorage.removeItem('accessToken'); // Adjust based on your actual local storage key
    
    // Optionally, clear any other relevant session data

    // Redirect to the login page
    navigate('/'); // Change to your login route
  };

  return (
    <NavContainer>
      <NavItem>
        <StyledLink to="/dashboard">Add Doctor</StyledLink>
      </NavItem>
      <NavItem>
        <StyledLink to="/aduit">Audit Log</StyledLink>
      </NavItem>
      <NavItem>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </NavItem>
    </NavContainer>
  );
};

// Styled components for the NavBar
const NavContainer = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
  background-color: #007bff; /* Change color as needed */
  color: white;
`;

const NavItem = styled.div`
  margin: 0 15px;
`;

const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export default NavBar;
