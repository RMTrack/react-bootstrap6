import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Menu from 'react-bootstrap/Menu';

function SplitBasicExample() {
  return (
    <Menu as={ButtonGroup}>
      <Button variant="success">Split Button</Button>

      <Menu.Toggle split variant="success" id="dropdown-split-basic" />

      <Menu.Panel>
        <Menu.Item href="#/action-1">Action</Menu.Item>
        <Menu.Item href="#/action-2">Another action</Menu.Item>
        <Menu.Item href="#/action-3">Something else</Menu.Item>
      </Menu.Panel>
    </Menu>
  );
}

export default SplitBasicExample;
