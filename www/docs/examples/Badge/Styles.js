import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function StylesExample() {
  return (
    <Stack gap={5}>
      <Stack direction="horizontal" gap={3}>
        <Badge bg="primary">Solid</Badge>
        <Badge bg="primary" variant="subtle">
          Subtle
        </Badge>
        <Badge bg="primary" variant="outline">
          Outline
        </Badge>
      </Stack>
      <Stack direction="horizontal" gap={3}>
        <Badge bg="success">Solid</Badge>
        <Badge bg="success" variant="subtle">
          Subtle
        </Badge>
        <Badge bg="success" variant="outline">
          Outline
        </Badge>
      </Stack>
    </Stack>
  );
}

export default StylesExample;
