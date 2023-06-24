import { useContext, useState } from "react";
import {
  Container,
  Button,
  Nav,
  Navbar,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import authContext from "../Context/authContext";

function MyNav() {
  let {user , loggedIn , doLogOut , nameSite , clearPages , currentLocation , setCurrentLocation} = useContext(authContext);
  const navigate = useNavigate();
  
  
  function handleLogout() {
    doLogOut();
    navigate('/');
  }
  
  function handleBackOffice() {
    navigate('/back');
    if(currentLocation === "back"){
      clearPages(false);
    }
    else{
      clearPages(true);
    }
    setCurrentLocation(()=>"back");
  }
  
  function handleFrontOffice() {
    navigate('/');
    if(currentLocation === "front"){
      clearPages(false);
    }
    else{
      clearPages(true);
    }
    setCurrentLocation(()=>"front");
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
      {nameSite !== "" ? 
        <Navbar.Brand onClick={() => handleFrontOffice()} style={{cursor : 'pointer', display: 'flex', justifyContent: 'center' }}>{nameSite}</Navbar.Brand> : 
        <Spinner animation="border" variant="light" />}
      { loggedIn ? <Nav  justify={true}><Button style={{marginBlockEnd : '1%'}} variant="outline-danger" onClick={()=>handleFrontOffice()}>
          Front Office
        </Button>
        <Button style={{marginBlockEnd : '1%'}} variant="outline-warning" onClick={()=>handleBackOffice()}>
          Back Office
        </Button>
        {currentLocation === "back" ? <Button style={{marginBlockEnd : '1%'}} variant="outline-success" onClick={()=>navigate("/pages/new")}>
          New Page
        </Button> : false}
         </Nav>: <></>}
      <Nav className="me-auto">
        </Nav> 
        { loggedIn? <>
                    <Button className='mx-2' variant='danger' onClick={() => handleLogout()}>Logout</Button>
                    </> : 
                    <Button className='mx-2' variant='warning' onClick={()=> navigate('/login')}>Login</Button> }
                
        { loggedIn ? 
                    <Navbar.Text className='fs-5'>
                        {"Signed in as: "+user.name}
                    </Navbar.Text> : <Navbar.Text className='fs-5'>
                        {"Not logged In"}
                    </Navbar.Text>}
      </Container>
    </Navbar>
  );
}


export default MyNav;