import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function MenuItemTagsExample() {
  return (
    <MenuButton id="dropdown-item-button" title="Menu button">
      <Menu.Text>Menu item text</Menu.Text>
      <Menu.Item as="button">Action</Menu.Item>
      <Menu.Item as="button">Another action</Menu.Item>
      <Menu.Item as="button">Something else</Menu.Item>
    </MenuButton>
  );
}

export default MenuItemTagsExample;
