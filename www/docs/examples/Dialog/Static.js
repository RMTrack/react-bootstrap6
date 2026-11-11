import Button from 'react-bootstrap/Button';
import Dialog from 'react-bootstrap/Dialog';

function StaticExample() {
  return (
    <dialog className="dialog" open style={{ position: 'static' }}>
      <Dialog.Header closeButton>
        <Dialog.Title>Dialog title</Dialog.Title>
      </Dialog.Header>

      <Dialog.Body>
        <p>Dialog body text goes here.</p>
      </Dialog.Body>

      <Dialog.Footer>
        <Button variant="secondary">Close</Button>
        <Button variant="primary">Save changes</Button>
      </Dialog.Footer>
    </dialog>
  );
}

export default StaticExample;
