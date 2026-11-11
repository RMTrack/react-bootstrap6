import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavMenu from 'react-bootstrap/NavMenu';
import Drawer from 'react-bootstrap/Drawer';

function CollapsibleExample() {
  return (
    <Navbar collapseOnSelect expand="md" className="bg-1">
      <Container>
        <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Drawer
          id="responsive-navbar-nav"
          aria-labelledby="responsive-navbar-nav-label"
          placement="end"
        >
          <Drawer.Header closeButton>
            <Drawer.Title id="responsive-navbar-nav-label">
              React-Bootstrap
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Nav className="me-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavMenu title="Menu" id="collapsible-nav-dropdown">
                <NavMenu.Item href="#action/3.1">Action</NavMenu.Item>
                <NavMenu.Item href="#action/3.2">Another action</NavMenu.Item>
                <NavMenu.Item href="#action/3.3">Something</NavMenu.Item>
                <NavMenu.Divider />
                <NavMenu.Item href="#action/3.4">Separated link</NavMenu.Item>
              </NavMenu>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Drawer.Body>
        </Navbar.Drawer>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
