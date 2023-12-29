import React, { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import fb from "../../assets/images/fb.png";
// import twitter from "../../assets/images/twitter.png";
// import menu from "../../assets/images/menu.png";
// import top_logo from "../../assets/images/top-logo.png";
// import aeroplane from "../../assets/images/aeroplane.png";
// import stt from "../../assets/images/stt.png";
// import cart from "../../assets/images/cart.png";
// import rupees from "../../assets/images/rupees.png";
// import pro_pick from "../../assets/images/pro_pick.png";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "../../shared/axios";
import { removeLSItem, setLSItem } from "../../shared/LocalStorage";
import {
  UPDATE_AUTH_TOKEN,
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  UPDATE_USER,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import { BASE_URL } from "../../store/action/actionTypes";
import swal from "sweetalert";
import { FacebookShareButton, TwitterShareButton } from "react-share";

const profileImagePath = BASE_URL + "/storage/app/public/profile_pics/";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    axios.post("show-contact-us-details").then((res) => {
      // console.log("details",res);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result) {
        this.setState({
          details: res.data.result.details,
        });
      }
    });
    if (localStorage.getItem("auth_token")) {
      axios
        .post("get-cart", {
          params: {
            get_list_states: "Y",
          },
        })
        .then((resp) => {
          if (resp.data.result && resp.data.result.cartMaster) {
            setLSItem("cart_detail", resp.data.result.cartMaster);
            this.props.updateCartItem(resp.data.result.cartMaster);
          } else {
            this.props.updateCartItem("");
          }
        });
    }
  }
  logout = () => {
    swal({
      text: "Are you sure you want to logout?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        this.props.history.push("/logout");
      }
    });
  };

  render() {
    const { details } = this.state;
    const initialValues = {
      email: localStorage.getItem("email") ? localStorage.getItem("email") : "",
      password: localStorage.getItem("password")
        ? localStorage.getItem("password")
        : "",
    };
    const validationSchema = Yup.object({
      email: Yup.string()
        .email("Please enter a valid email!")
        .required("Please enter your email!")
        .nullable(),
      password: Yup.string().required("Please enter your password!").nullable(),
    });
    const handleSubmit = (values) => {
      this.props.onUpdateLoader(true);
      // console.log("Login",values);
      var data = {
        params: {
          email: values.email,
          password: values.password,
        },
      };
      axios.post("/login", data).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("login", res);
        if (res.data.result && res.data.result.token) {
          if (values.remember_me) {
            setLSItem("email", values.email);
            setLSItem("password", values.password);
            setLSItem("remember_me", values.remember_me);
          } else {
            removeLSItem("email");
            removeLSItem("password");
            removeLSItem("remember_me");
          }

          this.props.onUpdateUser(res.data.result.user);
          this.props.onUpdateAuthToken(res.data.result.token);
          this.props.onUpdateSuccess("");
          this.props.history.push("/user-edit-profile");
        }
        if (res.data.error) {
          if (res.data.error.email) {
            swal(res.data.error.email[0], {
              icon: "error",
              timer: 5000,
            });
          } else if (res.data.error.password) {
            swal(res.data.error.password[0], {
              icon: "error",
              timer: 5000,
            });
          } else {
            swal(res.data.error.meaning, {
              icon: "error",
              timer: 5000,
            });
          }
        }
      });
    };
    return (
      <header className="header_sec ">
        <div className="top_bar">
          <nav className="navbar navbar-expand-lg ">
            <div className="container-fluid">
              <div className="socail_headers">
                <ul className="top-socail">
                  <li>
                    <FacebookShareButton url={window.location.href}>
                      <img
                        src={process.env.PUBLIC_URL + "/images/fb.png"}
                        alt=""
                      />
                    </FacebookShareButton>
                  </li>
                  <li>
                    <TwitterShareButton url={window.location.href}>
                      <img
                        src={process.env.PUBLIC_URL + "/images/twitter.png"}
                        alt=""
                      />
                    </TwitterShareButton>
                  </li>
                  {/* {details ? (
                    <li>
                      <a href={`mailto:${details.email}`}> {details.email}</a>
                    </li>
                  ) : null} */}
                </ul>
              </div>
              <div className="logo outsd">
                <Link to="/">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/maydaan_logo_top.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
              <div className="tab-scr-r8">
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#main_nav"
              >
                <span className="navbar-toggler-icon">
                  <img
                    src={process.env.PUBLIC_URL + "/images/menu.png"}
                    alt=""
                  />
                </span>
              </button>
              <div className="collapse navbar-collapse" id="main_nav">
                <ul className="navbar-nav ml-auto menu_all_head">
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-club">
                      {" "}
                      Club{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-event">
                      {" "}
                      Event
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-trainer">
                      {" "}
                      Trainer{" "}
                    </Link>
                  </li>
                  <div className="logo insd">
                <Link to="/">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/maydaan_logo_top.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
                  <li className="nav-item">
                    <Link className="nav-link link-4log" to="/login">
                      {" "}
                      Register/Login{" "}
                    </Link>
                  </li>
                  {!this.props.user ? (
                    <li className="nav-item">
                      <Link to="/search-product" className="nav-link">
                        Shop{" "}
                      </Link>
                    </li>
                  ) : null}
                </ul>
              </div>

              
              {/* navbar-collapse.// */}
              <div className="socail_headers">
                <ul className="top-socail">
                  
                  {details ? (
                    <li>
                      <a href={`mailto:${details.email}`}> {details.email}</a>
                    </li>
                  ) : null}
                </ul>
              </div>
              </div>
              
            </div>
            {/* container //  */}
          </nav>
        </div>
        {/* <div className="logo_bar">
          <div className="container-fluid">
            <div className="headers_flex">
              <div className="logo">
                <Link to="/">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/maydaan_logo_top.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
              {!this.props.user ? (
                <div className="login">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    <Form role="form  ">
                      <div className="mob_none flex_ri">
                        <div className="form-group">
                          <label htmlFor>Email</label>
                          <Field
                            type="text"
                            id
                            className="form-control"
                            placeholder="Email"
                            name="email"
                          />
                          <ErrorMessage name="email" component={FieldError} />
                        </div>
                        <div className="form-group">
                          <label htmlFor>Password</label>
                          <Field
                            type="password"
                            id
                            className="form-control"
                            placeholder="Password"
                            name="password"
                          />
                          <ErrorMessage
                            name="password"
                            component={FieldError}
                          />
                        </div>
                        <button className="login-btn" type="submit">
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/aeroplane.png"
                            }
                            alt=""
                          />
                          Login
                        </button>
                      </div>
                      <Link to="#" className="log_users">
                        <img
                          src={process.env.PUBLIC_URL + "/images/stt.png"}
                          alt=""
                        />
                      </Link>
                    </Form>
                  </Formik>
                </div>
              ) : (
                <div className="cart">
                  <div className="after_login">
                    <strong className="top_menu_click">
                      <img
                        src={
                          this.props.user.profile_picture
                            ? profileImagePath +
                              "/" +
                              this.props.user.profile_picture
                            : process.env.PUBLIC_URL + "/images/pro_pick.png"
                        }
                        alt=""
                      />{" "}
                      Hi,{" "}
                      {this.props.user
                        ? this.props.user.type === "C"
                          ? this.props.user.club_name
                          : this.props.user.first_name
                        : null}
                      <i className="fa fa-angle-down" aria-hidden="true" />
                    </strong>
                    <div className="aft_log_top_menu aft_log_top_menu_scroll">
                      <ul>
                        <li>
                          <Link
                            to={
                              this.props.user && this.props.user.type === "M"
                                ? "/user-dashboard"
                                : "/dashboard"
                            }
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link to="/user-edit-profile">Create Profile</Link>
                        </li>
                        <li>
                          <Link to="/change-password">Change Password</Link>
                        </li>
                        <li>
                          <Link to="/my-orders">My Orders</Link>
                        </li>
                        <li>
                          <Link to="/wish-list">My Wish List</Link>
                        </li>
                        {this.props.user &&
                        (this.props.user.type === "M" ||
                          this.props.user.type === "T") ? (
                          <>
                            <li>
                              <Link to="/my-trainers">My Trainers</Link>
                            </li>
                            <li>
                              <Link to="/my-associated-clubs">
                                My Associated Clubs
                              </Link>
                            </li>
                          </>
                        ) : null}
                        {this.props.user &&
                        (this.props.user.type === "C" ||
                          this.props.user.type === "T") ? (
                          <>
                            <li>
                              <Link to="/gallery">Gallery</Link>
                            </li>
                            <li>
                              <Link to="/bank-details">Bank Details</Link>
                            </li>
                            <li>
                              <Link to="/my-earning">My Earning</Link>
                            </li>
                            <li>
                              <Link to="/withdrawal">Withdrawal</Link>
                            </li>
                            <li>
                              <Link
                                // to="#"
                                to="/my-reviews"
                              >
                                My Review
                              </Link>
                            </li>
                          </>
                        ) : null}
                        {this.props.user && this.props.user.type === "C" ? (
                          <>
                            <li>
                              <Link to="/event-management">
                                Event Management
                              </Link>
                            </li>
                            <li>
                              <Link to="/manage-membership">
                                Manage Membership
                              </Link>
                            </li>
                            <li>
                              <Link to="/manage-products"> Manage Product</Link>
                            </li>
                            <li>
                              <Link to="/manage-order"> Manage Order</Link>
                            </li>
                            <li>
                              <Link to="/our-trainers">Our Trainers</Link>
                            </li>
                            <li>
                              <Link to="/club-members">Club Members</Link>
                            </li>
                          </>
                        ) : null}
                        {this.props.user && this.props.user.type === "T" ? (
                          <>
                            <li>
                              <Link to="/manage-subscription">
                                Manage Subscription
                              </Link>
                            </li>
                            <li>
                              <Link to="/our-members">Our Members</Link>
                            </li>
                            <li>
                              <Link to="/take-attendance">Take Attendance</Link>
                            </li>
                          </>
                        ) : null}
                        <li>
                        <li>
                            <Link to="/payment-details">Payment Details</Link>
                          </li>
                          <li>
                            <Link to="/my-posted-reviews">My Posted Reviews</Link>
                          </li>
                          <li>
                            <Link to="/address-book">Address Book</Link>
                          </li>
                          <li>
                            <Link to="/add-address">Add Address</Link>
                          </li>
                          <Link onClick={this.logout}>Log Out</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <Link to="/cart">
                    <img
                      src={process.env.PUBLIC_URL + "/images/cart.png"}
                      className="cart-img"
                      alt=""
                    />
                    <span>
                      {this.props.cart_detail &&
                      this.props.cart_detail.total_item
                        ? this.props.cart_detail.total_item
                        : 0}
                    </span>
                  </Link>
                  <div className="cart-txt">
                    <Link to="/cart">Cart</Link>
                    <p>
                      {this.props.cart_detail &&
                      this.props.cart_detail.total_item
                        ? this.props.cart_detail.total_item
                        : 0}{" "}
                      Items -{" "}
                      <span>
                        <img
                          src={process.env.PUBLIC_URL + "/images/rupees.png"}
                          className="img-fluid"
                          alt=""
                          style={{ marginRight: "5px" }}
                        />
                        {this.props.cart_detail &&
                        this.props.cart_detail.total_after_discount
                          ? this.props.cart_detail.total_after_discount
                          : "0.00"}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div> */}
      </header>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateUser: (cnt) => dispatch({ type: UPDATE_USER, value: cnt }),
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
    onUpdateAuthToken: (cnt) =>
      dispatch({ type: UPDATE_AUTH_TOKEN, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    updateCartItem: (cnt) => dispatch({ type: UPDATE_CART_ITEM, value: cnt }),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
    cart_detail: state.cart_detail,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
