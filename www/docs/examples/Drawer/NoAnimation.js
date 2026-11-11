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
        Launch without animation
      </Button>

      <Drawer show={show} onHide={handleClose} animation={false}>
        <Drawer.Header closeButton>
          <Drawer.Title>Drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </Drawer.Body>
      </Drawer>
    </>
  );
}

export default Example;
