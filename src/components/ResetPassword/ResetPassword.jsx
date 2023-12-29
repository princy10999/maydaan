import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import axios from "../../shared/axios";
// import success from "../../assets/images/success.png";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
class ResetPassword extends Component {
  constructor(props) {
		super(props);
		this.state = {
			otp: "",
      result: "",
      msg: "",
		};
	}
  componentDidMount() {
    document.title = "Maydaan | Reset Password";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.setState({otp:this.props.match.params.otp})
    
  }
  render() {
    const initialValues = {
      password: "",
      password_confirmation: "",
      eye: false,
      eye1: false,
    };
    const validationSchema = Yup.object({
      password: Yup.string()
        .required("Please enter a password!")
        .min(8, "Please give atleast 8 character!"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords is not matching!")
        .required("Please confirm your password!"),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      // console.log("Reset password", values);
      this.props.onUpdateLoader(true);
      var data={
        "params": {
          "password":values.password_confirmation,
          "email_vcode": this.state.otp
        }
      }
      axios.post("reset-password",data).then(res=>{
        this.props.onUpdateLoader(false);
        // console.log("===",res);
        if (res.data.result) {
          this.setState({ result: "T", msg: res.data.result.meaning });
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (res.data.error) {
          this.props.onUpdateError(res.data.error.meaning);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      
      })
    };
    return (
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
              <Message/>
              <h3>Reset Password</h3>
              <p>Please enter new password to reset password</p>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue }) => (
                  <Form role="form" className="login-form">
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
                            ? "field-icon fa fa-fw fa-eye toggle-password"
                            : "field-icon fa fa-fw fa-eye-slash toggle-password"
                        }
                        onClick={(event) => {
                          setFieldValue("eye", !values.eye);
                        }}
                      >
                        {" "}
                      </span>
                    <ErrorMessage name="password" component={FieldError} />
                    </div>
                    <div className="form-group log-group">
                      <Field
                        type={values.eye1 ? "text" : "password"}
                        id="password-field1"
                        className="form-control"
                        name="password_confirmation"
                      />
                      <label htmlFor className={`log-label ${values.password_confirmation?'up-design':''}`}>
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
                    
                    <button type="submit" className="login-main login-btn">
                      Submit
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>    )}
      </Layout>
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
export default connect(null, mapDispatchToProps)(ResetPassword);
