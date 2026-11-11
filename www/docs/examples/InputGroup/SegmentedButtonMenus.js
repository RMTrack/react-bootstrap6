import Menu from 'react-bootstrap/Menu';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SplitButton from 'react-bootstrap/SplitButton';

function SegmentedButtonMenusExample() {
  return (
    <>
      <InputGroup className="mb-5">
        <SplitButton
          variant="outline-secondary"
          title="Action"
          id="segmented-button-dropdown-1"
        >
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </SplitButton>
        <Form.Control aria-label="Text input with dropdown button" />
      </InputGroup>

      <InputGroup className="mb-5">
        <Form.Control aria-label="Text input with dropdown button" />
        <SplitButton
          variant="outline-secondary"
          title="Action"
          id="segmented-button-dropdown-2"
          alignRight
        >
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </SplitButton>
      </InputGroup>
    </>
  );
}

export default SegmentedButtonMenusExample;
