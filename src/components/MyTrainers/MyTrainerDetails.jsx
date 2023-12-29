import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
import { Rating } from "../../shared/Rating";
import axios from "../../shared/axios";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { USER_IMAGE } from "../../store/action/actionTypes";
import * as moment from "moment";
import swal from "sweetalert";

class MyTrainerDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      details: [],
      users: [],
      member_from: "",
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | My Trainer Details";
    this.getData();
    // console.log(">>>",this.props.match.params);
  }
  getData = () => {
    var data = {
      params: {
        id: this.props.match.params.id,
        offset: this.state.offset,
        page_type: "",
        view_as:"given",
        member_id:this.props.match.params.member_id,
      },
    };
    if(this.props.user.type==="T"){
      data = {
        params: {
          id: this.props.match.params.id,
          offset: this.state.offset,
          page_type: "B",
          view_as:"given",
          member_id:this.props.match.params.member_id
        },
      };
    }
    if(this.props.match.params.type=="A"){
      data = {
        params: {
          id: this.props.match.params.id,
          offset: this.state.offset,
          page_type: "A",
          view_as:"given",
          member_id:this.props.match.params.member_id
        },
      };

    }
    this.props.onUpdateLoader(true);
    axios.post("view-trainer-to-member-details", data).then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("TDetails", res);
      if (res.data.result && res.data.result.details) {
        this.setState({
          page_count: res.data.result.details.page_count,
          per_page: res.data.result.details.per_page,
          total: res.data.result.details.total,
          details: res.data.result.details,
          member_from: res.data.result.created_at,
          payment: res.data.result.details.get_subscription,
          subscription: res.data.result.MemberToSubscription,
          review:res.data.result.is_review_done
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
  msg = () => {
    swal(this.state.details && this.state.details.status==="AA"?"You are not approved by the club!":"You have already rated this trainer!", {
      icon: "warning",
    });
  };
  render() {
    const { details, member_from, subscription, payment,review } = this.state;
    const joindate = moment(member_from, "YYYY-MM-DD");
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
                      My Trainer Details (
                      {details.get_trainer &&
                      details.get_trainer.first_name &&
                      details.get_trainer.last_name
                        ? details.get_trainer.first_name +
                          " " +
                          details.get_trainer.last_name
                        : null}
                      )
                    </h1>
                    <div className="dasbordRightBody for_table_stc">
                      {details ? (
                        <div className="clubb_dtlls">
                          <buttton
                            className="back_btnn01 back_btnn_new01 back_btnn_new02"
                            onClick={() =>
                              this.props.history.push("/my-trainers")
                            }
                          >
                            Back
                          </buttton>
                          <span>
                            <img
                              className="club-logo"
                              src={
                                details.get_trainer &&
                                details.get_trainer.profile_picture !== null
                                  ? USER_IMAGE +
                                    details.get_trainer.profile_picture
                                  :(process.env.PUBLIC_URL + "/images/pro_pick.png")
                              }
                              alt=""
                            />
                          </span>
                          <div className="clubb_dtls_infoo">
                            <h1>
                              {details.get_trainer &&
                              details.get_trainer.first_name &&
                              details.get_trainer.last_name
                                ? details.get_trainer.first_name +
                                  " " +
                                  details.get_trainer.last_name
                                : null}
                            </h1>
                            <div className="rating_trainerss">
                            <div className="rating-start001">
                                <Rating
                                  rating={parseInt(
                                    details.get_trainer && details.get_trainer.membership_avg_review ? details.get_trainer.membership_avg_review : 0
                                  )}
                                />
                                <p>
                                {details.get_trainer &&
                                details.get_trainer.membership_avg_review
                                  ? details.get_trainer.membership_avg_review
                                  : null}
                                (
                                {details.get_trainer &&
                                details.get_trainer.membership_total_no_of_reviews
                                  ? details.get_trainer.membership_total_no_of_reviews
                                  : null}
                                )
                              </p>
                              </div>
                      
                            </div>
                            <p>
                              <img src={process.env.PUBLIC_URL +"/images/price-tag-ash.png"} alt="" />{" "}
                              {details.get_trainer &&
                              details.get_trainer.get_associated_category &&
                              details.get_trainer.get_associated_category
                                .length > 0 &&
                              details.get_trainer.get_associated_category[0] &&details.get_trainer.get_associated_category[0]
                                .get_category_details
                                ? details.get_trainer.get_associated_category[0]
                                    .get_category_details.name
                                : null}
                            </p>
                            <p>
                              <img src={process.env.PUBLIC_URL +"/images/location-icon.png"} alt="" />
                              {details.get_trainer &&
                              details.get_trainer.address
                                ? details.get_trainer.address
                                : null}
                              ,{" "}
                              {details.get_trainer &&
                              details.get_trainer.user_city_details
                                ? details.get_trainer.user_city_details.city
                                : null}
                              ,{" "}
                              {details.get_trainer &&
                              details.get_trainer.user_state_details
                                ? details.get_trainer.user_state_details.name
                                : null}
                            </p>
                            {details.get_trainer &&
                            details.get_trainer.phone ? (
                              <p>
                                <img src={process.env.PUBLIC_URL +"/images/phone.png"} alt="" />
                                +91
                                {details.get_trainer.phone
                                  ? details.get_trainer.phone
                                  : null}
                              </p>
                            ) : (
                              <p>&nbsp;</p>
                            )}
                            {details.get_trainer &&
                            details.get_trainer.email ? (
                              <p>
                                <img src={process.env.PUBLIC_URL +"/images/mail-icon.png"} alt="" />
                                {details.get_trainer.email
                                  ? details.get_trainer.email
                                  : null}
                              </p>
                            ) : (
                              <p>&nbsp;</p>
                            )}
                          </div>
                          <div className="clubb_dtls_personall">
                            <p className={details && details.status==="AA" ? "l-a-fix":""}>
                              <strong> Traning from </strong>{" "}
                              <span className>
                                {member_from ? member_from : null}
                                {Memberfrom > 0
                                  ? " " + "(" + Memberfrom + " " + "Year" + ")"
                                  : null}
                              </span>
                            </p>
                            <p className={details && details.status==="AA" ? "l-a-fix":""}>
                              <strong> Membership status </strong>{" "}
                              {subscription && subscription.is_subscribe ? (
                                <span className="green">
                                  {" "}
                                  <i
                                    className="fa fa-check"
                                    aria-hidden="true"
                                  />
                                  Active
                                </span>
                              ) : (
                                <span>Inactive</span>
                              )}
                            </p >
                            {details && details.status==="AA" ? (
                            <p className="l-a-fix">
                              <strong> Status </strong>{" "}
                                <span style={{color:"#f0a80c"}}>
                                  Awaiting Approval
                                </span>
                            </p>
                            ):null}
                            <p className={details && details.status==="AA" ? "l-a-fix":""}>
                              <strong> Upcoming date of payment </strong>{" "}
                              <span className>
                                {" "}
                                {subscription && subscription.expire_date
                                  ? subscription.expire_date
                                  : null}
                              </span>
                            </p>
                            <p className={details && details.status==="AA" ? "l-a-fix":""}>
                              <strong> Amount </strong>{" "}
                                <span className>
                                  {" "}
                                  <img src={process.env.PUBLIC_URL +"/images/rupe.png"} alt="" />{" "}
                                  { subscription && subscription.get_payment &&
                                  subscription.get_payment.amount
                                    ? subscription.get_payment.amount
                                    : null}{" "}
                                  / month
                                </span>
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {/*TABLE AREA START*/}
                      <div className="productss_orderr dashboardd">
                        <div className="attandance-rvw">
                        <h5 className="for_attendance">Payment Details</h5>
                        <div className="rvw-btn-0012">
                        <>
                        {review && review!=="Y" && details.status!=="AA"?
                        <Link
                            to={`/post-my-review/${this.props.match.params.id}/${this.props.match.params.type}/${this.props.match.params.member_id}`}
                            className="attendance"
                          >
                            <i
                              className="fa fa-thumbs-up"
                              aria-hidden="true"
                              style={{ marginRight: "8px" }}
                            />
                            Post Review
                          </Link>
                          :
                          <Link
                            to="#"
                            className="attendance"
                            onClick={() => this.msg()}
                          >
                            <i
                              className="fa fa-thumbs-up"
                              aria-hidden="true"
                              style={{ marginRight: "8px" }}
                            />
                            Post Review
                          </Link>
                          }
                          </>
                        <Link
                          to={`/my-attendance/${
                            details.get_trainer ? details.get_trainer.id : "0"
                          }/${this.props.match.params.id}/${this.props.match.params.type}/${this.props.match.params.member_id}`}
                          className="attendance att001"
                        >
                          Check Attendance
                        </Link>
                        </div>
                        </div>
                        {payment && payment.length > 0 ? (
                          <div className="table_01 table for_to">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw1">
                                Paid on
                              </div>
                              <div className="cel_area amunt cess nw2">
                                Amount
                              </div>
                              <div className="cel_area amunt cess nw5">
                                Status
                              </div>
                            </div>
                            {/*table row-1*/}
                            {payment.map((item, index) => {
                              return (
                                <div className="row small_screen2" key={index}>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Paid on
                                    </span>{" "}
                                    <span className="sm_size">
                                      {item.paid_on}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Amount
                                    </span>{" "}
                                    <span className="sm_size">
                                      <img src={process.env.PUBLIC_URL +"/images/rupe.png"} alt="" />{" "}
                                      {item.get_payment
                                        ? item.get_payment.amount
                                        : null}
                                    </span>{" "}
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Status</span>
                                    {item.is_subscribe === "Y" ? (
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
                              );
                            })}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {this.state.page_count > 1 ? (
                  <div className="pag_red">
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
                              <img src={process.env.PUBLIC_URL +"/images/pagleft.png"} alt="" className="dpb" />
                              <img src={process.env.PUBLIC_URL +"/images/paglefthov.png"} alt="" className="dpn" />
                            </>
                          }
                          nextLabel={
                            <>
                              <img src={process.env.PUBLIC_URL +"/images/pagright.png"} alt="" className="dpb" />
                              <img src={process.env.PUBLIC_URL +"/images/pagrightho.png"} alt="" className="dpn" />
                            </>
                          }
                          marginPagesDisplayed={1}
                          renderOnZeroPageCount={null}
                        />
                    </div>
                  </div>
                  ) : null}
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
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MyTrainerDetails);
