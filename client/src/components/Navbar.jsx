import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../images/logo.png";
import API from "../API";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLayerGroup, faGamepad, faRightToBracket, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [categories, setCategories] = React.useState([]);
  const [platforms, setPlatforms] = React.useState([]);
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
    const getPlatforms = async () => {
      try {
        const data = await API.getPlatforms();
        setPlatforms(data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();
    getPlatforms();
  }, []);

  const logoutNavbar = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
      <div className="dropdown-container">
        <div className="logo">
          <a href="/">
            <img src={Logo} alt="logo" />
          </a>
        </div>
        </div>
        <input className="side-menu" type="checkbox" id="side-menu"/>
        <label className="hamb" htmlFor="side-menu"><span className="hamb-line"></span></label>
        <div className="links">
          <div className="dropdown-container">
            <button className="dropdown-button"><FontAwesomeIcon icon={faGamepad} />PIATTAFORME</button>
            <div className="dropdown-content">
              {platforms.map((plat) => (
                <a key={plat.id} href={`/?platform=${plat.id}`}>
                  {plat.console.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <div className="dropdown-container">
            <button className="dropdown-button"><FontAwesomeIcon icon={faLayerGroup} />RECENSIONI</button>
            <div className="dropdown-content">
              {categories.map((cat) => (
                <a key={cat.id} href={`/?cat=${cat.id}`}>
                  {cat.category.toUpperCase()}
                </a>
              ))}
            </div>
          </div>
          <div className="dropdown-container">
          <button className="dropdown-button" onClick={() => navigate("/news")}><FontAwesomeIcon icon={faNewspaper} /> NEWS</button>
          </div>
        </div>
        <div className="user-links">
          {currentUser ? (
            <div className="dropdown-container">
              <button className="dropdown-button">
                <FontAwesomeIcon icon={faUser} /> {currentUser.username}
              </button>
              <div className="dropdown-content">
                <Link to={`/user`}>
                  {currentUser.username}
                </Link>
                {currentUser?.role === "admin" && (
                  <Link to="/write" state={""}>
                    Write
                  </Link>
                )}
                <Link onClick={logoutNavbar}>
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            <div className="dropdown-container">
              <button className="dropdown-button" onClick={() => navigate("/login")}><FontAwesomeIcon icon={faRightToBracket} />LOGIN</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
