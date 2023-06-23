[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/suhcjUE-)
# Exam #12345: "Exam Title"
## Student: s123456 LASTNAME FIRSTNAME 

## React Client Application Routes

- Route `/`: Pagina principale che mostra la lista completa delle pagine, comprese le non pubblicate se si è autenticati
- Route `/login` : Pagina per effettuare il login
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server
### API Front Office
- GET `/api/front/pages`
  - Nessun parametro per la richiesta
  - Lista delle pagine pubblicate sul sito, senza i loro contenuti
- GET `/api/front/pages/<id>`
  - id della pagina richiesta
  - Dati della pagina e relativo contenuto (Se pubblicata)
- GET `/api/front/name`
  - Nessun parametro per la richiesta
  - Nome del sito web
### API Back Office
- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/pages`
  - Nessun parametro per la richiesta
  - Lista di tutte le pagine sul sito, senza i loro contenuti
- GET `/api/pages/<id>`
  - id della pagina richiesta
  - Dati della pagina e relativo contenuto
- GET `/api/users`
  - Nessun parametro per la richiesta
  - Lista di tutti gli utenti del sito
- GET `/api/users/<id>`
  - Nessun parametro per la richiesta
  - Ritorna i dati dell'utente richiesto
- GET `/api/images`
  - Nessun parametro per la richiesta
  - Ritorna la lista dei metadati di tutte le immagini disponibili
- POST `/api/pages`
  - Il body della richiesta deve contenere:
    titolo
    data di creazione
    autore
    data di pubblicazione (opzionale : null)
    lista dei contentBlocks, ciascuno con id, tipo, contenuto e ordine
  - pageId
- PUT `/api/pages/<idPage>`
  - Unico parametro id della pagina
    Il body della richiesta deve contenere:
    titolo
    data di creazione
    autore
    data di pubblicazione (opzionale : null)
    lista dei contentBlocks, ciascuno con id, tipo, contenuto e ordine
  - Numero di righe modificate
- PUT `/api/namesite`
  - Il body contiene il nome del sito
  - Il nome del sito se l'update è andato a buon fine
- PUT `/api/pages/<id>`
  - Unico parametro l'id della pagina da eliminare
  - Numero componenti eliminati
### API Sessione
- GET `/api/sessions/current`
- POST `/api/sessions`
- DELETE `/api/sessions/current`

## Database Tables

- Table `users` - (id, name , email , salt , hash , Role)
        Contiene tutte le informazioni sugli utenti
- Table `contentBlock` - (id, page , Type , Content , Position)
        Contiene i content blocks delle varie pagine
- Table `pages` - (id, title , creationDate , author , publishDate)
        Contiene i dati delle pagine del sito
- Table `site` - Contiene il nome del sito
- Table `images` - (id, name , path)
        Contiene i metadati per le immagini mostrate sul sito

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)

