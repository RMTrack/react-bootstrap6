import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dialog from 'react-bootstrap/Dialog';

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  return (
    <>
      <Button variant="primary" onClick={() => setShow((s) => !s)}>
        Toggle non-modal dialog
      </Button>

      <Dialog show={show} onHide={handleClose} modal={false}>
        <Dialog.Header closeButton>
          <Dialog.Title>Non-modal dialog</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          There is no backdrop, and the rest of the page stays interactive while
          this dialog is open.
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

export default Example;
