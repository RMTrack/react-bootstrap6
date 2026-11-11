import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function MenuAlignEndExample() {
  return (
    <MenuButton align="end" title="Menu end" id="dropdown-menu-align-end">
      <Menu.Item eventKey="1">Action</Menu.Item>
      <Menu.Item eventKey="2">Another action</Menu.Item>
      <Menu.Item eventKey="3">Something else here</Menu.Item>
      <Menu.Divider />
      <Menu.Item eventKey="4">Separated link</Menu.Item>
    </MenuButton>
  );
}

export default MenuAlignEndExample;
