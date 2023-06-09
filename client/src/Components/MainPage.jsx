import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table , Spinner, Button
} from "react-bootstrap";
import { useContext ,useEffect} from "react";
import MyNav from "./MyNav.jsx";
import API from '../API.jsx'
import authContext from "../Context/authContext.jsx";
import PropTypes from 'prop-types';
import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";

MyRow.propTypes = {pageData: PropTypes.object.isRequired};

export function MyRow(props) {
    const { pageData } = props;
    const {loggedIn} = useContext(authContext);
    const navigate = useNavigate();
    let spinner , status;
    console.log(pageData);
    if(pageData.dirty){spinner = <Spinner animation="grow" variant="warning" />}
    if(pageData.deleted){spinner = <Spinner animation="grow" variant="danger" />}
    if(pageData.created){spinner = <Spinner animation="grow" variant="success" />}
    if(loggedIn && dayjs(pageData.publishDate) > dayjs() ) {status = "editing"}
    if(loggedIn && dayjs(pageData.publishDate) <= dayjs() ) {status = "published"}
    if(loggedIn && !pageData.publishDate) {status = "drafted"}
    return (
      <tr>
              <td><Button onClick={() => navigate(`/pages/${pageData.id}`)}>{pageData.id}</Button></td>
              <td>{pageData.title}</td>
              <td>{pageData.author}</td>
              <td>{pageData.publishDate ? pageData.publishDate.format("YYYY-MM-DD") : ""}</td>
              {loggedIn ? <td>{pageData.creationDate ? pageData.creationDate.format("YYYY-MM-DD") : "error"}</td> : false}
              {loggedIn ? <td>{status}</td> : false}
              {loggedIn ? <td>        <Button variant="white" onClick={()=>navigate("/pages/" + pageData.id + "/edit")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            className={"bi bi-pencil-fill"}
            viewBox="0 0 16 16"
          >
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
          </svg>
        </Button>
        </td> : false }
            </tr>
    );
  }

  MainPage.propTypes = {
    pages: PropTypes.array.isRequired,
    setPages : PropTypes.func.isRequired,
    dirty : PropTypes.bool.isRequired,
    setDirty : PropTypes.func.isRequired,
    name : PropTypes.string,
    doLogOut : PropTypes.func.isRequired
  };

function MainPage(props){
    let {pages , setPages , dirty , setDirty , name , doLogOut} = props;
    const {user , loggedIn} = useContext(authContext);
    
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
    
    return (
      <>
      <MyNav name={name} doLogOut={doLogOut}/>
      <Table striped bordered hover>
      
        <thead>
          <tr>
          <th scope="col">#</th>
            <th >Title</th>
            <th >Author</th>
            <th >PublishDate</th>
            {loggedIn ? <th >CreationDate</th> : false }
            {loggedIn ? <th >Status</th> : false }
            {loggedIn ? <th >Edit</th> : false }
          </tr>
        </thead>
        <tbody>
        {pages.length === 0 ? <Spinner animation="border" variant="primary" /> : false}
          {
          pages.map((e) =><MyRow pageData={e} key={e.id}/>)
            }
        </tbody>
      </Table>
      </>
    )
  }

  export default MainPage