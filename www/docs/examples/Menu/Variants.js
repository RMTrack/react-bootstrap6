import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';

function VariantsExample() {
  return (
    <>
      {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
        (variant) => (
          <MenuButton
            as={ButtonGroup}
            key={variant}
            id={`dropdown-variants-${variant}`}
            variant={variant.toLowerCase()}
            title={variant}
          >
            <Menu.Item eventKey="1">Action</Menu.Item>
            <Menu.Item eventKey="2">Another action</Menu.Item>
            <Menu.Item eventKey="3" active>
              Active Item
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item eventKey="4">Separated link</Menu.Item>
          </MenuButton>
        ),
      )}
    </>
  );
}

export default VariantsExample;
