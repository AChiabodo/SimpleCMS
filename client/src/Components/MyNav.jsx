import { useContext } from "react";
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
  let {user , loggedIn , doLogOut , nameSite , clearPages} = useContext(authContext);
  const navigate = useNavigate();
  function handleLogout() {
    doLogOut();
    navigate('/');
  }
  function handleBackOffice() {
    clearPages(false);
    navigate('/back');
  }
  function handleFrontOffice() {
    clearPages(false);
    navigate('/');
  }
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
      {nameSite !== "" ? 
        <Navbar.Brand onClick={() => handleFrontOffice()} style={{cursor : 'pointer', display: 'flex', justifyContent: 'center' }}>{nameSite}</Navbar.Brand> : 
        <Spinner animation="border" variant="light" />}
      { loggedIn ? <Nav justify={true}><Button variant="outline-danger" onClick={()=>handleFrontOffice()}>
          Front Page
        </Button>
        <Button variant="outline-warning" onClick={()=>handleBackOffice()}>
          Back Office
        </Button>
        <Button variant="outline-success" onClick={()=>navigate("/pages/new")}>
          New Page
        </Button>
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