import Button from 'react-bootstrap/Button';
import MenuButton from 'react-bootstrap/MenuButton';
import Menu from 'react-bootstrap/Menu';

function NestedExample() {
  return (
    <ButtonGroup>
      <Button>1</Button>
      <Button>2</Button>

      <MenuButton as={ButtonGroup} title="Menu" id="bg-nested-dropdown">
        <Menu.Item eventKey="1">Menu link</Menu.Item>
        <Menu.Item eventKey="2">Menu link</Menu.Item>
      </MenuButton>
    </ButtonGroup>
  );
}

export default NestedExample;
