import "bootstrap/dist/css/bootstrap.min.css";

import {useEffect, useState} from "react";
import API from './API.jsx'
import MainPage, { MainTable } from "./Components/MainPage.jsx";
import { BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import pageManagementContext from "./Context/pageManagementContext.jsx";
import { Container } from "react-bootstrap";
import { LoginForm } from "./Components/AuthComponents.jsx";
import authContext from './Context/authContext.jsx';
import PageContainer from "./Components/PageContainer.jsx";

function App() {
  const [pages, setPages] = useState([]);
  const [nextID, setNextId] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [nameSite , setNameSite] = useState("CMSmall");

  function addPage(page) {
    page = Object.assign({},page , {user : user?user.id:1 , id : nextID , created : true});
    setPages((films) => films.concat(Object.assign({}, page , {created : true})));
    API.addPage(page).then(id =>{
      setSuccessMessage("Page added successfully")
      setNextId(id+1);
      setDirty(true);
    }).catch(err => {setErrorMessage(err.error)})
  }

  useEffect(() => {
    API.getNameSite().then( (e) => {
      setNameSite(e);
    } );
  }, [nameSite]);
  
  function modifyPage(page) {
    setPages((pages) => {
      const list = pages.map((item) => {
        if (item.id === page.id) {
          return Object.assign({}, item, page , {updated : true});
        } else {
          return item;
        }
      });
      return list;
    });
    API.updatePage(page).then( () =>{
      setSuccessMessage("Page updated successfully")
      setDirty(true)
    }
    ).catch(err => setErrorMessage(err.error))
  }

  function deletePage(page) {
    setPages((pages) => {
      const list = pages.map((item) => {
        if (item.id === page.id) {
          return Object.assign({}, item, page , {deleted : true});
        } else {
          return item;
        }
      });
      return list;
    });
    API.deletePage(page).then(() => {
      setSuccessMessage("Page deleted successfully")
      setDirty(true)
    }
    ).catch(err => {setErrorMessage("Error deleting Page : " + err)})
  }

  const doLogOut = async () => {
    await API.logOut();
    setPages(() => []);
    setLoggedIn(() => false);
    setUser(() => undefined);
  }
  
  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
  }
  
  const updateSiteName = (name) => {
    setNameSite("");
    API.updateNameSite(name).then( (name) =>{
      setSuccessMessage("Site name updated successfully")
      setNameSite(name);
    }
    ).catch(err => {setErrorMessage("Error updating name site : " + err.error)})
  }

  return (
    <BrowserRouter>
    <Container fluid>
        <pageManagementContext.Provider value={{ addPage, modifyPage, deletePage, setErrorMessage : (message) =>setErrorMessage(message) , setSuccessMessage : (message) => setSuccessMessage(message)}}>
          <authContext.Provider value={{user:user?user:null , loginSuccessful:loginSuccessful , doLogOut : doLogOut , loggedIn:loggedIn , nameSite}}>
          <Routes>
            <Route
              path="/" element={
                <>
                  <MainPage errorMessage = {errorMessage} setErrorMessage={setErrorMessage} successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>
                </>
              }
            >
              <Route path="/"                   element={<MainTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut} front={true}/>} />
              <Route path="/back/"              element={!loggedIn? <Navigate replace to='/' /> : <MainTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut} front={false} updateSiteName={updateSiteName}/>} />
              <Route path="/pages/:pageID"      element={<PageContainer editMode={false} pages={pages}/>}></Route>
              <Route path="/pages/:pageID/edit" element={<PageContainer editMode={true}  pages={pages}/>}></Route>
              <Route path="/pages/new"          element={!loggedIn? <Navigate replace to='/' />:<PageContainer editMode={true} pages={pages} newPage={true}/>}></Route>
              <Route path='/login'              element={loggedIn? <Navigate replace to='/back/' />:  <LoginForm loginSuccessful={loginSuccessful} />} />
              <Route path="*" element={<h1>Not Found</h1>} />
            </Route>       
          </Routes>
          </authContext.Provider>
        </pageManagementContext.Provider>
      </Container>
    </BrowserRouter>
  );
}

export default App