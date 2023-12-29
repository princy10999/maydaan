import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import axios from '../../shared/axios';
import { UPDATE_ERROR, UPDATE_LOADER, UPDATE_SUCCESS } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import { getLSItem } from "../../shared/LocalStorage";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pass:false
        }
    }
    componentDidMount() {
        // document.title = "Maydaan | Change Password";
        window.scrollTo({ top: 0, behavior: "smooth" });
        let user = JSON.parse(getLSItem("user"));
        if(user.password!==null){
            this.setState({pass:true})
        }

    }

    render() {
        const initialValues = {
            pass:this.state.pass,
            oldpassword: "",
            password: "",
            repassword: ""
        };
        const validationSchema = Yup.object().shape({
            oldpassword: Yup.string()
            .when('pass', {
              is: true,
              then: Yup.string().required("Please enter current password!"),
              otherwise:Yup.string()
            }),
            password: Yup.string().required("Please enter new password!").min(8, "Please give atleast 8 character!"),
            repassword: Yup.string().oneOf(
                [Yup.ref("password"), ""],
                "Passwords must match!"
            ).required("Please enter confirm Password!"),
        });

        const handleSubmit = (values, actions) => {
            let params = {
                "old_password": values.oldpassword,
                "password_confirmation": values.repassword,
                "password": values.password
            };
            let body = {
                "params": params,
                "jsonrpc": "2.0"
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.props.onUpdateLoader(true);
            axios.post('/change-password', body).then(res => {
                this.props.onUpdateLoader(false);
                if (res.data.error) {
                    if (res.data.error.old_password) {
                        this.props.onUpdateError(res.data.error.old_password[0]);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (res.data.error.password) {
                        this.props.onUpdateError(res.data.error.password[0]);
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
            <title>{Titles?.changePassword?.title}</title>
            <meta
                name="description"
                content={Titles?.changePassword?.description}
            />
            <meta property="og:title" content={Titles?.changePassword?.ogTitle} />
            <meta property="og:description" content={Titles?.changePassword?.ogDescription} />
            <meta property="og:image" content={Titles?.changePassword?.ogImage} />
            <link rel="canonical" href={Titles?.changePassword?.link} />
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
                                        <h1>Change Password</h1>
                                        <div className="dasbordRightBody">
                                            <Message/>
                                            <Formik
                                                initialValues={initialValues}
                                                validationSchema={validationSchema}
                                                onSubmit={handleSubmit}
                                                enableReinitialize={true}
                                            >
                                                {() => (
                                                    <Form>
                                                        <div class="row">
                                                            <div class="col-md-6 col-sm-12">
                                                                <div class="iputBx">
                                                                    <label>Current password</label>
                                                                    <Field type="password" placeholder="Enter here" name="oldpassword" />
                                                                    <ErrorMessage name="oldpassword" component={FieldError} />
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 col-sm-12">
                                                                <div class="iputBx">
                                                                    <label>New password</label>
                                                                    <Field type="password" placeholder="Enter here" name="password" />
                                                                    <ErrorMessage name="password" component={FieldError} />
                                                                </div>
                                                            </div>
                                                            <div class="col-md-6 col-sm-12">
                                                                <div class="iputBx">
                                                                    <label>Confirm password</label>
                                                                    <Field type="password" placeholder="Enter here" name="repassword" />
                                                                    <ErrorMessage name="repassword" component={FieldError} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="footdashSec">
                                                            <button type="submit" className="subbtn">
                                                                Submit
                                                            </button>
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
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
        onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
        onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt })
    }
}
export default connect(null, mapDispatchToProps)(ChangePassword);
