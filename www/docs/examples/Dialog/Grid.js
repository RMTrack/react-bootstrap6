import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dialog from 'react-bootstrap/Dialog';
import Row from 'react-bootstrap/Row';

function GridDialog(props) {
  return (
    <Dialog {...props} aria-labelledby="contained-modal-title-vcenter">
      <Dialog.Header closeButton>
        <Dialog.Title id="contained-modal-title-vcenter">
          Using Grid in Dialog
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Body className="grid-example">
        <Container>
          <Row>
            <Col xs={12} md={8}>
              .col-xs-12 .col-md-8
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>

          <Row>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>
        </Container>
      </Dialog.Body>
      <Dialog.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Dialog.Footer>
    </Dialog>
  );
}

function App() {
  const [dialogShow, setDialogShow] = useState(false);

  return (
    <>
      <Button variant="primary" onClick={() => setDialogShow(true)}>
        Launch dialog with grid
      </Button>

      <GridDialog show={dialogShow} onHide={() => setDialogShow(false)} />
    </>
  );
}

render(<App />);
