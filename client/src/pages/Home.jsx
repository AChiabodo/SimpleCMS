import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../API";

const postsPerPage = import.meta.env.VITE_SIZE;

const Home = () => {
  // Declaring a state variable called posts and initializing it to an empty array
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const navigate = useNavigate();
  // Getting the current URL query string (if any) using the useLocation hook from react-router-dom
  const queryParams = new URLSearchParams(useLocation().search);
  const cat = queryParams.get('cat');
  const platform = queryParams.get('platform');

  // Recuperare il numero totale di post al montaggio del componente
 useEffect(() => {
  const fetchTotalPosts = async () => {
    try {
      const total = await API.getPostsNumber(cat,platform);
      setTotalPosts(total.num);
    } catch (error) {
      console.error('Errore nel recupero del numero totale di post:', error);
    }
  };
  fetchTotalPosts();
}, [cat,platform]);

  // Defining an effect that runs when the cat variable changes
  useEffect(() => {
    // Defining an asynchronous function called fetchData
    const fetchData = async () => {
      try {
        setPosts([]);
        // Making an HTTP GET request to the server to retrieve posts data based on the cat variable
        const res = await API.getPosts(cat,platform,currentPage);
        // Updating the posts state variable with the retrieved data
        setPosts(res);
      } catch (err) {
        // Logging any errors that occur during the request
        console.log(err);
      }
    };
    // Calling the fetchData function
    fetchData();
  }, [cat,platform,currentPage]); // Specifying that this effect should only run when the cat variable changes

  // Defining a helper function called getText that takes an HTML string and returns the text content
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };

  // Funzione per gestire il click sui pulsanti di paginazione
 const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
};

// Calcolo del numero totale di pagine
const totalPages = Math.ceil(totalPosts / postsPerPage);

const generatePageNumbers = () => {
  const pageNumbers = [];
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);
 
  pageNumbers.push(1); // Prima pagina
  // Aggiungi le pagine precedenti e successive alla pagina corrente
  for (let i = startPage; i <= endPage; i++) {
    if(!pageNumbers.includes(i)){
      pageNumbers.push(i);
    }
  }
  if(!pageNumbers.includes(totalPages) && totalPages > 1){
    pageNumbers.push(totalPages); // Ultima pagina
  }
 
  return pageNumbers;
 };

  // Rendering the Home component
  return (
    <div className="home">
      <div className="posts">
        {/* Mapping over the posts state variable and rendering a Post component for each post */}
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post-img">
              <img src={import.meta.env.VITE_URL + `/uploads/${post.img}`} alt="post cover" />
            </div>
            <div className="content">
              {/* Rendering a link to the post page */}
              <Link className="link" onClick={() => navigate(`/post/${post.id}`)}>
                <h1>{post.title}</h1>
              </Link>
              {/* Rendering the post description */}
              <p>{getText(post.desc)}</p>
              {/* Rendering a button to read more */}
              <Link className="link" onClick={() => navigate(`/post/${post.id}`)}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
        <div className="pagination">
      {generatePageNumbers && generatePageNumbers().map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          disabled={pageNumber === currentPage}
        >
          {pageNumber}
        </button>
      ))}
    </div>
      </div>
      
    </div>
  );
};

export default Home;
