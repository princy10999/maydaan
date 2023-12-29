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

class MyEarningFromProduct extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      earning: [],
      orderNo: "",
      from_date: "",
      to_date: "",
      status: "",
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | My Earning from Product";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    let data = {
      params: {
        offset: this.state.offset,
        order_no: this.state.orderNo,
        from_date: this.state.from_date,
        to_date: this.state.to_date,
        status: this.state.status,
      },
    };
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/view-all-club-earning-product-selling", data).then((resp) => {
      //   console.log("mEarProd", resp);
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      if (resp.data.result && resp.data.result.earning_from_product_selling) {
        this.setState({
          earning: resp.data.result.earning_from_product_selling,
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
      orderNo: "",
      status: "",
      from_date: "",
      to_date: "",
    };
    const handleSubmit = (values, actions) => {
      // console.log(">>>", values);
      this.setState(
        {
          orderNo: values.orderNo,
          status: values.status,
          from_date: values.from_date,
          to_date: values.to_date,
          offset: 0,
        },
        () => this.getData()
      );
    };
    const { earning } = this.state;
    return (
      <>
       <Helmet>
        <title>{Titles?.myEarningFromProduct?.title}</title>
        <meta
            name="description"
            content={Titles?.myEarningFromProduct?.description}
        />
        <meta property="og:title" content={Titles?.myEarningFromProduct?.ogTitle} />
        <meta property="og:description" content={Titles?.myEarningFromProduct?.ogDescription} />
        <meta property="og:image" content={Titles?.myEarningFromProduct?.ogImage} />
        <link rel="canonical" href={Titles?.myEarningFromProduct?.link} />
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
                    <h1>Earning From Product</h1>
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
                                    <label>Order No.</label>
                                    <Field
                                      type="text"
                                      name="orderNo"
                                      placeholder="Enter Order No."
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
                                <div className="odr-spc">
                                  <div className="iputBx">
                                    <label>Status</label>
                                    <Field as="select" name="status">
                                      <option value="">Select Status</option>
                                      <option value="INP">In Progress</option>
                                      <option value="CM">Completed</option>
                                      <option value="Dispatched">
                                        Dispatched
                                      </option>
                                      <option value="OD">Delivered</option>
                                      <option value="NW">New Order</option>
                                      <option value="C">Canceled</option>
                                    </Field>
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
                      {earning && earning.length > 0 ? (
                        <>
                          <div className="table_01 table">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw1">
                                Order Id
                              </div>
                              <div className="cel_area amunt cess nw2">
                                Customer
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Date
                              </div>
                              <div className="cel_area amunt cess nw4">
                                Price
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

                            {earning.map((item, index) => {
                              return (
                                <div className="row small_screen2" key={index}>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Order Id
                                    </span>{" "}
                                    <span className="sm_size">
                                      {item.order_master
                                        ? item.order_master.order_number
                                        : null}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Customer
                                    </span>{" "}
                                    <span className="sm_size">
                                      {item.order_master &&
                                      item.order_master.get_user_details
                                        ? item.order_master.get_user_details
                                            .first_name +
                                          " " +
                                          item.order_master.get_user_details
                                            .last_name
                                        : null}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Date</span>{" "}
                                    <span className="sm_size">
                                      {dateFormat(
                                        item.created_at,
                                        "dd-mm-yyyy"
                                      )}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Price</span>{" "}
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />{" "}
                                      {item.total ? item.total : "0"}
                                    </span>{" "}
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Commission</span>
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />
                                      {item.commission ? item.commission : "0"}
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
                                      {item.net_earnings
                                        ? item.net_earnings
                                        : "0"}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Action</span>
                                    <ul>
                                      <li>
                                        <Link
                                          to={`/view-my-earning-from-product/${item.order_master_id}`}
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
export default connect(null, mapDispatchToProps)(MyEarningFromProduct);
