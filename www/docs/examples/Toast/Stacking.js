import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

function StackingExample() {
  return (
    <ToastContainer className="position-static">
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-3" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small className="fg-secondary">just now</small>
        </Toast.Header>
        <Toast.Body>See? Just like this.</Toast.Body>
      </Toast>
      <Toast>
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-3" alt="" />
          <strong className="me-auto">Bootstrap</strong>
          <small className="fg-secondary">2 seconds ago</small>
        </Toast.Header>
        <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default StackingExample;
