import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function TextLinkExample() {
  return (
    <Navbar className="bg-1">
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Text className="ms-auto">
          Signed in as: <a href="#login">Mark Otto</a>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default TextLinkExample;
