import React, { FC } from "react";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";

const sliderItems = [
  {
    id: "0",
    name: "Photo 1",
    url: "https://iljo-product.s3.ap-northeast-2.amazonaws.com/a_inside_storage.jpg",
  },
  {
    id: "1",
    name: "Photo 2",
    url: "https://iljo-product.s3.ap-northeast-2.amazonaws.com/a_inside_print_zone.jpg",
  },
  {
    id: "2",
    name: "Photo 3",
    url: "https://iljo-product.s3.ap-northeast-2.amazonaws.com/a_inside_storage2.jpg",
  },
];

const CarouselImageSlider: FC = () => {
  const settings = {
    indicators: false,
    fade: true,
    infinite: "true",
    interval: 3000,
  };

  return (
    <div>
      <Carousel {...settings}>
        {sliderItems.map((item, index) => {
          return (
            <Carousel.Item key={item.id}>
              {/* <Link href={`/product/${item.id}`}> */}
              <a
                style={{
                  display: "flex",
                  width: "100%",
                  height: "0",
                  paddingTop: "46.875%",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <img
                  style={{
                    height: "100%",
                    width: "auto !important",
                    position: "absolute",
                    top: "0",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                  className="d-block"
                  src={item.url}
                  alt={item.name}
                  height="100%"
                />
              </a>
              {/* </Link> */}
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
};

export default CarouselImageSlider;
