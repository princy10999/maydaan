import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { UPDATE_LOADER, BASE_URL } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";

class ViewProductPaymentDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      product: [],
      order: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | My Product Payment Details";
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    axios
      .post("orderDetails", {
        params: {
          id: this.props.match.params.id,
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
      });
  };
  render() {
    const { order, product } = this.state;
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
                      View Product Payment Details (of orderId:{" "}
                      {order && order.order_number ? order.order_number : null}{" "}
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
                                    this.props.history.push("/payment-details")
                                  }
                                >
                                  Back
                                </buttton>
                              </div>
                              <div className="dashbox_body tyaa width_120px">
                                <p>
                                  <strong> Order Id </strong>{" "}
                                  <span>
                                    {order.order_number
                                      ? order.order_number
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
                                    {order.total_item ? order.total_item : null}
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
                                    {order.total_after_discount
                                      ? order.total_after_discount
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
                                    {order.total_cancelled_amount
                                      ? order.total_cancelled_amount
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
                                    {order.payable_amount
                                      ? order.payable_amount
                                      : null}
                                  </span>
                                </p>
                              </div>
                              <div className="dashbox_body small_bbxx tyaa">
                                <p>
                                  <strong> Status </strong>{" "}
                                  {order && order.status == "ICM" ? (
                                    <span style={{ color: "#fecf6d" }}>
                                      {" "}
                                      Incomplete
                                    </span>
                                  ) : order && order.status == "Dispatched" ? (
                                    <span style={{ color: "#fecf6d" }}>
                                      {" "}
                                      Dispatched
                                    </span>
                                  ) : order && order.status == "NW" ? (
                                    <span style={{ color: "#99e9eb" }}>
                                      New Order
                                    </span>
                                  ) : order && order.status == "INP" ? (
                                    <span style={{ color: "#99e9eb" }}>
                                      In Progress
                                    </span>
                                  ) : order && order.status == "OD" ? (
                                    <span className="green">
                                      {" "}
                                      <i
                                        className="fa fa-check"
                                        aria-hidden="true"
                                      />{" "}
                                      Delivered
                                    </span>
                                  ) : order && order.status == "CM" ? (
                                    <span className="green">
                                      {" "}
                                      <i
                                        className="fa fa-check"
                                        aria-hidden="true"
                                      />{" "}
                                      Completed
                                    </span>
                                  ) : order && order.status == "C" ? (
                                    <span className="red">Cancelled</span>
                                  ) : null}
                                </p>
                                <p>
                                  <strong> Payment mode</strong>{" "}
                                  <span>
                                    {order && order.payment_method === "C"
                                      ? "Cash on Delivary"
                                      : "Online"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="productss_orderr productss_orderr001">
                            <h5>Products</h5>
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
                              </div>
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
                                          {item.status == "ICM" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#fecf6d" }}
                                            >
                                              Incomplete
                                            </span>
                                          ) : item.status == "Dispatched" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#fecf6d" }}
                                            >
                                              Dispatched
                                            </span>
                                          ) : item.status == "NW" ? (
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
                                          ) : item.status == "OD" ? (
                                            <span className="sm_size clor_done">
                                              Delivered
                                            </span>
                                          ) : item.status == "CM" ? (
                                            <span className="sm_size clor_done">
                                              Completed
                                            </span>
                                          ) : item.status == "C" ? (
                                            <span className="sm_size clor_cancel">
                                              Cancelled
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
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
      </Layout>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(ViewProductPaymentDetails);
