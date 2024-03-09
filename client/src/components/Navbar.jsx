import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../images/logo.png";
import API from "../API";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [categories, setCategories] = React.useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await API.getCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
  }, []);

  const logoutNavbar = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
       <div className="container">
         <div className="logo">
           <a href="/">
             <img src={Logo} alt="logo" />
           </a>
         </div>
         <div className="links">
          <div className="dropdown-container">
          <button className="dropdown-button">CATEGORIE</button>
          <div className="dropdown-content">
              {categories.map((cat) => (
                <a key={cat.id} href={`/?cat=${cat.id}`}>
                  {cat.category.toUpperCase()}
                </a>
              ))}
          </div>
          </div>
          </div>
          <div className="links">
          {currentUser ? (
          <div className="dropdown-container">
              <button className="dropdown-button">
                <FontAwesomeIcon icon={faUser} /> {currentUser.username}
              </button>
              <div className="dropdown-content">
                <Link to={`/user/${currentUser.id}`}>
                    {currentUser.username}
                </Link>
                {currentUser?.role === "admin" && (
                  <Link to="/write">
                    Write
                  </Link>
                )}
                <Link onClick={logoutNavbar}>
               Logout
             </Link>
              </div>
          </div>
          ) : (
            <div className="link">
              <Link to="/login">Login</Link>
            </div>
          )}           
         </div>
       </div>
    </div>
   );
};

export default Navbar;
