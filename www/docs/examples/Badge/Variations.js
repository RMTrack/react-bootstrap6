import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function VariationsExample() {
  return (
    <Stack direction="horizontal" gap={3}>
      <Badge bg="primary">Primary</Badge>
      <Badge bg="accent">Accent</Badge>
      <Badge bg="secondary">Secondary</Badge>
      <Badge bg="success">Success</Badge>
      <Badge bg="danger">Danger</Badge>
      <Badge bg="warning">Warning</Badge>
      <Badge bg="info">Info</Badge>
      <Badge bg="inverse">Inverse</Badge>
    </Stack>
  );
}

export default VariationsExample;
