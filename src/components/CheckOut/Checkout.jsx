import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
import axios from "../../shared/axios";
import { setLSItem } from "../../shared/LocalStorage";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { BASE_URL } from "../../store/action/actionTypes";
import swal from "sweetalert";
import { ErrorMessage, Formik, Form, Field } from "formik";
import * as Yup from "yup";
import FormikErrorFocus from "formik-error-focus";
import Message from "../Layout/Message";
import { connect } from "react-redux";
// import pro_pick from "../../assets/images/pro_pick.png";
import FieldError from "../../shared/FieldError";

class Checkout extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cart_detail: [],
      cart: [],
      states: [],
      city: [],
      city2: [],
      address_data: [],
      Country: [],
      value: 0,
      update: [],
    };
  }
  componentDidMount() {
    document.title = "Maydaan | Checkout";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getCart();
    this.Update();
  }

  getCart = () => {
    this.props.onUpdateLoader(true);
    axios
      .post("get-cart", {
        params: {
          get_list_states: "Y",
        },
      })
      .then((resp) => {
        // console.log("cart",resp);
        this.props.onUpdateLoader(false);
        if (resp.data.result && resp.data.result.cartMaster) {
          this.setState({
            cart: resp.data.result.cartMaster.get_cart_detail,
            cart_detail: resp.data.result.cartMaster,
            states: resp.data.result.states,
            address_data: resp?.data?.result?.addressbook,
            Country: resp?.data?.result?.countries,
          });
          setLSItem("cart_detail", resp.data.result.cartMaster);
          this.props.updateCartItem(resp.data.result.cartMaster);
        } else {
          this.props.updateCartItem("");
          this.setState({ cart: "", cart_detail: "" });
        }
      });
  };
 

  Update = () => {
    if (this.props.match.params.uid !== "N") {
      this.props.onUpdateLoader(true);
      axios
        .post("get-order", {
          params: {
            id: this.props.match.params.uid,
          },
        })
        .then((resp) => {
          // console.log("cartUpdate",resp);
          this.props.onUpdateLoader(false);
          if (resp.data.result && resp.data.result.order) {
            this.setState({ update: resp.data.result.order });
          }
          if (resp.data.result && resp.data.result.billing_city_list && resp.data.result.shipping_city_list) {
            this.setState({
              city: resp.data.result.shipping_city_list,
              city2: resp.data.result.billing_city_list
            })
          }
        });
    }
  };
  updateCity = (id) => {
    this.props.onUpdateLoader(true);
    if (id) {
      axios.post("get-city", { params: { state_id: id } }).then((res) => {
        this.props.onUpdateLoader(false);
        this.setState({
          city: res.data.result.cities,
        });
      });
    } else {
      this.setState({ city: [] });
    }
  };
  updateCity1 = (id) => {
    this.props.onUpdateLoader(true);
    if (id) {
      axios.post("get-city", { params: { state_id: id } }).then((res) => {
        this.props.onUpdateLoader(false);
        this.setState({
          city2: res.data.result.cities,
        });
      });
    } else {
      this.setState({ city2: [] });
    }
  };
  render() {
    const { cart, cart_detail, states, city, city2, update } = this.state;
    const initialValues = {
      id:
        this.props.match.params.uid !== "N" ? this.props.match.params.uid : "",
      payment_method: "C",
      shipping:
        update.shipping_address_id && update.shipping_address_id !== "0"
          ? "Y"
          : "N",
      shipping_address_id:
        update.shipping_address_id && update.shipping_address_id !== "0"
          ? parseInt(update.shipping_address_id)
          : "",
      shipping_first_name: update.shipping_first_name
        ? update.shipping_first_name
        : "",
      shipping_last_name: update.shipping_last_name
        ? update.shipping_last_name
        : "",
      shipping_email: update.shipping_email ? update.shipping_email : "",
      shipping_phone: update.shipping_phone ? update.shipping_phone : "",
      shipping_full_address: update.shipping_full_address
        ? update.shipping_full_address
        : "",
      shipping_state:
        update.shipping_state && update.shipping_state !== "0"
          ? update.shipping_state
          : "",
      shipping_city:
        update.shipping_city && update.shipping_city !== "0"
          ? update.shipping_city
          : "",
      shipping_zipcode: update.shipping_zipcode ? update.shipping_zipcode : "",
      shipping_save:
        update.shipping_save && update.shipping_save === "true" ? true : false,
      billing:
        update.billing_address_id && update.billing_address_id !== "0"
          ? "Y"
          : "N",
      billing_address_id:
        update.billing_address_id && update.billing_address_id !== "0"
          ? parseInt(update.billing_address_id)
          : "",
      same_as: update.same_as && update.same_as === "true" ? true : false,
      billing_first_name: update.billing_first_name
        ? update.billing_first_name
        : "",
      billing_last_name: update.billing_last_name
        ? update.billing_last_name
        : "",
      billing_email: update.billing_email ? update.billing_email : "",
      billing_phone: update.billing_phone ? update.billing_phone : "",
      billing_full_address: update.billing_full_address
        ? update.billing_full_address
        : "",
      billing_state:
        update.billing_state && update.billing_state !== "0"
          ? update.billing_state
          : "",
      billing_city:
        update.billing_city && update.shipping_city !== "0"
          ? update.billing_city
          : "",
      billing_zipcode: update.billing_zipcode ? update.billing_zipcode : "",
      shipping_country: update.shipping_country ? update.shipping_country : "",
      billing_country: update.billing_country ? update.billing_country : "",
    };
    // console.log("0000000",initialValues);
    const validationSchema = Yup.object().shape({
      shipping: Yup.string(),
      shipping_first_name: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string().required("Please enter your first name!"),
      }),
      shipping_last_name: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string().required("Please enter your last name!"),
      }),
      shipping_phone: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string()
          .required("Please enter your phone number!")
          .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number")
          .min(10, "Phone number must be at least 10 characters")
          .max(10, "Phone number contains maximum 10 characters"),
      }),
      shipping_email: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string()
          .email("Invalid email format")
          .required("Please enter your email!"),
      }),
      shipping_zipcode: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string()
          .required("Please enter your pin code!")
          .matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
      }),
      shipping_city: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string().required("Please select your city!"),
      }),
      shipping_state: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string().required("Please select your state!"),
      }),
      shipping_country: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string().required("Please select your country!"),
      }),
      shipping_full_address: Yup.string().when("shipping", {
        is: "N",
        then: Yup.string().required("Please enter your full address!"),
      }),
      billing: Yup.string(),
      billing_first_name: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string().required("Please enter your first name!"),
        }),
      }),
      billing_last_name: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string().required("Please enter your last name!"),
        }),
      }),
      billing_phone: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string()
            .required("Please enter your phone number!")
            .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number")
            .min(10, "Phone number must be at least 10 characters")
            .max(10, "Phone number contains maximum 10 characters"),
        }),
      }),
      billing_email: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string()
            .email("Invalid email format")
            .required("Please enter your email!"),
        }),
      }),
      billing_zipcode: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string()
            .required("Please enter your pin code!")
            .matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
        }),
      }),
      billing_city: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string().required("Please select your city!"),
        }),
      }),
      billing_state: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string().required("Please select your state!"),
        }),
      }),
      billing_country: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string().required("Please select your country!"),
        }),
      }),
      billing_full_address: Yup.string().when("same_as", {
        is: false,
        then: Yup.string().when("billing", {
          is: "N",
          then: Yup.string().required("Please enter your full address!"),
        }),
      }),
    });
    const handleSubmit = (values) => {
      // console.log("form data", values);
      let url = "submitcheckout";
      if (this.props.match.params.uid !== "N") {
        url = "editOrderAddress";
      }
      this.props.onUpdateLoader(true);
      axios.post(url, { params: values }).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("ress",res);
        if (res.data.result && res.data.result.order) {
          this.props.history.push(`/place-order/${res.data.result.order.id}`);
        } else if (res.data.error) {
          this.props.onUpdateError(res.data.error.meaning);
        }
      });
    };
    return (
      <Layout>
        <div className="results">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12">
                <nav aria-label="breadcrumb" className="bread">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      <Link to="/cart">Shopping Cart</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Checkout
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* --------------result bar end----------------- */}
        <div className="main-check-area">
          <div className="container">
            <div className="check-area">
              <div className="left-check">
                <h3>Product Information</h3>
                <div className="prod-info">
                  <ul>
                    {cart && cart.length > 0
                      ? cart.map((item, index) => {
                        return (
                          <li>
                            <div className="prod-img pprd_pic001 pprd_pic002">
                              <img
                                src={
                                  item.get_product_detail &&
                                    item.get_product_detail.get_default_image
                                    ? BASE_URL +
                                    "/storage/app/public/product_images/" +
                                    item.get_product_detail
                                      .get_default_image.image
                                    : process.env.PUBLIC_URL +
                                    "/images/pro_pick.png"
                                }
                                alt=""
                              />
                              <div className="num">{item.qty}</div>
                            </div>
                            <div className="prod">
                              <span className="sm_size pprd_pic">
                                <h2>
                                  {item.get_product_detail &&
                                    item.get_product_detail.title
                                    ? item.get_product_detail.title
                                    : null}
                                </h2>
                                <p>
                                  Seller:{" "}
                                  {item.get_product_detail &&
                                    item.get_product_detail.get_user &&
                                    item.get_product_detail.get_user.club_name
                                    ? item.get_product_detail.get_user
                                      .club_name
                                    : null}
                                </p>
                              </span>
                            </div>
                            <div className="prc">
                              <p>
                                <i className="fa fa-inr" aria-hidden="true" />
                                {item.unit_price_original}
                              </p>
                            </div>
                          </li>
                        );
                      })
                      : null}
                  </ul>
                </div>
                <h3>Payment Details</h3>
                <div className="total">
                  <ul>
                    <li>
                      <p>
                        Subtotal(
                        {cart_detail && cart_detail.total_item
                          ? cart_detail.total_item
                          : "0"}{" "}
                        Items)
                      </p>
                      <span>
                        <i className="fa fa-inr" aria-hidden="true" />
                        {cart_detail && cart_detail.total_before_discount
                          ? cart_detail.total_before_discount
                          : "0.00"}
                      </span>
                    </li>
                    <li>
                      <p>Discount</p>
                      <span>
                        <i className="fa fa-inr" aria-hidden="true" />
                        {cart_detail &&
                          cart_detail.total_before_discount &&
                          cart_detail.total_after_discount
                          ? cart_detail.total_before_discount -
                          cart_detail.total_after_discount
                          : "0.00"}
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="pay">
                  <p>
                    Total payable amount:
                    <span style={{ color: "#da7b93" }}>
                      <i className="fa fa-inr" aria-hidden="true" />
                      {cart_detail && cart_detail.total_after_discount
                        ? cart_detail.total_after_discount
                        : "0.00"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="right-check">
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={true}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ setFieldValue, values }) => {
                    return (
                      <Form>
                        <Message />
                        <div className="shipping">
                          <h3>Shipping Information</h3>
                          <div className="dot">
                            <label className="rad">
                              Create New Address
                              <Field
                                type="radio"
                                name="shiping"
                                id="sn"
                                onClick={() => setFieldValue("shipping", "N")}
                                checked={values.shipping === "N" ? true : false}
                              />
                              <span className="radio" />
                            </label>
                            <label className="rad">
                              Used Saved Address
                              <Field
                                type="radio"
                                name="shiping"
                                id="ss"
                                onClick={() =>
                                  this?.state?.address_data?.length > 0
                                    ? setFieldValue("shipping", "Y")
                                    : swal({
                                      title: "Warning",
                                      text: "Please add address before using saved address.",
                                      icon: "warning",
                                    })
                                }
                                checked={values.shipping === "Y" ? true : false}
                              />
                              <span className="radio" />
                            </label>
                          </div>
                          {values.shipping === "N" ? (
                            <>
                              {" "}
                              <div className="name">
                                <div className="form-group log-group log-group001">
                                  <Field
                                    type="text"
                                    id
                                    className="form-control"
                                    placeholder
                                    name="shipping_first_name"
                                  />
                                  <ErrorMessage
                                    name="shipping_first_name"
                                    component={FieldError}
                                  />
                                  <label
                                    htmlFor
                                    className={`log-label ${values.shipping_first_name
                                        ? "up-design"
                                        : ""
                                      }`}
                                  >
                                    First Name
                                  </label>
                                </div>
                                <div className="form-group log-group log-group001">
                                  <Field
                                    type="text"
                                    id
                                    className="form-control"
                                    placeholder
                                    name="shipping_last_name"
                                  />
                                  <ErrorMessage
                                    name="shipping_last_name"
                                    component={FieldError}
                                  />
                                  <label
                                    htmlFor
                                    className={`log-label ${values.shipping_last_name
                                        ? "up-design"
                                        : ""
                                      }`}
                                  >
                                    Last Name
                                  </label>
                                </div>
                              </div>
                              <div className="name">
                                <div className="form-group log-group log-group001">
                                  <Field
                                    type="text"
                                    id
                                    className="form-control"
                                    placeholder
                                    name="shipping_email"
                                  />
                                  <ErrorMessage
                                    name="shipping_email"
                                    component={FieldError}
                                  />
                                  <label
                                    htmlFor
                                    className={`log-label ${values.shipping_email ? "up-design" : ""
                                      }`}
                                  >
                                    Email
                                  </label>
                                </div>
                                <div className="form-group log-group log-group001">
                                  <Field
                                    type="text"
                                    id
                                    className="form-control"
                                    placeholder
                                    name="shipping_phone"
                                    onChange={(e) => {
                                      let result = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      );
                                      setFieldValue("shipping_phone", result);
                                    }}
                                  />
                                  <ErrorMessage
                                    name="shipping_phone"
                                    component={FieldError}
                                  />
                                  <label
                                    htmlFor
                                    className={`log-label ${values.shipping_phone ? "up-design" : ""
                                      }`}
                                  >
                                    Phone Number
                                  </label>
                                </div>
                              </div>
                              <div
                                className="form-group log-group log-group001"
                                style={{ marginBottom: "12px" }}
                              >
                                <Field
                                  type="text"
                                  id
                                  className="form-control"
                                  placeholder
                                  name="shipping_full_address"
                                />
                                <ErrorMessage
                                  name="shipping_full_address"
                                  component={FieldError}
                                />
                                <label
                                  htmlFor="exampleFormControlTextarea1"
                                  className={`form-label ${values.shipping_full_address
                                      ? "up-design"
                                      : ""
                                    }`}
                                >
                                  Full Address
                                </label>
                              </div>
                              <div className="name">
                                <div className="form-group log-group log-group001">
                                  <Field name="shipping_country" as="select">
                                    <option value="">Country</option>
                                    {this.state.Country.map((e) => {
                                      return (
                                        <option value={e?.id}>
                                          {e?.country_name}
                                        </option>
                                      );
                                    })}
                                  </Field>
                                  <ErrorMessage
                                    name="shipping_country"
                                    component={FieldError}
                                  />
                                </div>
                                <div className="form-group log-group log-group001">
                                  <Field
                                    as="select"
                                    name="shipping_state"
                                    onChange={(e) => {
                                      setFieldValue(
                                        "shipping_state",
                                        e.target.value
                                      );
                                      setFieldValue("shipping_city", "");
                                      if (e.target.value === "") {
                                        setFieldValue("shipping_city", "");
                                        setFieldValue("shipping_state", "");
                                        this.setState({ city: [] });
                                      } else {
                                        setFieldValue(
                                          "shipping_state",
                                          e.target.value
                                        );
                                        this.updateCity(e.target.value);
                                      }
                                    }}
                                  >
                                    <option value="">Select State</option>
                                    {states && states.length > 0
                                      ? states.map((value, index) => {
                                        return (
                                          <option
                                            key={"state" + index}
                                            value={value.id}
                                          >
                                            {value.name}
                                          </option>
                                        );
                                      })
                                      : null}
                                  </Field>
                                  <ErrorMessage
                                    name="shipping_state"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="name">
                                <div className="form-group log-group log-group001">
                                  <Field as="select" name="shipping_city">
                                    <option value="">Select City</option>
                                    {city && city.length > 0
                                      ? city.map((value, index) => {
                                        return (
                                          <option
                                            key={"city" + index}
                                            value={value.id}
                                          >
                                            {value.city}
                                          </option>
                                        );
                                      })
                                      : null}
                                  </Field>
                                  <ErrorMessage
                                    name="shipping_city"
                                    component={FieldError}
                                  />
                                </div>
                                <div className="form-group log-group log-group001">
                                  <Field
                                    type="text"
                                    id
                                    className="form-control"
                                    placeholder
                                    name="shipping_zipcode"
                                    onChange={(e) => {
                                      let result = e.target.value.replace(
                                        /\D/g,
                                        ""
                                      );
                                      setFieldValue("shipping_zipcode", result);
                                    }}
                                  />
                                  <ErrorMessage
                                    name="shipping_zipcode"
                                    component={FieldError}
                                  />
                                  <label
                                    htmlFor
                                    className={`log-label ${values.shipping_zipcode ? "up-design" : ""
                                      }`}
                                  >
                                    Pin Code
                                  </label>
                                </div>
                              </div>
                              <div className="btm-radio prd-rad">
                                <label className="check">
                                  Save this information for easy purchase next
                                  time
                                  <Field type="checkbox" name="shipping_save" />
                                  <span className="checkmark" />
                                </label>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="sav-add-Body">
                                <div className="row">
                                  {this?.state?.address_data.map(
                                    (item, index) => {
                                      return (
                                        <div
                                          className="col-lg-6 col-md-12 com_padd_both"
                                          key={"ship" + index}
                                          onClick={() =>
                                            setFieldValue(
                                              "shipping_address_id",
                                              item.id
                                            )
                                          }
                                        >
                                          <div
                                            className={
                                              values.shipping_address_id ===
                                                item.id
                                                ? "dash-acti"
                                                : "dashbox"
                                            }
                                          >
                                            <div className="dashbox_head">
                                              {item.address_title ? (
                                                <h4>
                                                  <span>
                                                    ({item.address_title})
                                                  </span>
                                                </h4>
                                              ) : null}
                                            </div>
                                            <div className="dashbox_body">
                                              <p>
                                                <strong> Name </strong>{" "}
                                                <span>
                                                  {item.first_name +
                                                    " " +
                                                    item.last_name}
                                                </span>
                                              </p>
                                              <p>
                                                <strong> Address </strong>{" "}
                                                <span>
                                                  {item.address},{" "}
                                                  {item.user_city_details &&
                                                    item.user_city_details.city
                                                    ? item.user_city_details
                                                      .city
                                                    : null}
                                                  ,{" "}
                                                  {item.user_state_details.name}{" "}
                                                  - {item.pincode}
                                                </span>
                                              </p>
                                              <p>
                                                <strong> Phone </strong>{" "}
                                                <span>{item.phone}</span>
                                              </p>
                                              <p>
                                                <strong> Email </strong>{" "}
                                                <span
                                                  style={{
                                                    wordBreak: "break-all",
                                                  }}
                                                >
                                                  {item.email}
                                                </span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="billing">
                          <h3>Billing Information</h3>

                          <div className="btm-radio prd-rad">
                            <label className="check">
                              Billing address same as shipping address
                              <Field
                                type="checkbox"
                                name="same_as"
                                onChange={() => {
                                  setFieldValue("same_as", !values.same_as);
                                  if (values.same_as == false) {
                                    setFieldValue(
                                      "billing_first_name",
                                      values.shipping_first_name
                                    );
                                    setFieldValue(
                                      "billing_last_name",
                                      values.shipping_last_name
                                    );
                                    setFieldValue(
                                      "billing_phone",
                                      values.shipping_phone
                                    );
                                    setFieldValue(
                                      "billing_email",
                                      values.shipping_email
                                    );
                                    setFieldValue(
                                      "billing_zipcode",
                                      values.shipping_zipcode
                                    );
                                    setFieldValue(
                                      "billing_city",
                                      values.shipping_city
                                    );
                                    setFieldValue(
                                      "billing_country",
                                      values.shipping_country
                                    );
                                    setFieldValue(
                                      "billing_state",
                                      values.shipping_state
                                    );
                                    setFieldValue(
                                      "billing_full_address",
                                      values.shipping_full_address
                                    );
                                    setFieldValue(
                                      "billing_address_id",
                                      values.shipping_address_id
                                    );
                                  } else {
                                    setFieldValue("billing_first_name", "");
                                    setFieldValue("billing_last_name", "");
                                    setFieldValue("billing_phone", "");
                                    setFieldValue("billing_email", "");
                                    setFieldValue("billing_zipcode", "");
                                    setFieldValue("billing_city", "");
                                    setFieldValue("billing_country", "");
                                    setFieldValue("billing_state", "");
                                    setFieldValue("billing_full_address", "");
                                    setFieldValue("billing_address_id", "");
                                  }
                                }}
                              />
                              <span className="checkmark" />
                            </label>
                          </div>
                          {values.same_as == false ? (
                            <>
                              <div className="dot">
                                <label className="rad">
                                  Create New Address
                                  <Field
                                    type="radio"
                                    name="biling"
                                    id="bn"
                                    onClick={() =>
                                      setFieldValue("billing", "N")
                                    }
                                    checked={
                                      values?.billing === "N" ? true : false
                                    }
                                  />
                                  <span className="radio" />
                                </label>
                                <label className="rad">
                                  Used Saved Address
                                  <Field
                                    type="radio"
                                    name="biling"
                                    id="bs"
                                    onClick={() =>
                                      this?.state?.address_data?.length > 0
                                        ? setFieldValue("billing", "Y")
                                        : swal({
                                          title: "Warning",
                                          text: "Please add address before using saved address.",
                                          icon: "warning",
                                        })
                                    }
                                    checked={
                                      values?.billing === "Y" ? true : false
                                    }
                                  />
                                  <span className="radio" />
                                </label>
                              </div>
                              {values?.billing === "N" ? (
                                <>
                                  <div className="name">
                                    <div className="form-group log-group log-group001">
                                      <Field
                                        type="text"
                                        id
                                        className="form-control"
                                        placeholder
                                        name="billing_first_name"
                                      />
                                      <ErrorMessage
                                        name="billing_first_name"
                                        component={FieldError}
                                      />
                                      <label
                                        htmlFor
                                        className={`log-label ${values.billing_first_name
                                            ? "up-design"
                                            : ""
                                          }`}
                                      >
                                        First Name
                                      </label>
                                    </div>
                                    <div className="form-group log-group log-group001">
                                      <Field
                                        type="text"
                                        id
                                        className="form-control"
                                        placeholder
                                        name="billing_last_name"
                                      />
                                      <ErrorMessage
                                        name="billing_last_name"
                                        component={FieldError}
                                      />
                                      <label
                                        htmlFor
                                        className={`log-label ${values.billing_last_name
                                            ? "up-design"
                                            : ""
                                          }`}
                                      >
                                        Last Name
                                      </label>
                                    </div>
                                  </div>
                                  <div className="name">
                                    <div className="form-group log-group log-group001">
                                      <Field
                                        type="text"
                                        id
                                        className="form-control"
                                        placeholder
                                        name="billing_email"
                                      />
                                      <ErrorMessage
                                        name="billing_email"
                                        component={FieldError}
                                      />
                                      <label
                                        htmlFor
                                        className={`log-label ${values.billing_email
                                            ? "up-design"
                                            : ""
                                          }`}
                                      >
                                        Email
                                      </label>
                                    </div>
                                    <div className="form-group log-group log-group001">
                                      <Field
                                        type="text"
                                        id
                                        className="form-control"
                                        placeholder
                                        name="billing_phone"
                                        onChange={(e) => {
                                          let result = e.target.value.replace(
                                            /\D/g,
                                            ""
                                          );
                                          setFieldValue(
                                            "billing_phone",
                                            result
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name="billing_phone"
                                        component={FieldError}
                                      />
                                      <label
                                        htmlFor
                                        className={`log-label ${values.billing_phone
                                            ? "up-design"
                                            : ""
                                          }`}
                                      >
                                        Phone Number
                                      </label>
                                    </div>
                                  </div>
                                  <div
                                    className="form-group log-group log-group001"
                                    style={{ marginBottom: "12px" }}
                                  >
                                    <Field
                                      type="text"
                                      id
                                      className="form-control"
                                      placeholder
                                      name="billing_full_address"
                                    />
                                    <ErrorMessage
                                      name="billing_full_address"
                                      component={FieldError}
                                    />
                                    <label
                                      htmlFor="exampleFormControlTextarea1"
                                      className={`form-label ${values.billing_full_address
                                          ? "up-design"
                                          : ""
                                        }`}
                                    >
                                      Full Address
                                    </label>
                                  </div>
                                  <div className="name">
                                    <div className="form-group log-group log-group001">
                                      <Field name="billing_country" as="select">
                                        <option value="">Country</option>
                                        {this.state.Country.map((e) => {
                                          return (
                                            <option value={e?.id}>
                                              {e?.country_name}
                                            </option>
                                          );
                                        })}
                                      </Field>
                                      <ErrorMessage
                                        name="billing_country"
                                        component={FieldError}
                                      />
                                    </div>
                                    <div className="form-group log-group log-group001">
                                      <Field
                                        as="select"
                                        name="billing_state"
                                        onChange={(e) => {
                                          setFieldValue(
                                            "billing_state",
                                            e.target.value
                                          );
                                          setFieldValue("billing_city", "");
                                          if (e.target.value === "") {
                                            setFieldValue("billing_city", "");
                                            setFieldValue("billing_state", "");
                                            this.setState({ city2: [] });
                                          } else {
                                            setFieldValue(
                                              "billing_state",
                                              e.target.value
                                            );
                                            this.updateCity1(e.target.value);
                                          }
                                        }}
                                      >
                                        <option value="">Select State</option>
                                        {states && states.length > 0
                                          ? states.map((value, index) => {
                                            return (
                                              <option
                                                key={"state2" + index}
                                                value={value.id}
                                              >
                                                {value.name}
                                              </option>
                                            );
                                          })
                                          : null}
                                      </Field>
                                      <ErrorMessage
                                        name="billing_state"
                                        component={FieldError}
                                      />
                                    </div>
                                  </div>
                                  <div className="name">
                                    <div className="form-group log-group log-group001">
                                      <Field as="select" name="billing_city">
                                        <option value="">Select City</option>
                                        {city2 && city2.length > 0
                                          ? city2.map((value, index) => {
                                            return (
                                              <option
                                                key={"city2" + index}
                                                value={value.id}
                                              >
                                                {value.city}
                                              </option>
                                            );
                                          })
                                          : null}
                                      </Field>
                                      <ErrorMessage
                                        name="billing_city"
                                        component={FieldError}
                                      />
                                    </div>
                                    <div className="form-group log-group log-group001">
                                      <Field
                                        type="text"
                                        id
                                        className="form-control"
                                        placeholder
                                        name="billing_zipcode"
                                        onChange={(e) => {
                                          let result = e.target.value.replace(
                                            /\D/g,
                                            ""
                                          );
                                          setFieldValue(
                                            "billing_zipcode",
                                            result
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name="billing_zipcode"
                                        component={FieldError}
                                      />
                                      <label
                                        htmlFor
                                        className={`log-label ${values.billing_zipcode
                                            ? "up-design"
                                            : ""
                                          }`}
                                      >
                                        Pin Code
                                      </label>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="sav-add-Body">
                                    <div className="row">
                                      {this?.state?.address_data.map(
                                        (item, index) => {
                                          return (
                                            <div
                                              className="col-lg-6 col-md-12 com_padd_both"
                                              key={"bill" + index}
                                              onClick={() =>
                                                setFieldValue(
                                                  "billing_address_id",
                                                  item.id
                                                )
                                              }
                                            >
                                              <div
                                                className={
                                                  values.billing_address_id ===
                                                    item.id
                                                    ? "dash-acti"
                                                    : "dashbox"
                                                }
                                              >
                                                <div className="dashbox_head">
                                                  {item.address_title ? (
                                                    <h4>
                                                      <span>
                                                        ({item.address_title})
                                                      </span>
                                                    </h4>
                                                  ) : null}
                                                </div>
                                                <div className="dashbox_body">
                                                  <p>
                                                    <strong> Name </strong>{" "}
                                                    <span>
                                                      {item.first_name +
                                                        " " +
                                                        item.last_name}
                                                    </span>
                                                  </p>
                                                  <p>
                                                    <strong> Address </strong>{" "}
                                                    <span>
                                                      {item.address},{" "}
                                                      {item.user_city_details &&
                                                        item.user_city_details
                                                          .city
                                                        ? item.user_city_details
                                                          .city
                                                        : null}
                                                      ,{" "}
                                                      {
                                                        item.user_state_details
                                                          .name
                                                      }{" "}
                                                      - {item.pincode}
                                                    </span>
                                                  </p>
                                                  <p>
                                                    <strong> Phone </strong>{" "}
                                                    <span>{item.phone}</span>
                                                  </p>
                                                  <p>
                                                    <strong> Email </strong>{" "}
                                                    <span
                                                      style={{
                                                        wordBreak: "break-all",
                                                      }}
                                                    >
                                                      {item.email}
                                                    </span>
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          ) : null}
                        </div>
                        <div className="checkout-btn checkout-btn-res">
                          <ul>
                            <li className="chck">
                              <Link to="/search-product">Continue Shopping</Link>
                            </li>
                            <li className="shp">
                              <button className="" type="submit">
                                Place Order
                              </button>
                            </li>
                            {/* <li className="chck chck-pay">
                              <a onClick={() => this.payNow()}>Pay Now</a>
                            </li> */}
                          </ul>
                        </div>
                        <FormikErrorFocus
                          offset={0}
                          align={"middle"}
                          focusDelay={200}
                          ease={"linear"}
                          duration={1000}
                        />
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
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
export default connect(null, mapDispatchToProps)(Checkout);
