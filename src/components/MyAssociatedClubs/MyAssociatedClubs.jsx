import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom/cjs/react-router-dom";
// import club_logo_1 from "../../assets/images/club-logo-1.png";
// import club_logo_2 from "../../assets/images/club-logo-2.png";
// import club_logo_3 from "../../assets/images/club-logo-3.png";
// import location_icon from "../../assets/images/location-icon.png";
// import no_result from "../../assets/images/no-result.png";
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
import { Rating } from "../../shared/Rating";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class MyAssociatedClubs extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      users: [],
      loader: false,
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | My Associated Clubs";
    this.getData();
  }
  getData = () => {
    var data = {
      params: {
        offset: this.state.offset,
        member_id: this.props.user.id,
        page_type: "C",
      },
    };
    let url = "/our-joined-users";
    if (this.props.user.type === "T") {
      data = {
        params: {
          offset: this.state.offset,
        },
      };
      url = "/myassociatedJoinedClubs";
    }
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post(url, data).then((res) => {
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      // console.log("club", res);
      if (res.data.result && res.data.result.users) {
        this.setState({
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
          users: res.data.result.users,
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
    const { users } = this.state;
    return (
    <>
        <Helmet>
      <title>{Titles?.myAssociatedClubs?.title}</title>
      <meta
          name="description"
          content={Titles?.myAssociatedClubs?.description}
      />
      <meta property="og:title" content={Titles?.myAssociatedClubs?.ogTitle} />
      <meta property="og:description" content={Titles?.myAssociatedClubs?.ogDescription} />
      <meta property="og:image" content={Titles?.myAssociatedClubs?.ogImage} />
      <link rel="canonical" href={Titles?.myAssociatedClubs?.link} />
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
                    <h1>My Associated Clubs</h1>
                    <div className="dasbordRightBody for_wish_list_main">
                      {users && users.length > 0 ? (
                        <>
                          {this.props.user.type !== "T" ? (
                            <>
                              {users.map((item, index) => {
                                return (
                                  <div className="club-card" key={index}>
                                    {item.get_club ? (
                                      <Link
                                        to={`/my-associated-club-details/${item.id}/${item.member_id}`}
                                        className="join"
                                      >
                                        Details
                                      </Link>
                                    ) : null}
                                    <img
                                      src={
                                        item.get_club &&
                                        item.get_club.profile_picture
                                          ? USER_IMAGE +
                                            item.get_club.profile_picture
                                          : process.env.PUBLIC_URL +
                                            "/images/pro_pick.png"
                                      }
                                      className="club-logo"
                                      alt=""
                                    />
                                    <h3>
                                      <Link to="#">
                                        {item.get_club &&
                                        item.get_club.club_name &&
                                        item.get_club.club_name.length > 25
                                          ? item.get_club.club_name.substr(
                                              0,
                                              25
                                            ) + ".."
                                          : item.get_club.club_name}
                                      </Link>
                                    </h3>
                                    <div className="rating">
                                      <ul>
                                        <li>
                                          <Rating
                                            rating={parseInt(
                                              item.get_user &&
                                                item.get_user
                                                  .membership_avg_review
                                                ? item.get_user
                                                    .membership_avg_review
                                                : 0
                                            )}
                                          />
                                        </li>
                                      </ul>
                                      <p>
                                        {item.get_user &&
                                        item.get_user.membership_avg_review
                                          ? item.get_user.membership_avg_review
                                          : 0}
                                        (
                                        {item.get_user &&
                                        item.get_user
                                          .membership_total_no_of_reviews
                                          ? item.get_user
                                              .membership_total_no_of_reviews
                                          : 0}
                                        )
                                      </p>
                                    </div>
                                    <h4>
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/location-icon.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_club &&
                                      item.get_club.user_state_details
                                        ? item.get_club.user_state_details.name
                                        : ""}
                                    </h4>
                                    <div className="topic">
                                      <div className="topic-icon"></div>
                                      <h5>
                                        {item.get_club &&
                                        item.get_club.get_associated_category &&
                                        item.get_club.get_associated_category
                                          .length > 0 &&
                                        item.get_club.get_associated_category
                                          .length >= 4
                                          ? item.get_club.get_associated_category
                                              .slice(0, 4)
                                              .map((item1, index1) => {
                                                return (
                                                  <>
                                                    {item1.get_category_details
                                                      ? item1
                                                          .get_category_details
                                                          .name
                                                      : null}
                                                    {index1 === 3
                                                      ? "..."
                                                      : ", "}
                                                  </>
                                                );
                                              })
                                          : item.get_club
                                              .get_associated_category &&
                                            item.get_club
                                              .get_associated_category.length >
                                              0 &&
                                            item.get_club
                                              .get_associated_category.length <=
                                              4
                                          ? item.get_club.get_associated_category.map(
                                              (item1, index1) => {
                                                return (
                                                  <>
                                                    {item1.get_category_details
                                                      ? item1
                                                          .get_category_details
                                                          .name
                                                      : null}
                                                    {index1 ===
                                                    item.get_club
                                                      .get_associated_category
                                                      .length -
                                                      1
                                                      ? null
                                                      : ", "}
                                                  </>
                                                );
                                              }
                                            )
                                          : null}
                                      </h5>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              {users.map((item, index) => {
                                return (
                                  <div className="club-card" key={index}>
                                    {item.get_user ? (
                                      <Link
                                        to={`/my-associated-club-details/${item.id}/${item.member_id}`}
                                        className="join"
                                      >
                                        Details
                                      </Link>
                                    ) : null}
                                    <img
                                      src={
                                        item.get_user &&
                                        item.get_user.profile_picture
                                          ? USER_IMAGE +
                                            item.get_user.profile_picture
                                          : process.env.PUBLIC_URL +
                                            "/images/pro_pick.png"
                                      }
                                      className="club-logo"
                                      alt=""
                                    />
                                    <h3>
                                      <Link to="#">
                                        {item.get_user &&
                                        item.get_user.club_name &&
                                        item.get_user.club_name.length > 25
                                          ? item.get_user.club_name.substr(
                                              0,
                                              25
                                            ) + ".."
                                          : item.get_user.club_name}
                                      </Link>
                                    </h3>
                                    <div className="rating">
                                      <ul>
                                        <li>
                                          <Rating
                                            rating={parseInt(
                                              item.get_user &&
                                                item.get_user
                                                  .membership_avg_review
                                                ? item.get_user
                                                    .membership_avg_review
                                                : 0
                                            )}
                                          />
                                        </li>
                                      </ul>
                                      <p>
                                        {item.get_user &&
                                        item.get_user.membership_avg_review
                                          ? item.get_user.membership_avg_review
                                          : 0}
                                        (
                                        {item.get_user &&
                                        item.get_user
                                          .membership_total_no_of_reviews
                                          ? item.get_user
                                              .membership_total_no_of_reviews
                                          : 0}
                                        )
                                      </p>
                                    </div>
                                    <h4>
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/location-icon.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_user &&
                                      item.get_user.user_state_details
                                        ? item.get_user.user_state_details.name
                                        : ""}
                                    </h4>
                                    <div className="topic">
                                      <div className="topic-icon"></div>
                                      <h5>
                                        {item.get_user &&
                                        item.get_user.get_associated_category &&
                                        item.get_user.get_associated_category
                                          .length > 0 &&
                                        item.get_user.get_associated_category
                                          .length >= 4
                                          ? item.get_user.get_associated_category
                                              .slice(0, 4)
                                              .map((item1, index1) => {
                                                return (
                                                  <>
                                                    {item1.get_category_details
                                                      ? item1
                                                          .get_category_details
                                                          .name
                                                      : null}
                                                    {index1 === 3
                                                      ? "..."
                                                      : ", "}
                                                  </>
                                                );
                                              })
                                          : item.get_user
                                              .get_associated_category &&
                                            item.get_user
                                              .get_associated_category.length >
                                              0 &&
                                            item.get_user
                                              .get_associated_category.length <=
                                              4
                                          ? item.get_user.get_associated_category.map(
                                              (item1, index1) => {
                                                return (
                                                  <>
                                                    {item1.get_category_details
                                                      ? item1
                                                          .get_category_details
                                                          .name
                                                      : null}
                                                    {index1 ===
                                                    item.get_user
                                                      .get_associated_category
                                                      .length -
                                                      1
                                                      ? null
                                                      : ", "}
                                                  </>
                                                );
                                              }
                                            )
                                          : null}
                                      </h5>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          {!this.state.loader ? (
                            <div className="n-resul">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/no-result.png"
                                }
                                alt=""
                              />
                              <p>Your my associated club is empty!</p>
                            </div>
                          ) : null}
                        </>
                      )}
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
    </>
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
export default connect(mapStateToProps, mapDispatchToProps)(MyAssociatedClubs);
