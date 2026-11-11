import Menu from 'react-bootstrap/Menu';

function BasicExample() {
  return (
    <Menu>
      <Menu.Toggle variant="success" id="dropdown-basic">
        Menu Button
      </Menu.Toggle>

      <Menu.Panel>
        <Menu.Item href="#/action-1">Action</Menu.Item>
        <Menu.Item href="#/action-2">Another action</Menu.Item>
        <Menu.Item href="#/action-3">Something else</Menu.Item>
      </Menu.Panel>
    </Menu>
  );
}

export default BasicExample;
