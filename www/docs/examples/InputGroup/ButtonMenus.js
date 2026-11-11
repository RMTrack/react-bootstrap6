import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function ButtonMenusExample() {
  return (
    <>
      <InputGroup className="mb-5">
        <MenuButton
          variant="outline-secondary"
          title="Menu"
          id="input-group-dropdown-1"
        >
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </MenuButton>
        <Form.Control aria-label="Text input with dropdown button" />
      </InputGroup>

      <InputGroup className="mb-5">
        <Form.Control aria-label="Text input with dropdown button" />

        <MenuButton
          variant="outline-secondary"
          title="Menu"
          id="input-group-dropdown-2"
          align="end"
        >
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </MenuButton>
      </InputGroup>

      <InputGroup>
        <MenuButton
          variant="outline-secondary"
          title="Menu"
          id="input-group-dropdown-3"
        >
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </MenuButton>
        <Form.Control aria-label="Text input with 2 dropdown buttons" />
        <MenuButton
          variant="outline-secondary"
          title="Menu"
          id="input-group-dropdown-4"
          align="end"
        >
          <Menu.Item href="#">Action</Menu.Item>
          <Menu.Item href="#">Another action</Menu.Item>
          <Menu.Item href="#">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#">Separated link</Menu.Item>
        </MenuButton>
      </InputGroup>
    </>
  );
}

export default ButtonMenusExample;
