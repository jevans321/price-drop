import React from "react";
import { Carousel } from "react-responsive-carousel";

export default () => (
  <Carousel autoPlay showThumbs={false} showStatus={false} showArrows={false}>
    <div>
      <img src="/assets/photo-1550557019-3436df3d1c67_485x1650.jpg" />
    </div>
    <div>
      <img src="/assets/photo-1557413287-60f2f07fe204_485x1650.jpg" />
    </div>
    <div>
      <img src="/assets/photo-1560205001-a7011fc0093c_485x1650.jpg" />
    </div>
    <div>
      <img src="/assets/photo-1501645429123-a300be5fe1c2_485x1650.jpg" />
    </div>
    <div>
      <img src="/assets/photo-1523437275713-4dbf723f62c1_485x1650.jpg" />
    </div>
    <div>
      <img src="/assets/photo-1565307961646-5269939b5b64_485x1650.jpg" />
    </div>
  </Carousel>
);
