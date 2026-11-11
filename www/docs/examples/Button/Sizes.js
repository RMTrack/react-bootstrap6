import Button from 'react-bootstrap/Button';

function SizesExample() {
  return (
    <>
      <div className="d-flex gap-3 mb-3">
        <Button variant="primary" size="lg">
          Large button
        </Button>
        <Button variant="secondary" size="lg">
          Large button
        </Button>
      </div>
      <div className="d-flex gap-3">
        <Button variant="primary" size="sm">
          Small button
        </Button>
        <Button variant="secondary" size="sm">
          Small button
        </Button>
      </div>
    </>
  );
}

export default SizesExample;
