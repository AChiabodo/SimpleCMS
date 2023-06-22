import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect , useContext , useState } from "react";
import {
    Container , Row , Figure , Col, Button, ButtonToolbar, Form, Alert
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import authContext from "../Context/authContext";
import API from "../API";
import { EditModal } from "./editModal";
import PropTypes from 'prop-types';
import modalContext from "../Context/modalContext";
import pageManagementContext from "../Context/pageManagementContext";
import Card from 'react-bootstrap/Card';
import dayjs from "dayjs";

MyRow.propTypes = {contentData : PropTypes.object.isRequired}
function MyRow(props) {
  let component;
  const { contentData } = props;
  switch (contentData.componentType) {
    case "Header":
      component = (
        <h1 style={{ textAlign: "center" }}>{contentData.componentData}</h1>
      );
      break;
    case "Image":
      component = (
        <Figure style={{ display: "flex", justifyContent: "center" }}>
          <Figure.Image
            style={{ alignSelf: "center" }}
            width={290}
            height={360}
            alt={contentData.componentData}
            src={`http://localhost:3001/public/${contentData.componentData}`}
          />
        </Figure>
      );
      break;
    default:
      component = (
        <Row style={{ display: "flex", justifyContent: "center" }}>
          {contentData.componentData}
        </Row>
      );
  }
  return component;
}

EditRow.propTypes = {contentData : PropTypes.object.isRequired , handleOrder : PropTypes.func.isRequired}
function EditRow(props) {
    const {contentData , handleOrder} = props;
    let component;
    switch (contentData.componentType) {
      case "Header":
        component = (
          <h1 style={{ textAlign: "center" }}>{contentData.componentData}</h1>
        );
        break;
      case "Image":
        component = (
          <Figure style={{ display: "flex", justifyContent: "center" }}>
            <Figure.Image
              style={{ alignSelf: "center" }}
              width={290}
              height={360}
              alt={contentData.componentData}
              src={`http://localhost:3001/public/${contentData.componentData}`}
            />
          </Figure>
        );
        break;
      default:
        component = contentData.componentData
    }
    return (
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <Col xs lg="1">
          <Button onClick={() => handleOrder(contentData,contentData.position-1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-up-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
              />
            </svg>
          </Button>
          <Button onClick={() => handleOrder(contentData,contentData.position+1)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-down-short"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
              />
            </svg>
          </Button>
        </Col>
        <Col>{component}</Col>
        <Col xs lg="1">
          <EditModal newMode={false} content={contentData} />
        </Col>
      </Row>
    );
}

PageEdit.propTypes = {editMode : PropTypes.bool.isRequired , pages : PropTypes.array.isRequired}
function PageEdit(props) {
    const {editMode,newPage} = props;
    const {pageID} = useParams();
    const {loggedIn,user} = useContext(authContext);
    const [content, setContent] = useState([]);
    const [tempPage, setTempPage] = useState([]);
    const [nextId, setNextId] = useState(0);
    const [nextPosition , setNextPosition] = useState(0);
    const [dirty, setDirty] = useState(false); // true if the page has been modified
    const {addPage, modifyPage, deletePage} = useContext(pageManagementContext);
    const [errorMessage, setErrorMessage] = useState("");

      useEffect(() => {
        if(!newPage){
        if(!loggedIn){
          API.getPage(pageID,false).then( (page) => {
            setTempPage(page);
            setContent(() => page.components);
            setNextId(()=>Math.max(...content.map(component => component.id))+1);
            setNextPosition(()=>Math.max(...content.map(component => component.position))+1);
            setDirty(false);
          } );
        }
        else{
          API.getPage(pageID,true).then( (page) => {
            setTempPage(page);
            setContent(page.components);
            setNextId(()=>Math.max(...content.map(component => component.id))+1);
            setNextPosition(()=>Math.max(...content.map(component => component.position))+1);
            setDirty(false);
          } );
        }
      }
      else{
        setTempPage({title : "",creationDate : dayjs(),components : [],author : user.name,publishDate : null});
        setContent([]);
        setDirty(false);
        setNextId(0);
        setNextPosition(0);
      } 
      }, [dirty,loggedIn,newPage]);

      function addComponent(component) {
        component = Object.assign({},component,{id : nextId , position : nextPosition , created : true});
        setContent((content) => content.concat(Object.assign({}, component)));
        setTempPage((page) => Object.assign({},page,{components : page.components.concat(component)}));
        setNextId( (id) => id+1 );
        setNextPosition ( (position) => position + 1);
      }
    
      function modifyComponent(component) {
        console.log(component);
        setContent((pages) => {
          const list = pages.map((item) => {
            if (item.id === component.id) {
              return Object.assign({}, item, component);
            } else {
              return item;
            }
          });
          return list;
        });
      }

      function deleteComponent(component) {
        setContent((pages) => pages.filter((item) => item.id !== component.id));
      }

      {/** 
      function deleteComponent(component) {
        setContent((pages) => {
          const list = pages.map((item) => {
            if (item.id === component.id) {
              return Object.assign({}, item, {deleted : true});
            } else {
              return item;
            }
          });
          return list;
        });
      }*/}

      function handleSubmit(){
        setTempPage((page) => Object.assign({},page,{components : content}));
        console.log(tempPage.components);
        if(tempPage.components.length < 2){
          
          setErrorMessage("You need at least 2 components to create a page");
          return;
        }
        if(tempPage.title === ""){
          setErrorMessage("You need to set a title for the page");
          return;
        }
        if(tempPage.author === ""){
          setErrorMessage("You need to set an author for the page");
          return;
        }
        if(tempPage.components.filter(e => e.position == 0)[0].componentType !== "Header"){
          setErrorMessage("The first component of a page must be a header");
          return;
        }
        if(newPage){
          addPage(tempPage);
        }
        else{
          modifyPage(tempPage);
        }
      }

      function handleOrder(component,order){
        console.log(content);
        if(order < 0 || order >= content.length){
          
            return;
        }
        setContent((pages) => {
          const list = pages.map((item) => {
            if (item.id === component.id) {
              return Object.assign({}, item, {position : order});
            } else {
              if(item.position === order && item.id !== component.id){
                return Object.assign({}, item, {position : component.position});
              }
              return item;
            }
          });
          return list;
        });
      
      }

      function handleAuthor(event){
        setTempPage(
          (tempPage) =>
            (tempPage = Object.assign({}, tempPage, {
              author: event.target.value,
            })))
      }
      function handleTitle(event){
        setTempPage(
          (tempPage) =>
            (tempPage = Object.assign({}, tempPage, {
              title: event.target.value,
            })));
      }

      function handlePublishDate(event) {
        setTempPage(
          (tempContent) =>
            (tempContent = Object.assign({}, tempContent, {
              publishDate: dayjs(event.target.value),
            }))
        );
      }
      console.log(loggedIn);
    return (
      <>
        <modalContext.Provider
          value={{
            addComponent,
            modifyComponent,
            deleteComponent
          }}
        >
            {(loggedIn && editMode) ? 
            <Container flex='true'>
              <Card>
                <Card.Header>
                <Row>
                <ButtonToolbar style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button onClick={() => handleSubmit()}>Confirm Changes</Button>
                  <EditModal newMode={true} />
                  <Button variant={'secondary'} onClick={() => setDirty(true)}>Drop changes</Button>
                </ButtonToolbar>
                </Row>
                </Card.Header>
                <Card.Body>
                <Row>
                <Form>
                <Col>
                
                  <Form.Group>
                    <Form.Label>Title: </Form.Label>
                    <Form.Control
                    type="text"
                    name="title"
                      value={tempPage.title}
                      onChange={handleTitle}
                    >
                    </Form.Control>
                  </Form.Group>
                  </Col>
                  <Col>
                  
                  <Form.Group>
                    <Form.Label>Author: </Form.Label>
                    <Form.Select
                      value={tempPage.author}
                      onChange={handleAuthor}
                      disabled={true}
                    >
                      <option value={tempPage.author}>{tempPage.author}</option>
                    </Form.Select>
                  </Form.Group>
                  </Col>
                  <Col>
                  
                  <Form.Group>
                    <Form.Label>Publish Date: </Form.Label>
                    <Form.Control
                    type="date"
                      value={dayjs(tempPage.publishDate).format('YYYY-MM-DD')}
                      onChange={handlePublishDate}
                    >
                    </Form.Control>
                  </Form.Group>
                  
                  </Col>
                  </Form>
                </Row>
                </Card.Body>
                <Card.Footer>
                {errorMessage != "" ? (
            <Alert key={"danger"} variant={"danger"}>
              {" "}
              {errorMessage}{" "}
            </Alert>
          ) : (
            false
          )}
                </Card.Footer>
              </Card>
            
            
             {content
                  .sort((a,b) => a.position > b.position)
                  .filter((e) => !e.deleted)
                  .map((e) => <EditRow contentData={e} key={e.id} handleOrder={handleOrder}/>)}
                  
        </Container>
            
              : <Container>{content
                  .sort((a,b) => a.position > b.position)
                  .filter((e) => !e.deleted)
                  .map((e) => <MyRow contentData={e} key={e.id} />)} </Container>
              }

        </modalContext.Provider>
      </>
    );
  }
 export default PageEdit;