import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Drawer from 'react-bootstrap/Drawer';

function Example() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Toggle static drawer
      </Button>

      <Drawer show={show} onHide={handleClose} backdrop="static">
        <Drawer.Header closeButton>
          <Drawer.Title>Drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>I will not close if you click outside of me.</Drawer.Body>
      </Drawer>
    </>
  );
}

export default Example;
