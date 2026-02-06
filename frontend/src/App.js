import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Subscription from './components/Subscription/SubscriptionPage';
import PaymentForm from './components/Subscription/PaymentForm';
import SignalsPage from './Signals/SignalsPage';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/subscribe' element={<Subscription />} />
          <Route path='/PaymentForm' element={<PaymentForm />} />
          <Route path='/SignalsPage' element={<SignalsPage/>}/>
        </Routes>
      
      </BrowserRouter>
    </div>
  );
}

export default App;
