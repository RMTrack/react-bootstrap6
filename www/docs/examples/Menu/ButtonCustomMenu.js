import React, { useState } from 'react';
import Menu from 'react-bootstrap/Menu';
import Form from 'react-bootstrap/Form';

// The forwardRef is important!!
// Menu needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Menu needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Form.Control
          autoFocus
          className="mx-5 my-3 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

render(
  <Menu>
    <Menu.Toggle as={CustomToggle} id="dropdown-custom-components">
      Custom toggle
    </Menu.Toggle>

    <Menu.Panel as={CustomMenu}>
      <Menu.Item eventKey="1">Red</Menu.Item>
      <Menu.Item eventKey="2">Blue</Menu.Item>
      <Menu.Item eventKey="3" active>
        Orange
      </Menu.Item>
      <Menu.Item eventKey="1">Red-Orange</Menu.Item>
    </Menu.Panel>
  </Menu>,
);
