import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table , Spinner, Button 
} from "react-bootstrap";
import { useContext ,useEffect} from "react";
import MyNav from "./MyNav.jsx";
import API from '../API.jsx'
import { EditModal } from "./editModal.jsx";
import authContext from "../Context/authContext.jsx";
import PropTypes from 'prop-types';
import dayjs from 'dayjs'
import { useNavigate } from "react-router-dom";

MyRow.propTypes = {
  pageData: PropTypes.object.isRequired,
};

export function MyRow(props) {
    const { pageData } = props;
    const {loggedIn} = useContext(authContext);
    const navigate = useNavigate();
    let spinner , status;
    if(pageData.dirty){spinner = <Spinner animation="grow" variant="warning" />}
    if(pageData.deleted){spinner = <Spinner animation="grow" variant="danger" />}
    if(pageData.created){spinner = <Spinner animation="grow" variant="success" />}
    if(loggedIn && dayjs(pageData.publishDate) < dayjs() ) {status = "editing"}
    if(loggedIn && dayjs(pageData.publishDate) >= dayjs() ) {status = "published"}
    if(loggedIn && !pageData.publishDate) {status = "drafted"}
    return (
      <tr>
              <td><Button onClick={() => navigate(`/pages/${pageData.id}`)}>{pageData.id}</Button></td>
              <td>{pageData.title}</td>
              <td>{pageData.author}</td>
              <td>{pageData.publishDate ? pageData.publishDate.format("YYYY-MM-DD") : ""}</td>
              {loggedIn ? <td>{pageData.creationDate ? pageData.creationDate.format("YYYY-MM-DD") : "error"}</td> : false}
              {loggedIn ? <td>{status}</td> : false}
              {loggedIn ? <td>{spinner? spinner : <EditModal newMode={false} page={pageData}/>}</td> : false }
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
    //const route = filters.filter( e => e.label === FilterLabel).map(e => e.route)[0] 

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
          {
          pages.map((e) =><MyRow pageData={e} key={e.id}/>)
            }
        </tbody>
      </Table>
      </>
    )
  }

  export default MainPage