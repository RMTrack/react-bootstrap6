import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavMenu from 'react-bootstrap/NavMenu';
import Drawer from 'react-bootstrap/Drawer';

function BasicExample() {
  return (
    <Navbar expand="md" className="bg-1">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Drawer
          id="basic-navbar-nav"
          aria-labelledby="basic-navbar-nav-label"
          placement="end"
        >
          <Drawer.Header closeButton>
            <Drawer.Title id="basic-navbar-nav-label">
              React-Bootstrap
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
              <NavMenu title="Menu" id="basic-nav-dropdown">
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

export default BasicExample;
