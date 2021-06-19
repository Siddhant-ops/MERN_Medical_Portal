import { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import loader from "../../../../Media/Loader/Loader.svg";
import "./PatientProfile.scss";
import { Row, Col, Grid, List, Divider, Button, message } from "antd";

const PatientProfile = () => {
  // Get user token
  const [{ user }] = useStateValue();

  // Get id from route
  const { id } = useParams();

  const history = useHistory();

  // Initial Setup
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // md is boolean for medium breakpoint
  const { md } = Grid.useBreakpoint();

  // Fetch patient data on load
  useEffect(() => {
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

  // IF data is not yet loaded
  if (profileData === null && loading === true) {
    return (
      <div className="noData__Container">
        <img src={loader} alt="" />
        <h1>Loading</h1>
      </div>
    );
  }

  function deleteAccount() {
    const data = {
      _id: id,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };

    axios
      .post("/api/patient/delete", data, config)
      .then((res) => {
        if (res.status === 200 && res.data?.message) {
          message.success(res.data?.message);
          setTimeout(() => {
            history.push("/doctor/dashboard");
          }, 2000);
        } else {
          message.error("Error");
        }
      })
      .catch((err) => message.error(err.message));
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
          <div className="horizontalDiv">
            <Link to={`/patient/pro/edit/${id}`}>Edit profile</Link>
            <Button
              onClick={() => deleteAccount()}
              style={{ color: "red" }}
              shape="round"
            >
              Delete Account
            </Button>
          </div>
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

export default PatientProfile;
