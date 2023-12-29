import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  BASE_URL,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";

class ViewMyEarningFromProduct extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      product: [],
      order: [],
      pStatus: "",
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | View My Earning From Product";
    this.props.onUpdateLoader(true);
    axios
      .post("view-details-all-club-earning-product-selling", {
        params: {
          order_master_id: this.props.match.params.id,
        },
      })
      .then((resp) => {
        // console.log("view", resp);
        this.props.onUpdateLoader(false);
        if (resp.data.result && resp.data.result.earning_from_product_selling) {
          this.setState({
            order: resp.data.result.earning_from_product_selling,
            pStatus: resp.data.result.payment_status,
          });
        }
        if (
          resp.data.result &&
          resp.data.result.earning_from_product_selling &&
          resp.data.result.earning_from_product_selling.order_master &&
          resp.data.result.earning_from_product_selling.order_master
            .get_order_details
        ) {
          this.setState({
            product:
              resp.data.result.earning_from_product_selling.order_master
                .get_order_details,
          });
        }
      });
  }
  render() {
    const { order, product, pStatus } = this.state;
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
                  <div className="dasbordRightlink ">
                    <h1>
                      View My Earning from Product (of orderId{" "}
                      {order.order_master && order.order_master.order_number
                        ? order.order_master.order_number
                        : null}
                      )
                    </h1>
                    {order ? (
                      <div className="dasbordRightBody pb-3">
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
                                      "/my-earning-from-product"
                                    )
                                  }
                                >
                                  Back
                                </buttton>
                              </div>
                              <div className="dashbox_body tyaa">
                                <p>
                                  <strong> Order Id </strong>{" "}
                                  <span>
                                    :{" "}
                                    {order.order_master &&
                                    order.order_master.order_number
                                      ? order.order_master.order_number
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong> Order on </strong>{" "}
                                  <span>
                                    :{" "}
                                    {dateFormat(order.created_at, "dd-mm-yyyy")}
                                  </span>
                                </p>
                                <p>
                                  <strong> Item </strong>{" "}
                                  <span>
                                    :{" "}
                                    {order.order_master &&
                                    order.order_master.total_item
                                      ? order.order_master.total_item
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong> Order Total </strong>{" "}
                                  <span>
                                    :{" "}
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupe.png"
                                      }
                                      alt=""
                                    />{" "}
                                    {order.total ? order.total : null}
                                  </span>
                                </p>
                              </div>
                              <div className="dashbox_body small_bbxx tyaa">
                                <p>
                                  <strong> Customer Name:</strong>{" "}
                                  <span>
                                    {" "}
                                    {order.order_master &&
                                    order.order_master.get_user_details
                                      ? order.order_master.get_user_details
                                          .first_name +
                                        " " +
                                        order.order_master.get_user_details
                                          .last_name
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong> Status:</strong>
                                  {order.order_master &&
                                  order.order_master.status == "ICM" ? (
                                    <span style={{ color: "#fecf6d" }}>
                                      {" "}
                                      Incomplete
                                    </span>
                                  ):order.order_master &&
                                  order.order_master.status == "Dispatched" ? (
                                    <span style={{ color: "#fecf6d" }}>
                                      {" "}
                                      Dispatched
                                    </span>
                                  ) : order.order_master &&
                                    order.order_master.status == "NW" ? (
                                    <span style={{ color: "#99e9eb" }}>
                                      New Order
                                    </span>
                                  ): order.order_master &&
                                  order.order_master.status == "INP" ? (
                                  <span style={{ color: "#99e9eb" }}>
                                    In Progress
                                  </span>
                                ) : order.order_master &&
                                    order.order_master.status == "OD" ? (
                                    <span className="green">
                                      {" "}
                                      <i
                                        className="fa fa-check"
                                        aria-hidden="true"
                                      />{" "}
                                      Delivered
                                    </span>
                                  ) : order.order_master &&
                                  order.order_master.status == "CM" ? (
                                  <span className="green">
                                    {" "}
                                    <i
                                      className="fa fa-check"
                                      aria-hidden="true"
                                    />{" "}
                                    Completed
                                  </span>
                                ) : order.order_master &&
                                    order.order_master.status == "C" ? (
                                    <span className="red">Cancelled</span>
                                  ) : null}
                                </p>
                                <p>
                                  <strong> Payment mode:</strong>{" "}
                                  <span>
                                    {order.order_master &&
                                    order.order_master.payment_method === "C"
                                      ? "Cash on Delivary"
                                      : "Online"}
                                  </span>
                                </p>
                                <p>
                                  <strong> Payment Status:</strong>{" "}
                                  <span>
                                    {pStatus && pStatus === "S"
                                      ? "Paid"
                                      : pStatus === "I"
                                      ? "Initiated"
                                      : pStatus === "F"
                                      ? "Failed"
                                      : null}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="productss_orderr">
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
                                                {" "}
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
                                            />
                                            {item.total_price}
                                          </span>
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
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(ViewMyEarningFromProduct);
