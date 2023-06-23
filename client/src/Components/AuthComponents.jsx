import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';
import pageManagementContext from '../Context/pageManagementContext';

function LoginForm(props) {
  const {loginSuccessful} = props;
  const [username, setUsername] = useState('mario.rossi@polito.it');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const {setErrorMessage} = useContext(pageManagementContext);

  const navigate = useNavigate();

  const doLogIn = (credentials) => {
    setLoading(() => true );
    API.logIn(credentials)
      .then( user => {
        setErrorMessage('');
        loginSuccessful(user);
        setLoading(() => false );
      })
      .catch(() => {
        // NB: Generic error message, should not give additional info (e.g., if user exists etc.)
        setErrorMessage('Wrong username or password');
        setLoading(() => false );
      })
  }
  
  const handleSubmit = (event) => {
      event.preventDefault();
      setErrorMessage('');
      const credentials = { username, password };

      // SOME VALIDATION, ADD MORE if needed (e.g., check if it is an email if an email is required, etc.)
      let valid = true;
      if(username === '' || password === '')
          valid = false;
      
      if(valid)
      {
        doLogIn(credentials);
      } else {
        // TODO: show a better error message...
        setErrorMessage('Missing fields in the form, please fill all the fields.')
      }
  };

  return (
      <Container>
          <Row>
              <Col xs={3}></Col>
              <Col xs={6}>
                  <h2>Login</h2>
                  <Form onSubmit={handleSubmit}>
                      <Form.Group controlId='username'>
                          <Form.Label>Email</Form.Label>
                          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
                      </Form.Group>
                      <Form.Group controlId='password'>
                          <Form.Label>Password</Form.Label>
                          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
                      </Form.Group>
                      {!loading ? <Button className='my-2' type='submit'>Login</Button> : <Button className='my-2' disabled={true} type='submit'>Login</Button>}
                      <Button className='my-2 mx-2' variant='danger' onClick={()=>navigate('/')}>Cancel</Button>
                  </Form>
                  {loading && <Alert variant='secondary'>Loading...</Alert>}
              </Col>
              <Col xs={3}></Col>
          </Row>
      </Container>
    )
}

export { LoginForm };