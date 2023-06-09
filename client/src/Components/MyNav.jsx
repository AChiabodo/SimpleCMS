import { useContext, useState } from "react";
import {
  Container,
  Button,
  Form,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EditModal } from "./editModal";
import authContext from "../Context/authContext";

function MyNav() {
  let [word, setWord] = useState("");
  let {user , loggedIn , doLogOut} = useContext(authContext);
  const navigate = useNavigate();
  function handleSearch(event) {
    setWord(event.target.value);
    {
      /*searchFilm(event.target.value); */
    }
  }
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{cursor : 'pointer'}}>CMSmall</Navbar.Brand>
      <Nav className="me-auto">
      {loggedIn? <EditModal newMode={true} /> : false }
        </Nav> 
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            value={word}
            onChange={handleSearch}
          />
          <Button variant="outline-success">Search</Button>
        </Form>
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