import './App.css';
import Login from './components/jsx/Login';
import { AuthProvider } from './components/contexts/AuthContext';
import ProtectedRoute from './components/protectedroute';
import ADash from './components/jsx/ADash';
import UserReg from './components/jsx/AUserReg';
import UserDisp from './components/jsx/AUserDisp';
import UserEdit from './components/jsx/AUserEdit';
import UserChPass from './components/jsx/AUserChPass';
import FDash from './components/jsx/FDash';
import FDisp from './components/jsx/FDisp';
import FUCP from './components/jsx/FUserChPass';
import EventReg from './components/jsx/EventReg';
import EventEdit from './components/jsx/EventEdit';
import Ahall from './components/jsx/HallAvailable';
import SDash from './components/jsx/SDash';
import SDisp from './components/jsx/SDisp';
import WDisp from './components/jsx/WDisp';
import WEdit from './components/jsx/WaitlistEdit';
import {BrowserRouter as Router,Routes,Route, Switch} from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/FDash" element={<ProtectedRoute element={FDash} />} />
          <Route path="/SDash" element={<ProtectedRoute element={SDash} />} />
          <Route path="/EventReg" element={<ProtectedRoute element={EventReg} />} />
          <Route path="/EventEdit/:id" element={<ProtectedRoute element={EventEdit} />} />
          <Route path="/Ahall" element={<ProtectedRoute element={Ahall} />} />
          <Route path="/FDisp" element={<ProtectedRoute element={FDisp} />} />
          <Route path="/FUCP/:id" element={<ProtectedRoute element={FUCP} />} />
          <Route path="/SDisp" element={<ProtectedRoute element={SDisp} />} />
          <Route path="/WDisp" element={<ProtectedRoute element={WDisp} />} />
          <Route path="/WEdit/:id" element={<ProtectedRoute element={WEdit} />} />
          <Route path="/ADash" element={<ProtectedRoute element={ADash} />} />
          <Route path="/UserReg" element={<ProtectedRoute element={UserReg} />} />
          <Route path="/UserDisp" element={<ProtectedRoute element={UserDisp} />} />
          <Route path="/UserEdit/:id" element={<ProtectedRoute element={UserEdit} />} />
          <Route path="/UserChPass/:id" element={<ProtectedRoute element={UserChPass} />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
