import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavMenu from 'react-bootstrap/NavMenu';
import Drawer from 'react-bootstrap/Drawer';

function DrawerExample() {
  return (
    <>
      {[false, 'sm', 'md', 'lg', 'xl', '2xl'].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-1 mb-5">
          <Container fluid>
            <Navbar.Brand href="#">Navbar Drawer</Navbar.Brand>
            <Navbar.Toggle aria-controls={`drawerNavbar-expand-${expand}`} />
            <Navbar.Drawer
              id={`drawerNavbar-expand-${expand}`}
              aria-labelledby={`drawerNavbarLabel-expand-${expand}`}
              placement="end"
            >
              <Drawer.Header closeButton>
                <Drawer.Title id={`drawerNavbarLabel-expand-${expand}`}>
                  Drawer
                </Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <Nav className="justify-content-end flex-grow-1 pe-5">
                  <Nav.Link href="#action1">Home</Nav.Link>
                  <Nav.Link href="#action2">Link</Nav.Link>
                  <NavMenu
                    title="Menu"
                    id={`drawerNavbarMenu-expand-${expand}`}
                  >
                    <NavMenu.Item href="#action3">Action</NavMenu.Item>
                    <NavMenu.Item href="#action4">Another action</NavMenu.Item>
                    <NavMenu.Divider />
                    <NavMenu.Item href="#action5">
                      Something else here
                    </NavMenu.Item>
                  </NavMenu>
                </Nav>
                <Form className="d-flex">
                  <Form.Control
                    type="search"
                    placeholder="Search"
                    className="me-3"
                    aria-label="Search"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Drawer.Body>
            </Navbar.Drawer>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default DrawerExample;
