import Menu from 'react-bootstrap/Menu';
import MenuButton from 'react-bootstrap/MenuButton';
import SplitButton from 'react-bootstrap/SplitButton';

function MenuAlignResponsiveExample() {
  return (
    <>
      <div>
        <MenuButton
          as={ButtonGroup}
          align={{ lg: 'end' }}
          title="Left-aligned but right aligned when large screen"
          id="dropdown-menu-align-responsive-1"
        >
          <Menu.Item eventKey="1">Action 1</Menu.Item>
          <Menu.Item eventKey="2">Action 2</Menu.Item>
        </MenuButton>
      </div>
      <div className="mt-3">
        <SplitButton
          align={{ lg: 'start' }}
          title="Right-aligned but left aligned when large screen"
          id="dropdown-menu-align-responsive-2"
        >
          <Menu.Item eventKey="1">Action 1</Menu.Item>
          <Menu.Item eventKey="2">Action 2</Menu.Item>
        </SplitButton>
      </div>
    </>
  );
}

export default MenuAlignResponsiveExample;
