import React, { useEffect, useState , useContext} from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../API";
import { AuthContext } from "../context/authContext";

const UserPage = () => {
  // Declaring a state variable called posts and initializing it to an empty array
  const [posts, setPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(currentUser);
        const res = await API.getDrafts(currentUser.id);
        setPosts(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
 }, []);

  // Defining a helper function called getText that takes an HTML string and returns the text content
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // Rendering the Home component
  return (
    <div className="user-page">
      <table className="custom-table">
      <caption>Post non pubblicati</caption>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Categoria</th>
            <th>Piattaforma</th>
            <th>Immagine</th>
            <th>Modifica</th>
            <th>Elimina</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>{post.category}</td>
              <td>
              {post.platforms && post.platforms.map((platform, index) => (
          <span key={index} style={{ marginRight: '10px' }}>
            {platform}
          </span>
        ))}
              </td>
              <td>
                {post.img && (
                 <img src={import.meta.env.VITE_URL + `/uploads/${post.img}`} alt="post cover" style={{ width: '50px', height: '50px' }} />
                )}
              </td>
              <td>
                <Link to={`/write/`} state={post}>Modifica</Link>
              </td>
              <td>
                <Link to={`/delete/${post.id}`}>Elimina</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 );
};

export default UserPage;
