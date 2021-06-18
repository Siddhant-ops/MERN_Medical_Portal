import "./DoctorLogin.scss";
import img from "../../../../Media/Images/Doctor-lab.svg";
import { Form, Input, Button, Row, Col, Grid } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import axios from "axios";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import { actionTypes } from "../../../Utilities/reducer/reducer";
import { useHistory } from "react-router-dom";

const DoctorLogin = () => {
  const [{ user }, dispatch] = useStateValue();

  const { md } = Grid.useBreakpoint();

  const history = useHistory();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const onFinish = (values) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    axios
      .post("/api/auth/login/doctor", data)
      .then((res) => {
        if (res.status === 200 && res.data?.token) {
          dispatch({
            type: actionTypes.SET_USER,
            user: res.data.token,
          });
          localStorage.setItem("Ajackus_user", res.data?.token);
          history.push("/doctor/dashboard");
        }
      })
      .catch((err) => console.log(err));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="doctorLogin__Container">
      <Row>
        <Col span={md ? 12 : 24}>
          <img src={img} alt="" />
        </Col>
        <Col style={{ padding: "2rem" }} span={md ? 12 : 24}>
          <div className="login__Container">
            <h3>Doctor Login</h3>
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
      </Row>
    </div>
  );
};

export default DoctorLogin;
