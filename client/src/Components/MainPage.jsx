import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table , Spinner, Button, Modal, Alert
} from "react-bootstrap";
import { useContext, useEffect, useState} from "react";
import MyNav from "./MyNav.jsx";
import authContext from "../Context/authContext.jsx";
import PropTypes from 'prop-types';
import dayjs from 'dayjs'
import { Outlet, useNavigate } from "react-router-dom";
import API from "../API.jsx";
import pageManagementContext from "../Context/pageManagementContext.jsx";

MyRow.propTypes = {pageData: PropTypes.object.isRequired};

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            className={"bi bi-pencil-fill"}
            viewBox="0 0 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
          </svg>
        </Button>
        <Button variant="ouline-danger" disabled={!editable} onClick={()=>deletePage(pageData.id)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={color} className="bi bi-backspace-fill" viewBox="0 0 16 16">
        <path d="M15.683 3a2 2 0 0 0-2-2h-7.08a2 2 0 0 0-1.519.698L.241 7.35a1 1 0 0 0 0 1.302l4.843 5.65A2 2 0 0 0 6.603 15h7.08a2 2 0 0 0 2-2V3zM5.829 5.854a.5.5 0 1 1 .707-.708l2.147 2.147 2.146-2.147a.5.5 0 1 1 .707.708L9.39 8l2.146 2.146a.5.5 0 0 1-.707.708L8.683 8.707l-2.147 2.147a.5.5 0 0 1-.707-.708L7.976 8 5.829 5.854z"/>
        </svg>
        </Button>
        </td> : false }
            </tr>
    );
  }

function MainPage(props){
  const {errorMessage,setErrorMessage} = props;
  const handleClose = () => setErrorMessage(null);
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
      </>
    )
  }

  function MainTable(props) {
    let {pages , front , setPages , setDirty , dirty} = props;
    const {loggedIn , user} = useContext(authContext);
    
    useEffect(() => {
      setPages([]);
      if(!loggedIn || front){
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
    }, [dirty,loggedIn,front]);

    return <Table striped bordered hover>
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
        pages.map((e) => <MyRow pageData={e} key={e.id} front={front}/>)
        }
      </tbody>
      {pages.length === 0 ? <Spinner animation="border" variant="primary" /> : false}
    </Table>;
  }
  

  export default MainPage
  export {MainTable}
