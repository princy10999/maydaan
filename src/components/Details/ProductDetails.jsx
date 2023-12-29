import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Layout from "../Layout/Layout";
// import n1 from "../../assets/images/n1.jpg";
// import n2 from "../../assets/images/n2.jpg";
// import n3 from "../../assets/images/n3.jpg";
// import nbig1 from "../../assets/images/nbig1.jpg";
// import nbig2 from "../../assets/images/nbig2.jpg";
// import nbig3 from "../../assets/images/nbig3.jpg";
// import price_tag_ash from "../../assets/images/price-tag-ash.png";
// import club_logo_4 from "../../assets/images/club-logo-4.png";
// import location from "../../assets/images/location.png";
// import trainer_img_1 from "../../assets/images/trainer-img-1.png";
// import product_bg from "../../assets/images/product-bg.png";
// import product_img_1 from "../../assets/images/product-img-1.jpg";
// import product_img_2 from "../../assets/images/product-img-2.jpg";
// import product_img_3 from "../../assets/images/product-img-3.jpg";
// import product_img_4 from "../../assets/images/product-img-4.jpg";
// import product_arrow from "../../assets/images/product-arrow.png";
// import rupee_green from "../../assets/images/rupee-green.png";
// import rupees from "../../assets/images/rupees.png";
// import star_point from "../../assets/images/star-point.png";
// import star_yel from "../../assets/images/star-yel.png";
// import star_ash from "../../assets/images/star-ash.png";
import { Rating } from "../../shared/Rating";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import OwlCarousel from "react-owl-carousel";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { useDispatch, useSelector } from "react-redux";
import {
  UPDATE_LOADER,
  BASE_URL,
  USER_IMAGE,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import axios from "../../shared/axios";
import pro_pick from "../../assets/images/pro_pick.png";
import { getText } from "../../shared/common";
import dateFormat from "dateformat";
import {
  FacebookShareButton,
  PinterestShareButton,
  TwitterShareButton,
} from "react-share";
import { setLSItem } from "../../shared/LocalStorage";
import swal from "sweetalert";
import { MdFavorite } from "react-icons/md";

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

const updteNinjaSlider = () => {
  var nsOptions = {
    sliderId: "ninja-slider",
    transitionType: "fade", //"fade", "slide", "zoom", "kenburns 1.2" or "none"
    autoAdvance: false,
    delay: "default",
    transitionSpeed: 700,
    aspectRatio: "2:1",
    initSliderByCallingInitFunc: false,
    shuffle: false,
    startSlideIndex: 0, //0-based
    navigateByTap: true,
    pauseOnHover: false,
    keyboardNav: true,

    license: "b2e981",
  };
  const nslider = new window.NinjaSlider(nsOptions);
  var thumbnailSliderOptions = {
    sliderId: "thumbnail-slider",
    orientation: "vertical",
    thumbWidth: "140px",
    thumbHeight: "70px",
    showMode: 2,
    autoAdvance: true,
    selectable: true,
    slideInterval: 3000,
    transitionSpeed: 900,
    shuffle: false,
    startSlideIndex: 0, //0-based
    pauseOnHover: true,
    initSliderByCallingInitFunc: false,
    rightGap: 0,
    keyboardNav: false,
    mousewheelNav: true,
    before: function (currentIdx, nextIdx, manual) {
      if (typeof nslider != "undefined") nslider.displaySlide(nextIdx);
    },
    license: "mylicense",
  };
  const test2 = new window.ThumbnailSlider(thumbnailSliderOptions);
};

function ProductDetails() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();
  const initialState = {
    product: [],
    similar: [],
    review: [],
    review1: [],
    wishlistData: [],
  };
  const [state, setState] = useState(initialState);
  const [qty, setQty] = useState(1);
  const [sliderImage, setSliderImage] = useState("");

  useEffect(() => {
    document.title = "Maydaan | Product Details";
    window.scrollTo({ top: 0, behavior: "smooth" });
    getProductData();
  }, [params.slug]);

  const getProductData = () => {
    dispatch({ type: UPDATE_LOADER, value: true });
    let data = {
      params: {
        slug: params.slug,
      },
    };
    let data1 = {
      params: {
        product_id: params.id,
      },
    };
    if (user) {
      data = {
        params: {
          slug: params.slug,
          user_id: user.id,
        },
      };
    }
    axios.post("/view-product-details", data).then((res) => {
      // console.log("res",res);
      dispatch({ type: UPDATE_LOADER, value: false });
      // console.log("product", res);
      setState(
        (prevState) => {
          return {
            ...prevState,
            product: res.data.result.product,
            similar: res.data.result.similar_products,
          };
        },
        () => {
          updteNinjaSlider();
        }
      );
      setSliderImage(res.data.result.product.get_images[0]?.image);
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
    axios.post("/product-reviews", data1).then((res) => {
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
        getProductData();
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
          qty: qty,
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
  const { product, similar, review, review1, wishlistData } = state;
  return (
    <Layout>
      <div className="mai01">
        <div className="container">
          <div className="pro-shoe mt_pdtldd">
            <div className="row">
              <div className="col-md-12">
                <div className="pro_slider">
                  <div className="ninja_trail_remove">
                    <div className="left_slider_area">
                      <div id="thumbnail-slider" style={{ float: "left" }}>
                        <div className="inner">
                          {product && product.get_images ? (
                            <ul>
                              {product.get_images.length > 0
                                ? product.get_images.map((item, index) => {
                                    return (
                                      <li
                                        key={"thumb" + index}
                                        onClick={() =>
                                          setSliderImage(item.image)
                                        }
                                      >
                                        <img
                                          className="thumb"
                                          src={
                                            BASE_URL +
                                            "storage/app/public/product_images/" +
                                            item.image
                                          }
                                          alt=""
                                        />
                                      </li>
                                    );
                                  })
                                : null}
                            </ul>
                          ) : null}
                        </div>
                      </div>
                      <div id="ninja-slider" style={{ float: "left" }}>
                        <div className="slider-inner">
                          {product && product.get_images ? (
                            <ul>
                              {product.get_images.length > 0
                                ? product.get_images.map((item, index) => {
                                    return (
                                      <li key={"original" + index}>
                                        <img
                                          className="ns-img"
                                          src={
                                            BASE_URL +
                                            "storage/app/public/product_images/" +
                                            sliderImage
                                          }
                                          alt=""
                                        />
                                      </li>
                                    );
                                  })
                                : null}
                            </ul>
                          ) : null}
                          {/* <div class="fs-icon" title="Expand/Close"></div>
                          <div className="hhert">
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {product ? (
                  <div className="pro_desright">
                    <div className="pro-01-txt">
                      <div className="pro-01-top">
                        <h2>{product.title}</h2>
                        <h6>
                          <img
                            src={
                              process.env.PUBLIC_URL +
                              "/images/price-tag-ash.png"
                            }
                            alt=""
                          />
                          {product.get_category_details &&
                          product.get_category_details.name
                            ? product.get_category_details.name
                            : null}
                        </h6>
                        {localStorage.getItem("auth_token")?
                        <ul>
                          <li className="rat-span">
                            <Rating rating={parseInt(product.avg_review)} />
                          </li>
                          <p>{product.avg_review} ({product.total_no_of_reviews} Reviews) </p>
                        </ul>:null}
                        {localStorage.getItem("auth_token") ? (
                          <div className="pro-01-price">
                            {Math.round(product.percentage) > 0 ? (
                              <h3 className="grey">
                                ₹{product.original_price}
                              </h3>
                            ) : null}
                            {Math.round(product.percentage) > 0 ? (
                              <h3
                                style={{
                                  marginLeft: "-20px",
                                  marginRight: "10px",
                                }}
                              >
                                -
                              </h3>
                            ) : null}
                            <h3 className="pink">
                              ₹
                              {product.discounted_price !== "0.00"
                                ? product.discounted_price
                                : product.original_price}
                            </h3>
                            {Math.round(product.percentage) > 0 ? (
                              <p>OFF {Math.round(product.percentage)}%</p>
                            ) : null}
                          </div>
                        ) : (
                          <div className="pro-01-price">
                            <h4>
                              <Link to="/login" className="log-pls pls-no-frd">
                                Login to view price
                              </Link>
                            </h4>
                          </div>
                        )}

                        <span>(*Inclusive of all taxes)</span>
                        {localStorage.getItem("auth_token")?
                        <div className="counter">
                          <p>Quantity</p>
                          <div id="input_div">
                            <input
                              type="button"
                              defaultValue="-"
                              id="moins"
                              onClick={() => {
                                if (qty > 1) {
                                  setQty(qty - 1);
                                }
                              }}
                            />
                            <input
                              type="text"
                              size={25}
                              value={qty}
                              id="count"
                              onChange={(e)=> {
                                if (!isNaN(e.target.value))
                                 {
                                  setQty(e.target.value)
                                }
                              }}
                            />
                            <input
                              type="button"
                              defaultValue="+"
                              id="plus"
                              onClick={() => setQty(qty + 1)}
                            />
                          </div>
                        </div>:null}
                      </div>
                      <div className="pro-01-btm">
                        <div className="bottom-Lft-lft">
                          <div className="btm-left btm-left001">
                            <Link to="#" onClick={() => addCart(product.id)}>
                              Add to cart
                            </Link>
                          </div>
                          <div className="prod-wish-icon">
                            <Link to="#" onClick={() => wishlist(product.id)}>
                              <MdFavorite
                                size={35}
                                color={
                                  wishlistData &&
                                  wishlistData.some(
                                    (v) => parseInt(v) === product.id
                                  )
                                    ? "#da7b93"
                                    : "#727272"
                                }
                                title={
                                  wishlistData &&
                                  wishlistData.some(
                                    (v) => parseInt(v) === product.id
                                  )
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                                }
                              />
                            </Link>
                          </div>
                        </div>
                        <div className="btm-right">
                          <p>
                            <i className="fa fa-share" aria-hidden="true" />
                            Share :
                          </p>
                          <ul>
                            <li className="fb">
                              <FacebookShareButton url={window.location.href}>
                                <i
                                  className="fa fa-facebook"
                                  aria-hidden="true"
                                />
                              </FacebookShareButton>
                            </li>
                            <li className="fb-1">
                              <TwitterShareButton url={window.location.href}>
                                <i
                                  className="fa fa-twitter"
                                  aria-hidden="true"
                                />
                              </TwitterShareButton>
                            </li>
                            <li className="fb-2">
                              <PinterestShareButton
                                url={window.location.href}
                                media={
                                  BASE_URL +
                                  "storage/app/public/product_images/" +
                                  sliderImage
                                }
                              >
                                <i
                                  className="fa fa-pinterest"
                                  aria-hidden="true"
                                />
                              </PinterestShareButton>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className="about">
            <h2>Product Details</h2>
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
              {product.description ? getText(product.description) : ""}
            </ReactReadMoreReadLess>
          </div>
          <div className="seller-n">
            <div className="seller-img-area">
              <div className="slr-img">
                {product.get_user ? (
                  <img
                    src={
                      product.get_user.profile_picture !== null
                        ? USER_IMAGE + product.get_user.profile_picture
                        : pro_pick
                    }
                    alt=""
                    className="img-fluid"
                  />
                ) : null}
              </div>
            </div>
            <div className="slr-txt">
              <h3>{product.get_user ? product.get_user.club_name : null}</h3>
              {product.get_user ? (
                <h6>
                  <img
                    src={process.env.PUBLIC_URL + "/images/location.png"}
                    alt=""
                  />
                  {product.get_user.address},{" "}
                  {product.get_user.user_city_details
                    ? product.get_user.user_city_details.city
                    : null}
                  ,{" "}
                  {product.get_user.user_state_details
                    ? product.get_user.user_state_details.name
                    : null}
                </h6>
              ) : null}
              <h6>
                <img
                  src={process.env.PUBLIC_URL + "/images/price-tag-ash.png"}
                  alt=""
                />
                Selling:{" "}
                {product.get_user &&
                product.get_user.get_associated_category &&
                product.get_user.get_associated_category.length > 0
                  ? product.get_user.get_associated_category.map(
                      (item, index) => {
                        return (
                          <>
                            {item.get_category_details
                              ? item.get_category_details.name
                              : null}
                            {index ===
                            product.get_user.get_associated_category.length - 1
                              ? null
                              : ", "}
                          </>
                        );
                      }
                    )
                  : null}{" "}
                Accessories
              </h6>
              {product.get_user ? (
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
                  {product.get_user.about_club
                    ? getText(product.get_user.about_club)
                    : ""}
                </ReactReadMoreReadLess>
              ) : null}
            </div>
            {product.get_user ? (
              <div className="slr-rate">
                <ul>
                  <li className="rat-span">
                    <Rating
                      rating={parseInt(
                        product.get_user &&
                          product.get_user.membership_avg_review
                          ? product.get_user.membership_avg_review
                          : 0
                      )}
                    />
                  </li>
                  <p>
                    {product.get_user && product.get_user.membership_avg_review
                      ? product.get_user.membership_avg_review
                      : 0}{" "}
                    ({" "}
                    {product.get_user &&
                    product.get_user.membership_total_no_of_reviews
                      ? product.get_user.membership_total_no_of_reviews
                      : 0}{" "}
                    Reviews)
                  </p>
                </ul>
                <h4>
                  <i className="fa fa-calendar" aria-hidden="true" />
                  Seller since:{" "}
                  {product.get_user && product.get_user.created_at
                    ? dateFormat(
                        product.get_user.created_at.substring(
                          0,
                          product.get_user.created_at.indexOf(" ")
                        ),
                        "yyyy-mm-dd"
                      )
                    : null}
                </h4>
                <div className="left-panel-btn">
                  <Link
                    to={
                      product.get_user
                        ? `/club-details/${product.get_user.slug}/${product.get_user.id}`
                        : `#`
                    }
                  >
                    View Seller Profile
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          {review1 && review1.length > 0 ? (
            <div className="about">
              <div className="abt-heading">
                <h2>Product Reviews</h2>
                <div className="ovrll">
                  <h5>Over all Rating</h5>
                  <div className="slr-rate">
                    <ul>
                      <li>
                        <Rating rating={parseInt(product.avg_review)} />
                      </li>
                      <p>
                        {product.avg_review}(
                        {product.total_no_of_reviews
                          ? product.total_no_of_reviews
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
                                <p style={{display:"contents"}}>(
                                {item.ratings
                                  ? item.ratings
                                  : 0})
                              </p>
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
                                        item.get_user_details.profile_picture
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
      {similar && similar.length > 0 ? (
        <div className="product">
          <div className="container">
            <div className="product-head">
              <img
                src={process.env.PUBLIC_URL + "/images/product-bg.png"}
                alt=""
              />
              <h2>Similar Products</h2>
            </div>
            <OwlCarousel className="owl-carousel owl-theme owl-four" {...owl4}>
              {similar.map((item, index) => {
                return (
                  <div className="item" key={index}>
                    <div className="product-card">
                      <div className="product-img">
                        <Link to={`/product-details/${item.slug}/${item.id}`}>
                        <img
                          src={
                            item.get_default_image
                              ? BASE_URL +
                                "/storage/app/public/product_images/" +
                                item.get_default_image.image
                              : pro_pick
                          }
                          alt=""
                          className="main-img"
                        /></Link>
                        {Math.round(item.percentage) > 0 ? (
                          <div className="discount">
                            <p>-{Math.round(item.percentage)}%</p>
                          </div>
                        ) : null}
                        <div className="wish">
                          <Link
                            to="#"
                            id={"wish1" + index}
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
                            id={"cart1" + index}
                            className="bag"
                            onClick={() => addCart(item.id)}
                          />
                        </div>
                      </div>
                      <h3><Link style={{color:"inherit"}}>{item.title}</Link></h3>
                      {localStorage.getItem("auth_token") ? (
                        <h4>
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/rupee-green.png"
                            }
                            alt=""
                          />
                          {item.discounted_price !== "0.00"
                            ? item.discounted_price
                            : item.original_price}
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
    </Layout>
  );
}

export default ProductDetails;
