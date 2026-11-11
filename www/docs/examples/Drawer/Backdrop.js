import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Drawer from 'react-bootstrap/Drawer';

const options = [
  {
    name: 'Enable backdrop (default)',
    scroll: false,
    backdrop: true,
  },
  {
    name: 'Disable backdrop',
    scroll: false,
    backdrop: false,
  },
  {
    name: 'Enable body scrolling',
    scroll: true,
    backdrop: false,
  },
  {
    name: 'Enable both scrolling & backdrop',
    scroll: true,
    backdrop: true,
  },
];

function DrawerExample({ name, ...props }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  return (
    <>
      <Button variant="primary" onClick={toggleShow} className="me-3">
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
      {options.map((props, idx) => (
        <DrawerExample key={idx} {...props} />
      ))}
    </>
  );
}

render(<Example />);
