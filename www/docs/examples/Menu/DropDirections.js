import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';
import SplitButton from 'react-bootstrap/SplitButton';

function DropDirectionExample() {
  return (
    <>
      {['up', 'up-centered', 'down', 'down-centered', 'start', 'end'].map(
        (direction) => (
          <MenuButton
            as={ButtonGroup}
            key={direction}
            id={`dropdown-button-drop-${direction}`}
            drop={direction}
            variant="secondary"
            title={`Drop ${direction}`}
          >
            <Menu.Item eventKey="1">Action</Menu.Item>
            <Menu.Item eventKey="2">Another action</Menu.Item>
            <Menu.Item eventKey="3">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item eventKey="4">Separated link</Menu.Item>
          </MenuButton>
        ),
      )}

      {['up', 'up-centered', 'down', 'down-centered', 'start', 'end'].map(
        (direction) => (
          <SplitButton
            key={direction}
            id={`dropdown-button-drop-${direction}`}
            drop={direction}
            variant="secondary"
            title={`Drop ${direction}`}
          >
            <Menu.Item eventKey="1">Action</Menu.Item>
            <Menu.Item eventKey="2">Another action</Menu.Item>
            <Menu.Item eventKey="3">Something else here</Menu.Item>
            <Menu.Divider />
            <Menu.Item eventKey="4">Separated link</Menu.Item>
          </SplitButton>
        ),
      )}
    </>
  );
}

export default DropDirectionExample;
