import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function VerticalExample() {
  return (
    <ButtonGroup vertical>
      <Button>Button</Button>
      <Button>Button</Button>

      <MenuButton as={ButtonGroup} title="Menu" id="bg-vertical-dropdown-1">
        <Menu.Item eventKey="1">Menu link</Menu.Item>
        <Menu.Item eventKey="2">Menu link</Menu.Item>
      </MenuButton>

      <Button>Button</Button>
      <Button>Button</Button>

      <MenuButton as={ButtonGroup} title="Menu" id="bg-vertical-dropdown-2">
        <Menu.Item eventKey="1">Menu link</Menu.Item>
        <Menu.Item eventKey="2">Menu link</Menu.Item>
      </MenuButton>

      <MenuButton as={ButtonGroup} title="Menu" id="bg-vertical-dropdown-3">
        <Menu.Item eventKey="1">Menu link</Menu.Item>
        <Menu.Item eventKey="2">Menu link</Menu.Item>
      </MenuButton>
    </ButtonGroup>
  );
}

export default VerticalExample;
