import Nav from 'react-bootstrap/Nav';
import NavMenu from 'react-bootstrap/NavMenu';

function NavMenuExample() {
  const handleSelect = (eventKey) => alert(`selected ${eventKey}`);

  return (
    <Nav variant="pills" activeKey="1" onSelect={handleSelect}>
      <Nav.Item>
        <Nav.Link eventKey="1" href="#/home">
          NavLink 1 content
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="2" title="Item">
          NavLink 2 content
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="3" disabled>
          NavLink 3 content
        </Nav.Link>
      </Nav.Item>
      <NavMenu title="Menu" id="nav-dropdown">
        <NavMenu.Item eventKey="4.1">Action</NavMenu.Item>
        <NavMenu.Item eventKey="4.2">Another action</NavMenu.Item>
        <NavMenu.Item eventKey="4.3">Something else here</NavMenu.Item>
        <NavMenu.Divider />
        <NavMenu.Item eventKey="4.4">Separated link</NavMenu.Item>
      </NavMenu>
    </Nav>
  );
}

export default NavMenuExample;
