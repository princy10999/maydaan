import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom/cjs/react-router-dom";
// import trainer_img_2 from "../../assets/images/trainer-img-2.png";
// import trainer_img_1 from "../../assets/images/trainer-img-1.png";
// import unblock from "../../assets/images/unblock.png";
// import block from "../../assets/images/block.png";
// import icon_new1 from "../../assets/images/icon_new1.png";
// import icon_new2 from "../../assets/images/icon_new2.png";
// import icon_new3 from "../../assets/images/icon_new3.png";
// import view from "../../assets/images/view.png";
// import rupe from "../../assets/images/rupe.png";
// import delete_dash from "../../assets/images/delete-dash.png";
import Message from "../Layout/Message";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import {
  UPDATE_LOADER,
  BASE_URL,
  UPDATE_SUCCESS,
  UPDATE_ERROR,
} from "../../store/action/actionTypes";
import swal from "sweetalert";

const profileImagePath = BASE_URL + "/storage/app/public/profile_pics/";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dashboard: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (this.props.user && this.props.user.type === "C") {
      document.title = "Maydaan | Club Dashboard";
    } else if (this.props.user && this.props.user.type === "T") {
      document.title = "Maydaan | Trainer Dashboard";
    }
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    axios.post("dashboard").then((resp) => {
      // console.log("...", resp);
      this.props.onUpdateLoader(false);
      if (resp.data.result) {
        this.setState({ dashboard: resp.data.result });
      }
    });
  };
  cancel = (id) => {
    var data = {
      params: {
        id: id,
      },
    };
    swal({
      text: "Are you sure you want to cancel this order?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onUpdateLoader(true);
        axios.post("cancelOrder", data).then((resp) => {
          this.props.onUpdateLoader(false);
          if (resp.data.result) {
            this.getData();
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (resp.data.error) {
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  status = (id) => {
    var data = {
      params: {
        id: id,
        status: "A",
      },
    };
    swal({
      text: "Are you sure you want to approve this member?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("change-status", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.getData();
          } else if (resp.data.error) {
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  render() {
    const { dashboard } = this.state;
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
                    <h1>Dashboard</h1>
                    {dashboard ? (
                      <div className="dasbordRightBody for_table_stc">
                        <Message />
                        <div className="infoo_dashboardd">
                          <span>
                            Hi,{" "}
                            {this.props.user
                              ? this.props.user.first_name
                              : null}
                          </span>
                          <p>Welcome to Maydaan.</p>
                        </div>
                        <div className="statics">
                          <div className="statics_box">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/members.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Total Members</h6>
                              <span>
                                {dashboard.tot_members
                                  ? dashboard.tot_members
                                  : "0"}
                              </span>
                            </div>
                          </div>
                          {this.props.user && this.props.user.type === "C" ? (
                            <div className="statics_box">
                              <strong>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/trainer.png"
                                  }
                                  alt=""
                                />
                              </strong>
                              <div className="media-body">
                                <h6>Total Trainers</h6>
                                <span>
                                  {dashboard.tot_trainers
                                    ? dashboard.tot_trainers
                                    : "0"}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          {this.props.user && this.props.user.type === "C" ? (
                            <div className="statics_box mr-0">
                              <strong>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/product.png"
                                  }
                                  alt=""
                                />
                              </strong>
                              <div className="media-body">
                                <h6>Products</h6>
                                <span>
                                  {dashboard.tot_products
                                    ? dashboard.tot_products
                                    : "0"}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          {this.props.user && this.props.user.type === "C" ? (
                            <div className="statics_box">
                              <strong>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/orders.png"
                                  }
                                  alt=""
                                />
                              </strong>
                              <div className="media-body">
                                <h6>Orders</h6>
                                <span>
                                  {dashboard.tot_orders
                                    ? dashboard.tot_orders
                                    : "0"}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          {this.props.user && this.props.user.type === "C" ? (
                            <div className="statics_box">
                              <strong>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/earning-product.png"
                                  }
                                  alt=""
                                />
                              </strong>
                              <div className="media-body">
                                <h6>Earnings from products</h6>
                                <span>
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/images/rupe.png"
                                    }
                                    alt=""
                                  />{" "}
                                  {dashboard.earnings_from_products
                                    ? dashboard.earnings_from_products
                                    : "0"}
                                </span>
                              </div>
                            </div>
                          ) : null}
                          <div className="statics_box mr-0">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/earning-member.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Earnings from membership</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />{" "}
                                {dashboard.earnings_from_membership
                                  ? dashboard.earnings_from_membership
                                  : "0"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {this.props.user && this.props.user.type === "C" ? (
                          <div className="productss_orderr dashboardd">
                            <h5>Recent Orders</h5>
                            {/*TABLE AREA START*/}
                            <div className="table_01 table">
                              <div className="row amnt-tble">
                                <div className="cel_area amunt cess nw1">
                                  Order Id
                                </div>
                                <div className="cel_area amunt cess nw2">
                                  Customer
                                </div>
                                <div className="cel_area amunt cess nw3">
                                  Ordered On
                                </div>
                                <div className="cel_area amunt cess nw4">
                                  Order Total
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Status
                                </div>
                                <div className="cel_area amunt cess nw6">
                                  &nbsp;
                                </div>
                              </div>
                              {/*table row-1*/}
                              {dashboard.recent_orders &&
                              dashboard.recent_orders.length > 0
                                ? dashboard.recent_orders.map((item, index) => {
                                    return (
                                      <div
                                        className="row small_screen2"
                                        key={index}
                                      >
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Order Id
                                          </span>{" "}
                                          <span className="sm_size">
                                            {item.order_number
                                              ? item.order_number
                                              : null}
                                          </span>
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Customer
                                          </span>{" "}
                                          <span className="sm_size">
                                            {item.get_user_details? item.get_user_details.first_name+" "+item.get_user_details.last_name:null}
                                          </span>
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Ordered On
                                          </span>{" "}
                                          <span className="sm_size">
                                            {dateFormat(
                                              item.created_at,
                                              "dd-mm-yyyy"
                                            )}
                                          </span>
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Order Total
                                          </span>{" "}
                                          <span className="sm_size">
                                            <img
                                              src={
                                                process.env.PUBLIC_URL +
                                                "/images/rupe.png"
                                              }
                                              alt=""
                                            />{" "}
                                            {item.get_order_seller &&
                                            item.get_order_seller[0]
                                              ? item.get_order_seller[0]
                                                  .total
                                              : null}
                                          </span>{" "}
                                        </div>
                                        <div className="cel_area amunt-detail cess">
                                          {" "}
                                          <span className="hide_big">
                                            Status
                                          </span>
                                          {item.get_order_seller[0].status == "ICM" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#fecf6d" }}
                                            >
                                              Incomplete
                                            </span>
                                          ) :item.get_order_seller[0].status == "Dispatched" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#fecf6d" }}
                                            >
                                              Dispatched
                                            </span>
                                          ) : item.get_order_seller[0].status == "NW" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#99e9eb" }}
                                            >
                                              New Order
                                            </span>
                                          )
                                          : item.get_order_seller[0].status == "INP" ? (
                                            <span
                                              className="sm_size"
                                              style={{ color: "#99e9eb" }}
                                            >
                                              In Progress
                                            </span>
                                          ) : item.get_order_seller[0].status == "OD" ? (
                                            <span className="sm_size clor_done">
                                              Delivered
                                            </span>
                                          ): item.get_order_seller[0].status == "CM" ? (
                                            <span className="sm_size clor_done">
                                              Completed
                                            </span>
                                          ) : item.get_order_seller[0].status == "C" ? (
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
                                            <li>
                                              <Link
                                                to={`/order-detail/${item.get_order_seller &&
                                                  item.get_order_seller[0]
                                                    ? item.get_order_seller[0].order_master_id:"#"}`}
                                              >
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/view.png"
                                                  }
                                                  title="View Order Details"
                                                  alt=""
                                                />
                                              </Link>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </div>
                        ) : null}
                        {this.props.user && this.props.user.type === "T" ? (
                          <div className="productss_orderr dashboardd">
                            <h5>Recently joined Members</h5>
                            <div className="table_01 table">
                              <div className="row amnt-tble">
                                <div className="cel_area amunt cess nw1">
                                  &nbsp;
                                </div>
                                <div className="cel_area amunt cess nw2">
                                  Name &amp; Contact
                                </div>
                                <div className="cel_area amunt cess nw3">
                                  Location
                                </div>
                                <div className="cel_area amunt cess nw4">
                                  Paid on
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Next due date
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Status
                                </div>
                                <div className="cel_area amunt cess nw6">
                                  &nbsp;
                                </div>
                              </div>
                              {/*table row-1*/}
                              {dashboard.recently_joined_members &&
                              dashboard.recently_joined_members.length > 0
                                ? dashboard.recently_joined_members.map(
                                    (item, index) => {
                                      return (
                                        <div className="row small_screen2" key={index}>
                                          <div className="cel_area amunt-detail cess">
                                            <span className="sm_size mmbr_pic">
                                              <img
                                                src={
                                                  item.get_member && item.get_member
                                                    .profile_picture !== null
                                                    ? profileImagePath +
                                                      item.get_member
                                                        .profile_picture
                                                    : process.env.PUBLIC_URL +
                                                      "/images/pro_pick.png"
                                                }
                                                alt=""
                                              />
                                            </span>
                                          </div>

                                          <div className="cel_area amunt-detail cess">
                                            {" "}
                                            <span className="hide_big">
                                              Name & Contact
                                            </span>{" "}
                                            <span className="sm_size">
                                              {item.get_member.first_name}{" "}
                                              {item.get_member.last_name}
                                              <strong>
                                                {item.get_member.phone}
                                              </strong>
                                            </span>
                                          </div>
                                          <div className="cel_area amunt-detail cess ">
                                            {" "}
                                            <span className="hide_big">
                                              Location
                                            </span>{" "}
                                            <span className="sm_size">
                                              {item.get_member
                                                .user_state_details
                                                ? item.get_member
                                                    .user_state_details.name
                                                : null}
                                            </span>
                                          </div>
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Paid on
                                              </span>{" "}
                                              <span className="sm_size">
                                                {item.get_subscription && item.get_subscription[0]
                                                  ? item.get_subscription[0]
                                                      .paid_on
                                                  : null}
                                              </span>{" "}
                                            </div>
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Next due date
                                              </span>
                                              <span className="sm_size">
                                                {item.get_subscription && item.get_subscription[0] 
                                                  ? item.get_subscription[0]
                                                      .expire_date
                                                  : null}
                                              </span>
                                            </div>
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Membership Status
                                              </span>
                                              {item.status==="A" ? (
                                                <span className="sm_size clor_done">
                                                  Active
                                                </span>
                                              ) : (
                                                <span className="sm_size clor_cancel">
                                                  Inactive
                                                </span>
                                              )}
                                            </div>
                                          <div className="cel_area amunt-detail cess">
                                            {" "}
                                            <span className="hide_big">
                                              Action
                                            </span>
                                            <ul>
                                              <li>
                                                <Link to={`our-member-details/${item.id}/DA/${item.trainer_id}`}>
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
                                              {/* <li><a href="#"><img src={process.env.PUBLIC_URL + "/images/block.png" alt="" title="block"/> </a></li> */}
                                            </ul>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )
                                : null}
                            </div>
                          </div>
                        ) : null}
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
