import Card from 'react-bootstrap/Card';

function TextExample() {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Subtitle className="mb-3 fg-secondary">
          Card Subtitle
        </Card.Subtitle>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <div className="d-flex gap-5">
          <a href="#">Card Link</a>
          <a href="#">Another Link</a>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TextExample;
