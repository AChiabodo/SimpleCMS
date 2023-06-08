import "bootstrap/dist/css/bootstrap.min.css";

import { useState} from "react";
import API from './API.jsx'
import MainPage from "./Components/MainPage.jsx";
import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import modalContext from "./Context/modalContext.jsx";
import { Container } from "react-bootstrap";
import { LoginForm } from "./Components/AuthComponents.jsx";
import authContext from './Context/authContext.jsx'
import PageContainer from "./Components/PageContainer.jsx";

function App() {
  let [pages, setPages] = useState([]);
  let [nextID, setNextId] = useState(0);
  let [dirty, setDirty] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  function addPage(page) {
    page = Object.assign({},page , {user : user?user.id:1});
    setPages((films) => films.concat(Object.assign({}, page , {created : true})));
    API.addPage(page).then(id =>{
      setNextId(id+1);
      setDirty(true);
    }).catch(err => {console.log("POST err : " + err)})
  }

  function modifyPage(page) {
    page = Object.assign({},page , {user : user?user.id:1});
    setPages((pages) => {
      const list = pages.map((item) => {
        if (item.id === page.id) {
          //return new Answer(item.id, item.text,item.respondent,item.score+1,item.date);
          return Object.assign({}, item, page , {dirty : true});
        } else {
          return item;
        }
      });
      return list;
    });
    API.updatePage(page).then(
      setDirty(true)
    ).catch(err => {console.log("PUT err : " + err)})
  }

  function deletePage(page) {
    setPages((pages) => {
      const list = pages.map((item) => {
        if (item.id === page.id) {
          //return new Answer(item.id, item.text,item.respondent,item.score+1,item.date);
          return Object.assign({}, item, page , {deleted : true});
        } else {
          return item;
        }
      });
      return list;
    });
    API.deletePage(page).then(
      setDirty(true)
    ).catch(err => {console.log("PUT err : " + err)})
  }

  const doLogOut = async () => {
    await API.logOut();
    setPages([]);
    setLoggedIn(false);
    setUser(undefined);
    /* set state to empty if appropriate */
  }
  

  const loginSuccessful = (user) => {
    setUser(user);
    console.log(user)
    setLoggedIn(true);
    setDirty(true);  // load latest version of data, if appropriate
  }
  
  return (
    <BrowserRouter>
    <Container fluid>
        <modalContext.Provider
          value={{ addPage, modifyPage, deletePage ,nextID :  nextID , setNextId}}
        >
          <authContext.Provider value={{user:user?user:null , loginSuccessful:loginSuccessful , doLogOut : doLogOut , loggedIn:loggedIn}}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <MainPage pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut}/>
                </>
              }
            ></Route>
            <Route path='/login' element={loggedIn? <Navigate replace to='/' />:  <LoginForm loginSuccessful={loginSuccessful} />} />
            <Route
              path="/pages/:pageID"
              element={<PageContainer/>}
            ></Route>
          </Routes>
          </authContext.Provider>
        </modalContext.Provider>
      </Container>
    </BrowserRouter>
  );
}

export default App