import "bootstrap/dist/css/bootstrap.min.css";

import { useEffect, useState} from "react";
import API from './API.jsx'
import MainPage, { MainTable } from "./Components/MainPage.jsx";
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import pageManagementContext from "./Context/pageManagementContext.jsx";
import { Container } from "react-bootstrap";
import { LoginForm } from "./Components/AuthComponents.jsx";
import authContext from './Context/authContext.jsx';
import PageEdit from "./Components/PageEdit.jsx";
function App() {
  let [pages, setPages] = useState([]);
  let [nextID, setNextId] = useState(0);
  let [dirty, setDirty] = useState(false);
  const [user, setUser] = useState(undefined);
  const [loggedIn, setLoggedIn] = useState(false);

  function addPage(page) {
    page = Object.assign({},page , {user : user?user.id:1 , id : nextID , created : true});
    setPages((films) => films.concat(Object.assign({}, page , {created : true})));
    API.addPage(page).then(id =>{
      setNextId(id+1);
      setDirty(true);
    }).catch(err => {console.log("POST err : " + err)})
  }

  function modifyPage(page) {
    setPages((pages) => {
      const list = pages.map((item) => {
        if (item.id === page.id) {
          //return new Answer(item.id, item.text,item.respondent,item.score+1,item.date);
          return Object.assign({}, item, page , {updated : true});
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
  }
  
  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
    setDirty(true);
  }
  
  return (
    <BrowserRouter>
    <Container fluid>
        <pageManagementContext.Provider value={{ addPage, modifyPage, deletePage}}>
          <authContext.Provider value={{user:user?user:null , loginSuccessful:loginSuccessful , doLogOut : doLogOut , loggedIn:loggedIn}}>
          <Routes>
            <Route
              path="/" element={
                <>
                  <MainPage/>
                </>
              }
            >
              <Route path="/"                   element={<MainTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut} front={true}/>} />
              <Route path="/back/"              element={<MainTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut} front={false}/>} />
              <Route path="/pages/:pageID"      element={<PageEdit editMode={false} pages={pages}/>}></Route>
              <Route path="/pages/:pageID/edit" element={<PageEdit editMode={true}  pages={pages}/>}></Route>
              <Route path="/pages/new" element={<PageEdit editMode={true} pages={pages} newPage={true}/>}></Route>
              <Route path='/login'              element={loggedIn? <Navigate replace to='/back/' />:  <LoginForm loginSuccessful={loginSuccessful} />} />
            </Route>
            
            
          </Routes>
          </authContext.Provider>
        </pageManagementContext.Provider>
      </Container>
    </BrowserRouter>
  );
}

export default App