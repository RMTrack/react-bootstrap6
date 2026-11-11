import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Menu from 'react-bootstrap/Menu';

function ButtonCustomExample() {
  return (
    <>
      <Menu as={ButtonGroup}>
        <Menu.Toggle id="dropdown-custom-1">Pow! Zoom!</Menu.Toggle>
        <Menu.Panel className="super-colors">
          <Menu.Item eventKey="1">Action</Menu.Item>
          <Menu.Item eventKey="2">Another action</Menu.Item>
          <Menu.Item eventKey="3" active>
            Active Item
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item eventKey="4">Separated link</Menu.Item>
        </Menu.Panel>
      </Menu>
      <Menu as={ButtonGroup}>
        <Button variant="info">mix it up style-wise</Button>
        <Menu.Toggle split variant="success" id="dropdown-custom-2" />
        <Menu.Panel className="super-colors">
          <Menu.Item eventKey="1">Action</Menu.Item>
          <Menu.Item eventKey="2">Another action</Menu.Item>
          <Menu.Item eventKey="3" active>
            Active Item
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item eventKey="4">Separated link</Menu.Item>
        </Menu.Panel>
      </Menu>
    </>
  );
}

export default ButtonCustomExample;
