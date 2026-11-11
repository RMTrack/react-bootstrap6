import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function BasicButtonExample() {
  return (
    <MenuButton id="dropdown-basic-button" title="Menu button">
      <Menu.Item href="#/action-1">Action</Menu.Item>
      <Menu.Item href="#/action-2">Another action</Menu.Item>
      <Menu.Item href="#/action-3">Something else</Menu.Item>
    </MenuButton>
  );
}

export default BasicButtonExample;
