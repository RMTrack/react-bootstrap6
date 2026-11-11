import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from 'components/ExampleCarouselImage';

function AutoplayExample() {
  return (
    <Carousel autoplay interval={3000}>
      <Carousel.Item>
        <ExampleCarouselImage text="First slide" />
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage text="Second slide" />
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage text="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
}

export default AutoplayExample;
