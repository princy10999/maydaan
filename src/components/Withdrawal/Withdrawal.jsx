import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import swal from "sweetalert";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class Withdrawal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      wlist: [],
      user: [],
      loader: false,
      errors: {}
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Withdrawal";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getList();
  }
  getList = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("get-withdrawl-list").then((resp) => {
      // console.log("list", resp);
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      if (resp.data.result && resp.data.result.user) {
        this.setState({ user: resp.data.result.user });
      }
      if (resp.data.result && resp.data.result.Withdrawls) {
        this.setState({ wlist: resp.data.result.Withdrawls });
      }
    });
  };
  render() {
    const { wlist, user, errors } = this.state;

    const initialValues = {
      amount: "",
      bname: user.bank_name ? user.bank_name : "",
      acc_no: user.account_no ? user.account_no : "",
      acc_ho_name: user.account_holder_name ? user.account_holder_name : "",
      ifsc: user.ifsc_code ? user.ifsc_code : "",
      bank_det: true
    };
    const validationSchema = Yup.object().shape({
      amount: Yup.string().required("Please enter an amount for withdrawal!")
        .max((user.total_due), "Withdrawal amount can not be greater than available balance!"),
    });
    const validateForm = (values) => {
      // console.log("values.amount",Math.trunc(user.total_due), user.total_due ,values.amount);
      let errors = {};
      let formIsValid = true;
      if (Math.trunc(user.total_due) < Math.trunc(values.amount) ) {
        formIsValid = false;
        errors["amount"] = "Withdrawal amount can not be greater than available balance!";
      }
      this.setState({ errors: errors });
      return formIsValid;
    };
    const handleSubmit = (values, formikHelpers) => {
      if (validateForm(values)) {
        let data = {
          params: {
            amount: values.amount,
            bank_name: values.bname,
            account_no: values.acc_no,
            account_holder_name: values.acc_ho_name,
            ifsc_code: values.ifsc,
          },
        };
        this.props.onUpdateLoader(true);
        axios.post("request-withdrawl", data).then((resp) => {
          // console.log("withdraw", resp);
          this.props.onUpdateLoader(false);
          document.querySelector(".modal-backdrop").remove();
          document.querySelector("body").classList.remove("modal-open");
          document.querySelector("body").style.removeProperty("padding-right");
          document.getElementById("exampleModal").style.display = "none";
          formikHelpers.resetForm();
          if (resp.data.result) {
            swal({
              title: "Success",
              text: resp.data.result.meaning,
              icon: "success",
              button: "OK",
            }).then((isConfirmed) => {
              if (isConfirmed) {
                this.getList();
              }
            });
          } else {
            swal({
              title: "",
              text: resp.data.error.meaning,
              icon: "warning",
              button: "OK",
            }).then((isConfirmed) => {
              if (isConfirmed) {
                this.getList();
              }
            });
          }
        });
      }
    };
    const bank = () => {
      document.querySelector(".modal-backdrop").remove();
      document.querySelector("body").classList.remove("modal-open");
      document.querySelector("body").style.removeProperty("padding-right");
      document.getElementById("exampleModal").style.display = "none";
      this.props.history.push("/bank-details");
    }

    return (
      <>
        <Helmet>
      <title>{Titles?.withdrawal?.title}</title>
      <meta
          name="description"
          content={Titles?.withdrawal?.description}
      />
      <meta property="og:title" content={Titles?.withdrawal?.ogTitle} />
      <meta property="og:description" content={Titles?.withdrawal?.ogDescription} />
      <meta property="og:image" content={Titles?.withdrawal?.ogImage} />
      <link rel="canonical" href={Titles?.withdrawal?.link} />
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
                  <div className="dasbordRightlink ">
                    <h1>Withdrawal</h1>
                    <div className="dasbordRightBody pb-3">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 com_padd_both order_summary">
                          <div className="dashbox">
                            <div className="dashbox_head">
                              <h4>
                                Withdrawal Summary
                                <span />
                              </h4>
                              <buttton
                                className="back_btnn01 back_btnn_new01 back_btnn_new02"
                                onClick={() =>
                                  this.props.history.push("/my-earning")
                                }
                              >
                                Back
                              </buttton>
                            </div>
                            <div className="dashbox_body tyaa">
                              <p>
                                <strong> Total Earning </strong>{" "}
                                <span>
                                  :{" "}
                                  <img
                                    src="images/rupe.png"
                                    alt=""
                                    style={{ marginRight: "5px" }}
                                  />
                                  {user && user.total_earning
                                    ? user.total_earning
                                    : "0"}
                                </span>
                              </p>
                              <p>
                                <strong> Total Due</strong>{" "}
                                <span>
                                  :{" "}
                                  <img
                                    src="images/rupe.png"
                                    alt=""
                                    style={{ marginRight: "5px" }}
                                  />
                                  {user && user.total_due
                                    ? user.total_due
                                    : "0"}
                                </span>
                              </p>
                              <p>
                                <strong> Total Paid </strong>{" "}
                                <span>
                                  :{" "}
                                  <img
                                    src="images/rupe.png"
                                    alt=""
                                    style={{ marginRight: "5px" }}
                                  />
                                  {user && user.total_paid
                                    ? user.total_paid
                                    : "0"}
                                </span>
                              </p>
                            </div>
                            <div
                              className="dashbox_body small_bbxx tyaa"
                              style={{ marginTop: "20px" }}
                            >
                              <button
                                className="withDraw"
                                data-toggle="modal"
                                data-target="#exampleModal"
                              >
                                Request Withdrawal
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="productss_orderr">
                          {wlist && wlist.length > 0 ? (
                            <>
                              <h5>Withdrawal</h5>
                              <div className="table_01 table">
                                <div className="row amnt-tble">
                                  <div className="cel_area amunt cess nw1">
                                    Amount
                                  </div>
                                  <div className="cel_area amunt cess nw3">
                                    Date
                                  </div>
                                  <div className="cel_area amunt cess nw4">
                                    Status
                                  </div>
                                </div>
                                {/*table row-1*/}
                                {wlist.map((item, index) => {
                                  return (
                                    <div
                                      className="row small_screen2"
                                      key={index}
                                    >
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Amount</span>
                                        <span className="sm_size">
                                          <img src="images/rupe.png" alt="" />{" "}
                                          {item.amount}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Date</span>
                                        <span className="sm_size">
                                          {" "}
                                          {dateFormat(
                                            item.created_at,
                                            "dd-mm-yyyy"
                                          )}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Status</span>
                                        <span className="sm_size">
                                          {" "}
                                          {item.status === "I"
                                            ? "In Progress"
                                            : item.status === "A"
                                              ? "Approved"
                                              : item.status === "R"
                                                ? "Rejected"
                                                : null}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </>
                          ) : (
                            <>
                              {!this.state.loader ? (
                                <div
                                  className="n-resul n-resul001"
                                  style={{ height: "auto" }}
                                >
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/images/no-result.png"
                                    }
                                    alt=""
                                  />
                                  <p>You have not made any withdrawals yet!</p>
                                </div>
                              ) : null}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div
          className="modal fade withdrawl_modal"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  Available Balance:{" "}
                  <img
                    src="images/rupee-green.png"
                    alt=""
                    style={{ marginRight: "5px" }}
                  />
                  {user && user.total_due ? user.total_due : "0"}{" "}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="body_withdrawl">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                  >
                    {({ values, touched, setFieldTouched, setFieldValue }) => {
                      return (
                        <Form>
                          {user.account_no && user.account_holder_name && user.ifsc_code && user.bank_name ?
                            <div className="iputBx inpt001">
                              <label style={{ color: "black" }}>Amount</label>
                              <Field
                                type="text"
                                placeholder="Enter here"
                                name="amount"
                                onChange={(e) => {
                                  let result = e.target.value.replace(/\D/g, "");
                                  setFieldValue("amount", result);
                                }}
                              />
                              <ErrorMessage
                                name="amount"
                                component={FieldError}
                              />
                              <span className="errorInput">
                                {Math.trunc(user.total_due) > Math.trunc(values.amount) ? "" : errors["amount"]}
                              </span>
                            </div>
                            : null}
                          {user.account_no && user.account_holder_name && user.ifsc_code && user.bank_name ?
                            <div className="row row002">
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx inpt001">
                                  <label style={{ color: "black" }}>
                                    Bank Name
                                  </label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="bname"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx inpt001">
                                  <label style={{ color: "black" }}>
                                    Account Number
                                  </label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="acc_no"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx inpt001">
                                  <label style={{ color: "black" }}>
                                    Account Holder Name
                                  </label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="acc_ho_name"
                                    readOnly
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx inpt001">
                                  <label style={{ color: "black" }}>
                                    IFSC Code
                                  </label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="ifsc"
                                    readOnly

                                  />
                                </div>
                              </div>
                            </div>
                            :
                            <>
                              <div className="no-b_det d-block">You need to add<Link to="#" onClick={() => bank()}><img src={process.env.PUBLIC_URL +
                                "/images/bank_details3.png"} alt="" /> Bank Details </Link>before withdrawal!</div>
                            </>}
                          {user.account_no && user.account_holder_name && user.ifsc_code && user.bank_name ?
                            <input
                              type="submit"
                              value="Submit"
                              className="subbtn"
                            /> : null}
                        </Form>
                      );
                    }}
                  </Formik>
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
export default connect(null, mapDispatchToProps)(Withdrawal);
