import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function ValidationInputGroupExample() {
  return (
    <div className="form-field">
      <InputGroup>
        <InputGroup.Text>@</InputGroup.Text>
        <Form.Control type="text" required isInvalid />
      </InputGroup>
      <Form.Control.Feedback type="invalid">
        Please choose a username.
      </Form.Control.Feedback>
    </div>
  );
}

export default ValidationInputGroupExample;
