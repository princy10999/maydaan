import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
// import search from "../../assets/images/search.png";
// import sec_2_bg from "../../assets/images/sec-2-bg.png";
// import popular_dash from "../../assets/images/popular-dash.png";
// import location_icon from "../../assets/images/location-icon.png";
// import recent_price from "../../assets/images/recent-price.png";
// import trainer_bg from "../../assets/images/trainer-bg.jpg";
// import star_yel from "../../assets/images/star-yel.png";
// import star_ash from "../../assets/images/star-ash.png";
// import polka_dots from "../../assets/images/polka-dots.png";
// import product_bg from "../../assets/images/product-bg.png";
// import rupee_green from "../../assets/images/rupee-green.png";
// import rupees from "../../assets/images/rupees.png";
// import star_point from "../../assets/images/star-point.png";
// import product_arrow from "../../assets/images/product-arrow.png";
// import event_arrow from "../../assets/images/event-arrow.png";
// import locationicon from "../../assets/images/location-icon.png";
// import pro_pick from "../../assets/images/pro_pick.png";
// import list_dot_pink from "../../assets/images/list-dot-pink.png";
import { Rating } from "../../shared/Rating";
import OwlCarousel from "react-owl-carousel";
import { Formik, Field, Form } from "formik";
import axios from "../../shared/axios";
import swal from "sweetalert";
import {
  UPDATE_LOADER,
  USER_IMAGE,
  BASE_URL,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import { removeLSItem, setLSItem, getLSItem } from "../../shared/LocalStorage";
import { connect } from "react-redux";
import dateFormat from "dateformat";
import { getText } from "../../shared/common";
import { Helmet } from "react-helmet";

const owl1 = {
  items: 1,
  loop: true,
  nav: false,
  dots: true, 
  autoplay: true,
  autoplaySpeed: 1000,
  smartSpeed: 1500,
  autoplayHoverPause: true,
};

const owl2 = {
  loop: true,
  margin: 20,
  nav: false,
  dots: true,
  responsive: {
    0: {
      items: 1,
    },
    767: {
      items: 2,
    },
    1025: {
      items: 2,
    },
    1200: {
      items: 3,
    },
  },
};

const owl3 = {
  loop: true,
  margin: 27,
  nav: false,
  dots: true,
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
    1200: {
      items: 3.5,
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
      items: 3,
    },
    1200: {
      items: 4,
    },
  },
};

const owl5 = {
  loop: true,
  nav: false,
  dots: true,
  autoplay:true,
  autoplayTimeout:4000,
  autoplayHoverPause:true,
  margin: 30,
  responsive: {
    0: {
      items: 1,
    },
    700: {
      items: 2,
    },
    1000: {
      items: 2.5,
    },
  },
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: [],
      banners: [],
      active_clubs_count: "",
      active_events_count: "",
      active_trainers_count: "",
      list_of_clubs: [],
      list_of_events: [],
      list_of_products: [],
      list_of_trainers: [],
      home_page_subheading: "",
      home_page_heading: "",
      wishlistData: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Home";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.home();
  }
  home = () => {
    let data = {
      params: {
        no_parameter: "1",
      },
    };
    if (this.props.user) {
      data = {
        params: {
          no_parameter: "1",
          user_id: this.props.user.id,
        },
      };
    }
    this.props.onUpdateLoader(true);
    axios.post("show-home-page", data).then((res) => {
      // console.log("home", res);
      this.props.onUpdateLoader(false);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result) {
        this.setState({
          about: res.data.result.about_us,
          banners: res.data.result.banners,
          active_clubs_count: res.data.result.active_clubs_count,
          active_events_count: res.data.result.active_events_count,
          individual_trainer_count: res.data.result.individual_trainer_count,
          list_of_clubs: res.data.result.list_of_clubs,
          list_of_events: res.data.result.list_of_events,
          list_of_products: res.data.result.list_of_products,
          list_of_trainers: res.data.result.list_of_trainers,
          home_page_subheading: res.data.result.home_page_subheading,
          home_page_heading: res.data.result.home_page_heading,
        });
      }
    });
    if(localStorage.getItem("auth_token")){
    axios.post("listFavourite").then((resp) => {
      if (resp.data.result.fav_arr) {
        this.setState({ wishlistData: resp.data.result.fav_arr });
      }
    });
  }
  };
  showAllCat = (id) => {
    document.querySelector(`.show-all-cal-${id}`).classList.add("small-let");
    document.querySelector(`.show-category-count-${id}`).style.display = "none";
    document.querySelector(`.show-all-category-${id}`).style.display = "block";
  };
  hideAllCat = (id) => {
    document.querySelector(`.show-all-cal-${id}`).classList.remove("small-let");
    document.querySelector(`.show-all-category-${id}`).style.display = "none";
    document.querySelector(`.show-category-count-${id}`).style.display =
      "block";
  };
  wishlist = (id) => {
    if (localStorage.getItem("auth_token")) {
      var data = {
        params: {
          product_id: id,
        },
      };
      axios
        .post("addToFavourite", data)

        .then((resp) => {
          swal({
            title: "Success",
            text: resp.data.result.meaning,
            icon: "success",
            button: "Ok",
          });
          this.setState({ wishlistData: resp.data.result.fav_arr });
          this.home();
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
  addCart = (id) => {
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
          this.props.updateCartItem(resp.data.result.cartMaster);
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
  render() {
    const {
      about,
      banners,
      active_clubs_count,
      active_events_count,
      individual_trainer_count,
      list_of_clubs,
      list_of_events,
      list_of_products,
      list_of_trainers,
      home_page_heading,
      home_page_subheading,
    } = this.state;
    const initialValues = {
      keyword: "",
      category_id: "",
    };
    const handleSubmit = (values) => {
      // console.log("Home_Search", values);
      if (values.category_id === "C" && values.keyword === "") {
        this.props.history.push("/search-club");
      } else if (values.category_id === "C" && values.keyword !== "") {
        this.props.history.push(`/search-club?keyword=${values.keyword}`);
      } else if (values.category_id === "T" && values.keyword === "") {
        this.props.history.push("/search-trainer");
      } else if (values.category_id === "T" && values.keyword !== "") {
        this.props.history.push(`/search-trainer?keyword=${values.keyword}`);
      }
      if (values.category_id === "P" && values.keyword === "") {
        this.props.history.push("/search-product");
      } else if (values.category_id === "P" && values.keyword !== "") {
        this.props.history.push(`/search-product?keyword=${values.keyword}`);
      }
      if (values.category_id === "E" && values.keyword === "") {
        this.props.history.push("/search-event");
      } else if (values.category_id === "E" && values.keyword !== "") {
        this.props.history.push(`/search-event?keyword=${values.keyword}`);
      } else if (values.category_id === "" && values.keyword === "") {
        swal(
          "",
          "Please select a option from the dropdown to search!",
          "warning"
        );
      }
    };
    return (
     <>
     <Helmet>
        <title>Maydaan | Home</title>
        <meta
            name="description"
            content="Maydaan | Home"
        />
        <meta property="og:title" content="Maydaan | Home" />
        <meta property="og:description" content="Maydaan | Home" />
        <meta property="og:image" content="https://maydaan.in/service//storage/app/public/banner_images/100453.jpg" />
        <link rel="canonical" href="https://maydaan.in/preview" />
      </Helmet>
       <Layout>
        <div className="banner_numb">
          {/*banner start*/}
          <div className="banner">
            {banners && banners.length > 0 ? (
              <OwlCarousel className="owl-carousel owl-theme owl-one" {...owl1}>
                {banners.map((items, index) => {
                  return (
                    <div className="item" key={"banner" + index}>
                      <img
                        src={
                          BASE_URL +
                          "/storage/app/public/banner_images/" +
                          items.banner_image
                        }
                        className="img-fluid"
                        alt=""
                      />
                    </div>
                  );
                })}
              </OwlCarousel>
            ) : null}
            <div className="banner-txt">
              <h1>{home_page_heading ? home_page_heading : null}</h1>
              <p>{home_page_subheading ? home_page_subheading : null}</p>
              <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                <Form role="form">
                  <div className="form-group filter-form">
                    <label htmlFor>Catagory</label>
                    <Field
                      name="category_id"
                      as="select"
                      className="form-control rm06"
                    >
                      <option value="">Select</option>
                      <option value="C">Club</option>
                      <option value="T">Trainer</option>
                      <option value="P">Product</option>
                      <option value="E">Event</option>
                    </Field>
                  </div>
                  <div className="form-group filter-form">
                    <label htmlFor>Keyword</label>
                    <Field
                      type="text"
                      id
                      className="form-control rm07"
                      placeholder="Enter Your Keyword"
                      name="keyword"
                    />
                  </div>
                  <button className="search-btn" type="submit">
                    <img
                      src={process.env.PUBLIC_URL + "/images/search.png"}
                      alt=""
                    />
                    Search
                  </button>
                </Form>
              </Formik>
            </div>
            <div className="numbers">
              <div className="num-1">
                <h6>{active_clubs_count ? active_clubs_count : 0}</h6>
                <p>Active Club</p>
              </div>
              <div className="num-1">
                <h6>
                  {individual_trainer_count ? individual_trainer_count : 0}
                </h6>
                <p>Individual Trainer</p>
              </div>
              <div className="num-1">
                <h6>{active_events_count ? active_events_count : 0}</h6>
                <p>Upcoming Events</p>
              </div>
            </div>
          </div>
          {/*banne end*/}
          {/* number section end */}
        </div>
        <div className="recent">
          <img
            src={process.env.PUBLIC_URL + "/images/sec-2-bg.png"}
            alt=""
            className="recent-bg"
          />
          <div className="container">
            <div className="recent-inr">
              <div className="heading">
                <h3>
                  <img
                    src={process.env.PUBLIC_URL + "/images/popular-dash.png"}
                    alt=""
                  />
                  Popular Club
                </h3>
                <h2>Recently joined club</h2>
              </div>
              {list_of_clubs && list_of_clubs.length > 0 ? (
                <OwlCarousel
                  className="owl-carousel owl-theme owl-two"
                  {...owl2}
                >
                  {list_of_clubs.map((item, index) => {
                    return (
                      <div className="item" key={`aeacr` + index}>
                        <div className="club-card">
                          <Link
                            to={`/club-details/${item.slug}/${item.id}`}
                            className="join"
                          >
                            Join
                          </Link>
                          <Link to={`/club-details/${item.slug}/${item.id}`}>
                          <img
                            src={
                              item.profile_picture
                                ? USER_IMAGE + item.profile_picture
                                : process.env.PUBLIC_URL +
                                  (process.env.PUBLIC_URL +
                                    "/images/pro_pick.png")
                            }
                            className="club-logo"
                            alt={item.club_name}
                          /></Link>
                          <h3>
                            <Link to={`/club-details/${item.slug}/${item.id}`}>
                              {item.club_name && item.club_name.length > 25
                                ? item.club_name.substr(0, 25) + ".."
                                : item.club_name}
                            </Link>
                          </h3>
                          <div className="rating rating00111">
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
                            </ul>
                            <p>
                              {item.membership_avg_review
                                ? item.membership_avg_review
                                : 0}
                              (
                              {item.membership_total_no_of_reviews
                                ? item.membership_total_no_of_reviews
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
                            {item.user_state_details
                              ? item.user_state_details.name
                              : ""}
                          </h4>
                          {item.about_club ? (
                            <p>
                              {item.about_club && item.about_club.length > 25
                                ? getText(item.about_club).substr(0, 25) + ".."
                                : getText(item.about_club)}
                            </p>
                          ) : (
                            <p>&nbsp;</p>
                          )}
                          <div className="topic detail-topic">
                            <div className="topic-icon"></div>
                            <h5 className="topic-sml">
                              {item.get_associated_category &&
                              item.get_associated_category.length > 0 &&
                              item.get_associated_category.length >=4
                                ? item.get_associated_category
                                    .slice(0, 4)
                                    .map((item1, index1) => {
                                      return (
                                        <>
                                          {item1.get_category_details
                                            ? item1.get_category_details.name
                                            : null}
                                          {index1 === 3 ? "..." : ", "}
                                        </>
                                      );
                                    })
                                : item.get_associated_category &&
                                  item.get_associated_category.length > 0 &&
                                  item.get_associated_category.length <= 4
                                ? item.get_associated_category.map(
                                    (item1, index1) => {
                                      return (
                                        <>
                                          {item1.get_category_details
                                            ? item1.get_category_details.name
                                            : null}
                                          {index1 ===
                                          item.get_associated_category.length -
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

                          <div className="member">
                            <div className="mem-price">
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/recent-price.png"
                                }
                                alt=""
                              />
                              <h6>
                                <span> {item.membership_amount}</span> (per
                                month)
                              </h6>
                            </div>
                            <p>Member : {item.member_count}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </OwlCarousel>
              ) : null}
            </div>
          </div>
        </div>
        {/* recent section end */}
        {about ? (
          <div className="special for_bg_pic01">
            <div className="container">
              <div className="special-inr">
                <h2>{about.what_makes_maydaan_special_heading}</h2>
                <p>{about.what_makes_maydaan_special_description_first}</p>
                <h4>{about.subcaption_text}</h4>
                <ul style={{ color: "black" }}>
                  <li>
                    <img
                      src={process.env.PUBLIC_URL + "/images/list-dot-pink.png"}
                      alt=""
                    />
                    {about.subcaption_1}
                  </li>
                  <li>
                    <img
                      src={process.env.PUBLIC_URL + "/images/list-dot-pink.png"}
                      alt=""
                    />
                    {about.subcaption_2}
                  </li>
                  <li>
                    <img
                      src={process.env.PUBLIC_URL + "/images/list-dot-pink.png"}
                      alt=""
                    />
                    {about.subcaption_3}
                  </li>
                </ul>
                <div className="special-btn">
                  <Link to="/about-us">Read more</Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {/*   special section end */}
        {/*Recently added trainers*/}
        {list_of_trainers && list_of_trainers.length > 0 ? (
          <div className="trainers">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <img
                    src={process.env.PUBLIC_URL + "/images/trainer-bg.jpg"}
                    className="trainer-bg"
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="container">
              <div className="trainer-inr">
                <div className="trainer-head">
                  <img
                    src={process.env.PUBLIC_URL + "/images/polka-dots.png"}
                    className="polka"
                    alt=""
                  />
                  <h3>
                    <img
                      src={process.env.PUBLIC_URL + "/images/popular-dash.png"}
                      alt=""
                    />
                    Trainers
                  </h3>
                  <h2>Recently added trainers</h2>
                </div>
                <OwlCarousel
                  className="owl-carousel owl-theme owl-three"
                  {...owl3}
                >
                  {list_of_trainers.map((item, index) => {
                    return (
                      <div className="item" key={"trainer" + index}>
                        <div className="trainer-card">
                          <div className="train-inr">
                            <div className="tag">
                              <p>
                                {item.get_associated_category && item.get_associated_category[0] &&
                                item.get_associated_category[0]
                                  .get_category_details
                                  ? item.get_associated_category[0]
                                      .get_category_details.name
                                  : null}
                              </p>
                            </div>
                            <div className="trainer-img">
                              <Link
                                to={
                                  item.club_id !== "0" &&
                                  item.get_associated_club_details &&
                                  item.get_associated_club_details.slug
                                    ? `/club-details/${item.get_associated_club_details.slug}/${item.get_associated_club_details.id}`
                                    : `/trainer-details/${item.slug}/${item.id}`
                                }
                              >
                                <img
                                  className="tr-im-fix"
                                  src={
                                    item.profile_picture !== null
                                      ? USER_IMAGE + item.profile_picture
                                      : process.env.PUBLIC_URL +
                                        (process.env.PUBLIC_URL +
                                          "/images/pro_pick.png")
                                  }
                                  alt=""
                                />
                              </Link>
                            </div>
                            <h2><Link
                                style={{color:"inherit"}}
                                to={
                                  item.club_id !== "0" &&
                                  item.get_associated_club_details &&
                                  item.get_associated_club_details.slug
                                    ? `/club-details/${item.get_associated_club_details.slug}/${item.get_associated_club_details.id}`
                                    : `/trainer-details/${item.slug}/${item.id}`
                                }
                              >{item.first_name + " " + item.last_name}</Link></h2>
                            <h3>
                              <img
                                src={
                                  process.env.PUBLIC_URL +
                                  "/images/location-icon.png"
                                }
                                alt=""
                              />
                              {item.user_state_details
                                ? item.user_state_details.name
                                : null}
                            </h3>
                            <div className="rating">
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
                              </ul>
                              <p>
                                {item.membership_avg_review
                                  ? item.membership_avg_review
                                  : 0}
                                (
                                {item.membership_total_no_of_reviews
                                  ? item.membership_total_no_of_reviews
                                  : 0}
                                )
                              </p>
                            </div>
                            {item.about_trainer ? (
                              <p>
                                {item.about_trainer.length > 25
                                  ? getText(item.about_trainer).substr(0, 25) +
                                    ".."
                                  : getText(item.about_trainer)}
                              </p>
                            ) : (
                              <p>&nbsp;</p>
                            )}
                            <div className="train-btm">
                              <h6>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/rupees.png"
                                  }
                                  alt=""
                                />
                                <span>{item.membership_amount}</span>(per month)
                              </h6>
                              <h6>Students : {item.member_count}</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </OwlCarousel>
              </div>
            </div>
          </div>
        ) : null}
        {/*popular products*/}
        {list_of_products && list_of_products.length > 0 ? (
          <div className="product">
            <div className="container">
              <div className="product-head">
                <img
                  src={process.env.PUBLIC_URL + "/images/product-bg.png"}
                  alt=""
                />
                <h2>popular products</h2>
              </div>
              <OwlCarousel
                className="owl-carousel owl-theme owl-four"
                {...owl4}
              >
                {list_of_products.map((item, index) => {
                  return (
                    <div className="item" key={index}>
                      <div className="product-card">
                        <div className="product-img">
                          {item.get_default_image ? (
                            <Link to={`/product-details/${item.slug}/${item.id}`}>
                            <img
                              src={
                                BASE_URL +
                                "storage/app/public/product_images/" +
                                item.get_default_image.image
                              }
                              alt=""
                              className="main-img"
                            /></Link>
                          ) : null}
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
                                this.state.wishlistData &&
                                this.state.wishlistData.some(
                                  (v) => parseInt(v) === item.id
                                )
                                  ? "wish-act"
                                  : "heart"
                              }
                              onClick={() => this.wishlist(item.id)}
                            />
                            <Link
                              to="#"
                              id={"cart" + index}
                              className="bag"
                              onClick={() => this.addCart(item.id)}
                            />
                          </div>
                        </div>
                        <h3><Link style={{color:"inherit"}}to={`/product-details/${item.slug}/${item.id}`}>{item.title}</Link></h3>
                        {localStorage.getItem("auth_token") ? (
                          <h4>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/rupee-green.png"
                              }
                              alt=""
                            />
                            {item.original_price}
                            {Math.round(item.percentage) > 0 ? (
                              <span>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/rupees.png"
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
                                process.env.PUBLIC_URL +
                                "/images/star-point.png"
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
        
        <div className="events">
        <div className="container">
          <div className="event-head">
            <h2>Upcoming <span>events</span></h2>
            <img
                  className="event-arrow"
                  src={process.env.PUBLIC_URL + "/images/event-arrow.png"}
                  alt=""
                />
          </div>
          {list_of_events && list_of_events.length > 0 ? (
          <OwlCarousel className="owl-carousel owl-theme owl-five" {...owl5}>
          {list_of_events.map((item) => {
                  return (
                    <div className="item" key={item.id}>
                      <div className="event-card">
                        <div className="event-img">
                          <Link to={`/event-detail/${item.slug}`}>
                          <img
                            src={
                              BASE_URL +
                              "storage/app/public/event_images/" +
                              item.event_image
                            }
                            alt=""
                            className="event-main"
                          /></Link>
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
          ):
          <div className="evt_sorr">
          <img src={process.env.PUBLIC_URL+"/images/sad.png"} alt="" />
          <h2>Sorry! Currently there is no upcoming event available.</h2>
          </div>}
        </div>
      </div>
      </Layout>
     </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    updateCartItem: (cnt) => dispatch({ type: UPDATE_CART_ITEM, value: cnt }),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
