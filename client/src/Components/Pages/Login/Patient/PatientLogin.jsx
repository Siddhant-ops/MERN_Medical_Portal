import { useHistory } from "react-router-dom";
import axios from "axios";
import "./PatientLogin.scss";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import { actionTypes } from "../../../Utilities/reducer/reducer";
import img from "../../../../Media/Images/Doctor-patient.svg";
import { Form, Input, Button, Row, Col, Grid, message } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";

const PatientLogin = () => {
  // dispatch to set user token
  const [{}, dispatch] = useStateValue();

  // md is boolean for medium breakpoint
  const { md } = Grid.useBreakpoint();

  // using router history
  const history = useHistory();

  // Stating a basic layout
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  // on form submit
  const onFinish = (values) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    axios
      .post("/api/auth/login/patient", data)
      .then((res) => {
        if (res.status === 200 && res.data?.token) {
          dispatch({
            type: actionTypes.SET_USER,
            user: res.data.token,
          });
          message.success("Success");
          localStorage.setItem("Ajackus_user", res.data?.token);
          history.push("/patient/profile/Self");
        } else {
          message.error("Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="patientLogin__Container">
      <Row>
        <Col className="patientLogin__Col1" span={md ? 12 : 24}>
          <div className="login__Container">
            <h3>Patient Login</h3>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                {...tailLayout}
                name="remember"
                valuePropName="checked"
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
        <Col span={md ? 12 : 24}>
          <img src={img} alt="" />
        </Col>
      </Row>
    </div>
  );
};

export default PatientLogin;
