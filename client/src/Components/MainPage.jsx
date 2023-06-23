import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Table , Spinner, Button, Modal, Alert, Form
} from "react-bootstrap";
import { useContext, useEffect, useState} from "react";
import MyNav from "./MyNav.jsx";
import authContext from "../Context/authContext.jsx";
import dayjs from 'dayjs'
import { Outlet, useNavigate } from "react-router-dom";
import API from "../API.jsx";
import pageManagementContext from "../Context/pageManagementContext.jsx";

export function MyRow(props) {
    const { pageData , front } = props;
    const {loggedIn,user} = useContext(authContext);
    const {deletePage} = useContext(pageManagementContext);
    const navigate = useNavigate();
    let spinner , status;
    
    const editable = loggedIn && (user.role === "Admin" || user.name === pageData.author);
    const color = editable ? "danger" : "secondary";
    if(pageData.dirty){spinner = <Spinner animation="grow" variant="warning" />}
    if(pageData.deleted){spinner = <Spinner animation="grow" variant="danger" />}
    if(pageData.created){spinner = <Spinner animation="grow" variant="success" />}
    if(dayjs(pageData.publishDate) > dayjs() ) {status = "editing"}
    if(dayjs(pageData.publishDate) <= dayjs() ) {status = "published"}
    if(!pageData.publishDate) {status = "drafted"}
    return (
      <tr>
              <td><Button onClick={() => navigate(`/pages/${pageData.id}`)}>{pageData.id}</Button></td>
              <td>{pageData.title}</td>
              <td>{pageData.author}</td>
              <td>{pageData.publishDate ? pageData.publishDate.format("YYYY-MM-DD") : ""}</td>
              <td>{pageData.creationDate ? pageData.creationDate.format("YYYY-MM-DD") : "error"}</td>
              <td>{status}</td>
              {loggedIn && !front ? <td><Button variant="white" disabled={!editable} onClick={()=>navigate("/pages/" + pageData.id + "/edit")}>
          <i className={"bi bi-pencil-fill"}></i>
        </Button>
        <Button variant="ouline-danger" disabled={!editable} onClick={()=>deletePage(pageData.id)}>
        <i className={"bi bi-backspace-fill"}></i>
        </Button>
        </td> : false }
            </tr>
    );
  }

function MainPage(props){
  const {errorMessage,setErrorMessage,successMessage,setSuccessMessage} = props;
  const handleClose = () => {
    setErrorMessage(null)
    setSuccessMessage(null)
  };
    return (
      <>
      <MyNav/>
      <Outlet></Outlet>
      {errorMessage ?       <Modal show={true} onHide={handleClose} size={"m"} centered={true}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header> 
        <Modal.Body><Alert variant='danger' onClick={()=>setErrorMessage('')}>{errorMessage}</Alert></Modal.Body>
        </Modal> : false}
      {successMessage ?       <Modal show={true} onHide={handleClose} size={"m"} centered={true}>
      <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header> 
        <Modal.Body><Alert variant='success' onClick={()=>setSuccessMessage('')}>{successMessage}</Alert></Modal.Body>
      </Modal> : false}
      </>
    )
  }

  function MainTable(props) {
    let {pages , front , setPages , setDirty , dirty , updateSiteName } = props;
    const {setErrorMessage} = useContext(pageManagementContext);
    const [nameSite,setNameSite] = useState("");
    const {loggedIn , user} = useContext(authContext);
    
    useEffect(() => {
      setPages(() => []);
      if(!loggedIn || front){
        API.getPages().then( (e) => {
          setPages(() =>e);
          setDirty(() => false);
        } ).catch( (e) => {
          setErrorMessage(e.error);
        } );
      }
      else{
        API.getPages(user).then( (e) => {
          setPages(() => e);
          setDirty(() => false);
        } ).catch( (e) => {
          setErrorMessage(e.error)
        } );
      }
    }, [dirty,loggedIn,front]);

    function handleSubmit(event){
      event.preventDefault();
      updateSiteName(nameSite);
    }
    function handleNameSite(e){
      setNameSite(() => e.target.value)
    }
    return <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th>Title</th>
          <th>Author</th>
          <th>PublishDate</th>
          <th>CreationDate</th>
          <th>Status</th>
          {loggedIn && !front ? <th>Actions</th> : false}
        </tr>
      </thead>
      <tbody>
        {
        pages .sort((a,b) => a.publishDate > b.publishDate)
              .map((e) => <MyRow pageData={e} key={e.id} front={front}/>)
        }
      </tbody>
    </Table>
    {pages.length === 0 ? <Spinner animation="border" variant="primary" /> : false} 
    {pages.length !== 0 && loggedIn && user.role == "Admin" && !front ? 
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Change Name Site</Form.Label>
        <Form.Control type="text" placeholder="Enter name site" onChange={handleNameSite} value={nameSite}/>
      </Form.Group>
      <Button type="Submit">Change Name</Button>
    </Form> : false}
    </>
  }
  

  export default MainPage
  export {MainTable}
