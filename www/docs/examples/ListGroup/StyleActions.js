import ListGroup from 'react-bootstrap/ListGroup';

function StyleActionsExample() {
  return (
    <ListGroup>
      <ListGroup.Item>No style</ListGroup.Item>
      <ListGroup.Item variant="primary">Primary</ListGroup.Item>
      <ListGroup.Item action variant="secondary">
        Secondary
      </ListGroup.Item>
      <ListGroup.Item action variant="success">
        Success
      </ListGroup.Item>
      <ListGroup.Item action variant="danger">
        Danger
      </ListGroup.Item>
      <ListGroup.Item action variant="warning">
        Warning
      </ListGroup.Item>
      <ListGroup.Item action variant="info">
        Info
      </ListGroup.Item>
      <ListGroup.Item action variant="accent">
        Accent
      </ListGroup.Item>
      <ListGroup.Item action variant="inverse">
        Inverse
      </ListGroup.Item>
    </ListGroup>
  );
}

export default StyleActionsExample;
