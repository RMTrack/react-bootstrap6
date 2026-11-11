import Menu from 'react-bootstrap/Menu';

function MenuHeadersExample() {
  return (
    <Menu.Panel show>
      <Menu.Header>Menu header</Menu.Header>
      <Menu.Item eventKey="2">Another action</Menu.Item>
      <Menu.Item eventKey="3">Something else here</Menu.Item>
    </Menu.Panel>
  );
}

export default MenuHeadersExample;
