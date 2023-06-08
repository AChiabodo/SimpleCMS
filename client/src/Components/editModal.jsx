import { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import dayjs from "dayjs";
import Page from "../Page";
import modalContext from "../Context/modalContext";
import PropTypes from 'prop-types';

EditModal.propTypes = {
  newMode: PropTypes.func.isRequired,
  Page : PropTypes.object.isRequired
};

export function EditModal(props) {
  let { newMode } = props;
  let { addPage, modifyPage , nextId , setNextId , deletePage} = useContext(modalContext);
  const [editmode, setEditmode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [showEdit, setShowEdit] = useState(false);
  const [tempPage, setTempPage] = useState(new Page("", ""));

  const handleClose = () => setShowEdit(false);
  const handleShow = () => setShowEdit(true);
  function handleWatchDate(event) {
    setTempPage(
      (tempPage) =>
        (tempPage = Object.assign({}, tempPage, {
          date: dayjs(event.target.value),
        }))
    );
  }
  function handleTitle(event) {
    setTempPage(
      (tempPage) =>
        (tempPage = Object.assign({}, tempPage, { title: event.target.value }))
    );
  }
  function handleFavorite() {
    setTempPage(
      (tempPage) =>
        (tempPage = Object.assign({}, tempPage, {
          favorites: !tempPage.favorites,
        }))
    );
  }
  function handleRating(event) {
    console.log(event)
    setTempPage(
      (tempPage) =>
        (tempPage = Object.assign({}, tempPage, {
          rating: (event.target.value <6 && event.target.value >=0)?event.target.value:"" ,
        }))
    );
  }
  function handleEdit() {
    setEditmode(true);
    const { Page } = props;
    setTempPage((tempPage) => Object.assign(tempPage, Page));
    handleShow();
  }
  function handleCreation() {
    setEditmode(false);
    setTempPage(Object.assign({}, { id: nextId }));
    handleShow();
  }
  function handleRemove() {
    deletePage(tempPage);
    handleClose();
  }
  function handleSubmit() {
    if (!tempPage.title || tempPage.title == "" || !tempPage.title.trim()) {
      setErrorMessage("Titolo non valido !");
      return;
    } else {
      setErrorMessage("");
    }
    if (editmode) {
      modifyPage(tempPage);
      handleClose();
    } else {
      addPage(tempPage);
      setNextId((id) => id + 1);
      setTempPage(Object.assign({}, { id: nextId }));
      handleClose();
    }
  }

  return (
    <>
      {newMode ? (
        <Button variant="outline-success" onClick={handleCreation}>
          Add Page
        </Button>
      ) : (
        <Button variant="white" onClick={handleEdit}>
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
      )}
      <Modal show={showEdit} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title : </Form.Label>
              <Form.Control
                type="text"
                name="date"
                value={tempPage.title}
                onChange={handleTitle}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Favourite : </Form.Label>
              <Form.Check
                value={tempPage.favorites?true:false}
                checked={tempPage.favorites}
                onChange={handleFavorite}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Watch Date : </Form.Label>
              <Form.Control
                type="date"
                name="watchDate"
                value={
                  tempPage.date != null
                    ? dayjs(tempPage.date).format("YYYY-MM-DD")
                    : ""
                }
                onChange={handleWatchDate}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rating : </Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={tempPage.rating}
                onChange={handleRating}
              />
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
