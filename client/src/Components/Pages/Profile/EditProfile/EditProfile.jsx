import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import {
  diagnosisList,
  diffObject,
  medPrescribed,
  symptomsList,
} from "../../../Utilities/Helpers/Helper";
import "./EditProfile.scss";
import { Form, Input, Button, Select, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import loader from "../../../../Media/Loader/Loader.svg";

const EditProfile = () => {
  // Getting user token
  const [{ user }] = useStateValue();

  // Initial setup
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Getting id from route
  const { id } = useParams();

  // setting up form
  const [form] = Form.useForm();

  // getting Initial data
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
      .post("/api/patient/get/allPatientData", data, config)
      .then((res) => {
        if (res.status === 200) {
          setInitialData(res.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        message.error(err.message);
      });
  }, []);

  var prevData;

  if (initialData !== null) {
    prevData = initialData;
    delete prevData["_id"];
    form.setFieldsValue(prevData);
  }

  function onFormFinish(values) {
    // Check if obj are equal
    if (JSON.stringify(values) === JSON.stringify(prevData)) {
      message.warning("No new values are added!");
    } else {
      // diff in both obj
      var data = diffObject(prevData, values);
      // add id to data for retrieval from db
      data["_id"] = id;

      const config = {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      };

      axios
        .patch("/api/patient/edit", data, config)
        .then((res) => {
          if (res.status === 200 && res.data?.message) {
            message.success(res.data?.message);
          }
        })
        .catch((err) => message.error(err.message));
    }
  }

  // If no data then show loading
  if (initialData === null && loading === true) {
    return (
      <div className="noData__Container">
        <img src={loader} alt="" />
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <div className="Container">
      <div className="mainContainer">
        <h3>Edit Profile of {initialData?.fullName}</h3>
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            onFormFinish(values);
          }}
          name="Patient-Edit"
        >
          <Form.Item name="fullName" label="Name">
            <Input
              size="large"
              placeholder="FirstName LastName"
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input size="large" htmlType="tel" placeholder="1234567890" />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input size="large" htmlType="tel" placeholder="abc@xyz.com" />
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
          <Form.Item name="address" label="Address">
            <Input.TextArea size="large" placeholder="Address" />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input size="large" placeholder="e.g : Mumbai" />
          </Form.Item>
          <Form.Item name="state" label="State">
            <Input size="large" placeholder="e.g : Maharashtra" />
          </Form.Item>
          <Form.Item name="pinCode" label="Pin Code">
            <Input size="large" placeholder="e.g : 400001" />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input size="large" placeholder="e.g : India" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
