import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";
import Home from './Pages/Home'
import About from './Pages/About'
import Contact from './Pages/Contact'
import 'bootstrap/dist/css/bootstrap.min.css';


const Nav = () =>(
  <ul className="nav justify-content-center">
    <li className="nav-item">
      <Link className="nav-link" to="/">
        Home
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/About">
        About
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/Contact">
        Contact
      </Link>
    </li>
  </ul>
)



function App() {
  return (
    <Router>
      <Nav />
      <Route exact path="/" component={Home}/>
      <Route exact path="/About" component={About}/>
      <Route exact path="/Contact" component={Contact}/>
    </Router>
  );
}

export default App;
