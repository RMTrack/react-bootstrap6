import Card from 'react-bootstrap/Card';

function HorizontalExample() {
  return (
    <Card className="card-row" style={{ maxWidth: '540px' }}>
      <Card.Img
        variant="start"
        src="holder.js/180x200"
        style={{ width: '180px' }}
      />
      <Card.Body>
        <Card.Title>Card title</Card.Title>
        <Card.Text>
          This is a wider card with supporting text below as a natural lead-in
          to additional content.
        </Card.Text>
        <Card.Text>
          <small className="fg-secondary">Last updated 3 mins ago</small>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default HorizontalExample;
