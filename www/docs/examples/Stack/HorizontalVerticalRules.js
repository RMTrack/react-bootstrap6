import Stack from 'react-bootstrap/Stack';

function HorizontalVerticalRulesExample() {
  return (
    <Stack direction="horizontal" gap={5}>
      <div className="p-3">First item</div>
      <div className="p-3 ms-auto">Second item</div>
      <div className="vr" />
      <div className="p-3">Third item</div>
    </Stack>
  );
}

export default HorizontalVerticalRulesExample;
