import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../API";

const URL = import.meta.env.VITE_URL;
// Defining a functional component named Menu which takes a single prop named cat
const Menu = ({ cat,id }) => {
  // Initializing posts state with an empty array using useState hook
  const [posts, setPosts] = useState([]);
  console.log(id);
  // useEffect hook is used to fetch posts related to the category
  useEffect(() => {
    // Defining an async function fetchData to fetch posts related to the category using axios
    const fetchData = async () => {
      try {
        console.log(cat);
        if (cat){
          const res = await API.getPosts(cat,null,1,3);
          setPosts(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    // Calling fetchData function to fetch data when component is mounted or when category is changed
    fetchData();
  }, [cat]);

  return (
    <div className="menu">
 <h1>Potrebbe anche interessarti :</h1>
 {posts && posts.filter((post) => (post.id != id)).slice(0, 2).map((post) => (
   <div className="post" key={post.id}>
     <Link className="link" to={`/post/${post.id}`}>
       <div className="post-content">
         <h2 className="post-title">{post.title}</h2>
         <img src={`${URL}/uploads/${post.img}`} alt="post cover" className="post-image" />
       </div>
     </Link>
   </div>
 ))}
</div>
  );
};

export default Menu;
