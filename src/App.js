import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserRegister from './Components/UserRegister';
import Navbar from './Components/Navbar';
import UserLogin from './Components/UserLogin';
import Home from './Components/Home';
import ApplicationForm from './Components/ApplicationForm';
import AdminRegister from './Components/AdminRegister';
import EmiCalculator from './Components/EmiCalculator';
import AllFinanci from './Components/AllFinanci';
import FeedbackForm from './Components/FeedbackForm';
import ReviewsPage from './Components/ReviewsPage';
import UserProfilePage from './Components/UserProfilePage';
import ApplicationReports from './Components/ApplicationReports';
import AdminDashboard from './Components/AdminDasboard';
import AdminUserManagement from './Components/AdminUserManagement';
import AdminLoanApplication from './Components/AdminLoanApplication';
import AdminEmiManagement from './Components/AdminEmiManagement';
import AdminNotifications from './Components/AdminNotifications';
import AddProduct from './Components/AddProduct';
import FeedbackList from './Components/FeedbackList';
import Adminsidebar from './Components/Adminsidebar';
import AddEmi from './Components/AddEmi';
import UserEMIPayment from './Components/UserEmiPayment';
import Manager from './Components/Manager';
import EnterrPage from './Components/EnterrPage';
import WelcomePage from './Components/WelcomePage';
import ProductDetails from './Components/ProductDetails';
import AdminNotificationForm from './Components/AdminNotificationForm';
import UserNotifications from './Components/UserNotifications';
import AdminpastNotifications from './Components/AdminpastNotifications';
import ManagerPanel from './Components/ManagerPanel';
import ApprovedCompanies from './Components/ApprovedCompanies';
import CompanyLogin from './Components/CompanyLogin';
import CalculateEmi from './Components/CalculateEmi';
import FinanceDashboard from './Components/FinanceDashboard';
import CompanyProductTable from './Components/CompanyProductTable';
import CompanyProfilePage from './Components/CompanyProfilePage';
import ManagerHeader from './Components/ManagerHeader';
import Footer from './Components/Footer';
import LoanHistryForm from './Components/LoanHistryForm';
import LoanHistryTable from './Components/LoanHistryTable';
import UserLoanHistory from './Components/UserLoanHistry';
import ManagerDashboard from './Components/ManagerDashboard';
import TotalUsers from './Components/TotalUsers';
import CompanyDropdown from './Components/CompanyDropdown';
import EditUserProfile from './Components/EditUserProfile';
import EMessage from './Components/EMessage';
import NotificationHistory from './Components/NotificationHistory';
import TrackHistory from './Components/TrackHistory';
import MessageInbox from './Components/MessageInbox';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/navbar" element={<Navbar />} />
       <Route path="/userregister" element={<UserRegister />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/applicationform" element={<ApplicationForm />} />
        <Route path="/adminregister" element={<AdminRegister />} />
        <Route path="/EmiCalculator" element={<EmiCalculator />} />
        <Route path="/AllFinanci" element={<AllFinanci />} />
        <Route path="/FeedbackForm" element={<FeedbackForm />} />
        <Route path="/Reviewspage" element={<ReviewsPage />} />
       <Route path="/UserProfilePage" element={<UserProfilePage />} />
       <Route path="/ApplicationReports" element={<ApplicationReports />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/AdminUserManagement" element={<AdminUserManagement />} />
<Route path="/AdminLoanApplication" element={<AdminLoanApplication/>}/>
<Route path="/AdminEmiManagement" element={<AdminEmiManagement/>}/>
<Route path="/AdminNotifications" element={<AdminNotifications/>}/>
<Route path="/AddProduct" element={<AddProduct/>}/>
<Route path="/FeedbackList" element={<FeedbackList/>}/>
<Route path="/Adminsidebar" element={<Adminsidebar/>}/>
<Route path="/AddEmi" element={<AddEmi/>}/>
<Route path="/UserEmiPayment" element={<UserEMIPayment/>}/>
<Route path="/Manager" element={<Manager/>}/>
<Route path="/enterrPage" element={<EnterrPage/>}/>
<Route path="/" element={<WelcomePage/>}/>
<Route path="/ProductDetails" element={<ProductDetails/>}/>
<Route path="/AdminNotificationForm" element={<AdminNotificationForm/>}/>
<Route path='UserNotifications' element={<UserNotifications/>}/>
<Route path='AdminpastNotifications' element={<AdminpastNotifications/>}/>
<Route path="/ManagerPanel" element={<ManagerPanel/>}/>
<Route path="/ApprovedCompanies" element={<ApprovedCompanies/>}/>
<Route path="/CompanyLogin" element={<CompanyLogin/>}/>
<Route path="/CalculateEmi" element={<CalculateEmi/>}/>
<Route path="/FinanceDashboard" element={<FinanceDashboard/>}/>
<Route path="/CompanyProductTable" element={<CompanyProductTable/>}/>
<Route path="/CompanyProfilePage" element={<CompanyProfilePage/>}/>
<Route path="/ManagerHeader" element={<ManagerHeader/>}/>
<Route path="/Footer" element={<Footer/>}/>
<Route path="/LoanHistryForm" element={<LoanHistryForm/>}/>
<Route path="/LoanHistryTable" element={<LoanHistryTable/>}/>
<Route path='/UserLoanHistry' element={<UserLoanHistory/>}/>
<Route path='/ManagerDashboard' element={<ManagerDashboard/>}/>
<Route path='/TotalUsers' element={<TotalUsers/>}/>
<Route path='/CompanyDropdown' element={<CompanyDropdown/>}/>
<Route path="/EditUserProfile"  element={<EditUserProfile/>}/>
<Route path="/EMessage"  element={<EMessage/>}/>
<Route path="/NotificationHistory"  element={<NotificationHistory/>}/>
<Route path="/TrackHistory"  element={<TrackHistory/>}/>
<Route path="/MessageInbox"  element={<MessageInbox/>}/>









 </Routes>
    </Router>
  );
};

export default App;
