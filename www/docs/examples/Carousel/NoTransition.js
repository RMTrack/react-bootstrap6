import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from 'components/ExampleCarouselImage';

function NoTransitionExample() {
  return (
    <Carousel slide={false}>
      <Carousel.Item className="position-relative">
        <ExampleCarouselImage text="First slide" />
        <div className="position-absolute bottom-0 start-0 end-0 px-12 pb-12 text-center fg-white">
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item className="position-relative">
        <ExampleCarouselImage text="Second slide" />
        <div className="position-absolute bottom-0 start-0 end-0 px-12 pb-12 text-center fg-white">
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </Carousel.Item>
      <Carousel.Item className="position-relative">
        <ExampleCarouselImage text="Third slide" />
        <div className="position-absolute bottom-0 start-0 end-0 px-12 pb-12 text-center fg-white">
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default NoTransitionExample;
