import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// Global Styles to remove browser default margins and paddings
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

const Home = () => {
  const [role, setRole] = useState('doctor'); // Default role is doctor

  return (
    <>
      <GlobalStyle />
      <HomeContainer>
        <NavBar>
          <Logo>Care Vault</Logo>
          <RoleSwitcher>
            <StyledLink to="/doctor">Doctor</StyledLink>
            <StyledLink to="/admin">Admin</StyledLink>
          </RoleSwitcher>
        </NavBar>

        <WelcomeSection>
          <WelcomeTitle>Welcome to Care Vault</WelcomeTitle>
          <WelcomeMessage>
            {role === 'doctor' ? 'Doctor Portal: Manage your patients, schedule, and prescriptions.' : 'Admin Portal: Manage the hospital operations and staff efficiently.'}
          </WelcomeMessage>
          <LoginMessage>Select your role above to begin.</LoginMessage>
        </WelcomeSection>
      </HomeContainer>
    </>
  );
};

// Styled Components

// Main container for the page
const HomeContainer = styled.div`
  background-color: #f0f4f7;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Navigation bar container
const NavBar = styled.nav`
  width:100vw;
  background-color: #007bff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

// Logo styling
const Logo = styled.div`
  color: white;
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

// Role switcher with links
const RoleSwitcher = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Styled link for navigation
const StyledLink = styled(Link)`
  margin: 0 10px;
  padding: 10px 15px;
  color: white;
  text-decoration: none;
  background-color: #0056b3;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #003f7f;
  }

  @media (max-width: 768px) {
    margin: 5px;
    width: 100%;
    text-align: center;
  }
`;

// Welcome section for the hospital theme
const WelcomeSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 50px; // Moves the section to the top with spacing

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

// Welcome title
const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Welcome message based on user role
const WelcomeMessage = styled.p`
  font-size: 1.3rem;
  color: #555;
  max-width: 800px;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// Message for selecting login role
const LoginMessage = styled.p`
  margin-top: 30px;
  font-size: 1.1rem;
  color: #888;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default Home;
