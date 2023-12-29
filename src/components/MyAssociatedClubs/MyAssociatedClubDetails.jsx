import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import club_logo_1 from "../../assets/images/club-logo-1.png";
// import price_tag_ash from "../../assets/images/price-tag-ash.png";
// import location_icon from "../../assets/images/location-icon.png";
// import phone from "../../assets/images/phone.png";
// import mail_icon from "../../assets/images/mail-icon.png";
// import rupe from "../../assets/images/rupe.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import pro_pick from "../../assets/images/pro_pick.png";
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
import { Link } from "react-router-dom";
import swal from "sweetalert";
import { Rating } from "../../shared/Rating";

class MyAssociatedClubDetails extends Component {
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
      review:""
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | My Associated Club Details";
    this.getData();
  }
  getData = () => {
    var data = {
      params: {
        id: this.props.match.params.id,
        offset: this.state.offset,
        view_as:"given",
        member_id:this.props.match.params.member_id
      },
    };
    this.props.onUpdateLoader(true);
    axios.post("view-associated-club-details", data).then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("CDetails", res);
      if (res.data.result && res.data.result.details) {
        this.setState({
          page_count: res.data.result.details.page_count,
          per_page: res.data.result.details.per_page,
          total: res.data.result.details.total,
          details: res.data.result.details,
          member_from: res.data.result.member_from,
          users: res.data.result.users,
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
    swal("You have already rated this club!", {
      icon: "warning",
    });
  };
  render() {
    const { details, member_from, users ,review} = this.state;
    const joindate = moment(member_from, "YYYY-MM-DD");
    const Memberfrom = moment().diff(joindate, "years", false);
    // console.log("...",review);
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
                      My Associated Club Details{" "}
                      {details && details.get_club && details.get_club.club_name
                        ? "(" + details.get_club.club_name + ")"
                        : null}
                    </h1>
                    <div className="dasbordRightBody for_table_stc">
                      <div className="clubb_dtlls">
                        <buttton
                          className="back_btnn01 back_btnn_new01 back_btnn_new02"
                          onClick={() =>
                            this.props.history.push("/my-associated-clubs")
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
                                    details.get_user && details.get_user.membership_avg_review ? details.get_user.membership_avg_review : 0
                                  )}
                                />
                                <p>
                              {details.get_user && details.get_user.membership_avg_review ? details.get_user.membership_avg_review : 0}(
                              {details.get_user && details.get_user.membership_total_no_of_reviews
                                ? details.get_user.membership_total_no_of_reviews
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
                              {member_from ? member_from : null}
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
                        {review==="Y" ? (
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
                        ) : (
                          <Link
                            to={`/post-your-review/${this.props.match.params.id}/${this.props.match.params.member_id}`}
                            className="attendance"
                          >
                            <i
                              className="fa fa-thumbs-up"
                              aria-hidden="true"
                              style={{ marginRight: "8px" }}
                            />
                            Post Review
                          </Link>
                        )}
                        {users && users.length > 0 ? (
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
                            {users.map((item, index) => {
                              return (
                                <div className="row small_screen2" key={index}>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Membership Paid on
                                    </span>{" "}
                                    <span className="sm_size">
                                      {item.paid_on ? item.paid_on : null}
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
                                      />{" "}
                                      {item.get_payment
                                        ? item.get_payment.amount
                                        : null}
                                    </span>{" "}
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Status</span>
                                    {item && item.is_subscribe === "Y" ? (
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
                      {/*TABLE AREA END*/}
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
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyAssociatedClubDetails);
