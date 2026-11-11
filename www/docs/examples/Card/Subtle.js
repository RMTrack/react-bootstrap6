import Card from 'react-bootstrap/Card';

function SubtleExample() {
  return (
    <>
      {[
        'Primary',
        'Accent',
        'Secondary',
        'Success',
        'Danger',
        'Warning',
        'Info',
        'Inverse',
      ].map((theme) => (
        <Card
          bg={theme.toLowerCase()}
          variant="subtle"
          key={theme}
          style={{ width: '18rem' }}
          className="mb-3"
        >
          <Card.Header>Header</Card.Header>
          <Card.Body>
            <Card.Title>{theme} subtle card</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the
              bulk of the card's content.
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </>
  );
}

export default SubtleExample;
