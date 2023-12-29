import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class MyEarningFromMembership extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      users: [],
      name: "",
      from_date: "",
      to_date: "",
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | My Earning from Membership";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    let data = {
      params: {
        offset: this.state.offset,
        name: this.state.name,
        from_date: this.state.from_date,
        to_date: this.state.to_date,
      },
    };
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/view-all-club-my-earning-membership", data).then((resp) => {
      //   console.log("mEarMem", resp);
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      if (resp.data.result && resp.data.result.users) {
        this.setState({
          users: resp.data.result.users,
          page_count: resp.data.result.page_count,
          per_page: resp.data.result.per_page,
          total: resp.data.result.total,
        });
      }
    });
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    this.setState({ offset: offset }, () => {
      this.getData();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  render() {
    const initialValues = {
      name: "",
      from_date: "",
      to_date: "",
    };
    const handleSubmit = (values, actions) => {
      // console.log(">>>", values);
      this.setState(
        {
          name: values.name,
          from_date: values.from_date,
          to_date: values.to_date,
          offset: 0,
        },
        () => this.getData()
      );
    };
    const { users } = this.state;
    return (
     <>
       <Helmet>
      <title>{Titles?.myEarningFromMembership?.title}</title>
      <meta
          name="description"
          content={Titles?.myEarningFromMembership?.description}
      />
      <meta property="og:title" content={Titles?.myEarningFromMembership?.ogTitle} />
      <meta property="og:description" content={Titles?.myEarningFromMembership?.ogDescription} />
      <meta property="og:image" content={Titles?.myEarningFromMembership?.ogImage} />
      <link rel="canonical" href={Titles?.myEarningFromMembership?.link} />
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
                    <h1>Earning From Membership</h1>
                    <div
                      className="dasbordRightBody for_table_stc"
                      style={{ position: "relative" }}
                    >
                      <div className="ex-back001">
                        <buttton
                          className="back_btnn01 back_btnn_new01 back_btnn_new02"
                          onClick={() => this.props.history.push("/my-earning")}
                        >
                          Back
                        </buttton>
                      </div>
                      <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                      >
                        {({
                          values,
                          setFieldValue,
                          setFieldTouched,
                          resetForm,
                        }) => {
                          return (
                            <Form>
                              <div className="fltr-odr">
                                <div className="odr-spc">
                                  <div className="iputBx">
                                    <label>Member Name</label>
                                    <Field
                                      type="text"
                                      name="name"
                                      placeholder="Enter Member Name"
                                    />
                                  </div>
                                </div>
                                <div className="odr-spc">
                                  <div className="iputBx">
                                    <label>From Date</label>
                                    <DatePicker
                                      placeholderText="From Date"
                                      onChange={(value) => {
                                        setFieldTouched("from_date");
                                        setFieldValue("from_date", value);
                                      }}
                                      selected={values.from_date}
                                      name="from_date"
                                      dateFormat="MMMM d, yyyy"
                                      className="date_calc"
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="odr-spc">
                                  <div className="iputBx">
                                    <label>To Date</label>
                                    <DatePicker
                                      placeholderText="To Date"
                                      onChange={(value) => {
                                        setFieldTouched("to_date");
                                        setFieldValue("to_date", value);
                                      }}
                                      selected={values.to_date}
                                      name="to_date"
                                      dateFormat="MMMM d, yyyy"
                                      className="date_calc"
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="odr-src">
                                  <div className="prod_add fltr-src fltr-src001">
                                    <button type="submit">
                                      <i
                                        className="fa fa-search"
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                      {/*TABLE AREA START*/}
                      {users && users.length > 0 ? (
                        <>
                          <div className="table_01 table">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw2">
                                Member
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Membership Paid On
                              </div>
                              <div className="cel_area amunt cess nw4">
                                Fees
                              </div>
                              <div className="cel_area amunt cess nw5">
                                Commission
                              </div>
                              <div className="cel_area amunt cess mc99">
                                Net Earning
                              </div>
                              <div className="cel_area amunt cess nw6">
                                &nbsp;
                              </div>
                            </div>
                            {/*table row-1*/}
                            {users.map((item, index) => {
                              return (
                                <div className="row small_screen2" key={index}>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Member
                                    </span>{" "}
                                    <span className="sm_size">
                                      {item.get_user
                                        ? item.get_user.first_name +
                                          " " +
                                          item.get_user.last_name
                                        : null}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Membership Paid On
                                    </span>{" "}
                                    <span className="sm_size">
                                      {dateFormat(item.paid_on, "dd-mm-yyyy")}
                                    </span>{" "}
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Fees</span>
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_payment
                                        ? item.get_payment.amount
                                        : null}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Commision</span>
                                    <span className="sm_size ">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_payment
                                        ? item.get_payment.commission
                                        : "0"}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Net Earning
                                    </span>
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_payment
                                        ? item.get_payment
                                            .total_after_commission
                                        : "0"}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Action</span>
                                    <ul>
                                      <li>
                                        <Link
                                          to={`/fees-details/${item.member_id}`}
                                        >
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/images/view.png"
                                            }
                                            alt=""
                                            title="View Details"
                                          />
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {/*TABLE AREA END*/}
                          {this.state.page_count > 1 ? (
                            <div className="pag_red pag_for_dash">
                              <div className="paginationsec">
                                <ReactPaginate
                                  activeClassName="actv"
                                  activeLinkClassName="actv"
                                  initialPage={0}
                                  breakLabel="....."
                                  onPageChange={(e) => this.handlePageClick(e)}
                                  pageCount={this.state.page_count}
                                  previousLabel={
                                    <>
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/pagleft.png"
                                        }
                                        alt=""
                                        className="dpb"
                                      />
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/paglefthov.png"
                                        }
                                        alt=""
                                        className="dpn"
                                      />
                                    </>
                                  }
                                  nextLabel={
                                    <>
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/pagright.png"
                                        }
                                        alt=""
                                        className="dpb"
                                      />
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/pagrightho.png"
                                        }
                                        alt=""
                                        className="dpn"
                                      />
                                    </>
                                  }
                                  marginPagesDisplayed={1}
                                  renderOnZeroPageCount={null}
                                />
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <>
                          {!this.state.loader ? (
                            <div className="n-resul">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/no-result.png"
                                }
                                alt=""
                              />
                              <p>No data found!</p>
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
        </section>
      </Layout>
     </>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(MyEarningFromMembership);
