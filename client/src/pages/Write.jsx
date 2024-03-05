import React, { useState , useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import API from "../API";

const Write = () => {
  // Get the location state using the `useLocation` hook
  // will be used to check if we are in writing o edit mode
  const state = useLocation().state;

  // Define the state variables
  const [title, setTitle] = useState(state?.title || "");
  const [value, setValue] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [preview, setPreview] = useState()

  // Define the navigate function
  const navigate = useNavigate();

  useEffect(() => {
    if (!file) {
        setPreview(undefined)
        return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

}, [file])

  // Define the upload function
  const upload = async () => {
    try {
      // Create a new FormData object and append the file to it
      //const formData = new FormData();
      //formData.append("file", file);

      // Send a POST request to upload the file
      //const res = await axios.post("/upload", formData);
      const res = await API.uploadImage(file)
      console.log("filename : " + JSON.stringify(res));
      // Return the filename of the uploaded file
      return res;
    } catch (err) {
      console.log(err);
    }
  };

  // Define the handleClick function to handle the form submission
  const handlePublish = async (e) => {
    e.preventDefault();

    // Upload the image and get the filename
    const imgUrl = await upload();

    try {
      // Send a PUT request to update a post if the location state is defined (writing),
      // otherwise send a POST request to create a new post
      state
        ? await API.updatePost({
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            draft : false,
          })
        : await API.createPost({
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            draft : false,
          });

      // Navigate to the homepage after the post is saved or updated
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDraft = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file){
    // Upload the image and get the filename
       imgUrl = await upload();
    }

    try {
      // Send a PUT request to update a post if the location state is defined (writing),
      // otherwise send a POST request to create a new post
      state
        ? await API.updatePost({
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            draft : true,
          })
        : await API.createPost({
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            draft : true,
          });

      // Navigate to the homepage after the post is saved or updated
      navigate("/");
    } catch (err) {
      console.log(err);
    }

  }

  const handleRemoveImage = async (e) => {
    setFile(null)
    setPreview(undefined)
    e.preventDefault();
  }


  return (
    <div className="add">
      <div className="content">
      
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        
        <div className="editor-container">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          </span>
          
          {file &&  <img src={preview} height="auto" width="100%" /> }
          
          <div className="buttons">
            <button onClick={handleDraft}>Save as a draft</button>
            {preview && <button onClick={handleRemoveImage}>Remove Image</button>}
            <button onClick={handlePublish}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "art"}
              name="cat"
              value="art"
              id="art"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="art">Art</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "science"}
              name="cat"
              value="science"
              id="science"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="science">Science</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "technology"}
              name="cat"
              value="technology"
              id="technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "cinema"}
              name="cat"
              value="cinema"
              id="cinema"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="cinema">Cinema</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "design"}
              name="cat"
              value="design"
              id="design"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="design">Design</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Write;
