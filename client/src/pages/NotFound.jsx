// File: NotFound.jsx
import React from 'react';
import { Link } from "react-router-dom";
import '../style.scss'; // Importa gli stili generali del sito

const NotFound = () => {
 return (
    <div className="not-found">
      <h1>404 - Not Found</h1>
      <p>La pagina che stai cercando non esiste.</p>
      <Link to="/">Torna alla homepage</Link>
    </div>
 );
};

export default NotFound;