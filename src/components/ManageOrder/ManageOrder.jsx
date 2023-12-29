import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
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
    BASE_URL } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class ManageOrder extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      order: [],
      orderNo: "",
      from_date: "",
      to_date: "",
      status: "",
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Manage Order";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    let data = {
      params: {
        offset: this.state.offset,
        "order_no": this.state.orderNo,
        "from_date": this.state.from_date,
        "to_date": this.state.to_date,
        "status": this.state.status
      },
    };
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/manage-order", data).then((resp) => {
      // console.log("mOrder", resp);
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      if (resp.data.result && resp.data.result.order) {
        this.setState({
          order: resp.data.result.order,
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
    const { order } = this.state;
    return (
      <>
        <Helmet>
        <title>{Titles?.manageOrder?.title}</title>
        <meta
            name="description"
            content={Titles?.manageOrder?.description}
        />
        <meta property="og:title" content={Titles?.manageOrder?.ogTitle} />
        <meta property="og:description" content={Titles?.manageOrder?.ogDescription} />
        <meta property="og:image" content={Titles?.manageOrder?.ogImage} />
        <link rel="canonical" href={Titles?.manageOrder?.link} />
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
                    <h1>Order Management</h1>
                    <div
                      className="dasbordRightBody for_table_stc"
                      style={{ position: "relative" }}
                    >
                      {order && order.length > 0 ? (
                      <>
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
                                      <option value="OD">Delivered</option>
                                      <option value="Dispatched">Dispatched</option>
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
                      <div className="table_01 table">
                        <div className="row amnt-tble">
                          <div className="cel_area amunt cess nw1 amunt001">
                            Order No.
                          </div>
                          <div className="cel_area amunt cess nw2 amunt001">
                            Customer Name
                          </div>
                          <div className="cel_area amunt cess nw3 amunt001">
                            No. of Items
                          </div>
                          <div className="cel_area amunt cess nw4 amunt001">
                            Order Date
                          </div>
                          <div className="cel_area amunt cess nw4 amunt001">
                            Order Total
                          </div>
                          <div className="cel_area amunt cess nw4 amunt001">
                            Payable Amount
                          </div>
                          <div className="cel_area amunt cess nw4">Status</div>
                          <div className="cel_area amunt cess nw6">&nbsp;</div>
                        </div>
                        {/*table row-1*/}
                        {order.map((item, index) => {
                        return (
                        <div className="row small_screen2">
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            <span className="hide_big">Order No.</span>
                            <span className="sm_size">{item.order_master?item.order_master.order_number:null}</span>
                          </div>
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">Customer Name</span>{" "}
                            <span className="sm_size">{item.order_master && item.order_master.get_user_details? item.order_master.get_user_details.first_name+" "+item.order_master.get_user_details.last_name:null}</span>
                          </div>
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">No. of Items</span>{" "}
                            <span className="sm_size">{item.no_of_items?item.no_of_items:null}</span>{" "}
                          </div>
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">Order Date</span>
                            <span className="sm_size">{dateFormat(item.created_at, "dd-mm-yyyy")}</span>
                          </div>
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">Order Total</span>
                            <span className="sm_size">
                              <img src={process.env.PUBLIC_URL +"/images/rupe.png"} alt="" />
                              {item.total?item.total:null}
                            </span>
                          </div>
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">Payable Amount</span>
                            <span className="sm_size">
                              <img src={process.env.PUBLIC_URL +"/images/rupe.png"} alt="" />
                              {item.payable_amount?item.payable_amount:null}
                            </span>
                          </div>
                          {item.status ?
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">Status</span>
                            {item.status == "ICM" ? (
                                    <span
                                      className="sm_size"
                                      style={{ color: "#fecf6d" }}
                                    >
                                      Incomplete
                                    </span>
                                  ) :
                                  item.status == "Dispatched" ? (
                                    <span
                                      className="sm_size"
                                      style={{ color: "#fecf6d" }}
                                    >
                                      Dispatched
                                    </span>
                                  ): item.status == "NW" ? (
                                    <span
                                      className="sm_size"
                                      style={{ color: "#99e9eb" }}
                                    >
                                      New Order
                                    </span>
                                  ) : item.status == "INP" ? (
                                    <span
                                      className="sm_size"
                                      style={{ color: "#99e9eb" }}
                                    >
                                     In Progress
                                    </span>
                                  ): item.status == "OD" ? (
                                    <span className="sm_size clor_done">
                                      Delivered
                                    </span>
                                  ) : item.status == "CM" ? (
                                    <span className="sm_size clor_done">
                                      Completed
                                    </span>
                                  ) :item.status == "C" ? (
                                    <span className="sm_size clor_cancel">
                                      Cancelled
                                    </span>
                                  ) : null}
                          </div>:null}
                          <div className="cel_area amunt-detail cess amunt-detail0012">
                            {" "}
                            <span className="hide_big">Action</span>
                            <ul>
                              <li>
                                <Link to={`/order-detail/${item.order_master_id}`}>
                                  <img
                                    src={process.env.PUBLIC_URL +"/images/view.png"}
                                    alt=""
                                    title="View Details"
                                  />
                                </Link>
                              </li>
                              {/* <li>
                                <Link to="#">
                                  <img
                                    src={process.env.PUBLIC_URL +"/images/delete-dash.png"}
                                    alt=""
                                    title="Delete"
                                  />{" "}
                                </Link>
                              </li> */}
                            </ul>
                          </div>
                        </div>
                        )})}
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
                                  process.env.PUBLIC_URL + "/images/no-result.png"
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
  export default connect(null, mapDispatchToProps)(ManageOrder)
