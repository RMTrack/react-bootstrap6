import CloseButton from 'react-bootstrap/CloseButton';

function VariantsExample() {
  return (
    <>
      <div data-bs-theme="dark" className="bg-body p-3">
        <CloseButton />
        <CloseButton disabled />
      </div>
      <div className="p-3">
        <CloseButton className="fg-danger" />
        <CloseButton className="fg-primary" />
      </div>
    </>
  );
}

export default VariantsExample;
