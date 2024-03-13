import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../API";

const postsPerPage = import.meta.env.VITE_SIZE;

const News = () => {
 const [posts, setPosts] = useState([]);
 const [currentPage, setCurrentPage] = useState(1);
 const [totalPosts, setTotalPosts] = useState(0);

 useEffect(() => {
    const fetchTotalPosts = async () => {
      try {
        const total = await API.getPostsNumber(7, null);
        setTotalPosts(total.num);
      } catch (error) {
        console.error('Errore nel recupero del numero totale di post:', error);
      }
    };
    fetchTotalPosts();
 }, []);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.getPosts(7, null, currentPage);
        setPosts(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
 }, [currentPage]);

 const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
 };

 const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
 };

 const totalPages = Math.ceil(totalPosts / postsPerPage);

 const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    pageNumbers.push(1);
    for (let i = startPage; i <= endPage; i++) {
      if(!pageNumbers.includes(i)){
        pageNumbers.push(i);
      }
    }
    if(!pageNumbers.includes(totalPages) && totalPages > 1){
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
 };

 return (
    <div className="news">
      <div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="post-img">
              <img src={import.meta.env.VITE_URL + `/uploads/${post.img}`} alt="post cover" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post.id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
        <div className="pagination">
          {generatePageNumbers().map((pageNumber) => (
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

export default News;