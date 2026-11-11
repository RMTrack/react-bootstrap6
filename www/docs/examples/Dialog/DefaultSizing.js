import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dialog from 'react-bootstrap/Dialog';

function Example() {
  const [smShow, setSmShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);

  return (
    <>
      <Button onClick={() => setSmShow(true)} className="me-3">
        Small dialog
      </Button>
      <Button onClick={() => setLgShow(true)}>Large dialog</Button>
      <Dialog
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Dialog.Header closeButton>
          <Dialog.Title id="example-modal-sizes-title-sm">
            Small Dialog
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>...</Dialog.Body>
      </Dialog>
      <Dialog
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Dialog.Header closeButton>
          <Dialog.Title id="example-modal-sizes-title-lg">
            Large Dialog
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>...</Dialog.Body>
      </Dialog>
    </>
  );
}

export default Example;
