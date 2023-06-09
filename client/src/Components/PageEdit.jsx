import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import {
    Container , Row , Figure , Col
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import authContext from "../Context/authContext";
import { useContext , useState } from "react";
import API from "../API";
import MyNav from "./MyNav";
import { EditModal } from "./editModal";
import PropTypes from 'prop-types';
EditRow.propTypes = {
    contentData : PropTypes.object.isRequired
}

function EditRow(props) {
    const {contentData} = props;
    if(contentData.componentType === undefined) return (<></>);
    if (contentData.componentType === "Header")
      return (
        <>
          <Row>
            <Col>
            <h1 style={{ textAlign: "center" }}>{contentData.componentData}</h1></Col>
            <Col xs lg="1"><EditModal newMode={false} content={contentData}/></Col>
          </Row>
        </>
      );
    if(contentData.componentType === "Image"){
        return (
            <>
            <Row>
                <Col>
            <Figure style={{ display: 'flex', justifyContent: 'center' }}>
            <Figure.Image
                style={{ alignSelf: 'center' }}
              width={290}
              height={360}
              alt={contentData.componentData}
              src={`http://localhost:3001/public/${contentData.componentData}`}
            />
        </Figure>
        </Col>
        <Col xs lg="1">
        <EditModal newMode={false} content={contentData}/>
        </Col>
        </Row>
        </>
        );
    }
    return (
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
            <Col>{contentData.componentData}</Col>
            <Col xs lg="1"><EditModal newMode={false} content={contentData}/></Col>
        </Row>

    );
}

function PageEdit() {
    const {pageID} = useParams();
    const {loggedIn} = useContext(authContext);
    const [content, setContent] = useState([]);
    useEffect(() => { 
        API.getPageContent(pageID,loggedIn).then(
            (Components) => {setContent(Components);}
        ).catch(err => {console.log("GET err : " + err)});
      }, [pageID,loggedIn]);
    
    return (
        <>
    <MyNav/>
      <Container>
          {content.map( e =><EditRow contentData={e} key={e.id}/>)}
      </Container>
      </>
    );
  }
 export default PageEdit;