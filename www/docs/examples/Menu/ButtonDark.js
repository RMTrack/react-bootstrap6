import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function ButtonDarkExample() {
  return (
    <>
      <Menu data-bs-theme="dark">
        <Menu.Toggle id="dropdown-button-dark-example1" variant="secondary">
          Menu Button
        </Menu.Toggle>

        <Menu.Panel>
          <Menu.Item href="#/action-1" active>
            Action
          </Menu.Item>
          <Menu.Item href="#/action-2">Another action</Menu.Item>
          <Menu.Item href="#/action-3">Something else</Menu.Item>
          <Menu.Divider />
          <Menu.Item href="#/action-4">Separated link</Menu.Item>
        </Menu.Panel>
      </Menu>

      <MenuButton
        id="dropdown-button-dark-example2"
        variant="secondary"
        title="Menu button"
        className="mt-3"
        data-bs-theme="dark"
      >
        <Menu.Item href="#/action-1" active>
          Action
        </Menu.Item>
        <Menu.Item href="#/action-2">Another action</Menu.Item>
        <Menu.Item href="#/action-3">Something else</Menu.Item>
        <Menu.Divider />
        <Menu.Item href="#/action-4">Separated link</Menu.Item>
      </MenuButton>
    </>
  );
}

export default ButtonDarkExample;
