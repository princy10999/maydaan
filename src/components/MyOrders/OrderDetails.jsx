import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  BASE_URL,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import swal from "sweetalert";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";

class OrderDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      product: [],
      order: [],
      details: [],
      id:""
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Order Details";
    this.getData();
  }
  getData = () => {
    let url = "orderDetails";
    let Id = this.props.match.params.id;
    if (this.props.match.params.mid) {
      url = "clubViewManageorderDetails";
      Id = this.props.match.params.mid;
    }
    this.props.onUpdateLoader(true);
    axios
      .post(url, {
        params: {
          id: Id,
        },
      })
      .then((resp) => {
        // console.log("oDetails", resp);
        this.props.onUpdateLoader(false);
        if (resp.data.result && resp.data.result.order) {
          this.setState({
            order: resp.data.result.order,
          });
        }
        if (
          resp.data.result &&
          resp.data.result.order &&
          resp.data.result.order.get_order_details
        ) {
          this.setState({ product: resp.data.result.order.get_order_details });
        }
        if (
          resp.data.result &&
          resp.data.result.order &&
          resp.data.result.order.order_master &&
          resp.data.result.order.order_master.getOrderDetails
        ) {
          this.setState({
            product: resp.data.result.order.order_master.getOrderDetails,
          });
        }
      });
  };
  msg = () => {
    swal("You have already rated this product!", {
      icon: "warning",
    });
  };

  cancel = (id) => {
    var data = {
      params: {
        id: this.props.match.params.id,
        product_id: id,
      },
    };
    swal({
      text: "Are you sure, you want to cancel this order?" ,
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onUpdateLoader(true);
        axios.post("cancelOrder", data).then((resp) => {
           if (resp.data.error) {
            this.props.onUpdateLoader(false);

            swal({
              title: "Error",
              text: resp.data.error.meaning,
              icon: "error",
              button: "Ok",
            }).then((isConfirmed) => {
              if (isConfirmed) {
                this.getData();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            });
          } else if (resp.data.result) {
            swal({
              title: "Success",
              text: resp.data.result.meaning,
              icon: "success",
              button: "Ok",
            }).then((isConfirmed) => {
              if (isConfirmed) {
                this.getData();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            });
          }
        });
      }
    });
  };

  render() {
    const { order, product } = this.state;
    const initialValues = {
      status: "",
    };
    const validationSchema = Yup.object().shape({
      status: Yup.string().required("Please select a status to change!")
    });
    const handleSubmit = (values) => {
      var data2 = {
        params: {
          id: this.props.match.params.mid,
          product_id: this.state.id,
          status:values.status
        },
      };
      this.props.onUpdateLoader(true);
        axios.post("changeStatusOrder", data2).then((resp) => {
          this.props.onUpdateLoader(false);
          document.querySelector(".modal-backdrop").remove();
          document.querySelector("body").classList.remove("modal-open");
          document.querySelector("body").style.removeProperty("padding-right");
          document.getElementById("exampleModal").style.display = "none";
          if (resp.data.result) {
            swal({
              title: "Success",
              text: resp.data.result.meaning,
              icon: "success",
              button: "OK",
            }).then((isConfirmed) => {
              if (isConfirmed) {
                this.getData();
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
                this.getData();
              }
            });
          }
        });
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
                    <h1>
                      Order Details (of orderId:{" "}
                      {!this.props.match.params.mid &&
                      order &&
                      order.order_number
                        ? order.order_number
                        : order.order_master
                        ? order.order_master.order_number
                        : null}{" "}
                      )
                    </h1>
                    {order ? (
                      <div className="dasbordRightBody">
                        <div className="row">
                          <div className="col-lg-12 col-md-12 com_padd_both order_summary">
                            <div className="dashbox">
                              <div className="dashbox_head">
                                <h4>
                                  Order Summary
                                  <span />
                                </h4>
                                <buttton
                                  className="back_btnn01 back_btnn_new01 back_btnn_new02"
                                  onClick={() =>
                                    this.props.history.push(
                                      !this.props.match.params.mid
                                        ? "/my-orders"
                                        : "/manage-order"
                                    )
                                  }
                                >
                                  Back
                                </buttton>
                              </div>
                              <div className="dashbox_body tyaa width_120px">
                                <p>
                                  <strong> Order Id </strong>{" "}
                                  <span>
                                    {!this.props.match.params.mid &&
                                    order.order_number
                                      ? order.order_number
                                      : order.order_master &&
                                        order.order_master.order_number
                                      ? order.order_master.order_number
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong> Order on </strong>{" "}
                                  <span>
                                    {dateFormat(order.created_at, "dd-mm-yyyy")}
                                  </span>
                                </p>
                                <p>
                                  <strong> Item </strong>{" "}
                                  <span>
                                    {!this.props.match.params.mid &&
                                    order.total_item
                                      ? order.total_item
                                      : order.order_master
                                      ? order.order_master.total_item
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong> Order Total </strong>{" "}
                                  <span>
                                    {" "}
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupe.png"
                                      }
                                      alt=""
                                    />{" "}
                                    {!this.props.match.params.mid &&
                                    order.total_after_discount
                                      ? order.total_after_discount
                                      : order.order_master
                                      ? order.order_master.total_after_discount
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong>Cancelled Amount </strong>{" "}
                                  <span>
                                    {" "}
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupe.png"
                                      }
                                      alt=""
                                    />{" "}
                                    {!this.props.match.params.mid &&
                                    order.total_cancelled_amount
                                      ? order.total_cancelled_amount
                                      : order.order_master
                                      ? order.order_master.total_cancelled_amount
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong>Payable Amount</strong>{" "}
                                  <span>
                                    {" "}
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupe.png"
                                      }
                                      alt=""
                                    />{" "}
                                    {!this.props.match.params.mid &&
                                    order.payable_amount
                                      ? order.payable_amount
                                      : order.order_master
                                      ? order.order_master.payable_amount
                                      : null}
                                  </span>
                                </p>
                              </div>
                              <div className="dashbox_body small_bbxx tyaa">
                                {!this.props.match.params.mid ? (
                                  <p>
                                    <strong> Status </strong>{" "}
                                    {order.status ==="ICM" ? (
                                      <span style={{ color: "#fecf6d" }}>
                                        {" "}
                                        Incomplete
                                      </span>
                                    ) : order.status ==="Dispatched" ? (
                                      <span style={{ color: "#fecf6d" }}>
                                        {" "}
                                        Dispatched
                                      </span>
                                    ) : order.status ==="NW" ? (
                                      <span style={{ color: "#99e9eb" }}>
                                        New Order
                                      </span>
                                    ) : order.status ==="INP" ? (
                                      <span style={{ color: "#99e9eb" }}>
                                        In Progress
                                      </span>
                                    ) : order.status ==="OD" ? (
                                      <span className="green">
                                        {" "}
                                        <i
                                          className="fa fa-check"
                                          aria-hidden="true"
                                        />{" "}
                                        Delivered
                                      </span>
                                    ) : order.status ==="CM" ? (
                                      <span className="green">
                                        {" "}
                                        <i
                                          className="fa fa-check"
                                          aria-hidden="true"
                                        />{" "}
                                        Completed
                                      </span>
                                    ): order.status ==="C" ? (
                                      <span className="red">Cancelled</span>
                                    ) : null}
                                  </p>
                                ) : (
                                  <p>
                                    <strong> Status </strong>{" "}
                                    {order &&
                                    order.status ==="ICM" ? (
                                      <span style={{ color: "#fecf6d" }}>
                                        {" "}
                                        Incomplete
                                      </span>
                                    ) : order &&
                                      order.status ===
                                        "Dispatched" ? (
                                      <span style={{ color: "#fecf6d" }}>
                                        {" "}
                                        Dispatched
                                      </span>
                                    ) : order &&
                                      order.status ==="NW" ? (
                                      <span style={{ color: "#99e9eb" }}>
                                        New Order
                                      </span>
                                    ) : order &&
                                    order.status ==="INP" ? (
                                    <span style={{ color: "#99e9eb" }}>
                                      In Progress
                                    </span>
                                  ) : order &&
                                      order.status ==="OD" ? (
                                      <span className="green">
                                        {" "}
                                        <i
                                          className="fa fa-check"
                                          aria-hidden="true"
                                        />{" "}
                                        Delivered
                                      </span>
                                    ) 
                                    : order &&
                                      order.status ==="CM" ? (
                                      <span className="green">
                                        {" "}
                                        <i
                                          className="fa fa-check"
                                          aria-hidden="true"
                                        />{" "}
                                        Completed
                                      </span>
                                    ) : order &&
                                      order.status ==="C" ? (
                                      <span className="red">Cancelled</span>
                                    ) : null}
                                  </p>
                                )}
                                <p>
                                  <strong> Payment mode</strong>{" "}
                                  {!this.props.match.params.mid ? (
                                    <span>
                                      {order.payment_method ==="C"
                                        ? "Cash on Delivary"
                                        : "Online"}
                                    </span>
                                  ) : (
                                    <span>
                                      {order.order_master &&
                                      order.order_master.payment_method ==="C"
                                        ? "Cash on Delivary"
                                        : "Online"}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          {!this.props.match.params.mid ? (
                            <div className="col-lg-6 col-md-12 com_padd_both">
                              {order ? (
                                <div className="dashbox">
                                  <div className="dashbox_head">
                                    <h4>
                                      <span>Shipping Details</span>
                                    </h4>
                                  </div>
                                  <div className="dashbox_body">
                                    <p>
                                      <strong> Name </strong>{" "}
                                      <span>
                                        {order.shipping_first_name +
                                          " " +
                                          order.shipping_last_name}
                                      </span>
                                    </p>
                                    <p>
                                      <strong> Address </strong>{" "}
                                      <span>
                                        {order.shipping_full_address},
                                        {order && order.get_shipping_city
                                          ? order.get_shipping_city.city
                                          : null}
                                        ,
                                        {order && order.get_shipping_state
                                          ? order.get_shipping_state.name
                                          : null}{" "}
                                        - {order.shipping_zipcode}
                                      </span>
                                    </p>
                                    <p>
                                      <strong> Phone </strong>{" "}
                                      <span>{order.shipping_phone}</span>
                                    </p>
                                    <p>
                                      <strong> Email </strong>{" "}
                                      <span>{order.shipping_email}</span>
                                    </p>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                          {!this.props.match.params.mid ? (
                            <div className="col-lg-6 col-md-12 com_padd_both">
                              {order ? (
                                <div className="dashbox">
                                  <div className="dashbox_head">
                                    <h4>
                                      <span>Billing Details</span>
                                    </h4>
                                  </div>
                                  <div className="dashbox_body">
                                    <p>
                                      <strong> Name </strong>{" "}
                                      <span>
                                        {order.billing_first_name +
                                          " " +
                                          order.billing_last_name}
                                      </span>
                                    </p>
                                    <p>
                                      <strong> Address </strong>{" "}
                                      <span>
                                        {order.billing_full_address},
                                        {order && order.get_billing_city
                                          ? order.get_billing_city.city
                                          : null}
                                        ,
                                        {order && order.get_billing_state
                                          ? order.get_billing_state.name
                                          : null}{" "}
                                        - {order.billing_zipcode}
                                      </span>
                                    </p>
                                    <p>
                                      <strong> Phone </strong>{" "}
                                      <span>{order.billing_phone}</span>
                                    </p>
                                    <p>
                                      <strong> Email </strong>{" "}
                                      <span>{order.billing_email}</span>
                                    </p>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                          <div className="productss_orderr productss_orderr001">
                            <h5>Products</h5>
                            {/*TABLE AREA START*/}
                            <div className="table_01 table">
                              <div className="row amnt-tble">
                                <div className="cel_area amunt cess nw1">
                                  Product Info
                                </div>
                                <div className="cel_area amunt cess nw3">
                                  Unit Price
                                </div>
                                <div className="cel_area amunt cess nw4">
                                  Quantity
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Total
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Order Status
                                </div>
                                <div className="cel_area amunt cess nw6">
                                  &nbsp;
                                </div>
                              </div>
                              {/*table row-1*/}
                              {product && product.length > 0
                                ? product.map((item, index) => {
                                    return (
                                      <div
                                        className="row small_screen2"
                                        key={index}
                                      >
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big display_naa">
                                            Product Info
                                          </span>
                                          <span className="sm_size pprd_pic pprd_di">
                                            <div className="pprd_pic001 pprd_pic002">
                                              <img
                                                src={
                                                  item.get_product &&
                                                  item.get_product
                                                    .get_default_image
                                                    ? BASE_URL +
                                                      "/storage/app/public/product_images/" +
                                                      item.get_product
                                                        .get_default_image.image
                                                    : process.env.PUBLIC_URL +
                                                      "/images/pro_pick.png"
                                                }
                                                alt=""
                                              />
                                            </div>
                                            <div className="pprd_pic_txt">
                                              <h2>
                                                {item.get_product &&
                                                item.get_product.title
                                                  ? item.get_product.title
                                                  : null}
                                              </h2>
                                              <p>
                                                Seller:{" "}
                                                {item.get_product &&
                                                item.get_product.get_user &&
                                                item.get_product.get_user
                                                  .club_name
                                                  ? item.get_product.get_user
                                                      .club_name
                                                  : null}
                                              </p>
                                            </div>
                                          </span>
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Unit Price
                                          </span>
                                          <span className="sm_size">
                                            <img
                                              src={
                                                process.env.PUBLIC_URL +
                                                "/images/rupe.png"
                                              }
                                              alt=""
                                            />{" "}
                                            {item.unit_price_discounted !==
                                            "0.00"
                                              ? item.unit_price_discounted
                                              : item.unit_price_original}
                                          </span>
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Quantity
                                          </span>
                                          <span className="sm_size">
                                            {item.qty}
                                          </span>
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Total
                                          </span>
                                          <span className="sm_size">
                                            <img
                                              src={
                                                process.env.PUBLIC_URL +
                                                "/images/rupe.png"
                                              }
                                              alt=""
                                            />{" "}
                                            {item.total_price}
                                          </span>
                                        </div>

                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Status
                                          </span>
                                          {item.status ==="ICM" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#fecf6d" }}
                                            >
                                              Incomplete
                                            </span>
                                          ) : item.status ==="Dispatched" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#fecf6d" }}
                                            >
                                              Dispatched
                                            </span>
                                          ) : item.status ==="NW" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#99e9eb" }}
                                            >
                                              New Order
                                            </span>
                                          ) : item.status ==="INP" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#99e9eb" }}
                                            >
                                              In Progress
                                            </span>
                                          ) : item.status ==="OD" ? (
                                            <span className="sm_size clor_done">
                                              Delivered
                                            </span>
                                          ) : item.status ==="CM" ? (
                                            <span className="sm_size clor_done">
                                              Completed
                                            </span>
                                          ) : item.status ==="C" ? (
                                            <span className="sm_size clor_cancel">
                                              Cancelled
                                            </span>
                                          ) : null}
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Action
                                          </span>
                                          <ul>
                                            {!this.props.match.params.mid ? (
                                              <>
                                                {item.status ==="OD" ||item.status ==="CM" ? (
                                                  <li>
                                                    {item.avg_review ===
                                                    "0.00" ? (
                                                      <Link
                                                        to={`/post-review/${item.product_id}/${item.order_master_id}`}
                                                      >
                                                        <img
                                                          src={
                                                            process.env
                                                              .PUBLIC_URL +
                                                            "/images/write-review.png"
                                                          }
                                                          title="Post your review"
                                                          alt=""
                                                        />
                                                      </Link>
                                                    ) : (
                                                      <Link
                                                        to="#"
                                                        onClick={() =>
                                                          this.msg()
                                                        }
                                                      >
                                                        <img
                                                          src={
                                                            process.env
                                                              .PUBLIC_URL +
                                                            "/images/write-review.png"
                                                          }
                                                          title="Post your review"
                                                          alt=""
                                                        />
                                                      </Link>
                                                    )}
                                                  </li>
                                                ) : null}
                                                {item.status !=="C" &&
                                                item.status !=="OD" && item.status !=="CM"? (
                                                  <li>
                                                    <Link
                                                      to="#"
                                                      onClick={() =>
                                                        this.cancel(
                                                          item.product_id
                                                        )
                                                      }
                                                    >
                                                      <img
                                                        src={
                                                          process.env
                                                            .PUBLIC_URL +
                                                          "/images/delete-dash.png"
                                                        }
                                                        title="Cancel Order"
                                                        alt=""
                                                      />{" "}
                                                    </Link>
                                                  </li>
                                                ) : null}
                                              </>
                                            ) : (
                                              <>
                                              {item.status !=="OD" && item.status !=="CM" && item.status !=="C"?
                                                <li>
                                                  <Link to="#" 
                                                  data-toggle="modal"
                                                  data-target="#exampleModal"
                                                  onClick={()=>this.setState({id:item.product_id})}
                                                  >
                                                    <img
                                                      src={
                                                        process.env.PUBLIC_URL +
                                                        "/images/block.png"
                                                      }
                                                      title="Change Status"
                                                      alt=""
                                                    />
                                                  </Link>
                                                </li>
                                              :null}
                                              </>
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                            {/*TABLE AREA END*/}
                          </div>
                        </div>
                      </div>
                    ) : null}
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
                  Change Status  
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
                            <div className="iputBx inpt001 inpt0012">
                              <label style={{ color: "black" }}>Select a Status</label>
                              <Field as="select" name="status">
                                      <option value="">Select</option>
                                      <option value="INP">In Progress</option>
                                      <option value="Dispatched">Dispatched</option>
                                      <option value="CM">Completed</option>
                                      <option value="OD">Delivered</option>
                                      <option value="C">Canceled</option>
                                    </Field>
                              <ErrorMessage
                                name="status"
                                component={FieldError}
                              />
                            </div>
                            <input
                              type="submit"
                              value="Submit"
                              className="subbtn subbtn0012"
                            />
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
export default connect(null, mapDispatchToProps)(OrderDetails);
