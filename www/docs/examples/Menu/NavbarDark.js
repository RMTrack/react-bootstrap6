import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavMenu from 'react-bootstrap/NavMenu';
import Drawer from 'react-bootstrap/Drawer';

function NavbarDarkExample() {
  return (
    <Navbar variant="dark" expand="md">
      <Container fluid>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-dark-example" />
        <Navbar.Drawer
          id="navbar-dark-example"
          aria-labelledby="navbar-dark-example-label"
          placement="end"
        >
          <Drawer.Header closeButton>
            <Drawer.Title id="navbar-dark-example-label">
              React-Bootstrap
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Nav>
              <NavMenu
                id="nav-dropdown-dark-example"
                title="Menu"
                menuVariant="dark"
              >
                <NavMenu.Item href="#action/3.1">Action</NavMenu.Item>
                <NavMenu.Item href="#action/3.2">Another action</NavMenu.Item>
                <NavMenu.Item href="#action/3.3">Something</NavMenu.Item>
                <NavMenu.Divider />
                <NavMenu.Item href="#action/3.4">Separated link</NavMenu.Item>
              </NavMenu>
            </Nav>
          </Drawer.Body>
        </Navbar.Drawer>
      </Container>
    </Navbar>
  );
}

export default NavbarDarkExample;
