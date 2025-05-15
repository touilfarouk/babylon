import React, { useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";

const ProgrammeCarousel = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalTime = 2000; 
  const onExiting = () => setAnimating(true);
  const onExited = () => setAnimating(false);

  const next = () => {
    if (animating) return;
    const nextIndex = (activeIndex + 1) % items.length;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = (activeIndex - 1 + items.length) % items.length;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item, index) => (
    <CarouselItem
      onExiting={onExiting}
      onExited={onExited}
      key={index}
    >
      <img src={item.src} alt={item.altText} style={{ width: "100%" }} />
      {item.caption && (
        <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
      )}
    </CarouselItem>
  ));

  return (
    <Carousel activeIndex={activeIndex} next={next} previous={previous}>
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
        ride="carousel" // Enables auto-sliding
        interval={intervalTime} // Faster auto-slide
      />
      {slides}
      <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
      <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
    </Carousel>
  );
};

export default ProgrammeCarousel;
