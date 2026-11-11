import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';
import SplitButton from 'react-bootstrap/SplitButton';

function ButtonSizesExample() {
  return (
    <>
      {[MenuButton, SplitButton].map((MenuType, idx) => (
        <MenuType
          as={ButtonGroup}
          key={idx}
          id={`dropdown-button-drop-${idx}`}
          size="lg"
          title="Drop large"
        >
          <Menu.Item eventKey="1">Action</Menu.Item>
          <Menu.Item eventKey="2">Another action</Menu.Item>
          <Menu.Item eventKey="3">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item eventKey="4">Separated link</Menu.Item>
        </MenuType>
      ))}

      {[MenuButton, SplitButton].map((MenuType, idx) => (
        <MenuType
          as={ButtonGroup}
          key={idx}
          id={`dropdown-button-drop-${idx}`}
          size="sm"
          variant="secondary"
          title="Drop small"
        >
          <Menu.Item eventKey="1">Action</Menu.Item>
          <Menu.Item eventKey="2">Another action</Menu.Item>
          <Menu.Item eventKey="3">Something else here</Menu.Item>
          <Menu.Divider />
          <Menu.Item eventKey="4">Separated link</Menu.Item>
        </MenuType>
      ))}
    </>
  );
}

export default ButtonSizesExample;
