import Menu from 'react-bootstrap/Menu';

function AutoCloseExample() {
  return (
    <>
      <Menu className="d-inline mx-3">
        <Menu.Toggle id="dropdown-autoclose-true">Default Menu</Menu.Toggle>

        <Menu.Panel>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
        </Menu.Panel>
      </Menu>

      <Menu className="d-inline mx-3" autoClose="inside">
        <Menu.Toggle id="dropdown-autoclose-inside">
          Clickable Outside
        </Menu.Toggle>

        <Menu.Panel>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
        </Menu.Panel>
      </Menu>

      <Menu className="d-inline mx-3" autoClose="outside">
        <Menu.Toggle id="dropdown-autoclose-outside">
          Clickable Inside
        </Menu.Toggle>

        <Menu.Panel>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
        </Menu.Panel>
      </Menu>

      <Menu className="d-inline mx-3" autoClose={false}>
        <Menu.Toggle id="dropdown-autoclose-false">Manual Close</Menu.Toggle>

        <Menu.Panel>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
          <Menu.Item href="#">Menu Item</Menu.Item>
        </Menu.Panel>
      </Menu>
    </>
  );
}

export default AutoCloseExample;
