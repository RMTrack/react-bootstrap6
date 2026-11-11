import Menu from 'react-bootstrap/Menu';
import SplitButton from 'react-bootstrap/SplitButton';

function SplitVariantExample() {
  return (
    <>
      {['Primary', 'Secondary', 'Success', 'Info', 'Warning', 'Danger'].map(
        (variant) => (
          <SplitButton
            key={variant}
            id={`dropdown-split-variants-${variant}`}
            variant={variant.toLowerCase()}
            title={variant}
          >
            <Menu.Item eventKey="1">Action</Menu.Item>
            <Menu.Item eventKey="2">Another action</Menu.Item>
            <Menu.Item eventKey="3" active>
              Active Item
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item eventKey="4">Separated link</Menu.Item>
          </SplitButton>
        ),
      )}
    </>
  );
}

export default SplitVariantExample;
