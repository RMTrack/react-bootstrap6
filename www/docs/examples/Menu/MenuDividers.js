import Menu from 'react-bootstrap/Menu';

function MenuDividersExample() {
  return (
    <Menu.Panel show>
      <Menu.Item eventKey="1">Action</Menu.Item>
      <Menu.Item eventKey="2">Another action</Menu.Item>
      <Menu.Item eventKey="3">Something else here</Menu.Item>
      <Menu.Divider />
      <Menu.Item eventKey="4">Separated link</Menu.Item>
    </Menu.Panel>
  );
}

export default MenuDividersExample;
