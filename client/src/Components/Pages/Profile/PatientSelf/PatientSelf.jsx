import axios from "axios";
import { useEffect, useState } from "react";
import { parseJwt } from "../../../Utilities/Helpers/Helper";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import loader from "../../../../Media/Loader/Loader.svg";
import {
  Row,
  Col,
  Grid,
  List,
  Divider,
  Button,
  message,
  Modal,
  Form,
  Input,
} from "antd";

const PatientSelf = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [{ user }] = useStateValue();

  // md is boolean for medium breakpoint
  const { md } = Grid.useBreakpoint();

  const [form] = Form.useForm();

  useEffect(() => {
    const id = parseJwt(user)["_id"];
    const data = {
      _id: id,
    };
    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };

    axios
      .post("/api/patient/get/patient", data, config)
      .then((res) => {
        if (res.status === 200 && res.data?._id) {
          setProfileData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  // format ISO data
  function formatDate(isoDateString = "") {
    var utcString = new Date(isoDateString).toUTCString();
    return utcString.slice(0, -13);
  }

  function formSubmit(values) {
    const id = parseJwt(user)["_id"];
    const data = {
      _id: id,
      oldPassword: values?.oldPassword,
      newPassword: values?.newPassword,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };

    axios
      .patch("/api/patient/change-password", data, config)
      .then((res) => {
        if (res.status === 200 && res.data?.message) {
          message.info(res.data?.message);
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);
        } else {
          message.error("Error");
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }

  // IF data is not yet loaded
  if (profileData === null && loading === true) {
    return (
      <div className="noData__Container">
        <img src={loader} alt="" />
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <div className="profile__Container">
      <Row>
        <Col
          className="profile__Col1"
          span={md ? "12" : "24"}
          style={{ padding: "1rem" }}
        >
          <h2>Patient Profile</h2>
          <Button
            onClick={() => {
              setModalVisible(true);
            }}
            style={{ color: "red" }}
            shape="round"
          >
            Change Password
          </Button>
          <Modal
            title="Change Password"
            visible={modalVisible}
            onCancel={() => {
              setModalVisible(false);
            }}
            footer={[]}
          >
            <Form
              form={form}
              onFinish={(value) => {
                formSubmit(value);
              }}
            >
              <Form.Item
                rules={[{ required: true }]}
                name="oldPassword"
                label="Old Password"
              >
                <Input.Password placeholder="Old password" />
              </Form.Item>
              <Form.Item
                rules={[{ required: true }]}
                name="newPassword"
                label="New Password"
              >
                <Input.Password placeholder="New password" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Divider orientation="center">User</Divider>
          <h4>Name : {profileData?.fullName}</h4>
          <h5>Phone : {profileData?.phone}</h5>
          <h5>Emaiil : {profileData?.email}</h5>
          <h5>Patient created at : {formatDate(profileData?.createdAt)}</h5>
        </Col>
        <Col span={md ? "12" : "24"} style={{ padding: "1rem" }}>
          <Divider orientation="left">Symptoms</Divider>
          <List
            size="small"
            bordered
            dataSource={profileData?.symptoms}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider orientation="left">Prescribed medication</Divider>
          <List
            size="small"
            bordered
            dataSource={profileData?.prescribedMedication}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider orientation="left">Diagnosis</Divider>
          <List
            size="small"
            bordered
            dataSource={profileData?.diagnosis}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PatientSelf;
