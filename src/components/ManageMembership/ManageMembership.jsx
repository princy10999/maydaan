import React, { Component } from 'react'
import Layout from '../Layout/Layout'
import Sidebar from '../Layout/Sidebar'
// import recent_price from "../../assets/images/recent-price.png"
import { ErrorMessage, Field, Form, Formik } from "formik";
import FieldError from "../../shared/FieldError";
import * as Yup from "yup";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import { getLSItem } from "../../shared/LocalStorage";

class ManageMembership extends Component {
    constructor(props) {
        super(props);
        this.state = {
          amount:"",
          userType:"C"
        }
    }
    componentDidMount() {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.title = "Maydaan | Manage Membership";
        let user = JSON.parse(getLSItem("user"));
        if(user.type==="T"){
          this.setState({userType:"T"})
          document.title = "Maydaan | Manage Subscription";
        }
        this.props.onUpdateLoader(true);
        axios.post("view-info").then(res=>{
            this.props.onUpdateLoader(false);
            // console.log("==",res);
            if(res.data.result.user){
                this.setState({amount:res.data.result.user.membership_amount})
            }
        })
        }
  render() {
    const initialValues = {
        fee:this.state.amount?this.state.amount:""
    }
    const validationSchema = Yup.object().shape({
        fee: Yup.number().typeError("Membership fees must be in number!").required("Please enter membership fees!"),
    })
    const handleSubmit = (values) => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.props.onUpdateLoader(true);
        let data={
            "params": {
              "membership_amount": values.fee
            }
          }
        axios.post("update-membership",data).then(res=>{
            this.props.onUpdateLoader(false);
            // console.log("Update_Membership",res);
            if (res.data.result) {
                this.props.onUpdateSuccess(res.data.result.meaning);
            }else if (res.data.error) {
                if (res.data.error.membership_amount) {
                  this.props.onUpdateError(res.data.error.membership_amount[0]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (res.data.error.message) {
                    this.props.onUpdateError(res.data.error.meaning);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
            }
        })
    }
    return (
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
                <h1>Manage {this.state.userType==="C"?"Membership":"Subscription"}</h1>
                <div className="dasbordRightBody">
                <Message />
                <Formik
                    initialValues={initialValues}
                    enableReinitialize={true}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    >
                    {({ setFieldValue }) => {
                    return (
                    <Form action="edit-profile-service-offered.html">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                        <div className="iputBx">
                            <label>Monthly fees for {this.state.userType==="C"?"Membership":"Subscription"}</label>
                            <Field type="number" className="icon_rupee" placeholder="Enter here" name="fee" 
                            />
                            <ErrorMessage
                            name="fee"
                            component={FieldError}
                            />
                            <span className="for_icon_rupee"><img src={process.env.PUBLIC_URL + "/images/recent-price.png"} alt=''/></span>
                        </div>
                        </div>
                    </div>
                    <div className="footdashSec">
                        <input type="submit" value="Save" className="subbtn" />
                    </div>
                    </Form>
                    )}}</Formik>
                </div>
                </div>
            </div>
                </div>
            </div>
        </div>
        </section>
        </Layout>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
    return {
      onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
      onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
      onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    };
  };
  export default connect(null, mapDispatchToProps)(ManageMembership)
