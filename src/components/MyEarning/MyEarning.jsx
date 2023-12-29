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
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class MyEarning extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      earning: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | My Earning";
    this.props.onUpdateLoader(true);
    axios.post("club-my-earning").then((resp) => {
      // console.log("earning", resp);
      this.props.onUpdateLoader(false);
      if (resp.data.result) {
        this.setState({ earning: resp.data.result });
      }
    });
  }
  render() {
    const { earning } = this.state;
    return (
      <>
       <Helmet>
        <title>{Titles?.myEarning?.title}</title>
        <meta
            name="description"
            content={Titles?.myEarning?.description}
        />
        <meta property="og:title" content={Titles?.myEarning?.ogTitle} />
        <meta property="og:description" content={Titles?.myEarning?.ogDescription} />
        <meta property="og:image" content={Titles?.myEarning?.ogImage} />
        <link rel="canonical" href={Titles?.myEarning?.link} />
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
                    <h1>My Earning</h1>
                    <div className="dasbordRightBody for_table_stc">
                      <div className="infoo_dashboardd">
                        <div className="statics mt-0">
                          <div className="statics_box">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/gross-earning.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Gross Earning</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {earning.gross_earning
                                  ? earning.gross_earning
                                  : "0"}
                              </span>
                            </div>
                          </div>
                          <div className="statics_box">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/commission.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Commission</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {earning.commission ? earning.commission : "0"}
                              </span>
                            </div>
                          </div>
                          <div className="statics_box mr-0">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/net-earning.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Net Earning</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {earning.net_earning
                                  ? earning.net_earning
                                  : "0"}
                              </span>
                            </div>
                          </div>
                          <div className="statics_box">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/withdrawl.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Withdrawal</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {earning.withdrawl ? earning.withdrawl : "0"}
                              </span>
                            </div>
                          </div>
                          <div className="statics_box">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/pending-amount.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Pending Amount</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {earning.pending_amount
                                  ? earning.pending_amount
                                  : "0"}
                              </span>
                            </div>
                          </div>
                          <div className="statics_box mr-0">
                            <strong>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/available-balance.png"
                                }
                                alt=""
                              />
                            </strong>
                            <div className="media-body">
                              <h6>Available Balance</h6>
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {earning.available_balance
                                  ? earning.available_balance
                                  : "0"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {this.props.user && this.props.user.type !== "T" ? (
                          <div className="productss_orderr dashboardd mbii">
                            <h5>Earning from product selling</h5>
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
                              </div>
                              {/*table row-1*/}
                              {earning.earning_from_product_selling &&
                              earning.earning_from_product_selling.length > 0
                                ? earning.earning_from_product_selling.map(
                                    (item, index) => {
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
                                                ? item.order_master
                                                    .get_user_details
                                                    .first_name +
                                                  " " +
                                                  item.order_master
                                                    .get_user_details.last_name
                                                : null}
                                            </span>
                                          </div>
                                          <div className="cel_area amunt-detail cess">
                                            {" "}
                                            <span className="hide_big">
                                              Date
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
                                              Price
                                            </span>{" "}
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
                                            <span className="hide_big">
                                              Commision
                                            </span>
                                            <span className="sm_size clor_done">
                                              <img
                                                src={
                                                  process.env.PUBLIC_URL +
                                                  "/images/rupe.png"
                                                }
                                                alt=""
                                              />
                                              {item.commission
                                                ? item.commission
                                                : "0"}
                                            </span>
                                          </div>
                                          <div className="cel_area amunt-detail cess">
                                            {" "}
                                            <span className="hide_big">
                                              Net Earning
                                            </span>
                                            <span className="sm_size clor_done">
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
                                        </div>
                                      );
                                    }
                                  )
                                : null}
                            </div>
                            {/*TABLE AREA END*/}
                            {earning.earning_from_product_selling &&
                            earning.earning_from_product_selling.length > 0 ? (
                              <Link
                                to="/my-earning-from-product"
                                className="erng_all"
                              >
                                View All
                              </Link>
                            ) : null}
                          </div>
                        ) : null}
                        <div className="productss_orderr dashboardd">
                          <h5>Earning from membership</h5>
                          {/*TABLE AREA START*/}
                          <div className="table_01 table">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw2">
                                Member
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Membership Paid on
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
                            </div>
                            {/*table row-1*/}
                            {earning.users && earning.users.length > 0
                              ? earning.users.map((item, index) => {
                                  return (
                                    <div
                                      className="row small_screen2"
                                      key={index}
                                    >
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Member
                                        </span>{" "}
                                        <span className="sm_size">
                                          {" "}
                                          {item.get_member
                                            ? item.get_member.first_name +
                                              " " +
                                              item.get_member.last_name
                                            : null}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Membership Paid on
                                        </span>{" "}
                                        <span className="sm_size">
                                          {dateFormat(
                                            item.paid_on,
                                            "dd-mm-yyyy"
                                          )}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Fees
                                        </span>{" "}
                                        <span className="sm_size">
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/images/rupe.png"
                                            }
                                            alt=""
                                          />{" "}
                                          {item.get_payment
                                            ? item.get_payment.amount
                                            : null}
                                        </span>{" "}
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Commision
                                        </span>
                                        <span className="sm_size clor_done">
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
                                        <span className="sm_size clor_done">
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
                                    </div>
                                  );
                                })
                              : null}
                          </div>
                          {/*TABLE AREA END*/}
                          {earning.users && earning.users.length > 0 ? (
                            <Link
                              to="/my-earning-from-membership"
                              className="erng_all"
                            >
                              View All
                            </Link>
                          ) : null}
                        </div>
                      </div>
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyEarning);
