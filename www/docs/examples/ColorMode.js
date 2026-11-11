import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function Example() {
  return (
    <Stack direction="horizontal" gap={5}>
      <MenuButton
        id="dropdown-button-dark-example2"
        variant="secondary"
        title="Light menu"
        className="mt-3"
        data-bs-theme="light"
      >
        <Menu.Item href="#/action-1" active>
          Action
        </Menu.Item>
        <Menu.Item href="#/action-2">Another action</Menu.Item>
        <Menu.Item href="#/action-3">Something else</Menu.Item>
        <Menu.Divider />
        <Menu.Item href="#/action-4">Separated link</Menu.Item>
      </MenuButton>

      <MenuButton
        id="dropdown-button-dark-example2"
        variant="secondary"
        title="Dark menu"
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
    </Stack>
  );
}

export default ColorMode;
