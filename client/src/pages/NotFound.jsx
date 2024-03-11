// File: NotFound.jsx
import React from 'react';
import '../style.scss'; // Importa gli stili generali del sito

const NotFound = () => {
 return (
    <div className="not-found">
      <h1>404 - Not Found</h1>
      <p>La pagina che stai cercando non esiste.</p>
      <a href="/">Torna alla homepage</a>
    </div>
 );
};

export default NotFound;