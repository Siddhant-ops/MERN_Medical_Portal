import { Col, Grid, Row } from "antd";
import { Link } from "react-router-dom";
import introImg from "../../../Media/Images/Home/Doctor-online-2.svg";
import rowImg1 from "../../../Media/Images/Home/Doc-op.jpg";
import "./Home.scss";

const Home = () => {
  const { md } = Grid.useBreakpoint();

  return (
    <div className="home__Container">
      <Row className="home__intro">
        <Col className="home__intro__Col1" span={md ? "12" : 24}>
          <div className="home__intro__text">
            <h1>Best Outcome for Every Patient Every Time</h1>
            <h5>For the expected, unexpected and everything in between</h5>
            <Link className="home__intro__btn" to="/contact">
              Contact Us
            </Link>
          </div>
        </Col>
        <Col span={md ? "12" : 24}>
          <img
            style={{ borderRadius: "10px" }}
            className="homeImg__Background"
            src={introImg}
            alt="Home background"
          />
        </Col>
      </Row>
      {/* <h2>Easy Steps</h2>
      <Row className="home__Row2">
        <Col span={md ? "6" : 24}>
          <img style={{ width: "80%" }} src={rowImg1} alt="" />
        </Col>
        <Col span={md ? "6" : 24}>
          <h4>Hello</h4>
          <img style={{ width: "80%" }} src={rowImg1} alt="" />
        </Col>
        <Col span={md ? "6" : 24}>
          <h4>Hello</h4>
          <img style={{ width: "80%" }} src={rowImg1} alt="" />
        </Col>
      </Row> */}
    </div>
  );
};

export default Home;
