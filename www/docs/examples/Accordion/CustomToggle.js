import { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import useAccordionButton from 'react-bootstrap/useAccordionButton';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('totally custom!'),
  );

  return (
    <button
      type="button"
      style={{ backgroundColor: 'pink' }}
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

function CustomCollapse({ children, eventKey }) {
  const { activeEventKey } = useContext(AccordionContext);

  return (
    <Collapse in={activeEventKey === eventKey}>
      <div>{children}</div>
    </Collapse>
  );
}

function Example() {
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Card.Header>
          <CustomToggle eventKey="0">Click me!</CustomToggle>
        </Card.Header>
        <CustomCollapse eventKey="0">
          <Card.Body>Hello! I'm the body</Card.Body>
        </CustomCollapse>
      </Card>
      <Card>
        <Card.Header>
          <CustomToggle eventKey="1">Click me!</CustomToggle>
        </Card.Header>
        <CustomCollapse eventKey="1">
          <Card.Body>Hello! I'm another body</Card.Body>
        </CustomCollapse>
      </Card>
    </Accordion>
  );
}

render(<Example />);
