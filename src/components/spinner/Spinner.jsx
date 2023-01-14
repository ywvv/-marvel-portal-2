import { ThreeCircles } from "react-loader-spinner";

const Spinner = () => {
  return (
    <ThreeCircles
      height="100"
      width="100"
      color="#9f0013"
      wrapperStyle={{ justifyContent: "center" }}
      visible={true}
      ariaLabel="three-circles-rotating"
      outerCircleColor=""
      innerCircleColor=""
      middleCircleColor="#232222"
    />
  );
};

export default Spinner;
