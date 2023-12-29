import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
// import stari from "../../assets/images/stari.png";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import {
  UPDATE_LOADER,
  BASE_URL,
  USER_IMAGE,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import swal from "sweetalert";

class PostReview extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      product: [],
      order: [],
      seller: "",
      details: [],
      offset:0
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Post Review";
    this.props.onUpdateLoader(true);
    axios
      .post("usergetOrderProduct", {
        params: {
          order_master_id: this.props.match.params.mid,
          product_id: this.props.match.params.id,
        },
      })
      .then((resp) => {
        // console.log("oDetails", resp);
        this.props.onUpdateLoader(false);
        if (resp.data.result && resp.data.result.order) {
          this.setState({
            order: resp.data.result.order,
          });
        }
        if (resp.data.result && resp.data.result.seller) {
          this.setState({
            seller: resp.data.result.seller.club_name,
          });
        }
        if (
          resp.data.result &&
          resp.data.result.order &&
          resp.data.result.order.get_order_details &&
          resp.data.result.order.get_order_details[0]
        ) {
          this.setState({
            product: resp.data.result.order.get_order_details[0],
          });
        }
      });
    if (this.props.match.params.cid) {
      this.getData();
    }
    if(this.props.match.params.tId){
      this.getTrainer();
    }
  }
  getData = () => {
    var data = {
      params: {
        id: this.props.match.params.cid,
        offset: this.state.offset,
      },
    };
    this.props.onUpdateLoader(true);
    axios.post("view-associated-club-details", data).then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("CDetails", res);
      if (res.data.result && res.data.result.details) {
        this.setState({
          details: res.data.result.details,
        });
      }
    });
  };
  getTrainer=()=>{
    var data = {
      params: {
        id: this.props.match.params.tId,
        offset: this.state.offset,
        page_type: "",
      },
    };
    if(this.props.user.type==="T"){
      data = {
        params: {
          id: this.props.match.params.tId,
          offset: this.state.offset,
          page_type: "B",
        },
      };
    }
    if(this.props.match.params.type=="A"){
      data = {
        params: {
          id: this.props.match.params.tId,
          offset: this.state.offset,
          page_type: "A",
        },
      };

    }
    this.props.onUpdateLoader(true);
    axios.post("view-trainer-to-member-details", data).then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("TDetails", res);
      if (res.data.result && res.data.result.details) {
        this.setState({
          details: res.data.result.details,
        });
      }
    });
  }
  render() {
    const { order, product, seller, details } = this.state;
    const initialValues = {
      comment: "",
      rating: "",
      hover: "",
    };
    const validationSchema = Yup.object({
      rating: Yup.string().required("Please select a rating!"),
    });
    const onSubmit = (values) => {
      // console.log("Rating", values);
      let data = {
        params: {
          rating: values.rating,
          comment: values.comment,
          order_master_id: this.props.match.params.mid,
          product_id: this.props.match.params.id,
        },
      };
      let url = "/clubPostReview";
      if (this.props.match.params.cid) {
        data = {
          params: {
            rating: values.rating,
            comment: values.comment,
            for_user_id: details.user_id,
          },
        };
        url = "/user-membership-post-review";
      }
      if (this.props.match.params.tId) {
        data = {
          params: {
            rating: values.rating,
            comment: values.comment,
            for_user_id: details.trainer_id,
          },
        };
        url = "/user-membership-post-review";
      }
      this.props.onUpdateLoader(true);
      axios.post(url, data).then((res) => {
        this.props.onUpdateLoader(false);
        if (res.data.result) {
          swal(res.data.result.meaning, {
            icon: "success",
          }).then((isConfirmed) => {
            if (isConfirmed) {
              if(this.props.match.params.cid){
                this.props.history.push(
                  `/my-associated-club-details/${this.props.match.params.cid}/${this.props.match.params.member_id}`
                )
              }
              else if(this.props.match.params.tId){
                this.props.history.push(
                  `/my-trainer-details/${this.props.match.params.tId}/${this.props.match.params.type}/${this.props.match.params.member_id}`
                )
              }
              else{
                this.props.history.push(
                  `/order-details/${this.props.match.params.mid}`
                )
              }
            }
          });
        } else {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      });
    };
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
                      Post Review{" "}
                      {product.get_product && product.get_product.title
                        ? "( " + product.get_product.title + " )"
                        : null}
                      {this.props.match.params.cid &&
                      details.get_club &&
                      details.get_club.club_name
                        ? "( for " + details.get_club.club_name + " )"
                        : null}
                    </h1>
                    <div className="dasbordRightBody">
                      <div className="row">
                        {!this.props.match.params.cid && !this.props.match.params.tId? (
                          <div className="col-lg-12 col-md-12 com_padd_both order_summary">
                            <div className="dashbox">
                              <div className="dashbox_head">
                                <h4>
                                  Order Summary
                                  <span />
                                </h4>
                              </div>
                              <div className="dashbox_body tyaa">
                                <p>
                                  <strong> Seller </strong>{" "}
                                  <span>{seller ? seller : null}</span>
                                </p>
                                <p>
                                  <strong> Order Id </strong>{" "}
                                  <span>
                                    {order.order_number
                                      ? order.order_number
                                      : null}
                                  </span>
                                </p>
                                <p>
                                  <strong> Order on </strong>{" "}
                                  <span>
                                    {dateFormat(order.created_at, "dd-mm-yyyy")}
                                  </span>
                                </p>
                              </div>
                              <div className="dashbox_body small_bbxx tyaa">
                                <p>
                                  <strong> Status </strong>{" "}
                                  {order.status == "ICM" ? (
                                    <span style={{ color: "#fecf6d" }}>
                                      {" "}
                                      Incomplete
                                    </span>
                                  ) : order.status == "NW" ? (
                                    <span style={{ color: "#99e9eb" }}>
                                      New Order
                                    </span>
                                  ): order.status == "INP" ? (
                                    <span style={{ color: "#99e9eb" }}>
                                      In Progress
                                    </span>
                                  ) : order.status == "OD" ? (
                                    <span className="green">
                                      {" "}
                                      <i
                                        className="fa fa-check"
                                        aria-hidden="true"
                                      />{" "}
                                      Delivered
                                    </span>
                                  ) : order.status == "CM" ? (
                                    <span className="green">
                                      {" "}
                                      <i
                                        className="fa fa-check"
                                        aria-hidden="true"
                                      />{" "}
                                      Completed
                                    </span>
                                  ) : order.status == "C" ? (
                                    <span className="red">Cancelled</span>
                                  ) : null}
                                </p>
                                <p>
                                  <strong> Payment mode</strong>{" "}
                                  <span>
                                    {order.payment_method === "C"
                                      ? "Cash on Delivary"
                                      : "Online"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          !this.props.match.params.tId?
                          <div
                            className="clubb_dtlls"
                            style={{ marginBottom: "0px" }}
                          >
                            <span>
                              <img
                                src={
                                  details.get_club &&
                                  details.get_club.profile_picture
                                    ? USER_IMAGE +
                                      details.get_club.profile_picture
                                    : process.env.PUBLIC_URL +
                                      "/images/pro_pick.png"
                                }
                                alt=""
                              />
                            </span>
                            {details ? (
                              <div className="clubb_dtls_infoo" style={{marginTop:"0px"}}>
                                <h1>
                                  {details.get_club &&
                                  details.get_club.club_name
                                    ? details.get_club.club_name
                                    : null}
                                </h1>
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
                                  details.get_club.get_associated_category
                                    .length > 0
                                    ? details.get_club.get_associated_category.map(
                                        (item1, index1) => {
                                          return (
                                            <>
                                              {item1.get_category_details
                                                ? item1.get_category_details
                                                    .name
                                                : null}
                                              {index1 ===
                                              details.get_club
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
                                      process.env.PUBLIC_URL +
                                      "/images/phone.png"
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
                          </div>
                          :
                          <div
                          className="clubb_dtlls"
                        >
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
                          <div className="clubb_dtls_infoo" style={{marginTop:"0px"}}>
                            <h1>
                              {details.get_trainer &&
                              details.get_trainer.first_name &&
                              details.get_trainer.last_name
                                ? details.get_trainer.first_name +
                                  " " +
                                  details.get_trainer.last_name
                                : null}
                            </h1>
                            <p>
                              <img src={process.env.PUBLIC_URL +"/images/price-tag-ash.png"} alt="" />{" "}
                              {details.get_trainer &&
                              details.get_trainer.get_associated_category &&
                              details.get_trainer.get_associated_category
                                .length > 0 &&
                              details.get_trainer.get_associated_category[0]
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
                        </div>
                        )}
                        {!this.props.match.params.cid && !this.props.match.params.tId ? (
                          <div className="productss_orderr productss_orderr001">
                            <h5>Product Summery</h5>
                            {/*TABLE AREA START*/}
                            <div className="table_01 table">
                              <div className="row amnt-tble">
                                <div className="cel_area amunt cess nw1">
                                  Product Info
                                </div>
                                <div className="cel_area amunt cess nw3">
                                  Unit Price
                                </div>
                                <div className="cel_area amunt cess nw4">
                                  Quantity
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Total
                                </div>
                              </div>
                              {product ? (
                                <div className="row small_screen2">
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big display_naa">
                                      Product Info
                                    </span>
                                    <span className="sm_size pprd_pic pprd_di">
                                      <div className="pprd_pic001 pprd_pic002">
                                        <img
                                          src={
                                            product.get_product &&
                                            product.get_product
                                              .get_default_image
                                              ? BASE_URL +
                                                "/storage/app/public/product_images/" +
                                                product.get_product
                                                  .get_default_image.image
                                              : process.env.PUBLIC_URL +
                                                "/images/pro_pick.png"
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="pprd_pic_txt">
                                        <h2>
                                          {product.get_product &&
                                          product.get_product.title
                                            ? product.get_product.title
                                            : null}
                                        </h2>
                                        <p>
                                          {" "}
                                          Seller:{" "}
                                          {product.get_product &&
                                          product.get_product.get_user &&
                                          product.get_product.get_user.club_name
                                            ? product.get_product.get_user
                                                .club_name
                                            : null}
                                        </p>
                                      </div>
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Unit Price</span>
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />{" "}
                                      {product.unit_price_discounted !== "0.00"
                                        ? product.unit_price_discounted
                                        : product.unit_price_original}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Quantity</span>
                                    <span className="sm_size">
                                      {" "}
                                      {product.qty}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Total</span>
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />{" "}
                                      {product.total_price}
                                    </span>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        <div className="col-lg-12 col-md-12 com_padd_both ">
                          <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            enableReinitialize={true}
                          >
                            {({
                              values,
                              touched,
                              setFieldValue,
                              setFieldTouched,
                            }) => (
                              <Form>
                                <div className="post_revi">
                                  <p>Rating</p>
                                  {[...Array(5)].map((star, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                      <Link
                                        to="#"
                                        onClick={() =>
                                          setFieldValue("rating", ratingValue)
                                        }
                                        className={
                                          ratingValue <=
                                          (values.hover || values.rating)
                                            ? "post_reviFoc"
                                            : ""
                                        }
                                        onMouseEnter={() =>
                                          setFieldValue("hover", ratingValue)
                                        }
                                        onMouseLeave={() =>
                                          setFieldValue("hover", "")
                                        }
                                      >
                                        <img
                                          src={
                                            ratingValue <=
                                            (values.hover || values.rating)
                                              ? process.env.PUBLIC_URL +
                                                "/images/stari.png"
                                              : process.env.PUBLIC_URL +
                                                "/images/stara.png"
                                          }
                                          alt=""
                                        />
                                      </Link>
                                    );
                                  })}
                                </div>
                                <ErrorMessage
                                  name="rating"
                                  component={FieldError}
                                />
                                <div className="input_sh_bx2">
                                  <div className="dash-field">
                                    <Field
                                      as="textarea"
                                      placeholder="Enter your comment here..."
                                      name="comment"
                                    />
                                    <label htmlFor="name">Comments</label>
                                  </div>
                                </div>
                                <div className="postt_reviews submitt">
                                  <button type="submit">
                                    <i
                                      className="fa fa-thumbs-up"
                                      aria-hidden="true"
                                    />{" "}
                                    Submit Review
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostReview);
