import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import google from "../../assets/images/google.png";
// import mail from "../../assets/images/mail.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import axios from "../../shared/axios";
import { removeLSItem, setLSItem } from "../../shared/LocalStorage";
import {
  UPDATE_AUTH_TOKEN,
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  UPDATE_USER,
} from "../../store/action/actionTypes";
import Message from "../Layout/Message";
import { connect } from "react-redux";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import initializeAuthentication from "../../Firebase/firebase.init";
import { Helmet } from "react-helmet";
import Titles from "../Titles";
initializeAuthentication();
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupType: "",
      googleDate: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Login";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  handleGoogleLogin = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        let splitName = result.user.displayName.split(" ");
        let body = {
          params: {
            platform_id: result.user.uid,
            first_name: splitName[0],
            last_name: splitName.length > 1 && splitName[1] ? splitName[1] : "",
            email: result.user.email,
            profile_picture: result.user.photoURL,
            phone: result.user.phoneNumber,
          },
          jsonrpc: "2.0",
        };
        this.props.onUpdateLoader(true);
        axios.post("/social-login", body).then((res) => {
          this.props.onUpdateLoader(false);
          if (res.data.error) {
            if (res.data.error.message) {
              this.props.onUpdateError(res.data.error.meaning);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          } else if (res.data.result && res.data.result.token) {
            this.props.onUpdateUser(res.data.result.user);
            this.props.onUpdateAuthToken(res.data.result.token);
            this.props.onUpdateSuccess("");
            this.props.history.push("/user-edit-profile");
          } else if (res.data.social_login_status === 2) {
            this.setState({ signupType: "G", googleDate: result.user });
          }
        });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        // setIsLoading(false);
      });
  };
  render() {
    const { signupType, googleDate } = this.state;
    let splitName = googleDate.displayName
      ? googleDate.displayName.split(" ")
      : [];
    const googleInitialValues = {
      userType: "",
      fname: splitName.length > 0 ? splitName[0] : "",
      lname: splitName.length > 1 ? splitName[1] : "",
      email: googleDate.email ? googleDate.email : "",
      club_name: "",
    };
    const googleValidationSchema = Yup.object({
      userType: Yup.string().required("Please select atleast one option!"),
      fname: Yup.string().required("Please enter your first name!"),
      lname: Yup.string().required("Please enter your last name!"),
      club_name: Yup.string().when("userType", {
        is: "C",
        then: Yup.string().required("Please enter club name"),
      }),
      email: Yup.string()
        .required("Please enter your email!")
        .email("Please enter a valid email!")
        .nullable(),
    });
    const googleOnSubmit = (values) => {
      var data = {
        params: {
          platform_id: googleDate.uid,
          profile_picture: googleDate.photoURL,
          phone: googleDate.phoneNumber,
          club_name: values.club_name,
          type: values.userType,
          first_name: values.fname,
          last_name: values.lname,
          email: values.email,
        },
      };
      this.props.onUpdateLoader(true);
      axios.post("/update-social-inetrmediate-step", data).then((res) => {
        this.props.onUpdateLoader(false);
        if (res.data.error) {
          if (res.data.error.email) {
            this.props.onUpdateError(res.data.error.email[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.error.first_name) {
            this.props.onUpdateError(res.data.error.first_name[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.error.last_name) {
            this.props.onUpdateError(res.data.error.last_name[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.error.type) {
            this.props.onUpdateError(res.data.error.type[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.message) {
            this.props.onUpdateError(res.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else if (res.data.result && res.data.result.token) {
          this.props.onUpdateUser(res.data.result.user);
          this.props.onUpdateAuthToken(res.data.result.token);
          this.props.onUpdateSuccess("");
          this.props.history.push("/user-edit-profile");
        }
      });
    };
    const initialValues = {
      email: localStorage.getItem("email") ? localStorage.getItem("email") : "",
      password: localStorage.getItem("password")
        ? localStorage.getItem("password")
        : "",
      eye: false,
      remember_me: localStorage.getItem("remember_me") ? true : false,
    };
    const validationSchema = Yup.object({
      email: Yup.string()
        .email("Please enter a valid email!")
        .required("Please enter your email!")
        .nullable(),
      password: Yup.string()
        .required("Please enter a password!")
        .min(8, "Please give atleast 8 character!")
        .nullable(),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(true);
      // console.log("Login", values);
      var data = {
        params: {
          email: values.email,
          password: values.password,
        },
      };
      axios.post("/login", data).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("login", res);
        if (res.data.result && res.data.result.token) {
          if (values.remember_me) {
            setLSItem("email", values.email);
            setLSItem("password", values.password);
            setLSItem("remember_me", values.remember_me);
          } else {
            removeLSItem("email");
            removeLSItem("password");
            removeLSItem("remember_me");
          }

          this.props.onUpdateUser(res.data.result.user);
          this.props.onUpdateAuthToken(res.data.result.token);
          this.props.onUpdateSuccess("");
          this.props.history.push("/user-edit-profile");
        }
        if (res.data.error) {
          if (res.data.error.email) {
            this.props.onUpdateError(res.data.error.email[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.error.password) {
            this.props.onUpdateError(res.data.error.password[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            this.props.onUpdateError(res.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      });
    };
    return (
    <>
        <Helmet>
        <title>{Titles?.login?.title}</title>
        <meta
            name="description"
            content={Titles?.login?.description}
        />
        <meta property="og:title" content={Titles?.login?.ogTitle} />
        <meta property="og:description" content={Titles?.login?.ogDescription} />
        <meta property="og:image" content={Titles?.login?.ogImage} />
        <link rel="canonical" href={Titles?.login?.link} />
      </Helmet>
      <Layout>
        <div className="login-pg">
          <div className="container">
            <div className="login-box">
              <Message />
              {signupType === "G" ? (
                <Formik
                  initialValues={googleInitialValues}
                  validationSchema={googleValidationSchema}
                  onSubmit={googleOnSubmit}
                  enableReinitialize={true}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <h3>signup</h3>
                      <p>Please fill in the below fields to continue with us</p>
                      <div className="as log-radio">
                        <h4>Sign up as</h4>
                        <div className="dot">
                          <label className="rad">
                            Club
                            <Field type="radio" name="userType" value="C" />
                            <span className="radio" />
                          </label>
                          <label className="rad">
                            Trainer
                            <Field type="radio" name="userType" value="T" />
                            <span className="radio" />
                          </label>
                          <label className="rad">
                            User
                            <Field type="radio" name="userType" value="M" />
                            <span className="radio" />
                          </label>
                        </div>
                      </div>
                      <ErrorMessage name="userType" component={FieldError} />
                      <div className="name">
                        <div className="form-group log-group">
                          <Field
                            type="text"
                            className="form-control"
                            name="fname"
                          />
                          <label className={`log-label ${values.fname?'up-design':''}`}>First Name</label>
                          <ErrorMessage name="fname" component={FieldError} />
                        </div>
                        <div className="form-group log-group marts">
                          <Field
                            type="text"
                            className="form-control"
                            name="lname"
                          />
                          <label className={`log-label ${values.lname?'up-design':''}`}>Last Name</label>
                          <ErrorMessage name="lname" component={FieldError} />
                        </div>
                      </div>
                      {values.userType === "C" ? (
                        <div className="form-group log-group">
                          <Field
                            type="text"
                            id="club_name"
                            className="form-control"
                            name="club_name"
                          />
                          <label className={`log-label ${values.club_name?'up-design':''}`}>Club name</label>
                          <ErrorMessage
                            name="club_name"
                            component={FieldError}
                          />
                        </div>
                      ) : null}
                      <div className="form-group log-group">
                        <Field
                          type="text"
                          id="email"
                          className="form-control"
                          readOnly={true}
                          name="email"
                        />
                        <label className={`log-label ${values.email?'up-design':''}`}>Email</label>
                        <ErrorMessage name="email" component={FieldError} />
                      </div>
                      <h5>
                        By creating an account, you agree that you have read and
                        accepted our <Link to="#">Terms of Services</Link> and{" "}
                        <Link to="#">Prvacy Policy</Link>.
                      </h5>
                      <ul className="btn-group">
                        <li className="login-main">
                          <button className="login-btn" type="submit">
                            Complete Signup with Google
                          </button>
                        </li>
                      </ul>
                    </Form>
                  )}
                </Formik>
              ) : (
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <h3>Login</h3>
                      <p>Welcome Back, Please Sign In to your account</p>

                      <div className="form-group log-group">
                        <img src={process.env.PUBLIC_URL + "/images/mail.png"} alt="" />
                        <Field
                          type="text"
                          className="form-control"
                          name="email"
                        />
                          <label htmlFor className={`log-label ${values.email?'up-design':''}`}>
                          Email Address
                        </label>
                        <ErrorMessage name="email" component={FieldError} />
                      </div>

                      <div className="form-group log-group">
                        <Field
                          type={values.eye ? "text" : "password"}
                          id="password-field"
                          className="form-control"
                          name="password"
                        />
                          <label htmlFor className={`log-label ${values.password?'up-design':''}`}>
                          Password
                        </label>
                        <span
                          toggle="#password-field"
                          name="eye"
                          className={
                            !values.eye
                              ? "field-icon fa fa-fw fa-eye-slash toggle-password"
                              : "field-icon fa fa-fw fa-eye toggle-password"
                          }
                          onClick={(event) => {
                            setFieldValue("eye", !values.eye);
                          }}
                        >
                          {" "}
                        </span>
                        <ErrorMessage name="password" component={FieldError} />
                      </div>

                      <div className="remember">
                        <label className="check">
                          Remember me
                          <Field type="checkbox" name="remember_me" />
                          <span className="checkmark" />
                        </label>
                        <Link to="/forgot-password">Forgot password?</Link>
                      </div>
                      <ul className="btn-group">
                        <li className="login-main">
                          <button className="login-btn" type="submit">
                            Login
                          </button>
                        </li>
                        <li className="login-google">
                          <Link
                            to="#"
                            onClick={() => this.handleGoogleLogin()}
                            className="google-lnk"
                          >
                            <img src={process.env.PUBLIC_URL + "/images/google.png"} alt="" />
                            Login with Google
                          </Link>
                        </li>
                      </ul>
                    </Form>
                  )}
                </Formik>
              )}
              <h6>
                Don't have an Account? <Link to="/signup">Sign up</Link>
              </h6>
            </div>
          </div>
        </div>
      </Layout>
    </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateUser: (cnt) => dispatch({ type: UPDATE_USER, value: cnt }),
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    onUpdateAuthToken: (cnt) =>
      dispatch({ type: UPDATE_AUTH_TOKEN, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(Login);
