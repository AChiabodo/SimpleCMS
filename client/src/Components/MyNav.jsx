import { useContext } from "react";
import {
  Container,
  Button,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import authContext from "../Context/authContext";

function MyNav() {
  let {user , loggedIn , doLogOut} = useContext(authContext);
  const navigate = useNavigate();
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand onClick={() => navigate('/')} style={{cursor : 'pointer', display: 'flex', justifyContent: 'center' }}>CMSmall</Navbar.Brand>
      { loggedIn ? <><Button variant="outline-success" onClick={()=>navigate("/")}>
          Front Page
        </Button>
        <Button variant="outline-warning" onClick={()=>navigate("/back")}>
          Back Office
        </Button> </>: <></>}
      <Nav className="me-auto">
        </Nav> 
        { loggedIn? <>
                    <Button className='mx-2' variant='danger' onClick={doLogOut}>Logout</Button>
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