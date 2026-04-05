import './App.css';
import AssignRoles from './AssignRoles';
import Home from './Home';
import AddMed from './AddMed';
import Supply from './Supply';
import Track from './Track';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar */}
        <nav className="navbar navbar-custom">
          <div className="container-fluid d-flex justify-content-between align-items-center flex-wrap">
            <div className="navbar-brand">
              🧾 Blockchain Supply Chain <small>Quản lý chuỗi cung ứng</small>
            </div>
            <div>
              <Link to="/" className="btn btn-outline-light btn-sm me-2">🏠 Trang chủ</Link>
              <Link to="/roles" className="btn btn-outline-light btn-sm me-2">👥 Đăng ký</Link>
              <Link to="/addmed" className="btn btn-outline-light btn-sm me-2">📦 Tạo đơn hàng</Link>
              <Link to="/supply" className="btn btn-outline-light btn-sm me-2">⚙️ Vận hành</Link>
              <Link to="/track" className="btn btn-outline-light btn-sm">🔍 Theo dõi</Link>
            </div>
          </div>
        </nav>

        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/roles" component={AssignRoles} />
          <Route path="/addmed" component={AddMed} />
          <Route path="/supply" component={Supply} />
          <Route path="/track" component={Track} />
        </Switch>

        {/* Footer */}
        <div className="footer-custom">
          © 2025 - Hệ thống quản lý chuỗi cung ứng trên Blockchain | Bảo mật và minh bạch
        </div>
      </div>
    </Router>
  );
}

export default App;