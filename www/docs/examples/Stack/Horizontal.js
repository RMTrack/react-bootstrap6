import Stack from 'react-bootstrap/Stack';

function HorizontalExample() {
  return (
    <Stack direction="horizontal" gap={5}>
      <div className="p-3">First item</div>
      <div className="p-3">Second item</div>
      <div className="p-3">Third item</div>
    </Stack>
  );
}

export default HorizontalExample;
