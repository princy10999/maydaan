import React, { Component } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import FieldError from "../../shared/FieldError";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import * as Yup from "yup";
import axios from "../../shared/axios";
import FormikErrorFocus from "formik-error-focus";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
class AddAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: [],
      city: [],
      address: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (this.props.match.params.id) {
      document.title = "Maydaan | Edit Address";
      this.props.onUpdateLoader(true);
      axios
        .post("/show-address-details", {
          params: { id: this.props.match.params.id },
        })
        .then((res) => {
          this.props.onUpdateLoader(false);
          this.setState({
            address: res.data.result.UserToAddressBook,
            states: res.data.result.states,
            city: res.data.result.cities,
          });
        });
    } else {
      document.title = "Maydaan | Add Address";
      this.props.onUpdateLoader(true);
      axios.post("/get-list").then((res) => {
        this.props.onUpdateLoader(false);
        this.setState({ states: res.data.result.states });
      });
    }
  }
  updateCity = (id) => {
    this.props.onUpdateLoader(true);
    if (id) {
      axios.post("get-city", { params: { state_id: id } }).then((res) => {
        this.props.onUpdateLoader(false);
        this.setState({ city: res.data.result.cities });
      });
    } else {
      this.setState({ city: [] });
    }
  };
  render() {
    const { states, city, address } = this.state;
    const initialValues = {
      address_title: address.address_title ? address.address_title : "",
      first_name: address.first_name ? address.first_name : "",
      last_name: address.last_name ? address.last_name : "",
      address: address.address ? address.address : "",
      state: address.state_id ? address.state_id : "",
      city_id: address.city_id ? address.city_id : "",
      pincode: address.pincode ? address.pincode : "",
      phone: address.phone ? address.phone : "",
      email: address.email ? address.email : "",
    };

    const validationSchema = Yup.object().shape({
      address_title: Yup.string().required("Please enter name!"),
      first_name: Yup.string().required("Please enter first name!"),
      last_name: Yup.string().required("Please enter last name!"),
      address: Yup.string().required("Please enter full address!"),
      state: Yup.string().required("Please select state!"),
      city_id: Yup.string().required("Please select city!"),
      pincode: Yup.string().required("Please enter your pin code!").matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
      phone: Yup.string()
        .required("Please enter phone number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number!")
        .min(10, "Phone number must be at least 10 characters!")
        .max(10, "Phone number contains maximum 10 characters!"),
      email: Yup.string()
        .required("Please enter email! ")
        .email("Please enter a valid email!"),
    });
    const handleSubmit = (values, actions) => {
      let body = {
        params: {
          id: address.id,
          address_title: values.address_title,
          first_name: values.first_name,
          last_name: values.last_name,
          address: values.address,
          state_id: values.state,
          city_id: values.city_id,
          pincode: values.pincode,
          phone: values.phone,
          email: values.email,
        },
      };
      let url = "user-add-address-addressbook";
      if (address.id) url = "user-update-address-addressbook";
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(true);
      axios.post(url, body).then((res) => {
        this.props.onUpdateLoader(false);
        if (res.data.result) {
          this.props.onUpdateSuccess(res.data.result.meaning);
          this.props.history.push("/address-book");
        }
        if (res.data.error) {
          this.props.onUpdateError(res.data.error.meaning);
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
                    <h1>{address.id ? "Edit" : "Add"} Address</h1>
                    <div className="dasbordRightBody">
                      <Formik
                        initialValues={initialValues}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ setFieldValue }) => {
                          return (
                            <Form>
                              <div className="row">
                                <div className="col-md-12 col-sm-12">
                                  <h3 className="mt-0">Basic Information</h3>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <div className="iputBx">
                                    <label>Address title</label>
                                    <Field
                                      type="text"
                                      name="address_title"
                                      placeholder="Enter here"
                                    />
                                    <ErrorMessage
                                      name="address_title"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <div className="iputBx">
                                    <label>First name</label>
                                    <Field
                                      type="text"
                                      name="first_name"
                                      placeholder="Enter here"
                                    />
                                    <ErrorMessage
                                      name="first_name"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-12">
                                  <div className="iputBx">
                                    <label>Last name</label>
                                    <Field
                                      type="text"
                                      name="last_name"
                                      placeholder="Enter here"
                                    />
                                    <ErrorMessage
                                      name="last_name"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                  <h3>Address Information</h3>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                  <div className="iputBx">
                                    <Field
                                      type="text"
                                      name="address"
                                      placeholder="Enter here"
                                    />
                                    <ErrorMessage
                                      name="address"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-4 col-sm-6">
                                <div className="iputBx">
                                  <label>State</label>
                                  <Field
                                    as="select"
                                    name="state"
                                    onChange={(e) => {
                                      setFieldValue("state", e.target.value);
                                      setFieldValue("city_id", "");
                                      if (e.target.value === "") {
                                        setFieldValue("city_id", "");
                                        setFieldValue("state", "");
                                        this.setState({ city: [] });
                                      } else {
                                        setFieldValue("state", e.target.value);
                                        this.updateCity(e.target.value);
                                      }
                                    }}
                                  >
                                    <option value="">Select</option>
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
                                    name="state"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-4 col-sm-12">
                                <div className="iputBx">
                                  <label>City</label>
                                  <Field as="select" name="city_id">
                                    <option value="">Select</option>
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
                                    name="city_id"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                                <div className="col-md-4 col-sm-12">
                                  <div className="iputBx">
                                    <label>Pin code</label>
                                    <Field
                                      type="text"
                                      name="pincode"
                                      placeholder="Enter here"
                                      onChange={(e)=>{
                                        let result = e.target.value.replace(/\D/g, '');
                                        setFieldValue("pincode",result)
                                    }}
                                    />
                                    <ErrorMessage
                                      name="pincode"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                  <h3>Contact Information</h3>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                  <div className="iputBx">
                                    <label>Phone number</label>
                                    <Field
                                      type="text"
                                      name="phone"
                                      placeholder="Enter here"
                                      onChange={(e)=>{
                                        let result = e.target.value.replace(/\D/g, '');
                                        setFieldValue("phone",result)
                                    }}
                                    />
                                    <ErrorMessage
                                      name="phone"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                  <div className="iputBx">
                                    <label>Email address </label>
                                    <Field
                                      type="text"
                                      name="email"
                                      placeholder="Enter here"
                                    />
                                    <ErrorMessage
                                      name="email"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className={address.id ?"footdashSec for_backk_btnn":"footdashSec"}>
                                <input
                                  type="submit"
                                  value={address.id ?"Save all changes":"Save address"}
                                  className="subbtn"
                                />
                                {address.id ?
                                <button className="back_btnn01" onClick={()=>this.props.history.push("/address-book")}>Back</button>:null}
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
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(AddAddress);
