import ListGroup from 'react-bootstrap/ListGroup';

function HorizontalResponsiveExample() {
  return (
    <div className="contains-inline">
      {['sm', 'md', 'lg', 'xl', '2xl'].map((breakpoint) => (
        <ListGroup key={breakpoint} horizontal={breakpoint} className="my-3">
          <ListGroup.Item>This ListGroup</ListGroup.Item>
          <ListGroup.Item>renders horizontally</ListGroup.Item>
          <ListGroup.Item>on {breakpoint}</ListGroup.Item>
          <ListGroup.Item>and above!</ListGroup.Item>
        </ListGroup>
      ))}
    </div>
  );
}

export default HorizontalResponsiveExample;
