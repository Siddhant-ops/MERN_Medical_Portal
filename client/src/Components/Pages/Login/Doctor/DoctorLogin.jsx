import axios from "axios";
import { useHistory } from "react-router-dom";
import { actionTypes } from "../../../Utilities/reducer/reducer";
import { useStateValue } from "../../../Utilities/stateProvider/stateProvider";
import "./DoctorLogin.scss";
import { Form, Input, Button, Row, Col, Grid, message } from "antd";
import img from "../../../../Media/Images/Doctor-lab.svg";

const DoctorLogin = () => {
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
      .post("/api/auth/login/doctor", data)
      .then((res) => {
        if (res.status === 200 && res.data?.token) {
          dispatch({
            type: actionTypes.SET_USER,
            user: res.data.token,
          });
          message.success("Success");
          localStorage.setItem("Ajackus_user", res.data?.token);
          history.push("/doctor/dashboard");
        } else {
          message.error("Error");
        }
      })
      .catch((err) => message.error(err.message));
  };

  return (
    <div className="doctorLogin__Container">
      <Row>
        <Col span={md ? 12 : 24}>
          <img src={img} alt="" />
        </Col>
        <Col className="doctorLogin__Col1" span={md ? 12 : 24}>
          <div className="login__Container">
            <h3>Doctor Login</h3>
            <Form
              {...layout}
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinish}
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
