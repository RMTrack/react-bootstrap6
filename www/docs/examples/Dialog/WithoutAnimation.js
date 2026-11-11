import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dialog from 'react-bootstrap/Dialog';

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo dialog
      </Button>

      <Dialog show={show} onHide={handleClose} animation={false}>
        <Dialog.Header closeButton>
          <Dialog.Title>Dialog heading</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          Woohoo, you are reading this text in a dialog!
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

export default Example;
