import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Drawer from 'react-bootstrap/Drawer';

function DrawerExample({ name, ...props }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="me-3">
        {name}
      </Button>
      <Drawer show={show} onHide={handleClose} {...props}>
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

function Example() {
  return (
    <>
      {['start', 'end', 'top', 'bottom'].map((placement, idx) => (
        <DrawerExample key={idx} placement={placement} name={placement} />
      ))}
    </>
  );
}

render(<Example />);
