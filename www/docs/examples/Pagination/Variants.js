import Pagination from 'react-bootstrap/Pagination';

function VariantsExample() {
  return (
    <div>
      {['primary', 'accent', 'success', 'danger'].map((variant) => (
        <Pagination key={variant} variant={variant}>
          <Pagination.Prev />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Item active>{2}</Pagination.Item>
          <Pagination.Item>{3}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      ))}
    </div>
  );
}

export default VariantsExample;
