import logo from './logo.svg';
import './App.css';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './admin/admin-dashboard';
import CustomerDashboard from './customer/customer-dashboard';
import SellerDashboard from './seller/seller-dashboard';
import Navbar from './components/NavbarRedirect';
import ProtectedRoute from './components/ProtectedRoute';
import AddCategory from './admin/AddCategory';
import CategoryList from './admin/CategoryList';
import AddProduct from './seller/AddProduct';
import UploadImage from './seller/UploadImage';
import ViewProduct from './customer/ViewProduct';
import Cart from './customer/Cart';
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/" element={<Login/>}/>
            <Route
              path="/seller-dashboard"
              element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <SellerDashboard />
                </ProtectedRoute>
              }
            />


            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/add-category" element={ <ProtectedRoute allowedRoles={["admin"]}> <AddCategory />  </ProtectedRoute>} /> 
            <Route path="/categories" element={ <ProtectedRoute allowedRoles={["admin"]}> <CategoryList />  </ProtectedRoute>} /> 
            <Route path="/add-product" element={ <ProtectedRoute allowedRoles={["seller"]}> <AddProduct />  </ProtectedRoute>} /> 
            <Route path="/products" element={ <ProtectedRoute allowedRoles={["seller"]}> <AddProduct />  </ProtectedRoute>} /> 
            <Route path="/upload-image/:productId" element={<ProtectedRoute allowedRoles={["seller"]}> <UploadImage /> </ProtectedRoute>} />
            <Route path="/product/:productId" element={<ProtectedRoute allowedRoles={["customer"]}> <ViewProduct /> </ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute allowedRoles={["customer"]}> <Cart /> </ProtectedRoute>} />
          </Routes>
         
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
