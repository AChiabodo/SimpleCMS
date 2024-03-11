import React, { useRef, useState , useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import API from "../API";
import Editor from "../components/Editor";

const Write = () => {
  // Get the location state using the `useLocation` hook
  // will be used to check if we are in writing o edit mode
  const state = useLocation().state;
  // Define the navigate function
  const navigate = useNavigate();
  // Define the state variables
  const [title, setTitle] = useState(state?.title || "");
  const [desc, setDesc] = useState(state?.desc || "");
  const [text, setText] = useState(state?.text || "");
  const [file, setFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(state?.cat || "");
  const [preview, setPreview] = useState(state?.img ? import.meta.env.VITE_URL + `/uploads/${state?.img}` : "");
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState(state?.platforms_id ? state.platforms_id.map((id) => (parseInt(id))) : []);
  const [status, setStatus] = useState(state?.draft == 0 ? 0 : 1); // Imposta lo stato predefinito su 'draft'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const textareaRef = useRef(null);

  useEffect(() => {
  const textarea = textareaRef.current;
  if (textarea) {
      textarea.style.height = 'auto'; // Reset the height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the new height
  }
  }, [desc]);


  useEffect(() => {
    if (file){
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)  
    }
}, [file])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await API.getCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPlatforms = async () => {
       try {
         const data = await API.getPlatforms();
         setPlatforms(data);
       } catch (error) {
         console.log(error);
       }
    };
   
    fetchPlatforms();
   }, []);

  // Define the upload function
  const upload = async () => {
    try {
      if (!file) return "";
      const res = await API.uploadImage(file)
      console.log("filename : " + JSON.stringify(res));
      // Return the filename of the uploaded file
      return res;
    } catch (err) {
      console.log(err);
      return "";
    }
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
   }

  // Define the handleClick function to handle the form submission
  const handlePublish = async (e) => {
    e.preventDefault();
    if (selectedPlatforms.length == 0 && status == 0){
      setError("Seleziona almeno una piattaforma");
      return;
    }
    if (selectedCategory.length == 0){
      setError("Seleziona una categoria");
      return;
    }
    if (title.length == 0){
      setError("Inserisci un titolo");
      return;
    }
    if (desc.length == 0){
      setError("Inserisci una descrizione");
      return;
    }
    if (text.length == 0  && status == 0){
      setError("Inserisci un testo per poter pubblicare il post");
      return;
    }
    if (file && file.size > 1000000){
      setError("L'immagine è troppo grande, massimo 1MB");
      return;
    }
    
    setLoading(true);
    // Upload the image and get the filename
    let imgUrl = "";
    if (file){
      imgUrl = await upload();
      if (!imgUrl || imgUrl == "") {
        setLoading(false);
        setError("Errore durante il caricamento dell'immagine");
        return;
      }
    }
    if (!file && !preview && status == 0){
      setLoading(false);
      setError("Inserisci un'immagine di copertina");
      return;
    }
    setError(null);
    try {
      // Send a PUT request to update a post if the location state is defined (writing),
      // otherwise send a POST request to create a new post
      state
        ? await API.updatePost({
            id: state.id,
            title,
            desc: desc,
            text: text,
            cat: selectedCategory,
            img: file ? imgUrl : "",
            draft : parseInt(status) == 1 ? true : false,
            platforms : selectedPlatforms,
          })
        : await API.createPost({
            title,
            desc: desc,
            text: text,
            cat: selectedCategory,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            draft : parseInt(status) == 1 ? true : false,
            platforms : selectedPlatforms,
          });

      // Navigate to the homepage after the post is saved or updated
      navigate("/");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleRemoveImage = async (e) => {
    setFile(null)
    setPreview(undefined)
    e.preventDefault();
  }


  return (
    <div className="add">
      <div className="content">
      <label htmlFor="title">Titolo</label>
        <input
          type="text"
          id="title"
          placeholder="Inserisci un titolo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="desc-container">
        <label htmlFor="desc">Descrizione</label>
        <textarea
        ref={textareaRef}
        id="desc"
        placeholder="Inserisci una descrizione..."
        className="editor"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        onInput={() => {
            const textarea = textareaRef.current;
            if (textarea) {
              textarea.style.height = 'auto'; // Reset the height
              textarea.style.height = `${textarea.scrollHeight}px`; // Set the new height
            }
        }}
        style={{
            width: '100%',
            height: 'auto',
            resize: 'none', // Disabilita il ridimensionamento dell'area di testo
            overflow: 'hidden', // Nasconde la barra di scorrimento
        }}
        />
</div>
<div className="editor-container" style={{ width: '100%', height: '100%', overflowY: 'hidden' }}>
 <ReactQuill
    theme="snow"
    onChange={setText}
    value={text}
    modules={Editor.modules}
    formats={Editor.formats}
    bounds={'#root'}
    style={{ width: '100%', height: '100%' }}
 />
</div>
      </div>
      <div className="menu">
      <div className="status-container">
      <label htmlFor="status">Status</label>
      <select
        id="status"
        value={status}
        onChange={(e) => {
          console.log("old status : " + status + " New Status : " + e.target.value);
          setStatus(e.target.value)
        }}
      >
        <option value={1}>Draft</option>
        <option value={0}>Public</option>
      </select>
    </div>
    {error && <div className="error">{error}</div>}
        <div className="item">
          <h1>Copertina</h1>
          
          {file ? <img src={preview} height="auto" width="100%" /> : <img src={preview} height="auto" width="100%" />}
          
          <div className="buttons">
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
            {preview && <button onClick={handleRemoveImage}>Remove Image</button>}
          </div>
        </div>
        <div className="item">
        <h1>Categoria</h1>
        {categories.map((category) => (
            <div className="cat" key={category.id}>
              <input
                type="radio"
                checked={selectedCategory == category.id}
                name="cat"
                value={category.category}
                id={category.id}
                onChange={() => {
                  setSelectedCategory(category.id)}}
              />
              {<label htmlFor={category.id}>{capitalizeFirstLetter(category.category)}</label>}
            </div>
          ))}
        </div>
        <div className="item">
 <h1>Piattaforme</h1>
 {platforms.map((platform) => (
    <div className="cat" key={platform.id}>
      <input
        type="checkbox"
        checked={selectedPlatforms.includes(platform.id)}
        name="platform"
        value={platform.id}
        id={platform.id}
        onChange={(e) => {
          const isChecked = e.target.checked;
          if (isChecked) {
            setSelectedPlatforms([...selectedPlatforms, platform.id]);
          } else {
            setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
          }
        }}
      />
      <label htmlFor={platform.id}>{capitalizeFirstLetter(platform.console)}</label>
    </div>
  ))}
</div>

  {loading ? <button onClick={handlePublish} disabled>Confirm Changes</button> : <button onClick={handlePublish}>Confirm Changes</button>}
      </div>
    </div>
  );
};



export default Write;
