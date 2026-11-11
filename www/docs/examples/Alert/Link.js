import Alert from 'react-bootstrap/Alert';

function LinksExample() {
  return (
    <>
      {[
        'primary',
        'accent',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'inverse',
      ].map((variant) => (
        <Alert key={variant} variant={variant}>
          This is a {variant} alert with{' '}
          <Alert.Link href="#">an example link</Alert.Link>. Give it a click if
          you like.
        </Alert>
      ))}
    </>
  );
}

export default LinksExample;
