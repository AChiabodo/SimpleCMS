import "bootstrap/dist/css/bootstrap.min.css";

import {useEffect, useState} from "react";
import API from './API.jsx'
import MainPage, { BackTable , FrontTable } from "./Components/MainPage.jsx";
import { BrowserRouter, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import pageManagementContext from "./Context/pageManagementContext.jsx";
import { Container } from "react-bootstrap";
import { LoginForm } from "./Components/AuthComponents.jsx";
import authContext from './Context/authContext.jsx';
import PageContainer from "./Components/PageContainer.jsx";

function App() {
  const [pages, setPages] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [nameSite , setNameSite] = useState("CMSmall");
  const [currentLocation, setCurrentLocation] = useState("front");

  useEffect(() => {
    API.getNameSite().then( (e) => {
      setNameSite(e);
    } );
  }, [nameSite]);
  
  function clearPages(cleaning) {
    if(cleaning){setPages(() => []);}
    if(!cleaning){setDirty(() =>true);}
  }

  function addPage(page) {
    page = Object.assign({},page , {user : user?user.id:1});
    API.addPage(page).then(id =>{
      setPages((films) => films.concat(Object.assign({}, page , {id : id , created : true })));
      setDirty(true);
    }).catch(err => {setErrorMessage(err.error)})
  }

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
      setDirty(() => true)
    }
    ).catch(err => {
      setErrorMessage("Error updating Page : " + err.error)
      setDirty(() => true)
    })
  }

  function deletePage(id) {
    setPages((pages) => {
      const list = pages.map((item) => {
        if (item.id === id) {
          return Object.assign({}, item , {deleted : true});
        } else {
          return item;
        }
      });
      return list;
    });

    API.deletePage(id).then(() => {
      setDirty(true)
    }
    ).catch(err => {
      setErrorMessage("Error deleting Page : " + err.error)
      setDirty(true);
    })
  }

  const doLogOut = async () => {
    await API.logOut();
    setPages(() => []);
    setDirty(() => true);
    setLoggedIn(() => false);
    setUser(() => undefined);
    setCurrentLocation("front");
  }
  
  const loginSuccessful = (user) => {
    setPages(() => []);
    setDirty(() => true);
    setUser(user);
    setLoggedIn(true);
    setCurrentLocation("back");
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
          <authContext.Provider value={{user:user?user:null , loginSuccessful , doLogOut , loggedIn , nameSite , clearPages , currentLocation, setCurrentLocation}}>
          <Routes>
            <Route
              path="/" element={
                <>
                  <MainPage errorMessage = {errorMessage} setErrorMessage={setErrorMessage} successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>
                </>
              }
            >
              <Route path="/"                   element={                                        <FrontTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}/>} />
              <Route path="/back/"              element={!loggedIn? <Navigate replace to='/' /> : <BackTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty} updateSiteName={updateSiteName}/>} />
              <Route path="/pages/:pageID"      element={<PageContainer editMode={false}/>}></Route>
              <Route path="/pages/:pageID/edit" element={<PageContainer editMode={true}/>}></Route>
              <Route path="/pages/new"          element={!loggedIn? <Navigate replace to='/' />:<PageContainer editMode={true} newPage={true}/>}></Route>
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