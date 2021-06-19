import { Link } from "react-router-dom";
import { Col, Grid, Row } from "antd";
import "./Home.scss";
import introImg from "../../../Media/Images/Home/Doctor-online-2.svg";

const Home = () => {
  const { md } = Grid.useBreakpoint();

  return (
    <div className="home__Container">
      <Row className="home__intro">
        <Col className="home__intro__Col1" span={md ? "12" : 24}>
          <div className="home__intro__text">
            <h1>Best Outcome for Every Patient Every Time</h1>
            <h5>For the expected, unexpected and everything in between</h5>
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
    </div>
  );
};

export default Home;
