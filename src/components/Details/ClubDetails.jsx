import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import OwlCarousel from "react-owl-carousel";
import ReactReadMoreReadLess from "react-read-more-read-less";
import {
  USER_IMAGE,
  BASE_URL,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import { removeLSItem, setLSItem } from "../../shared/LocalStorage";
import { useParams } from "react-router";
import axios from "../../shared/axios";
import { Rating } from "../../shared/Rating";
// import location from "../../assets/images/location.png";
// import phone from "../../assets/images/phone.png";
// import mail_icon from "../../assets/images/mail-icon.png";
// import owl_detail_1 from "../../assets/images/owl-detail-1.jpg";
// import pro_pick from "../../assets/images/pro_pick.png";
// import price_tag_ash from "../../assets/images/price-tag-ash.png";
// import gallary_head from "../../assets/images/gallary-head.png";
// import product_bg from "../../assets/images/product-bg.png";
// import rupee_green from "../../assets/images/rupee-green.png";
// import rupees from "../../assets/images/rupees.png";
// import star_point from "../../assets/images/star-point.png";
// import product_arrow from "../../assets/images/product-arrow.png";
// import event_arrow from "../../assets/images/event-arrow.png";
// import location_icon from "../../assets/images/location-icon.png";
// import double_tick from "../../assets/images/double-tick.png";
// import { getLSItem } from "../../shared/LocalStorage";
import dateFormat from "dateformat";
import ReactPlayer from "react-player/youtube";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { getText, getText2 } from "../../shared/common";

const owl_detail = {
  items: 1,
  loop: true,
  nav: true,
  dots: false,
  autoplay: true,
  autoplaySpeed: 1000,
  smartSpeed: 1500,
  autoplayHoverPause: true,
};

const owl_gallery = {
  loop: true,
  margin: 25,
  nav: true,
  dots: true,
  responsive: {
    0: {
      items: 1,
      dots: false,
    },
    400: {
      items: 2,
    },
    767: {
      items: 3,
    },
    1024: {
      items: 4,
    },
  },
};

const owl4 = {
  loop: true,
  nav: false,
  margin: 23,
  dots: true,
  responsive: {
    0: {
      items: 1,
    },
    767: {
      items: 2,
    },
    1000: {
      items: 4,
    },
  },
};

const owl5 = {
  loop: true,
  nav: true,
  dots: false,
  margin: 30,
  responsive: {
    0: {
      items: 1,
    },
    767: {
      items: 2,
    },
    1000: {
      items: 2.5,
    },
  },
};

const ClubDetails = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const initialState = {
    clubDetails: [],
    Trainerlist: [],
    Gallery: [],
    Products: [],
    events: [],
    subscribed: "",
    wishlistData: [],
    review: [],
    review1: [],
  };
  const [state, setState] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const params = useParams();

  useEffect(() => {
    getProfileData();
  }, [params.slug]);

  const getProfileData = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Club Details";
    dispatch({ type: UPDATE_LOADER, value: true });
    setLoader(true)
    let data = {
      params: {
        slug: params.slug,
      },
    };
    let data1 = {
      params: {
        user_id: params.id,
      },
    };

    if (user) {
      data = {
        params: {
          slug: params.slug,
          member_id: user.id,
          user_id: user.id,
        },
      };
    }
    axios.post("/view-public-profile", data).then((res) => {
      dispatch({ type: UPDATE_LOADER, value: false });
      setLoader(false)
      // console.log("profile",res);
      setState((prevState) => {
        return {
          ...prevState,
          clubDetails: res.data.result.user,
          Trainerlist: res.data.result.list_of_trainers,
          Products: res.data.result.list_of_products,
          events: res.data.result.list_of_events,
        };
      });
      if (res.data.result && res.data.result.user) {
        setState((prevState) => {
          return {
            ...prevState,
            Gallery: res.data.result.user.get_user_gallery,
          };
        });
      }
      if (res.data.result && res.data.result.is_subscribed) {
        setState((prevState) => {
          return {
            ...prevState,
            subscribed: res.data.result.is_subscribed,
          };
        });
      }
    });
    if(localStorage.getItem("auth_token")){
    axios.post("listFavourite").then((resp) => {
      if (resp.data.result.fav_arr) {
        setState((prevState) => {
          return {
            ...prevState,
            wishlistData: resp.data.result.fav_arr,
          };
        });
      }
    });
    axios.post("/user-reviews", data1).then((res) => {
      // console.log("res", res);
      setState((prevState) => {
        return {
          ...prevState,
          review: res.data.result.reviews.slice(
            4,
            res.data.result.reviews.length
          ),
          review1: res.data.result.reviews.slice(0, 4),
        };
      });
    });
  }
  };

  const applytrainer = (id) => {
    if (subscribed && subscribed === "Y") {
      var data1 = {
        params: {
          club_id: clubDetails.id,
          trainer_id: id,
        },
      };
      swal({
        text: "Are you sure you want to apply for this trainer?",
        icon: "warning",
        dangerMode: true,
        buttons: true,
        className: "war005",
      }).then((isConfirmed) => {
        if (isConfirmed) {
          axios.post("/apply-for-trainer", data1).then((res) => {
            // console.log("apply", res);
            if (res.data.result) {
              getProfileData();
            } else if (res.data.error) {
              swal(res.data.error.meaning);
            }
          });
        }
      });
    } else {
      swal({
        title: "",
        icon: "warning",
        text: "You need to be a member to apply for trainer! Please click on Join Now.",
      });
    }
  };

  const msg = () => {
    swal({
      title: "",
      text: "Please Login to Join a Club!",
      icon: "warning",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        history.push("/login");
      }
    });
  };
  const msg3 = () => {
    swal({
      title: "",
      text: "Please Login to see reviews!",
      icon: "warning",
    })
  };
  const wishlist = (id) => {
    if (localStorage.getItem("auth_token")) {
      var data = {
        params: {
          product_id: id,
        },
      };
      axios.post("addToFavourite", data).then((resp) => {
        swal({
          title: "Success",
          text: resp.data.result.meaning,
          icon: "success",
          button: "Ok",
        });
        setState((prevState) => {
          return {
            ...prevState,
            wishlistData: resp.data.result.fav_arr,
          };
        });
        getProfileData();
      });
    } else {
      swal({
        title: "",
        text: "Please login to continue",
        icon: "warning",
        button: "Ok",
      });
    }
  };
  const addCart = (id) => {
    if (localStorage.getItem("auth_token")) {
      var data = {
        params: {
          product_id: id,
          qty: 1,
        },
      };
      axios.post("add-to-cart", data).then((resp) => {
        // console.log("lll0",resp);
        if (resp.data.result && resp.data.result.cartMaster) {
          setLSItem("cart_detail", resp.data.result.cartMaster);
          dispatch({
            type: UPDATE_CART_ITEM,
            value: resp.data.result.cartMaster,
          });
          swal({
            title: "Success",
            text: resp.data.result.meaning,
            icon: "success",
            button: "Ok",
          });
        } else if (resp.data.error) {
          swal({
            title: "Failed",
            text: resp.data.error.meaning,
            icon: "warning",
            button: "Ok",
          });
        }
      });
    } else {
      swal({
        title: "",
        text: "Please login to continue",
        icon: "warning",
        button: "Ok",
      });
    }
  };
  const moreReview = (id) => {
    var data = {
      params: {
        user_id: id,
      },
    };
    dispatch({ type: UPDATE_LOADER, value: true });
    setLoader(true);
    axios.post("user-reviews", data).then((res) => {
      // console.log("lll0",res);
      dispatch({ type: UPDATE_LOADER, value: false });
      setLoader(false);
      if (res.data.result && res.data.result.reviews) {
        setState((prevState) => {
          return {
            ...prevState,
            tReviews: res.data.result.reviews,
          };
        });
      }
      if (res.data.result && res.data.result.user) {
        setState((prevState) => {
          return {
            ...prevState,
            tDetail: res.data.result.user,
          };
        });
      }
    });
    
  };
  // console.log(tId);
  const {
    clubDetails,
    Trainerlist,
    Gallery,
    Products,
    events,
    subscribed,
    wishlistData,
    review,
    review1,
    tReviews,
    tDetail,
  } = state;
  return (
    <Layout>
      <div className="details main-search-area">
        {clubDetails ? (
          <div className="container">
            <div className="left-side">
              <div className="club-logo-left club_lo_left_001">
                <img
                  src={
                    clubDetails.profile_picture !== null
                      ? USER_IMAGE + clubDetails.profile_picture
                      : process.env.PUBLIC_URL + "/images/pro_pick.png"
                  }
                  alt=""
                />
              </div>
              <h2>{clubDetails.club_name}</h2>
              <p>Year of establishment: {clubDetails.year_of_establishment}</p>
              <div className="topic detail-topic">
                <div className="topic-icon"></div>
                <h5 className="topic-sml">
                  {clubDetails.get_associated_category &&
                  clubDetails.get_associated_category.length > 0
                    ? clubDetails.get_associated_category.map((item, index) => {
                        return (
                          <>
                            {item.get_category_details
                              ? item.get_category_details.name
                              : null}
                            {index ===
                            clubDetails.get_associated_category.length - 1
                              ? null
                              : ", "}
                          </>
                        );
                      })
                    : null}
                </h5>
              </div>
              <ul className="contact-detail">
                <li>
                  <img
                    src={process.env.PUBLIC_URL + "/images/location.png"}
                    alt=""
                  />
                  <p>
                    {clubDetails.address},{" "}
                    {clubDetails.user_city_details
                      ? clubDetails.user_city_details.city
                      : null}
                    ,{" "}
                    {clubDetails.user_state_details
                      ? clubDetails.user_state_details.name
                      : null}
                  </p>
                </li>
                <li>
                  <img
                    src={process.env.PUBLIC_URL + "/images/phone.png"}
                    alt=""
                  />
                  <p>{clubDetails.phone}</p>
                </li>
                <li>
                  <img
                    src={process.env.PUBLIC_URL + "/images/mail-icon.png"}
                    alt=""
                  />
                  <p>{clubDetails.email}</p>
                </li>
              </ul>
              <div className="member" style={{ marginBottom: "20px" }}>
                <div className="mem-price">
                  <h6 style={{ color: "#fff" }}>
                    ₹<span>{clubDetails.membership_amount}</span> (per month)
                  </h6>
                </div>
                <p>Member : {clubDetails.member_count}</p>
              </div>
              {localStorage.getItem("auth_token") ? (
                <>
                  {user && user.type !== "C" ? (
                    <div className="left-panel-btn">
                      {subscribed === "Y" ? (
                        <>
                          <Link to="#">
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/double-tick.png"
                              }
                              alt=""
                              className="d-tick"
                            />
                            Joined
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to={`/payment/${params.slug}/${params.id}`}>
                            Join Now
                          </Link>
                        </>
                      )}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="left-panel-btn" onClick={() => msg()}>
                  <Link to="#">Join Now</Link>
                </div>
              )}
            </div>

            <div className="right-side">
              {!loader?
                  <div className="public-banner-image">
                    <img
                      src={
                        clubDetails.get_user_default_images
                          ? BASE_URL +
                            "/storage/app/public/general_images/profile_general_image/" +
                            clubDetails.get_user_default_images.file
                          : process.env.PUBLIC_URL + "/images/owl-detail-1.jpg"
                      }
                      // className="img-fluid"
                      alt=""
                    />
                  </div>:null}
              <div className="about">
                <h2>ABOUT THE CLUB</h2>
                <ReactReadMoreReadLess
                  charLimit={150}
                  readMoreText={"Read more +"}
                  readLessText={"Read less -"}
                  ellipsis={"..."}
                  readMoreClassName={
                    "react-read-more-read-less react-read-more-read-less-more col-green"
                  }
                  readLessClassName={
                    "react-read-more-read-less react-read-more-read-less-less col-green"
                  }
                >
                  {clubDetails.about_club
                    ? getText(clubDetails.about_club)
                    : ""}
                </ReactReadMoreReadLess>
              </div>
              <div className="about">
                <h2>TERMS AND CONDITIONS</h2>
                <ReactReadMoreReadLess
                  charLimit={150}
                  readMoreText={"Read more +"}
                  readLessText={"Read less -"}
                  ellipsis={"..."}
                  readMoreClassName={
                    "react-read-more-read-less react-read-more-read-less-more col-green"
                  }
                  readLessClassName={
                    "react-read-more-read-less react-read-more-read-less-less col-green"
                  }
                >
                  {clubDetails.terms_conditions
                    ? getText(clubDetails.terms_conditions)
                    : ""}
                </ReactReadMoreReadLess>
              </div>
              {Trainerlist && Trainerlist.length > 0?
              <div className="about rate-trainer-abt">
                <h2 className="rate-heading-top">Our club trainers</h2>
                <div className="row">
                  {Trainerlist.map((item, index) => {
                        return (
                          <div className="col-lg-6 col-md-6 col-12" key={index}>
                            <div
                              className={
                                index % 2 == 0 && Trainerlist.length > 1
                                  ? "trainer-rate rate-left trainer-rate001"
                                  : "trainer-rate trainer-rate001"
                              }
                            >
                              <div className="rate-name-img">
                                <img
                                  src={
                                    item.profile_picture !== null
                                      ? USER_IMAGE + item.profile_picture
                                      : process.env.PUBLIC_URL +
                                        "/images/pro_pick.png"
                                  }
                                  alt=""
                                  style={{ width: "100%", height: "100%" }}
                                />
                              </div>
                              <div className="rate-name-inr">
                                <h3 className="w_140">
                                  {item.first_name + " " + item.last_name}
                                </h3>
                                <h5>
                                  Total Reviews:{" "}
                                  <span>
                                    {item.membership_total_no_of_reviews
                                      ? item.membership_total_no_of_reviews
                                      : 0}
                                  </span>
                                </h5>
                                {localStorage.getItem("auth_token")?
                                <div className="slr-rate">
                                  <h5>Average Review:</h5>
                                  <ul>
                                    <li>
                                      <Rating
                                        rating={parseInt(
                                          item.membership_avg_review
                                            ? item.membership_avg_review
                                            : 0
                                        )}
                                      />
                                    </li>
                                    <p style={{display:"contents"}}>({item.membership_avg_review})</p>
                                  </ul>
                                </div>:
                                <div className="pro-01-price">
                                <h4>
                                  <Link to="/login" className="log-pls pls-no-frd">
                                    Login to view more info.
                                  </Link>
                                </h4>
                              </div>}
                                <div className="trnr-txt">
                                  <div className="trnr-for trnr-for001">
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/price-tag-ash.png"
                                      }
                                      alt=""
                                    />
                                    <p
                                      style={{
                                        marginBottom: "0px",
                                        lineHeight: "9px",
                                      }}
                                    >
                                      {item.get_associated_category.length >
                                        0 && 
                                      item.get_associated_category[0] &&item.get_associated_category[0]
                                        .get_category_details
                                        ? item.get_associated_category[0]
                                            .get_category_details.name
                                        : null}
                                    </p>
                                  </div>
                                  {localStorage.getItem("auth_token") ? (
                                    <div
                                      className={
                                        item.get_trainer_to_member.length > 0
                                          ? "trnr-apply trnr-app001 trnr-aply-tic"
                                          : "trnr-apply trnr-app001"
                                      }
                                      onClick={() => applytrainer(item.id)}
                                      id={`${item.id}`}
                                    >
                                      {user && user.type !== "C" ? (
                                        // <Link to="#" id={`tnr+${item.id}`}>Apply</Link>:null}
                                        <a href="#" id={`tnr+${item.id}`}>
                                          {item.get_trainer_to_member.length > 0
                                            ? "Applied"
                                            : "Apply"}
                                        </a>
                                      ) : null}
                                    </div>
                                  ) : (
                                    <div
                                      className="trnr-apply"
                                      onClick={() => msg()}
                                    >
                                      <a href="#">Apply</a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {localStorage.getItem("auth_token") ?
                              <button
                                type="button"
                                className="btn trnr-mr-cmnt"
                                data-toggle="modal"
                                data-target="#exampleModalCenter"
                                onClick={() => moreReview(item.id)}
                              >
                                Ratings
                              </button>
                              :
                              <button  type="button"
                              className="btn trnr-mr-cmnt"
                              onClick={()=>msg3()}
                              >Ratings</button>}
                            </div>
                          </div>
                        );
                      })
                    }
                </div>
              </div>
              :null}
              {review1 && review1.length > 0 ? (
                <div className="about">
                  <div className="abt-heading">
                    <h2>Member Reviews</h2>
                    <div className="ovrll responsive_margin_6">
                      <h5>Over all Rating</h5>
                      <div className="slr-rate">
                        <ul>
                          <li>
                            <Rating
                              rating={parseInt(
                                clubDetails.membership_avg_review
                              )}
                            />
                          </li>
                          <p>
                            {clubDetails.membership_avg_review}(
                            {clubDetails.membership_total_no_of_reviews
                              ? clubDetails.membership_total_no_of_reviews
                              : 0}{" "}
                            Reviews)
                          </p>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {review1.map((item, index) => {
                      return (
                        <div className="col-md-6 col-12" key={index}>
                          <div className="rvw-box">
                            <div className="rvw-crd">
                              <div className="rvw-top">
                                <div className="rvw-img">
                                  <img
                                    style={{ height: "100%" }}
                                    src={
                                      item.get_user_details &&
                                      item.get_user_details.profile_picture
                                        ? USER_IMAGE +
                                          item.get_user_details.profile_picture
                                        : process.env.PUBLIC_URL +
                                          "/images/pro_pick.png"
                                    }
                                    alt=""
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="rvw-intro">
                                  <h5>
                                    {item.get_user_details
                                      ? item.get_user_details.first_name +
                                        " " +
                                        item.get_user_details.last_name
                                      : null}
                                  </h5>
                                  <ul>
                                    <li>
                                      <Rating rating={parseInt(item.ratings)} />
                                    </li>
                                    <p style={{display:"contents"}}>({item.ratings})</p>
                                  </ul>
                                </div>
                              </div>
                              {item.reviews !== null ? (
                                <div className="rvw-btm">
                                  <ReactReadMoreReadLess
                                    charLimit={150}
                                    readMoreText={"Read more +"}
                                    readLessText={"Read less -"}
                                    ellipsis={"..."}
                                    readMoreClassName={
                                      "react-read-more-read-less react-read-more-read-less-more col-green"
                                    }
                                    readLessClassName={
                                      "react-read-more-read-less react-read-more-read-less-less col-green"
                                    }
                                  >
                                    {item.reviews ? getText(item.reviews) : ""}
                                  </ReactReadMoreReadLess>
                                  <h6
                                    style={{
                                      marginTop: "12px",
                                      lineHeight: "18px",
                                    }}
                                  >
                                    <i
                                      className="fa fa-clock-o"
                                      aria-hidden="true"
                                    />
                                    {dateFormat(
                                      item.created_at,
                                      "dddd, mmmm dS, yyyy, h:MM:ss TT"
                                    )}
                                  </h6>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {review && review.length > 0 ? (
                    <>
                      <div className="rvw-box-more">
                        <div className="row">
                          {review.map((item, index) => {
                            return (
                              <div className="col-md-6 col-12" key={index}>
                                <div className="rvw-box">
                                  <div className="rvw-crd">
                                    <div className="rvw-top">
                                      <div className="rvw-img">
                                        <img
                                          style={{ height: "100%" }}
                                          src={
                                            item.get_user_details &&
                                            item.get_user_details
                                              .profile_picture
                                              ? USER_IMAGE +
                                                item.get_user_details
                                                  .profile_picture
                                              : process.env.PUBLIC_URL +
                                                "/images/pro_pick.png"
                                          }
                                          alt=""
                                          className="img-fluid"
                                        />
                                      </div>
                                      <div className="rvw-intro">
                                        <h5>
                                          {item.get_user_details
                                            ? item.get_user_details.first_name +
                                              " " +
                                              item.get_user_details.last_name
                                            : null}
                                        </h5>
                                        <ul>
                                          <li>
                                            <Rating
                                              rating={parseInt(item.ratings)}
                                            />
                                          </li>
                                          <p style={{display:"contents"}}>{item.ratings}</p>
                                        </ul>
                                      </div>
                                    </div>
                                    {item.reviews !== null ? (
                                      <div className="rvw-btm">
                                        <ReactReadMoreReadLess
                                          charLimit={150}
                                          readMoreText={"Read more +"}
                                          readLessText={"Read less -"}
                                          ellipsis={"..."}
                                          readMoreClassName={
                                            "react-read-more-read-less react-read-more-read-less-more col-green"
                                          }
                                          readLessClassName={
                                            "react-read-more-read-less react-read-more-read-less-less col-green"
                                          }
                                        >
                                          {item.reviews
                                            ? getText(item.reviews)
                                            : ""}
                                        </ReactReadMoreReadLess>
                                        <h6
                                          style={{
                                            marginTop: "12px",
                                            lineHeight: "18px",
                                          }}
                                        >
                                          <i
                                            className="fa fa-clock-o"
                                            aria-hidden="true"
                                          />
                                          {dateFormat(
                                            item.created_at,
                                            "dddd, mmmm dS, yyyy, h:MM:ss TT"
                                          )}
                                        </h6>
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <Link
                        to="#"
                        className="rvw-show"
                        style={{ color: "#3f6e6f", cursor: "pointer" }}
                      >
                        Show all review +
                      </Link>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
      {Gallery && Gallery.length > 0 ? (
        <div className="carosouls">
          <div className="gallery">
            <div className="container">
              <div className="product-head">
                <img
                  src={process.env.PUBLIC_URL + "/images/gallary-head.png"}
                  style={{ width: "30px", height: "42px" }}
                  alt=""
                />
                <h2>OUR GALLERY</h2>
              </div>
              <OwlCarousel
                className="owl-carousel owl-theme owl-gallery"
                {...owl_gallery}
              >
                {Gallery.map((item, index) => {
                  return (
                    <>
                      {item.status !== "I" ? (
                        <div className="item" key={index}>
                          {item.type === "I" ? (
                            <div className="gal-img00">
                            <img
                              // className="img-fluid"
                              src={
                                BASE_URL +
                                "/storage/app/public/general_images/" +
                                item?.file
                              }
                              alt=""
                            />
                            </div>
                          ) : (
                            <ReactPlayer className="pplayer" url={item.file} />
                          )}
                        </div>
                      ) : null}
                    </>
                  );
                })}
              </OwlCarousel>
            </div>
          </div>
        </div>
      ) : null}
      {/*popular products*/}
      {Products && Products.length > 0 ? (
        <div className="product">
          <div className="container">
            <div className="product-head">
              <img
                src={process.env.PUBLIC_URL + "/images/product-bg.png"}
                alt=""
              />
              <h2>POPULER PRODUCTS</h2>
            </div>
            <OwlCarousel className="owl-carousel owl-theme owl-four" {...owl4}>
              {Products.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <div className="product-card">
                      <div className="product-img">
                      <Link
                          // to="#"
                          to={`/product-details/${item.slug}/${item.id}`}
                          className="pro-btn"
                        >
                        {item.get_default_image ? (
                          <img
                            src={
                              BASE_URL +
                              "storage/app/public/product_images/" +
                              item.get_default_image.image
                            }
                            alt=""
                            className="main-img"
                          />
                        ) : null}
                        </Link>
                        {Math.round(item.percentage) > 0 ? (
                          <div className="discount">
                            <p>-{Math.round(item.percentage)}%</p>
                          </div>
                        ) : null}
                        <div className="wish">
                          <Link
                            to="#"
                            id={"wish" + index}
                            className={
                              wishlistData &&
                              wishlistData.some((v) => parseInt(v) === item.id)
                                ? "wish-act"
                                : "heart"
                            }
                            onClick={() => wishlist(item.id)}
                          />
                          <Link
                            to="#"
                            id={"cart" + index}
                            className="bag"
                            onClick={() => addCart(item.id)}
                          />
                        </div>
                      </div>
                      <Link
                          // to="#"
                          to={`/product-details/${item.slug}/${item.id}`}
                          className="pro-btn"
                        >
                      <h3>{item.title}</h3>
                      </Link>
                      {localStorage.getItem("auth_token") ? (
                        <h4>
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/rupee-green.png"
                            }
                            alt=""
                          />
                          {item.original_price}
                          {Math.round(item.percentage) > 0 ? (
                            <span>
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/images/rupees.png"
                                }
                                alt=""
                              />
                              {item.original_price}
                            </span>
                          ) : null}
                        </h4>
                      ) : (
                        <h4>
                          <Link to="/login" className="log-pls">
                            Login to view price
                          </Link>
                        </h4>
                      )}
                      <div className="product-star">
                        <div className="star">
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/star-point.png"
                            }
                            alt=""
                          />
                          <p>{item.avg_review}</p>
                        </div>
                        <Link
                          // to="#"
                          to={`/product-details/${item.slug}/${item.id}`}
                          className="pro-btn"
                        >
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/images/product-arrow.png"
                            }
                            alt=""
                            className="pro-arrow"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </OwlCarousel>
          </div>
        </div>
      ) : null}
      {/*popular products END*/}
      {/*Upcoming events*/}
      {events && events.length > 0 ? (
        <div className="events">
          <div className="container">
            <div className="event-head">
              <h2>
                <span>EVENTS</span>
              </h2>
              <img
                className="event-arrow"
                src={process.env.PUBLIC_URL + "/images/event-arrow.png"}
                alt=""
              />
            </div>
            <OwlCarousel className="owl-carousel owl-theme owl-five" {...owl5}>
              {events.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <div className="event-card">
                      <div className="event-img">
                        <img
                          src={
                            BASE_URL +
                            "storage/app/public/event_images/" +
                            item.event_image
                          }
                          alt=""
                          className="event-main"
                        />
                        <div className="date">
                          <h5>{dateFormat(item.event_date, "d")}</h5>
                          <h6>{dateFormat(item.event_date, "mmm")}</h6>
                          <h4>{dateFormat(item.event_date, "yyyy")}</h4>
                        </div>
                        <div className="club-name">
                          <h5>
                            {item.get_user ? item.get_user.club_name : null}
                          </h5>
                          <h6>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/location-icon.png"
                              }
                              alt=""
                            />
                            {item.user_city_details
                              ? item.user_city_details.city
                              : null}
                          </h6>
                        </div>
                      </div>
                      <h3>
                        <Link to={`/event-detail/${item.slug}`}>
                          {item.event_title}
                        </Link>
                      </h3>
                      {item.about_event ? (
                        <p>
                          {item.about_event.length > 25
                            ? getText(item.about_event).substr(0, 25) + ".."
                            : getText(item.about_event)}
                        </p>
                      ) : (
                        <p>&nbsp;</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </OwlCarousel>
          </div>
        </div>
      ) : null}
      <div
        className="modal fade modal-rate"
        id="exampleModalCenter"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content responsive_content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                <div className="row">
                  <div className="col-12">
                    {tDetail ? (
                      <div className="trainer-rate modal-trnr">
                        <div className="rate-name-img">
                          <img
                            src={
                              tDetail.profile_picture !== null
                                ? USER_IMAGE + tDetail.profile_picture
                                : process.env.PUBLIC_URL +
                                  "/images/pro_pick.png"
                            }
                            alt=""
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className="rate-name-inr">
                          <h3>
                            {tDetail.first_name + " " + tDetail.last_name}
                          </h3>
                          <h5>
                            Total Reviews:{" "}
                            <span>
                              {tDetail.membership_total_no_of_reviews
                                ? tDetail.membership_total_no_of_reviews
                                : 0}
                            </span>
                          </h5>
                          <div className="slr-rate">
                            <h5>Average Review:</h5>
                            <ul>
                              <li>
                                <Rating
                                  rating={parseInt(
                                    tDetail.membership_avg_review
                                      ? tDetail.membership_avg_review
                                      : 0
                                  )}
                                />
                              </li>
                              <p style={{display:"contents"}}>
                              ({tDetail.membership_avg_review})
                            </p>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </h5>
              <button
                type="button"
                className="close rate-close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body modal-rate-body">
              {tReviews && tReviews.length > 0 ? (
                tReviews.map((item, index) => {
                  return (
                    <div
                      className={
                        tReviews.length > 1
                          ? "rvw-crd mar-bt"
                          : "rvw-crd mar-bt mar-bt123"
                      }
                      key={index}
                    >
                      <div className="rvw-top ma-001">
                        <div className="review-area">
                          <div className="rvw-img">
                            <img
                              src={
                                item.get_user_details &&
                                item.get_user_details.profile_picture
                                  ? USER_IMAGE +
                                    item.get_user_details.profile_picture
                                  : process.env.PUBLIC_URL +
                                    "/images/pro_pick.png"
                              }
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="rvw-intro">
                            <h5>
                              {item.get_user_details
                                ? item.get_user_details.first_name +
                                  " " +
                                  item.get_user_details.last_name
                                : null}
                            </h5>
                            <ul>
                              <li>
                                <Rating rating={parseInt(item.ratings)} />
                              </li>
                              <p style={{display:"contents"}}>({item.ratings})</p>
                            </ul>
                          </div>
                        </div>
                        <h6>
                          <i className="fa fa-clock-o" aria-hidden="true" />
                          {dateFormat(
                            item.created_at,
                            "dddd, mmmm dS, yyyy, h:MM:ss TT"
                          )}
                        </h6>
                      </div>
                      {item.reviews !== null ? (
                        <div className="rvw-btm">
                          <p>{item.reviews ? getText(item.reviews) : ""}</p>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <>
                  {!loader ? (
                    <p className="n-r-f001">No reviews found!</p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClubDetails;