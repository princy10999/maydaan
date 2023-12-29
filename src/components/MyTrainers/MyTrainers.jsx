import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
// import location_icon from "../../assets/images/location-icon.png";
// import trainer_img_2 from "../../assets/images/trainer-img-2.png";
// import trainer_img_1 from "../../assets/images/trainer-img-1.png";
// import trainer_img_4 from "../../assets/images/trainer-img-4.jpg";
// import trainer_img_3 from "../../assets/images/trainer-img-3.jpg";
// import star_yel from "../../assets/images/star-yel.png";
// import star_ash from "../../assets/images/star-ash.png";
// import club_logo_4 from "../../assets/images/club-logo-4.png";
// import club_logo_2 from "../../assets/images/club-logo-2.png";
// import club_logo_1 from "../../assets/images/club-logo-1.png";
// import price_tag from "../../assets/images/price-tag.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import pro_pick from "../../assets/images/pro_pick.png";
import { USER_IMAGE } from "../../store/action/actionTypes";
import axios from "../../shared/axios";
import { connect } from "react-redux";
import ReactPaginate from "react-paginate";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { Rating } from "../../shared/Rating";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class MyTrainers extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      users: [],
      loader:false
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | My Trainers";
    this.getData();
  }
  getData = () => {
    var data = {
      params: {
        offset: this.state.offset,
        member_id: this.props.user.id,
        page_type:"T"
      },
    };
    let url="/our-joined-users"
    if(this.props.user.type==="T"){
      data = {
        params: {
          offset: this.state.offset,
        }
      }
      url="/my-associated-applied";
    }
    this.props.onUpdateLoader(true);
    this.setState({loader:true})
    axios.post(url, data).then((res) => {
      this.props.onUpdateLoader(false);
      this.setState({loader:false})
      // console.log("trainers", res);
      if (res.data.result && res.data.result.users) {
        this.setState({
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
          users: res.data.result.users,
        });
      }
      if(this.props.user.type==="T"){
        if (res.data.result && res.data.result.TrainerToMember) {
          this.setState({ users: res.data.result.TrainerToMember})
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
    const { users } = this.state;
    return (
     <>
     <Helmet>
        <title>{Titles?.myTrainers?.title}</title>
        <meta
            name="description"
            content={Titles?.myTrainers?.description}
        />
        <meta property="og:title" content={Titles?.myTrainers?.ogTitle} />
        <meta property="og:description" content={Titles?.myTrainers?.ogDescription} />
        <meta property="og:image" content={Titles?.myTrainers?.ogImage} />
        <link rel="canonical" href={Titles?.myTrainers?.link} />
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
                    <h1>My Trainers</h1>
                    <div className="dasbordRightBody for_wish_list_main">
                    {users && users.length > 0 ? (
                     <>
                        {users.map((item, index) => {
                          return (
                            <div className="club-card" key={index}>
                              <Link
                                to={item.club_id!=="0" ?`/my-trainer-details/${item.id}/""/${item.member_id}`:`/my-trainer-details/${item.id}/A/${item.member_id}`}
                                className="join"
                              >
                                Details
                              </Link>
                              <img
                                src={
                                  item.get_trainer &&
                                  item.get_trainer.profile_picture !== null
                                    ? USER_IMAGE +
                                      item.get_trainer.profile_picture
                                    : (process.env.PUBLIC_URL + "/images/pro_pick.png")
                                }
                                className="club-logo"
                                alt=""
                              />
                              {item.club_id!=="0" ? (
                                <span className="club_llgoo">
                                  <img
                                    src={
                                      item.get_club &&
                                      item.get_club.profile_picture
                                        ? USER_IMAGE +
                                          item.get_club.profile_picture
                                        : (process.env.PUBLIC_URL + "/images/pro_pick.png")
                                    }
                                    className="club-logo"
                                    alt=""
                                  />
                                </span>
                              ) : null}
                              <h3>
                                <Link to="#">
                                  {item.get_trainer &&
                                  item.get_trainer.first_name &&
                                  item.get_trainer.last_name
                                    ? item.get_trainer.first_name +
                                      " " +
                                      item.get_trainer.last_name
                                    : null}
                                </Link>
                              </h3>
                              <h4>
                                <img src={process.env.PUBLIC_URL + "/images/location-icon.png"} alt="" />
                                {item.get_trainer &&
                                item.get_trainer.user_state_details
                                  ? item.get_trainer.user_state_details.name
                                  : null}
                              </h4>
                              <div className="rating">
                                <ul>
                                  <li>
                                  <Rating
                                  rating={parseInt(
                                    item.get_trainer && item.get_trainer.membership_avg_review ? item.get_trainer.membership_avg_review : 0
                                  )}
                                />
                                  </li>
                                </ul>
                                <p>
                                  {item.get_trainer &&
                                  item.get_trainer.membership_avg_review
                                    ? item.get_trainer.membership_avg_review
                                    : null}
                                  (
                                  {item.get_trainer &&
                                  item.get_trainer.membership_total_no_of_reviews
                                    ? item.get_trainer.membership_total_no_of_reviews
                                    : null}
                                  )
                                </p>
                              </div>
                              <div className="topic">
                                <div className="topic-icon">
                                  <img src={process.env.PUBLIC_URL + "/images/price-tag.png"} alt="" />
                                </div>
                                <h5>
                                  {item.get_trainer &&
                                  item.get_trainer.get_associated_category &&
                                  item.get_trainer.get_associated_category
                                    .length > 0 &&
                                  item.get_trainer.get_associated_category[0] &&item.get_trainer.get_associated_category[0]
                                    .get_category_details
                                    ? item.get_trainer
                                        .get_associated_category[0]
                                        .get_category_details.name
                                    : null}
                                </h5>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        { !this.state.loader ?
                      <div className="n-resul">
                        <img src={process.env.PUBLIC_URL + "/images/no-result.png"} alt="" />
                        <p>You have currently no trainers!</p>
                      </div>
                      :null}
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
                              <img src={process.env.PUBLIC_URL + "/images/pagleft.png"} alt="" className="dpb" />
                              <img src={process.env.PUBLIC_URL + "/images/paglefthov.png"} alt="" className="dpn" />
                            </>
                          }
                          nextLabel={
                            <>
                              <img src={process.env.PUBLIC_URL + "/images/pagright.png"} alt="" className="dpb" />
                              <img src={process.env.PUBLIC_URL + "/images/pagrightho.png"} alt="" className="dpn" />
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
export default connect(mapStateToProps, mapDispatchToProps)(MyTrainers);
