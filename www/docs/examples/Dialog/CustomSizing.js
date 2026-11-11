import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Dialog from 'react-bootstrap/Dialog';

function Example() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        Custom Width Dialog
      </Button>

      <Dialog
        show={show}
        onHide={() => setShow(false)}
        className="dialog-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Dialog.Header closeButton>
          <Dialog.Title id="example-custom-modal-styling-title">
            Custom Dialog Styling
          </Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <p>
            Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
            commodi aspernatur enim, consectetur. Cumque deleniti temporibus
            ipsam atque a dolores quisquam quisquam adipisci possimus
            laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
            accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
            reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
            deleniti rem!
          </p>
        </Dialog.Body>
      </Dialog>
    </>
  );
}

export default Example;
