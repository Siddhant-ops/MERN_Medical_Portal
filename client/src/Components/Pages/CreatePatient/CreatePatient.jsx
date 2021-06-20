import axios from "axios";
import {
  diagnosisList,
  medPrescribed,
  symptomsList,
} from "../../Utilities/Helpers/Helper";
import { Form, Input, Select, Button, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useStateValue } from "../../Utilities/stateProvider/stateProvider";
import { useHistory } from "react-router-dom";

const CreatePatient = () => {
  const [{ user }] = useStateValue();
  const history = useHistory();

  const [form] = Form.useForm();

  function onFormFinish(values) {
    values["phone"] = parseInt(values["phone"]);
    values["pinCode"] = parseInt(values["pinCode"]);

    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        const element = values[key];
        if (element === undefined) {
          values[key] = [];
        }
      }
    }

    const data = values;

    const config = {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    };

    axios
      .post("/api/auth/register/patient", data, config)
      .then((res) => {
        if (res.status === 200 && res.data?.message) {
          message.success(res.data?.message);
          setTimeout(() => {
            history.push("/doctor/dashboard");
          }, 2000);
        } else {
          message.error("Some Error!");
        }
      })
      .catch((err) => message.error(err?.message));
  }

  return (
    <div className="Container">
      <div className="mainContainer">
        <h3>Create new patient</h3>
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => {
            onFormFinish(values);
          }}
          name="Patient-Edit"
        >
          <Form.Item
            rules={[
              {
                required: true,
                message: "PLease fill this field",
                type: "string",
              },
            ]}
            name="fullName"
            label="Name"
          >
            <Input
              size="large"
              placeholder="FirstName LastName"
              prefix={<UserOutlined />}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "PLease fill this field",
              },
            ]}
            name="phone"
            label="Phone"
          >
            <Input size="large" htmlType="tel" placeholder="1234567890" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "PLease fill this field" }]}
            name="email"
            label="Email"
          >
            <Input size="large" htmlType="tel" placeholder="abc@xyz.com" />
          </Form.Item>
          <Form.Item name="password" label="Password">
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
          <Form.Item
            rules={[{ required: true, message: "Please fill this field" }]}
            name="pinCode"
            label="Pin Code"
          >
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

export default CreatePatient;
