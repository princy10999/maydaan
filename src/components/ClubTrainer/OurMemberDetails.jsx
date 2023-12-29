import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  USER_IMAGE,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import * as moment from "moment";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";

class OurMemberDetails extends Component {
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
      subscription: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    document.title = "Maydaan | Club Member Details";
    var url = "view-associated-club-details";
    var data = {
      params: {
        id: this.props.match.params.id,
        offset: this.state.offset,
        view_as:"received",
        club_id:this.props.match.params.club_id
      },
    };
    if (this.props.match.params.mId) {
      document.title = "Maydaan | Member Details";
      data = {
        params: {
          id: this.props.match.params.id,
          page_type: "",
          offset: this.state.offset,
          view_as:"received",
          trainer_id:this.props.match.params.user_id
        },
      };
      url = "view-trainer-to-member-details";
    }
    if (this.props.match.params.tmId) {
      document.title = "Maydaan | Our Member Details";
      if(this.props.match.params.type=="DA"){
        data = {
          params: {
            id: this.props.match.params.tmId,
            page_type: "DA",
            offset: this.state.offset,
            view_as:"received",
            trainer_id:this.props.match.params.user_id
          },
        };
      }else{
      data = {
        params: {
          id: this.props.match.params.tmId,
          page_type: "",
          offset: this.state.offset,
          view_as:"received",
          trainer_id:this.props.match.params.user_id
        },
      };}
      url = "view-trainer-to-member-details";
    }
    this.props.onUpdateLoader(true);
    axios.post(url, data).then((res) => {
      this.props.onUpdateLoader(false);
    //   console.log("MDetails", res);
      if (res.data.result && res.data.result.details) {
        this.setState({
          page_count: res.data.result.details.page_count,
          per_page: res.data.result.details.per_page,
          total: res.data.result.details.total,
          details: res.data.result.details,
          member_from: res.data.result.member_from,
          subscription: res.data.result.MemberToSubscription,
        });
        if (this.props.match.params.mId || this.props.match.params.tmId) {
          this.setState({ member_from: res.data.result.created_at });
        }
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
    const { details, member_from, subscription } = this.state;
    const joindate = dateFormat(member_from, "dd-mm-yyyy");
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
                      {this.props.match.params.mId
                        ? "Member Details "
                        : this.props.match.params.tmId
                        ? "Our Member Details "
                        : " Club Member Details "}
                      {details &&
                      details.get_member &&
                      details.get_member.first_name &&
                      details.get_member.last_name
                        ? "(" +
                          details.get_member.first_name +
                          " " +
                          details.get_member.last_name +
                          ")"
                        : null}
                    </h1>
                    {details ? (
                      <div className="dasbordRightBody for_table_stc">
                        <div className="clubb_dtlls">
                          <buttton
                            className="back_btnn01 back_btnn_new01 back_btnn_new02"
                            onClick={() =>
                              this.props.history.push(
                                this.props.match.params.mId
                                  ? `/view-members/${this.props.match.params.mId}`
                                  : this.props.match.params.tmId
                                  ? "/our-members"
                                  : "/club-members"
                              )
                            }
                          >
                            Back
                          </buttton>
                          <span>
                            <img
                              className="club-logo"
                              src={
                                details.get_member &&
                                details.get_member.profile_picture
                                  ? USER_IMAGE +
                                    details.get_member.profile_picture
                                  : process.env.PUBLIC_URL +
                                    "/images/pro_pick.png"
                              }
                              alt=""
                            />
                          </span>
                          <div className="clubb_dtls_infoo">
                            <h1>
                              {details.get_member &&
                              details.get_member.first_name &&
                              details.get_member.last_name
                                ? details.get_member.first_name +
                                  " " +
                                  details.get_member.last_name
                                : null}
                            </h1>
                            {/* <p><img src="images/price-tag-ash.png" alt="" /> Football</p> */}
                            {details.get_member && details.get_member.address && details.get_member.user_city_details &&details.get_member.user_state_details
                            ? 
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/location-icon.png"
                                }
                                alt=""
                              />
                             {details.get_member.address}
                              ,{" "}
                              {details.get_member.user_city_details.city}
                              ,{" "}
                              {details.get_member.user_state_details.name}
                            </p>
                            :null}
                            {details.get_member && details.get_member.phone?
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/images/phone.png"
                                }
                                alt=""
                              />
                              +91{details.get_member.phone}
                            </p>
                             : null}
                             {details.get_member && details.get_member.email?
                            <p>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/mail-icon.png"
                                }
                                alt=""
                              />
                              {details.get_member.email}
                            </p>
                              : null}
                          </div>
                          <div className="clubb_dtls_personall">
                            <p>
                              <strong> Member from </strong>{" "}
                              <span className>
                                {" "}
                                {member_from ? member_from : null}
                                {Memberfrom > 0
                                  ? " " + "(" + Memberfrom + " " + "Year" + ")"
                                  : null}
                              </span>
                            </p>
                            <p>
                              <strong> Membership status </strong>{" "}
                              {this.props.match.params.mId ||
                              this.props.match.params.tmId ? (
                                <>
                                  {subscription &&
                                  subscription.is_subscribe === "Y" ? (
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
                                </>
                              ) : (
                                <>
                                  {details.is_subscribe === "Y" ? (
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
                                </>
                              )}
                            </p>
                            <p>
                              <strong> Upcoming date of payment </strong>{" "}
                              <span className>
                                {this.props.match.params.mId ||
                                this.props.match.params.tmId ? (
                                  <>
                                    {subscription && subscription.expire_date
                                      ? subscription.expire_date
                                      : null}
                                  </>
                                ) : (
                                  <>
                                    {details.expire_date
                                      ? details.expire_date
                                      : null}
                                  </>
                                )}
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
                                />
                                {this.props.match.params.mId ||
                                this.props.match.params.tmId ? (
                                  <>
                                    {subscription.get_payment
                                      ? subscription.get_payment.amount
                                      : null}{" "}
                                    / month
                                  </>
                                ) : (
                                  <>
                                    {details.get_payment
                                      ? details.get_payment.amount
                                      : null}{" "}
                                    / month
                                  </>
                                )}
                              </span>
                            </p>
                          </div>
                        </div>
                        {/*TABLE AREA START*/}
                        <div className="productss_orderr dashboardd">
                          <h5 className="for_attendance">Payment Details</h5>
                          {/* <a href="user_check_attendance.html" className="attendance">Check Attendance</a> */}
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
                            {this.props.match.params.mId ||
                            this.props.match.params.tmId ? (
                              <>
                                {details.get_subscription &&
                                details.get_subscription.length > 0
                                  ? details.get_subscription.map(
                                      (item, index) => {
                                        return (
                                          <div
                                            className="row small_screen2"
                                            key={index}
                                          >
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Paid on
                                              </span>{" "}
                                              <span className="sm_size">
                                                {dateFormat(
                                                  item.get_payment.created_at,
                                                  "dd-mm-yyyy"
                                                )}
                                              </span>
                                            </div>
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Amount
                                              </span>{" "}
                                              <span className="sm_size">
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/rupe.png"
                                                  }
                                                  alt=""
                                                />
                                                {item.get_payment.amount}
                                              </span>{" "}
                                            </div>
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Status
                                              </span>
                                              <span className="sm_size clor_done">
                                                {item.is_subscribe === "Y" ? (
                                                  <span className="sm_size clor_done">
                                                    Active
                                                  </span>
                                                ) : (
                                                  <span className="sm_size clor_blue">
                                                    Completed
                                                  </span>
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )
                                  : null}
                              </>
                            ) : (
                              <>
                                {details.get_payment_details &&
                                details.get_payment_details.length > 0
                                  ? details.get_payment_details.map(
                                      (item, index) => {
                                        return (
                                          <div
                                            className="row small_screen2"
                                            key={index}
                                          >
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Paid on
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
                                                Amount
                                              </span>{" "}
                                              <span className="sm_size">
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/rupe.png"
                                                  }
                                                  alt=""
                                                />
                                                {item.amount}
                                              </span>{" "}
                                            </div>
                                            <div className="cel_area amunt-detail cess">
                                              {" "}
                                              <span className="hide_big">
                                                Status
                                              </span>
                                              <span className="sm_size clor_done">
                                                {item.status &&
                                                item.status === "S" ? (
                                                  <span className="sm_size clor_done">
                                                    Active
                                                  </span>
                                                ) : (
                                                  <span className="sm_size clor_blue">
                                                    Completed
                                                  </span>
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    )
                                  : null}
                              </>
                            )}
                          </div>
                        </div>
                        {/*TABLE AREA END*/}
                      </div>
                    ) : null}
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
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/images/pagleft.png"
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
export default connect(mapStateToProps, mapDispatchToProps)(OurMemberDetails);
