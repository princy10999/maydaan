import React, { Component } from 'react'
import Layout from '../Layout/Layout'
import Sidebar from '../Layout/Sidebar'
import Message from "../Layout/Message";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import axios from "../../shared/axios";
import {
  UPDATE_USER,
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import swal from "sweetalert";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class BankDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user: [],
        }}
    componentDidMount() {
        this.props.onUpdateLoader(true);
        // document.title = "Maydaan | Bank Details";
        window.scrollTo({ top: 0, behavior: "smooth" });
        axios.post("/view-info").then((res) => {
          this.props.onUpdateLoader(false);
          // console.log("view info",res);
          if (res.data.error) {
            swal(res.data.error.meaning, {
              icon: "error",
            });
          } else if (res.data.result && res.data.result.user) {
            this.setState({
              user: res.data.result.user,
            });
          }
        
        })
        }
  render() {
    const { user } = this.state;

    const initialValues = {
        bname:user.bank_name?user.bank_name:"",
        acc_no:user.account_no?user.account_no:"",
        acc_ho_name:user.account_holder_name?user.account_holder_name:"",
        ifsc:user.ifsc_code?user.ifsc_code:""
    }
    const validationSchema = Yup.object({
        bname: Yup.string().required("Please enter bank name!"),
        acc_no: Yup.string().required("Please enter account no!").min(9, "Account number must be at least 9 digits")
        .matches(/^([0-9\s\-+()]*)$/, "Account number should be numeric")
        .max(18, "Account number contains maximum 18 digits"),
        acc_ho_name: Yup.string().required("Please enter account holder name!"),
        ifsc: Yup.string().required("Please enter ifsc code!").matches(/^[A-Z]{4}[0][A-Z0-9]{6}$/, "Invalid ifsc code!"),
        // ifsc: Yup.string().required("Please enter ifsc code!").matches("[A-Za-z0]{4})(0\d{6})$", "Invalid ifsc code!"),
    })
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
        this.props.onUpdateLoader(true);
        // console.log("Bank",values);
        let  data={
            "params": {
              "bank_name": values.bname,
              "account_no":values.acc_no,
              "account_holder_name": values.acc_ho_name,
              "ifsc_code": values.ifsc
            }
          }
        axios.post("/update-bank-info", data).then((res) => {
            this.props.onUpdateLoader(false);
            // console.log("Update_bank_info",res);
            if (res.data.error) {
                if (res.data.error.bank_name) {
                    this.props.onUpdateError(res.data.error.bank_name[0]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }if (res.data.error.account_no) {
                    this.props.onUpdateError(res.data.error.account_no[0]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                if (res.data.error.account_holder__name) {
                    this.props.onUpdateError(res.data.error.account_holder_name[0]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                if (res.data.error.ifsc_code) {
                    this.props.onUpdateError(res.data.error.ifsc_code[0]);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
                if (res.data.error.message) {
                    this.props.onUpdateError(res.data.error.meaning);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } else {
                if (res.data.result && res.data.result.message) {
                    this.props.onUpdateSuccess(res.data.result.meaning);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        })
    
    }
    return (
      <>
      <Helmet>
        <title>{Titles?.bankDetails?.title}</title>
        <meta
            name="description"
            content={Titles?.bankDetails?.description}
        />
        <meta property="og:title" content={Titles?.bankDetails?.ogTitle} />
        <meta property="og:description" content={Titles?.bankDetails?.ogDescription} />
        <meta property="og:image" content={Titles?.bankDetails?.ogImage} />
        <link rel="canonical" href={Titles?.bankDetails?.link} />
      </Helmet>
        <Layout>
        <section className="mainDasbordsec">
          <div className="container">
            <div className="mainDasbordInr">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="mobile_filter">
                    {" "}
                    <i className="fa fa-filter" />
                    <p>Show Menu</p>
                  </div>
                </div>
                <Sidebar />
                <div className="col-lg-9 col-md-12 col-sm-12 rpr-0">
                  <div className="dasbordRightlink">
                    <h1>Bank Details</h1>
                    <div className="dasbordRightBody">
                    <Message />
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                        enableReinitialize={true}
                      >
                        {({
                          values,
                          touched,
                          setFieldValue,
                          setFieldTouched,
                        }) => (
                          <Form action="edit-profile-service-offered.html">
                            <div className="row">
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Bank Name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="bname"
                                  />
                                  <ErrorMessage
                                    name="bname"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Account Number</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="acc_no"
                                  />
                                  <ErrorMessage
                                    name="acc_no"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Account Holder Name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="acc_ho_name"
                                  />
                                  <ErrorMessage
                                    name="acc_ho_name"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>IFSC Code</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="ifsc"
                                  />
                                  <ErrorMessage
                                    name="ifsc"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              
                              <div className="footdashSec">
                                <button type="submit" className="subbtn" style={{marginLeft:15}}>
                                Save
                                </button>
                                </div>
                            </div>
                          </Form>
                           )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
      </>
        
    )
  }
}
const mapDispatchToProps = (dispatch) => {
    return {
      onUpdateUser: (cnt) => dispatch({ type: UPDATE_USER, value: cnt }),
      onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
      onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
      onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    };
  };
  const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };
  export default connect(mapStateToProps, mapDispatchToProps)(BankDetails)
