import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dialog from 'react-bootstrap/Dialog';

function Example() {
  const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', '2xl-down'];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);

  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  return (
    <>
      {values.map((v, idx) => (
        <Button key={idx} className="me-3 mb-3" onClick={() => handleShow(v)}>
          Full screen
          {typeof v === 'string' && `below ${v.split('-')[0]}`}
        </Button>
      ))}
      <Dialog show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
        <Dialog.Header closeButton>
          <Dialog.Title>Dialog</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>Dialog body content</Dialog.Body>
      </Dialog>
    </>
  );
}

export default Example;
