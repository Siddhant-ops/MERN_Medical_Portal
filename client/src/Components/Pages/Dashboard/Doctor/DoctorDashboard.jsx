import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import "./DoctorDashboard.scss";
import {
  diagnosisList,
  medPrescribed,
  symptomsList,
} from "../../../Utilities/Helpers/Helper";
import {
  Button,
  Input,
  Select,
  Form,
  Row,
  Col,
  Grid,
  BackTop,
  Empty,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const ResultItem = (post, index) => {
  return (
    <div key={index} className="results__Item">
      <span className="horizontalDiv">
        <h4>Name : {post?.fullName}</h4>
        <Link to={`/patient/pro/${post?._id}`}>Visit Profile</Link>
      </span>
      <span className="horizontalDiv">
        <h5>Phone : {post?.phone}</h5>
        <h5>Email : {post?.email}</h5>
      </span>
    </div>
  );
};

const DoctorDashboard = () => {
  const [{ user }] = useStateValue();

  const [form] = Form.useForm();
  const { md } = Grid.useBreakpoint();

  const [data, setData] = useState(null);

  function onFinish(e) {
    const config = {
      headers: { Authorization: `Bearer ${user}` },
    };

    axios
      .post("/api/patient/searchAll", e, config)
      .then((res) => {
        if (res.status === 200 && res.data[0]?.fullName) {
          setData(res.data);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Row className="dashboard__Container">
      <Col span={md ? "8" : "24"}>
        <h3>Search patients</h3>
        <Form
          layout="vertical"
          form={form}
          onFinish={(e) => {
            onFinish(e);
          }}
          className="dashboard__searchContainer"
        >
          <Form.Item name="name" label="Name">
            <Input
              size="large"
              placeholder="FirstName LastName"
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item name="symptoms" label="Symptoms">
            <Select mode="multiple" size="large" placeholder="Symptoms">
              {symptomsList.map((symptom) => (
                <Select.Option key={symptom}>{symptom}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="prescribedMedication" label="Prescribed medication">
            <Select mode="multiple" size="large" placeholder="Medication">
              {medPrescribed.map((meds) => (
                <Select.Option key={meds}>{meds}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="diagnosis" label="Diagnosis">
            <Select mode="multiple" size="large" placeholder="Diagnosis">
              {diagnosisList.map((item) => (
                <Select.Option key={item}>{item}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <span className="horizontalDiv">
              <Button
                type="primary"
                size="large"
                shape="round"
                htmlType="submit"
              >
                Search
              </Button>
              <Link to="/patient/pro/create">
                <Button shape="round" size="large" type="dashed">
                  Create new Patient
                </Button>
              </Link>
            </span>
          </Form.Item>
        </Form>
      </Col>
      <Col span={md ? "12" : "24"}>
        {data !== null ? (
          <Fragment>
            <BackTop />
            <div className="results__Container">
              {data.map((post, index) => ResultItem(post, index))}
            </div>
          </Fragment>
        ) : (
          <div className="noData__Container">
            <Empty />
          </div>
        )}
      </Col>
    </Row>
  );
};

export default DoctorDashboard;
