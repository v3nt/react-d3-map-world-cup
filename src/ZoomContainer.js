import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { useSvg } from "./Stage";

const ZoomContainer = function ({ children }) {
  console.log(children);
  //   console.log(children.parentNode.parentNode.removeChild(children.parentNode));
  const svgElement = useSvg();
  const [{ x, y, k }, setTransform] = useState({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    if (!svgElement) return;
    const selection = d3.select(svgElement);
    const zoom = d3.zoom().on("zoom", function (event) {
      setTransform(event.transform);
    });
    selection.call(zoom);
    return () => selection.on(".zoom", null);
  }, [svgElement]);

  return <g transform={`translate(${x}, ${y}) scale(${k})`}>{children}</g>;
};

export default ZoomContainer;
