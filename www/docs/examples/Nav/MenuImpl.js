import Menu from 'react-bootstrap/Menu';
import NavItem from 'react-bootstrap/NavItem';
import NavLink from 'react-bootstrap/NavLink';

function MenuImplExample() {
  return (
    <Menu as={NavItem}>
      <Menu.Toggle as={NavLink}>Click to see more…</Menu.Toggle>
      <Menu.Panel>
        <Menu.Item>Hello there!</Menu.Item>
      </Menu.Panel>
    </Menu>
  );
}

export default MenuImplExample;
