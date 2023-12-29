import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
// import mail from "../../assets/images/mail.png";
// import success from "../../assets/images/success.png";
import axios from "../../shared/axios";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: "",
      msg: "",
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Forgot Password";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  render() {
    const initialValues = {
      email: "",
    };
    const validationSchema = Yup.object({
      email: Yup.string()
        .email("Please enter a valid email!")
        .required("Please enter your email!")
        .nullable(),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(true);
      // console.log("Forgot password", values);
      var data = {
        params: {
          email: values.email,
        },
      };
      axios.post("/forgot-password", data).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("lll", res);
        if (res.data.result) {
          this.setState({ result: "T", msg: res.data.result.meaning });
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (res.data.error) {
          this.props.onUpdateError(res.data.error.meaning);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    };
    return (
     <>
      <Helmet>
        <title>{Titles?.forgotPassword?.title}</title>
        <meta
            name="description"
            content={Titles?.forgotPassword?.description}
        />
        <meta property="og:title" content={Titles?.forgotPassword?.ogTitle} />
        <meta property="og:description" content={Titles?.forgotPassword?.ogDescription} />
        <meta property="og:image" content={Titles?.forgotPassword?.ogImage} />
        <link rel="canonical" href={Titles?.forgotPassword?.link} />
      </Helmet>
       <Layout>
        {this.state.result === "T" ? (
          <div className="loader_img">
            <div className="container">
              <div className="row">
                <div className="loader_divs">
                  <div className="scs_msg">
                    <img src={process.env.PUBLIC_URL + "/images/success.png"} alt="success" />
                    <h2>Success !</h2>
                    <p>{this.state.msg ? this.state.msg : null}</p>
                    <Link to="/login">Go to Login</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="login-pg">
            <div className="container">
              <div className="login-box">
                <Message />
                <h3>Forgot Password</h3>
                <p>
                  Please Enter your email address. You will receive a link to
                  create a new password via email.
                </p>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {({ values, setFieldValue }) => (
                    <Form role="form" className="login-form">
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
                      <button type="submit" className="login-main login-btn">
                        Submit
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        )}
      </Layout>
     </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(ForgotPassword);
