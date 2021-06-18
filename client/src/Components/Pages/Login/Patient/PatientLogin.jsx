import "./PatientLogin.scss";
import img from "../../../../Media/Images/Doctor-patient.svg";
import { Form, Input, Button, Row, Col, Grid } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";

const PatientLogin = () => {
  const { md } = Grid.useBreakpoint();

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 4, span: 16 },
  };

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="patientLogin__Container">
      <Row>
        <Col style={{ padding: "2rem" }} span={md ? 12 : 24}>
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
