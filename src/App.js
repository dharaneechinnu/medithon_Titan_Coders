
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './Pages/Home';
import RegisterDoctor from './Admin/RegisterDoctor';
import AdminLogin from './Admin/AdminLogin';
import AuditLogPage from './Admin/AuditLogPage';
import DoctorLogin from './Doctor/DoctorLogin';
import AddPrescription from './Doctor/AddPrescription';
import GetPrescription from './Doctor/GetPrescription';

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/dashboard" element={<RegisterDoctor />} />
          <Route path="/aduit" element={<AuditLogPage />} />
          <Route path="/doctor" element={<DoctorLogin />} />
          <Route path="/AddPrescription" element={<AddPrescription />} />
          <Route path="/getprescription" element={<GetPrescription />} />
        
      
        </Routes>
      </Container>
    </Router>
  );
}

// Sample styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;


// Sample pages
export default App;
