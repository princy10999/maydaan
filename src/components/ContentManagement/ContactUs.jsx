import React, { Component } from "react";
import Layout from "../Layout/Layout";
import axios from "../../shared/axios";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import swal from "sweetalert";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import ReCAPTCHA from "react-google-recaptcha";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
// import capcha from "../../assets/images/capcha.png";
// import phone_o from "../../assets/images/phone-o.png";
// import mail_o from "../../assets/images/mail-o.png";
// import location_o from "../../assets/images/location-o.png";

class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.captchaRef = React.createRef();
    this.state = {
      about: [],
      details: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Contact Us";
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios.post("show-contact-us-details").then((res) => {
      // console.log("details", res);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result) {
        this.setState({
          details: res.data.result.details,
        });
      }
    });
  }
  render() {
    const { details } = this.state;
    const initialValues = {
      fname: "",
      lname: "",
      email: "",
      phone: "",
      msg: "",
      isValid:false
    };
    const validationSchema = Yup.object().shape({
      fname: Yup.string().required("Please enter first name!"),
      lname: Yup.string().required("Please enter last name!"),
      email: Yup.string()
        .email("Please enter a valid email!")
        .required("Please enter email!"),
      phone: Yup.string()
        .required("Please enter phone number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number!")
        .min(10, "Phone number must be at least 10 characters!")
        .max(10, "Phone number contains maximum 10 characters!"),
      msg: Yup.string().required("Please enter message!"),
      isValid:Yup.boolean().oneOf([true],'Please confirm you are not a robot!')
    });
    const handleSubmit = (values, actions) => {
      let body = {
        params: {
          first_name: values.fname,
          last_name: values.lname,
          email: values.email,
          phone: values.phone,
          message: values.msg,
        },
      };
      this.props.onUpdateLoader(true);
      axios.post("/contact-us", body).then((res) => {
        this.props.onUpdateLoader(false);
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        } else if (res.data.result) {
          swal(res.data.result.meaning, {
            icon: "success",
          });
        }
        actions.resetForm();
        this.captchaRef.current.reset();
      });
    };
    
    return (
      <>
        <Helmet>
      <title>{Titles?.contactUs?.title}</title>
      <meta
          name="description"
          content={Titles?.contactUs?.description}
      />
      <meta property="og:title" content={Titles?.contactUs?.ogTitle} />
      <meta property="og:description" content={Titles?.contactUs?.ogDescription} />
      <meta property="og:image" content={Titles?.contactUs?.ogImage} />
      <link rel="canonical" href={Titles?.contactUs?.link} />
    </Helmet>
      <Layout>
        <div className="mai-abt">
          <div className="container">
            <div className="cnt-heading">
              <h3>Contact Us</h3>
              <p>Any question or remarks? just write us a message</p>
            </div>
            <div className="cnt-frm">
              <div className="row">
                <div className="col-lg-6 col-12">
                  {details ? (
                    <div className="cnt-lft">
                      <h4>Contact Information</h4>
                      <p>
                        Fill up the form and our team will get back to you
                        within 24 hour
                      </p>
                      <ul>
                        <li>
                          <img src={process.env.PUBLIC_URL + "/images/phone-o.png"} alt="" />
                          <p>
                            {" "}
                            +91{details.phone_number_1}, +91
                            {details.phone_number_2}
                          </p>
                        </li>
                        <li>
                          <img src={process.env.PUBLIC_URL + "/images/mail-o.png"} alt="" />
                          <p>{details.email}</p>
                        </li>
                        <li>
                          <img src={process.env.PUBLIC_URL + "/images/location-o.png"} alt="" />
                          <p>{details.address}</p>
                        </li>
                      </ul>
                      <div className="cnct-social">
                        <ul>
                          <li>
                            <Link href={details.facebook_link} target="_blank">
                              <i
                                className="fa fa-facebook"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                          <li>
                          <Link href={details.twitter_link} target="_blank">
                              <i className="fa fa-twitter" aria-hidden="true" />
                            </Link>
                          </li>
                          <li>
                          <Link href={details.instagram_ink} target="_blank">
                              <i
                                className="fa fa-instagram"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                          <li>
                            <Link to="#">
                              <i
                                className="fa fa-google-plus"
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="col-lg-6 col-12">
                  <div className="cnt-right">
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ setFieldValue,values }) => {
                        return (
                          <Form>
                            <div className="cnt-right-tp">
                              <div className="dual">
                                <div className="form-group cnt-grp">
                                  <label htmlFor className="log-label">
                                    First Name
                                  </label>
                                  <Field
                                    type="text"
                                    name="fname"
                                    id
                                    className={`${values.fname && "valid"} form-control`}
                                    placeholder="Enter your first name here"
                                  />
                                  <ErrorMessage
                                    name="fname"
                                    component={FieldError}
                                  />
                                </div>
                                <div className="form-group cnt-grp">
                                  <label htmlFor className="log-label">
                                    Last Name
                                  </label>
                                  <Field
                                    type="text"
                                    name="lname"
                                    id
                                    className={`${values.lname && "valid"} form-control`}
                                    placeholder="Enter your last name here"
                                  />
                                  <ErrorMessage
                                    name="lname"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="dual">
                                <div className="form-group cnt-grp">
                                  <label htmlFor className="log-label">
                                    Email
                                  </label>
                                  <Field
                                    type="text"
                                    name="email"
                                    id
                                    className={`${values.email && "valid"} form-control`}
                                    placeholder="Enter your email here"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component={FieldError}
                                  />
                                </div>
                                <div className="form-group cnt-grp">
                                  <label htmlFor className="log-label">
                                    Phone
                                  </label>
                                  <Field
                                    type="text"
                                    name="phone"
                                    id
                                    className={`${values.phone && "valid"} form-control`}
                                    placeholder="Enter your phone no. here"
                                    onChange={(e)=>{
                                      let result = e.target.value.replace(/\D/g, '');
                                      setFieldValue("phone",result)
                                  }}
                                  />
                                  <ErrorMessage
                                    name="phone"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="cnt-grp">
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className="form-label"
                                >
                                  Message
                                </label>
                                <Field
                                  as="textarea"
                                  className={`${values.msg && "valid"} form-control`}
                                  id="exampleFormControlTextarea1"
                                  rows={3}
                                  placeholder="Write your message here"
                                  name="msg"
                                />
                                <ErrorMessage
                                  name="msg"
                                  component={FieldError}
                                />
                              </div>
                            </div>
                            <div className="h-line" />
                            <div className="cnt-right-btm">
                              <div className="captcha">
                              <ReCAPTCHA
                                sitekey="6LdnxpkhAAAAAHBBFTGRCtjpFgHyrJRjm1EhpNZe"
                                name="isValid"
                                onChange={()=>{setFieldValue("isValid",true)}}
                                ref={this.captchaRef}
                              />
                              <ErrorMessage
                                  name="isValid"
                                  component={FieldError}
                                />
                              </div>
                              <div className="form-group cnt-grp">
                                <input
                                  type="submit"
                                  value="Send Message"
                                  id
                                  className="tp-btn"
                                />
                              </div>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
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
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(ContactUs);
