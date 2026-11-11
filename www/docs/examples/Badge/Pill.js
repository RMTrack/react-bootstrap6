import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

function PillExample() {
  return (
    <Stack direction="horizontal" gap={3}>
      <Badge pill bg="primary">
        Primary
      </Badge>
      <Badge pill bg="accent">
        Accent
      </Badge>
      <Badge pill bg="secondary">
        Secondary
      </Badge>
      <Badge pill bg="success">
        Success
      </Badge>
      <Badge pill bg="danger">
        Danger
      </Badge>
      <Badge pill bg="warning">
        Warning
      </Badge>
      <Badge pill bg="info">
        Info
      </Badge>
      <Badge pill bg="inverse">
        Inverse
      </Badge>
    </Stack>
  );
}

export default PillExample;
