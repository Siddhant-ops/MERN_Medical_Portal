import {
  Button,
  Input,
  Select,
  Form,
  Row,
  Col,
  Grid,
  List,
  Divider,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import "./DoctorDashboard.scss";
import {
  diagnosisList,
  medPrescribed,
  symptomsList,
} from "../../../Utilities/Helpers/Helper";
import { NavLink } from "react-router-dom";
import { Fragment, useState } from "react";

const ResultItem = () => {
  const [viewMore, setViewMore] = useState(false);

  return (
    <div className="results__Item">
      <span className="horizontalDiv">
        <h4>Name : Siddhant Dalvi</h4>
        <NavLink to="/">Visit Profile</NavLink>
        <Button
          size="small"
          onClick={() => {
            setViewMore((prevViewMore) => !prevViewMore);
          }}
        >
          View More
        </Button>
      </span>
      <span className="horizontalDiv">
        <h5>Phone : 1234567890</h5>
        <h5>Email : siddhantdalvi3@gmail.com</h5>
      </span>
      {viewMore && (
        <Fragment>
          <Divider orientation="left">Symptoms</Divider>
          <List
            size="small"
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider orientation="left">Prescribed medication</Divider>
          <List
            size="small"
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider orientation="left">Diagnosis</Divider>
          <List
            size="small"
            bordered
            dataSource={data}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Fragment>
      )}
    </div>
  );
};

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];
const DoctorDashboard = () => {
  const [form] = Form.useForm();
  const { md } = Grid.useBreakpoint();

  const [showCreatePatient, setShowCreatePatient] = useState(false);

  const onSearch = () => {};

  return (
    <div className="dashboard__Container">
      <Row>
        <Col span={md ? "8" : "24"}>
          <h3>Search patients</h3>
          <Form
            layout="vertical"
            form={form}
            onFinish={(e) => {
              console.log(e);
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
            <Form.Item
              name="prescribedMedication"
              label="Prescribed medication"
            >
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
              <Button
                type="primary"
                size="large"
                shape="round"
                htmlType="submit"
              >
                Search
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={md ? "12" : "24"}>
          <div className="results__Container">{ResultItem()}</div>
        </Col>
      </Row>
    </div>
  );
};

export default DoctorDashboard;
