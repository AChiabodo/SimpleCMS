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

  useEffect(() => {
    if(!loggedIn){
      API.getPages().then( (e) => {
        setPages(e);
        setDirty(false);
      } );
    }
    else{
      API.getPages(user).then( (e) => {
        setPages(e);
        setDirty(false);
      } );
    }
  }, [dirty,loggedIn]);

  function addPage(page) {
    page = Object.assign({},page , {user : user?user.id:1});
    setPages((films) => films.concat(Object.assign({}, page , {created : true})));
    API.addPage(page).then(id =>{
      setNextId(id+1);
      setDirty(true);
    }).catch(err => {console.log("POST err : " + err)})
  }

  function modifyPage(page) {
    page = Object.assign({},page,{id:nextID++})
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
              <Route path="/" element={<MainTable       pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut} />} />
              <Route path="/back/" element={<MainTable  pages={pages} setPages={setPages} dirty={dirty} setDirty={setDirty}  name={user?user.name:null} doLogOut={doLogOut} />} />
              <Route path="/pages/:pageID"      element={<PageEdit editMode={false}/>}></Route>
              <Route path="/pages/:pageID/edit" element={<PageEdit editMode={true}/>}></Route>
              <Route path='/login' element={loggedIn? <Navigate replace to='/' />:  <LoginForm loginSuccessful={loginSuccessful} />} />
            </Route>
            
            
          </Routes>
          </authContext.Provider>
        </pageManagementContext.Provider>
      </Container>
    </BrowserRouter>
  );
}

export default App