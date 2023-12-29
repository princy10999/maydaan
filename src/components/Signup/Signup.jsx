import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
// import google from "../../assets/images/google.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import Message from "../Layout/Message";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  UPDATE_AUTH_TOKEN,
  UPDATE_USER
} from "../../store/action/actionTypes";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import initializeAuthentication from "../../Firebase/firebase.init";
import { Helmet } from "react-helmet";
import Titles from "../Titles";
// import success from "../../assets/images/success.png";
initializeAuthentication();
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      signupType: "E",
      googleDate: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Signup";
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
        axios.post("/social-login", body).then((res) => {
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
    const initialValues = {
      userType: "",
      fname: splitName.length > 0 ? splitName[0] : "",
      lname: splitName.length > 1 ? splitName[1] : "",
      email: googleDate.email ? googleDate.email : "",
      club_name: "",
      password: googleDate.email ? "12345678" : "",
      password_confirmation: googleDate.email ? "12345678" : "",
      eye: false,
      eye1: false,
    };
    const validationSchema = Yup.object({
      userType: Yup.string().required("Please select atleast one option!"),
      fname: Yup.string().required("Please enter your first name!"),
      lname: Yup.string().required("Please enter your last name!"),
      club_name: Yup.string().when("userType", {
        is: "C",
        then: Yup.string().required("Please enter club name!"),
      }),
      email: Yup.string()
        .required("Please enter your email!")
        .email("Please enter a valid email!")
        .nullable(),
      password: Yup.string()
        .required("Please enter a password!")
        .min(8, "Please give atleast 8 character!"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords is not matching!")
        .required("Please confirm your password!"),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // console.log("SFormDta",values);
      this.props.onUpdateLoader(true);
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
          password: values.password_confirmation,
        },
      };
      let url = "/sign-up";
      if (signupType === "G") url = "/social-login";

      axios.post(url, data).then((res) => {
        // console.log("signup", res);
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
          } else if (res.data.error.password) {
            this.props.onUpdateError(res.data.error.password[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.error.type) {
            this.props.onUpdateError(res.data.error.type[0]);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.message) {
            this.props.onUpdateError(res.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        } else {
          if (res.data.result && res.data.result.message) {
            this.setState({
              message: res.data.result.meaning,
            });
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.result && res.data.result.token) {
            this.props.onUpdateUser(res.data.result.user);
            this.props.onUpdateAuthToken(res.data.result.token);
            this.props.onUpdateSuccess("");
            this.props.history.push("/user-edit-profile");
          }
        }
      });
    };
    return (
      <>
        <Helmet>
        <title>{Titles?.signUp?.title}</title>
        <meta
            name="description"
            content={Titles?.signUp?.description}
        />
        <meta property="og:title" content={Titles?.signUp?.ogTitle} />
        <meta property="og:description" content={Titles?.signUp?.ogDescription} />
        <meta property="og:image" content={Titles?.signUp?.ogImage} />
        <link rel="canonical" href={Titles?.signUp?.link} />
      </Helmet>
        <Layout>
        <div className="login-pg sign-pg">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                {this.state.message ? (
                  <div className="loader_img loader_img_new">
                    <div className="container">
                      <div className="row">
                        <div className="scs_msg sign-pg01">
                          <img src={process.env.PUBLIC_URL + "/images/success.png"} alt="success" />
                          <h2>Success !</h2>
                          <p>{this.state.message}</p>
                          <Link to="/login">Go to Login</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="login-box">
                    <Message />
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                      enableReinitialize={true}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <h3>signup</h3>
                          <p>
                            Please fill in the below fields to continue with us
                          </p>
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
                            <ErrorMessage
                            name="userType"
                            component={FieldError}
                          />
                          </div>
                          
                          <div className="name">
                            <div className="form-group log-group">
                              <Field
                                type="text" 
                                className="form-control "
                                name="fname"
                              />
                                <label className={`log-label ${values.fname?'up-design':''}`}>First Name</label>
                              <ErrorMessage
                                name="fname"
                                component={FieldError}
                              />
                            </div>
                            <div className="form-group log-group marts">
                              <Field
                                type="text" 
                                className="form-control"
                                name="lname"
                              />
                                <label className={`log-label ${values.lname?'up-design':''}`}>Last Name</label>
                              <ErrorMessage
                                name="lname"
                                component={FieldError}
                              />
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
                              readOnly={signupType === "G" ? true : false}
                              name="email"
                            />
                              <label className={`log-label ${values.email?'up-design':''}`}>Email</label>
                            <ErrorMessage name="email" component={FieldError} />
                          </div>
                          {signupType === "E" ? (
                            <>
                              <div className="form-group log-group">
                                <Field
                                  type={values.eye ? "text" : "password"} 
                                  id="password-field"
                                  className="form-control"
                                  name="password"
                                />
                                  <label className={`log-label ${values.password?'up-design':''}`}>Password</label>
                                <span
                                  toggle="#password-field"
                                  name="eye"
                                  className={
                                    !values.eye
                                      ? "field-icon fa fa-fw fa-eye toggle-password"
                                      : "field-icon fa fa-fw fa-eye-slash toggle-password"
                                  }
                                  onClick={(event) => {
                                    setFieldValue("eye", !values.eye);
                                  }}
                                >
                                  {" "}
                                </span>
                                <ErrorMessage
                                  name="password"
                                  component={FieldError}
                                />
                              </div>
                              <div className="form-group log-group">
                                <Field
                                  type={values.eye1 ? "text" : "password"} 
                                  id="password-field1"
                                  className="form-control"
                                  name="password_confirmation"
                                />
                                <label className={`log-label ${values.password_confirmation?'up-design':''}`}>
                                  Confirm Password
                                </label>
                                <span
                                  toggle="#password-field"
                                  name="eye1"
                                  className={
                                    !values.eye1
                                      ? "field-icon fa fa-fw fa-eye toggle-password"
                                      : "field-icon fa fa-fw fa-eye-slash toggle-password"
                                  }
                                  onClick={(event) => {
                                    setFieldValue("eye1", !values.eye1);
                                  }}
                                >
                                  {" "}
                                </span>
                                <ErrorMessage
                                  name="password_confirmation"
                                  component={FieldError}
                                />
                              </div>
                            </>
                          ) : null}
                          <h5>
                            By creating an account, you agree that you have read
                            and accepted our{" "}
                            <Link to="/terms-and-conditions" target="_blank">Terms of Services</Link> and{" "}
                            <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>.
                          </h5>
                          <ul className="btn-group">
                            <li className="login-main">
                              <button className="login-btn" type="submit">
                                {signupType === "E"
                                  ? "Signup"
                                  : "Complete Signup with Google"}
                              </button>
                            </li>
                            {signupType === "E" ? (
                              <li className="login-google">
                                <Link
                                  to="#"
                                  onClick={() => this.handleGoogleLogin()}
                                  className="google-lnk"
                                >
                                  <img src={process.env.PUBLIC_URL + "/images/google.png"} alt="" />
                                  Sign up with Google
                                </Link>
                              </li>
                            ) : null}
                          </ul>
                        </Form>
                      )}
                    </Formik>
                    <h6>
                      Already have an Account? <Link to="/login">Login</Link>
                    </h6>
                  </div>
                )}
              </div>
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
export default connect(null, mapDispatchToProps)(Signup);
