import { Redirect, Route, Switch } from "react-router-dom";
import Default404 from "../../Pages/404-Pages/Default404";
import DoctorDashboard from "../../Pages/Dashboard/Doctor/DoctorDashboard";
import Home from "../../Pages/Home/Home";
import DoctorLogin from "../../Pages/Login/Doctor/DoctorLogin";
import PatientLogin from "../../Pages/Login/Patient/PatientLogin";
import { parseJwt } from "../Helpers/Helper";
import { useStateValue } from "../stateProvider/stateProvider";
import PatientProfile from "../../Pages/Profile/Patient/PatientProfile";
import PatientSelf from "../../Pages/Profile/PatientSelf/PatientSelf";
import EditProfile from "../../Pages/Profile/EditProfile/EditProfile";
import CreatePatient from "../../Pages/CreatePatient/CreatePatient";

// Private Routes for doctor
const DoctorPrivateRoute = ({ other, path, user, children }) => {
  return (
    <Route
      path={path}
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

// Private Routes for patient
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

      {/* ALL Doctor Routes */}

      {/* Doctor Dashboard */}
      <DoctorPrivateRoute user={user} path="/doctor/dashboard">
        <DoctorDashboard />
      </DoctorPrivateRoute>
      {/* Create Patient*/}
      <DoctorPrivateRoute user={user} path="/patient/pro/create">
        <CreatePatient />
      </DoctorPrivateRoute>
      {/* Patient Profile*/}
      <DoctorPrivateRoute exact user={user} path="/patient/pro/:id">
        <PatientProfile />
      </DoctorPrivateRoute>
      {/* Edit Patient*/}
      <DoctorPrivateRoute exact user={user} path="/patient/pro/edit/:id">
        <EditProfile />
      </DoctorPrivateRoute>

      {/* Patient Routes */}

      {/* Patient Profile */}
      <PatientPrivateRoute exact user={user} path="/patient/profile/Self">
        <PatientSelf />
      </PatientPrivateRoute>

      {/* Redirect 404 */}
      <Route path="/404" component={Default404} />
      <Redirect from="*" exact to="/404" />
    </Switch>
  );
};

export default Routes;
