import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import {
  UPDATE_LOADER,
  USER_IMAGE,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import { Rating } from "../../shared/Rating";
import * as moment from "moment";

class ViewClubPaymentDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | View Club Payment Details";
    this.getData();
  }
  getData = () => {
    let url = "view-details-membership-related-payments";
    let Id = this.props.match.params.id;
    this.props.onUpdateLoader(true);
    axios
      .post(url, {
        params: {
          membership_table_id: Id,
        },
      })
      .then((resp) => {
        // console.log("Details", resp);
        this.props.onUpdateLoader(false);
        if (resp.data.result && resp.data.result.MemberToSubscription) {
          this.setState({
            details: resp.data.result.MemberToSubscription,
          });
        }
      });
  };
  render() {
    const { details } = this.state;
    const joindate = dateFormat(details.created_at, "dd-mm-yyyy");
    const Memberfrom = moment().diff(joindate, "years", false);
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
                      View Club Payment Details{" "}
                      {details && details.get_club && details.get_club.club_name
                        ? "(" + details.get_club.club_name + ")"
                        : null}
                    </h1>
                    <div className="dasbordRightBody for_table_stc">
                      <div className="clubb_dtlls">
                        <buttton
                          className="back_btnn01 back_btnn_new01 back_btnn_new02"
                          onClick={() =>
                            this.props.history.push("/payment-details")
                          }
                        >
                          Back
                        </buttton>
                        <span>
                          <img
                            src={
                              details.get_club &&
                              details.get_club.profile_picture
                                ? USER_IMAGE + details.get_club.profile_picture
                                : process.env.PUBLIC_URL +
                                  "/images/pro_pick.png"
                            }
                            alt=""
                          />
                        </span>
                        {details ? (
                          <div className="clubb_dtls_infoo">
                            <h1>
                              {details.get_club && details.get_club.club_name
                                ? details.get_club.club_name
                                : null}
                            </h1>
                            <div className="rating_trainerss">
                              <div className="rating-start001">
                                <Rating
                                  rating={parseInt(
                                    details.get_user &&
                                      details.get_user.membership_avg_review
                                      ? details.get_user.membership_avg_review
                                      : 0
                                  )}
                                />
                                <p>
                                  {details.get_user &&
                                  details.get_user.membership_avg_review
                                    ? details.get_user.membership_avg_review
                                    : 0}
                                  (
                                  {details.get_user &&
                                  details.get_user
                                    .membership_total_no_of_reviews
                                    ? details.get_user
                                        .membership_total_no_of_reviews
                                    : 0}
                                  )
                                </p>
                              </div>
                            </div>
                            <h2>
                              Year of establishment :{" "}
                              {details.get_club &&
                              details.get_club.year_of_establishment
                                ? details.get_club.year_of_establishment
                                : null}
                            </h2>
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/price-tag-ash.png"
                                }
                                alt=""
                              />{" "}
                              {details.get_club &&
                              details.get_club.get_associated_category &&
                              details.get_club.get_associated_category.length >
                                0
                                ? details.get_club.get_associated_category.map(
                                    (item1, index1) => {
                                      return (
                                        <>
                                          {item1.get_category_details
                                            ? item1.get_category_details.name
                                            : null}
                                          {index1 ===
                                          details.get_club
                                            .get_associated_category.length -
                                            1
                                            ? null
                                            : ", "}
                                        </>
                                      );
                                    }
                                  )
                                : null}
                            </p>
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/location-icon.png"
                                }
                                alt=""
                              />
                              {details.get_club && details.get_club.address
                                ? details.get_club.address
                                : null}
                              ,{" "}
                              {details.get_club &&
                              details.get_club.user_city_details
                                ? details.get_club.user_city_details.city
                                : null}
                              ,{" "}
                              {details.get_club &&
                              details.get_club.user_state_details
                                ? details.get_club.user_state_details.name
                                : null}
                            </p>
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/images/phone.png"
                                }
                                alt=""
                              />
                              +91
                              {details.get_club && details.get_club.phone
                                ? details.get_club.phone
                                : null}
                            </p>
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/mail-icon.png"
                                }
                                alt=""
                              />
                              {details.get_club && details.get_club.email
                                ? details.get_club.email
                                : null}
                            </p>
                          </div>
                        ) : null}
                        <div className="clubb_dtls_personall">
                          <p>
                            <strong> Member from </strong>{" "}
                            <span className>
                              {" "}
                              {joindate ? joindate : null}
                              {Memberfrom > 0
                                ? " " + "(" + Memberfrom + " " + "Year" + ")"
                                : null}
                            </span>
                          </p>
                          <p>
                            <strong> Membership status </strong>{" "}
                            {details.is_subscribe ? (
                              <span className="green">
                                {" "}
                                <i className="fa fa-check" aria-hidden="true" />
                                Active
                              </span>
                            ) : (
                              <span>Inactive</span>
                            )}
                          </p>
                          <p>
                            <strong> Upcoming date of payment </strong>{" "}
                            <span className>
                              {" "}
                              {details.expire_date ? details.expire_date : null}
                            </span>
                          </p>
                          <p>
                            <strong> Amount </strong>{" "}
                            <span className>
                              {" "}
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/images/rupe.png"
                                }
                                alt=""
                              />{" "}
                              {details.get_payment
                                ? details.get_payment.amount
                                : null}{" "}
                              / per month
                            </span>
                          </p>
                        </div>
                      </div>
                      {/*TABLE AREA START*/}
                      <div className="productss_orderr dashboardd">
                        <h5 className="for_attendance">Payment Details</h5>
                        {details.get_payment ? (
                          <div className="table_01 table for_to">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw1">
                                Membership Paid on
                              </div>
                              <div className="cel_area amunt cess nw2">
                                Amount
                              </div>
                              <div className="cel_area amunt cess nw5">
                                Status
                              </div>
                            </div>
                            <div className="row small_screen2">
                              <div className="cel_area amunt-detail cess">
                                {" "}
                                <span className="hide_big">
                                  Membership Paid on
                                </span>{" "}
                                <span className="sm_size">
                                  {dateFormat(
                                    details.get_payment.created_at,
                                    "dd-mm-yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="cel_area amunt-detail cess">
                                {" "}
                                <span className="hide_big">Amount</span>{" "}
                                <span className="sm_size">
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/images/rupe.png"
                                    }
                                    alt=""
                                  />{" "}
                                  {details.get_payment.amount}
                                </span>{" "}
                              </div>
                              <div className="cel_area amunt-detail cess">
                                {" "}
                                <span className="hide_big">Status</span>
                                {details.get_payment.status === "S" ? (
                                  <span className="sm_size clor_done">
                                    Active
                                  </span>
                                ) : (
                                  <span className="sm_size clor_blue">
                                    Completed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                      {/*TABLE AREA END*/}
                    </div>
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
export default connect(null, mapDispatchToProps)(ViewClubPaymentDetails);
