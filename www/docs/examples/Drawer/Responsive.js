import { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Drawer from 'react-bootstrap/Drawer';

function ResponsiveExample() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" className="lg:d-none" onClick={handleShow}>
        Launch
      </Button>

      <Alert variant="info" className="d-none lg:d-block">
        Resize your browser to show the responsive drawer toggle.
      </Alert>

      <Drawer show={show} onHide={handleClose} responsive="lg">
        <Drawer.Header closeButton>
          <Drawer.Title>Responsive drawer</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <p className="mb-0">
            This is content within an <code>.lg:drawer</code>.
          </p>
        </Drawer.Body>
      </Drawer>
    </>
  );
}

export default ResponsiveExample;
