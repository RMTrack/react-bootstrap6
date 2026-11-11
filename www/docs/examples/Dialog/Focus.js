import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
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

      <Dialog show={show} onHide={handleClose}>
        <Dialog.Header closeButton>
          <Dialog.Title>Dialog heading</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <Form>
            <Form.Group className="mb-5" controlId="exampleForm.ControlInput1">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-5"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Example textarea</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
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
