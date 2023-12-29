import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import OwlCarousel from "react-owl-carousel";
import { useParams } from "react-router";
import axios from "../../shared/axios";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { USER_IMAGE, BASE_URL } from "../../store/action/actionTypes";
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
import dateFormat from "dateformat";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import ReactPlayer from "react-player/youtube";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import { getText } from "../../shared/common";
import { getLSItem } from "../../shared/LocalStorage";
import { Rating } from "../../shared/Rating";

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
function TrainerDetails() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const initialState = {
    trainer: [],
    Gallery: [],
    subscribed: "",
  };
  const history = useHistory();
  const [state, setState] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const params = useParams();
  // console.log('====================================');
  // console.log("params",params);
  // console.log('====================================');
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Trainer Details";
    getProfileData();
  }, [params.slug]);
  const getProfileData = () => {
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

    if (user && user.type !== "C") {
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
          trainer: res.data.result.user,
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

  const { trainer, Gallery, subscribed,review,review1 } = state;
  const msg = () => {
    swal({
      title: "",
      icon: "warning",
      text: "Please login to apply for a trainer!",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        history.push("/login");
      }
    });
  };
  return (
    <Layout>
      <div className="details main-search-area">
        {trainer ? (
          <div className="container">
            <div className="left-side">
              <div className="club-logo-left club_lo_left_001">
                <img
                  src={
                    trainer.profile_picture !== null
                      ? USER_IMAGE + trainer.profile_picture
                      : process.env.PUBLIC_URL + "/images/pro_pick.png"
                  }
                  alt=""
                />
              </div>
              <h2>{trainer.first_name + " " + trainer.last_name}</h2>
              <p>Date of Birth: {trainer.dob}</p>
              <div className="topic detail-topic">
                <div className="topic-icon"></div>
                <h5 className="topic-sml">
                  {trainer.get_associated_category &&
                  trainer.get_associated_category.length > 0 && trainer.get_associated_category[0] &&
                  trainer.get_associated_category[0].get_category_details
                    ? trainer.get_associated_category[0].get_category_details
                        .name
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
                    {trainer.address},{" "}
                    {trainer.user_city_details
                      ? trainer.user_city_details.city
                      : null}
                    ,{" "}
                    {trainer.user_state_details
                      ? trainer.user_state_details.name
                      : null}
                  </p>
                </li>
                <li>
                  <img
                    src={process.env.PUBLIC_URL + "/images/phone.png"}
                    alt=""
                  />
                  +91{trainer.phone}
                </li>
                <li>
                  <img
                    src={process.env.PUBLIC_URL + "/images/mail-icon.png"}
                    alt=""
                  />
                  {trainer.email}
                </li>
              </ul>
              <div className="member" style={{ marginBottom: "20px" }}>
                <div className="mem-price">
                  <h6 style={{ color: "#fff" }}>
                    ₹<span>{trainer.membership_amount}</span> (per month)
                  </h6>
                </div>
                <p>Member : {trainer.member_count}</p>
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
                            Applied
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link to={`/payment/${params.slug}/${params.id}`}>Apply Now</Link>
                        </>
                      )}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="left-panel-btn" onClick={() => msg()}>
                  <Link to="#">Apply </Link>
                </div>
              )}
            </div>
            <div className="right-side">
              {!loader?
                  <div className="public-banner-image">
                    <img
                      src={
                        trainer.get_user_default_images &&
                        trainer.get_user_default_images !== null
                          ? BASE_URL +
                            "/storage/app/public/general_images/" +
                            trainer.get_user_default_images.file
                          : process.env.PUBLIC_URL + "/images/owl-detail-1.jpg"
                      }
                      // className="img-fluid"
                      alt=""
                    />
                  </div>:null}
              <div className="about">
                <h2>ABOUT THE TRAINER</h2>
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
                  {trainer.about_trainer ? getText(trainer.about_trainer) : ""}
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
                  {trainer.terms_conditions ? trainer.terms_conditions : ""}
                </ReactReadMoreReadLess>
              </div>
              {review1 && review1.length > 0 ? (
                <div className="about">
                  <div className="abt-heading">
                    <h2>Member Reviews</h2>
                    <div className="ovrll">
                      <h5>Over all Rating</h5>
                      <div className="slr-rate">
                        <ul>
                          <li>
                            <Rating rating={parseInt(trainer.membership_avg_review)} />
                          </li>
                          <p>
                            {trainer.membership_avg_review}(
                            {trainer.membership_total_no_of_reviews
                              ? trainer.membership_total_no_of_reviews
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
                                item.file
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
    </Layout>
  );
}

export default TrainerDetails;
