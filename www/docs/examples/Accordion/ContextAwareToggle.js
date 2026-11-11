import { useContext } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import useAccordionButton from 'react-bootstrap/useAccordionButton';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';

const PINK = 'rgba(255, 192, 203, 0.6)';
const BLUE = 'rgba(0, 0, 255, 0.6)';

function ContextAwareToggle({ children, eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey),
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <button
      type="button"
      aria-expanded={isCurrentEventKey}
      style={{ backgroundColor: isCurrentEventKey ? PINK : BLUE }}
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
          <ContextAwareToggle eventKey="0">Click me!</ContextAwareToggle>
        </Card.Header>
        <CustomCollapse eventKey="0">
          <Card.Body>Hello! I am the body</Card.Body>
        </CustomCollapse>
      </Card>
      <Card>
        <Card.Header>
          <ContextAwareToggle eventKey="1">Click me!</ContextAwareToggle>
        </Card.Header>
        <CustomCollapse eventKey="1">
          <Card.Body>Hello! I am another body</Card.Body>
        </CustomCollapse>
      </Card>
    </Accordion>
  );
}

render(<Example />);
