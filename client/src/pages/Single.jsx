import React, { useContext, useEffect, useState } from "react";
import EditImage from "../images/edit.png";
import DeleteImage from "../images/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import API from "../API";
import DOMPurify from "dompurify";

const URL = import.meta.env.VITE_URL;

const Single = () => {
  const [post, setPost] = useState({});

  // The useLocation hook returns the current location object, which contains information about the current URL.
  const location = useLocation();
  // The useNavigate hook returns a navigate function that can be used to navigate to a new location.
  const navigate = useNavigate();

  // Extract the post ID from the current URL.
  const postId = location.pathname.split("/")[2];

  // Get the current user from the AuthContext.
  const { currentUser } = useContext(AuthContext);

  // Use the useEffect hook to fetch the blog post data from the server when the component mounts.
  useEffect(() => {
    fetchData();
  }, [postId]);

  // Handler function for deleting a blog post.
  const handleDelete = async () => {
    try {
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await API.getPost(postId);
      console.log(res);
      setPost(res);
    } catch (err) {
      console.log(err);
    }
  };

  // Helper function to extract plain text from an HTML string.
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // Render the blog post.
  return (
    <div className="single">
      {post && (<div className="content">
        {/* Render the post image. */}
        {<img src={`${URL}/uploads/${post?.img}`} alt="post cover" />}
        <div className="user">
          {/* Render the user image if it exists. */}
          {post.userImg && <img src={post.userImg} alt="user" />}
          <div className="info">
            {/* Render the post author and date. */}
            {<span>{post.username}</span>}
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {/* Render the edit and delete buttons if the current user is the author of the post. */}
          {currentUser && currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={EditImage} alt="edit" />
              </Link>
              <img onClick={handleDelete} src={DeleteImage} alt="delete" />
            </div>
          )}
        </div>
        {/* Render the post title and description. */}
        {<h1>{post.title}</h1>}
        {<i>"{getText(post.desc)}"</i>}
        {<p>{getText(post.text)}</p>}
      </div>
      )}
      {post && <Menu cat={post.cat} />}
    </div>
  );
};

export default Single;
