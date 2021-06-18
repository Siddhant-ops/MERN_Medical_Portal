import { Redirect, Route, Switch } from "react-router-dom";
import Default404 from "../../Pages/404-Pages/Default404";
import DoctorDashboard from "../../Pages/Dashboard/Doctor/DoctorDashboard";
import PatientDashboard from "../../Pages/Dashboard/Patient/PatientDashboard";
import Home from "../../Pages/Home/Home";
import DoctorLogin from "../../Pages/Login/Doctor/DoctorLogin";
import PatientLogin from "../../Pages/Login/Patient/PatientLogin";
import { parseJwt } from "../Helpers/Helper";
import { useStateValue } from "../stateProvider/stateProvider";

const DoctorPrivateRoute = ({ other, user, children }) => {
  return (
    <Route
      {...other}
      render={({ location }) => {
        if (user) {
          if (parseJwt(user).role === "doctor") {
            return children;
          } else {
            <Redirect to={{ pathname: "/", state: { from: location } }} />;
          }
        } else
          <Redirect
            to={{ pathname: "/login/doctor", state: { from: location } }}
          />;
      }}
    />
  );
};
const PatientPrivateRoute = ({ other, user, children }) => {
  return (
    <Route
      {...other}
      render={({ location }) => {
        if (user) {
          if (parseJwt(user).role === "patient") {
            return children;
          } else {
            <Redirect to={{ pathname: "/", state: { from: location } }} />;
          }
        } else
          <Redirect
            to={{ pathname: "/login/patient", state: { from: location } }}
          />;
      }}
    />
  );
};

const Routes = () => {
  const [{ user }] = useStateValue();

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login/doctor" component={DoctorLogin} />
      <Route path="/login/patient" component={PatientLogin} />
      <DoctorPrivateRoute user={user} path="/doctor/dashboard">
        <DoctorDashboard />
      </DoctorPrivateRoute>
      <DoctorPrivateRoute user={user} path="/patient/create">
        <DoctorDashboard />
      </DoctorPrivateRoute>
      <PatientPrivateRoute user={user} path="/patient/dashboard">
        <PatientDashboard />
      </PatientPrivateRoute>
      <Route path="" component={Default404} />
    </Switch>
  );
};

export default Routes;
