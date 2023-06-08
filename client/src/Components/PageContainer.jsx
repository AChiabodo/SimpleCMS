import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import {
    Container , Row , Figure
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import authContext from "../Context/authContext";
import { useContext , useState } from "react";
import API from "../API";
import MyNav from "./MyNav";

function MyRow(props) {
    const {contentData} = props;
    if(contentData.componentType === undefined) return (<></>);
    if(contentData.componentType === "Header") return (<h1 style={{ textAlign: 'center' }}>{contentData.componentData}</h1>);
    if(contentData.componentType === "Image"){
        return (
            <Figure style={{ display: 'flex', justifyContent: 'center' }}>
            <Figure.Image
                style={{ alignSelf: 'center' }}
              width={290}
              height={360}
              alt={contentData.componentData}
              src={`http://localhost:3001/public/${contentData.componentData}`}
            />
        </Figure>);
    }
    return (
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
            {contentData.componentData}
        </Row>
    );
}

function PageContainer() {
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
          {content.map( e =><MyRow contentData={e} key={e.id}/>)}
      </Container>
      </>
    );
  }

  export default PageContainer;