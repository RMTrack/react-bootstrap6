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
        Launch static backdrop dialog
      </Button>

      <Dialog
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Dialog.Header closeButton>
          <Dialog.Title>Dialog title</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          I will not close if you click outside me. Do not even try to press
          escape key.
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

export default Example;
