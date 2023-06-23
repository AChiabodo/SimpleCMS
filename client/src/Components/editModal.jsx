import { useContext, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import modalContext from "../Context/modalContext";

export function EditModal(props) {
  let { newMode } = props;
  let {addComponent, modifyComponent, deleteComponent , images} = useContext(modalContext);
  const [editmode, setEditmode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [tempContent, setTempContent] = useState( Object.assign({},{componentType : "Body" , componentData : ""}) );

  const handleClose = () => setShowEdit(false);
  const handleShow = () => setShowEdit(true);

  function handleType(event) {
    if (event.target.value == "Image") {
      setTempContent(
        (tempContent) =>
          (tempContent = Object.assign({}, tempContent, {
            componentData: "faro.jpeg",
            componentType: event.target.value,
          }))
      );
    }
    else{
      setTempContent(
        (tempContent) =>
          (tempContent = Object.assign({}, tempContent, {
            componentType: event.target.value,
          }))
      );
    }
  }
  function handleData(event) {
    
    setTempContent(
      (tempContent) =>
        (tempContent = Object.assign({}, tempContent, {
          componentData: event.target.value ,
        }))
    );
  }
  function handleEdit() {
    setEditmode(true);
    const { content } = props;
    setTempContent((tempContent) => Object.assign(tempContent, content));
    handleShow();
    
  }
  function handleCreation() {
    setEditmode(false);
    setTempContent(Object.assign({},{componentType : "Body" , componentData : ""}));
    handleShow();
  }
  function handleRemove() {
    deleteComponent(tempContent);
    handleClose();
  }
  function handleSubmit() {
    
    if (!tempContent.componentData || tempContent.componentData == "" || !tempContent.componentData.trim()) {
      setErrorMessage("Titolo non valido !");
      return;
    } else {
      setErrorMessage("");
    }
    if (editmode) {
      modifyComponent(tempContent);
      handleClose();
    } else {
      addComponent(tempContent);
      setTempContent(Object.assign({},{componentType : "Body" , componentData : ""}));
      handleClose();
    }
  }

  return (
    <>
      {newMode ? (
        <Button variant="outline-success" onClick={handleCreation}>
          Add new Component
        </Button>
      ) : (
        <Button variant="white" onClick={handleEdit}>
          <i className={"bi bi-pencil-fill"}></i>
        </Button>
      )}
      <Modal show={showEdit} onHide={handleClose} size={"xl"}>
        <Modal.Header closeButton>
          <Modal.Title>Component Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(event) => event.preventDefault()}>
            <Form.Group>
              <Form.Label>Type: </Form.Label>
              <Form.Select
                value={tempContent.componentType}
                onChange={handleType}
                >
                <option value="Body">Body</option>
                <option value="Header">Header</option>
                <option value="Image">Image</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Content: </Form.Label>
              {(tempContent.componentType === "Body") &&
              <Form.Control
                as="textarea"
                name="componentData"
                value={tempContent.componentData}
                onChange={handleData}/>
              
                || (tempContent.componentType === "Image") &&
                <Form.Select
                value={tempContent.componentData}
                onChange={handleData}
                >
                  {images.map((image) => <option value={image.path} key={image.id}>{image.name}</option>)}
                </Form.Select>
                || (tempContent.componentType === "Header") &&
                <Form.Control
                type="text"
                name="componentData"
                value={tempContent.componentData}
                onChange={handleData}/>
              }
            </Form.Group>
          </Form>
          {errorMessage != "" ? (
            <Alert key={"danger"} variant={"danger"}>
              {" "}
              {errorMessage}{" "}
            </Alert>
          ) : (
            false
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!newMode && <Button variant="danger" onClick={handleRemove}>
            DELETE
          </Button>}
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
