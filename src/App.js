import logo from './logo.svg';
import './App.css';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './admin/admin-dashboard';
import CustomerDashboard from './customer/customer-dashboard';
import SellerDashboard from './seller/seller-dashboard';
import Navbar from './components/navbar';
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="signup" element={<Signup/>}/>
            <Route path="/" element={<h1>Welcome to ShopNext.. Please Login.</h1>}/>
            <Route path="/products" element={<h1>Products</h1>}/>
            <Route path="/about" element={<h1>About</h1>}/>
            <Route path="/contact" element={<h1>Contact</h1>}/>
            <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
            <Route path="/customer-dashboard" element={<CustomerDashboard/>}/>
            <Route path="/seller-dashboard" element={<SellerDashboard/>}/>
          </Routes>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
