import React, { Component } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import FieldError from "../../shared/FieldError";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import clickhe from "../../assets/images/clickhe.png";
import swal from "sweetalert";
import * as Yup from "yup";
import axios from "../../shared/axios";
import FormikErrorFocus from "formik-error-focus";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import { BASE_URL } from "../../store/action/actionTypes";

class AddTrainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      TrainerProfilePic: null,
      image: [],
      categoryIds: [],
      states: [],
      city: [],
      trainers: [],
    };
  }
  componentDidMount() {
    this.props.onUpdateLoader(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios.post("/view-info").then((res) => {
      this.props.onUpdateLoader(false);
    //   console.log("view info", res);
      if (res.data.error) {
        swal(res.data.error.meaning, {
          icon: "error",
        });
      } else if (res.data.result && res.data.result.user) {
        this.setState({
          user: res.data.result.user,
        });
      }
    });
    if (this.props.match.params.id) {
      document.title = "Maydaan | Edit Trainer";
      this.props.onUpdateLoader(true);
      let data1 = {
        params: {
          club_id: this.props.user.id,
          trainer_id: this.props.match.params.id,
        },
      };
      axios.post("get-trainer-info", data1).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("Edit-trainer-info", res);
        this.setState({
          trainers: res.data.result.trainer,
          states: res.data.result.states,
          city: res.data.result.cities,
          categoryIds: res.data.result.club_categories,
        });
        this.setState({
          TrainerProfilePic:
            res.data.result.trainer &&
            res.data.result.trainer.profile_picture !== null
              ? BASE_URL +
                "/storage/app/public/profile_pics/" +
                res.data.result.trainer.profile_picture
              : null,
        });
      });
    } else {
      document.title = "Maydaan | Add Trainer";
      this.props.onUpdateLoader(true);

      let data = {
        params: {
          club_id: this.props.user.id,
        },
      };
      axios.post("get-trainer-info", data).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("trainer-info", res);
        this.setState({
          states: res.data.result.states,
          categoryIds: res.data.result.club_categories,
        });
      });
    }
  }
  fileChangedHandler = (event) => {
    this.setState({ image: event.target.files[0] });
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      this.setState({ TrainerProfilePic: reader.result });
    }.bind(this);
  };

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
    const { states, city, trainers } = this.state;
    const initialValues = {
      fname: trainers.first_name ? trainers.first_name : "",
      lname: trainers.last_name ? trainers.last_name : "",
      phone: trainers.phone ? trainers.phone : "",
      address: trainers.address ? trainers.address : "",
      state: trainers.state_id ? trainers.state_id : "",
      city_id: trainers.city_id ? trainers.city_id : "",
      pin_code: trainers.pincode ? trainers.pincode : "",
      categoryId:
        trainers.get_associated_category && trainers.get_associated_category.length>0 &&trainers.get_associated_category[0] &&
        trainers.get_associated_category[0].get_category_details &&
        trainers.get_associated_category[0].get_category_details.id
          ? trainers.get_associated_category[0].get_category_details.id
          : "",
      image: "",
    };
    const validationSchema = Yup.object({
      fname: Yup.string().required("Please enter first name!"),
      lname: Yup.string().required("Please enter last name!"),
      phone: Yup.string()
        .required("Please enter contact number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid mobile number")
        .min(10, "Mobile number must be at least 10 characters")
        .max(10, "Mobile number contains maximum 10 characters"),
      categoryId: Yup.string().required("Please enter category!"),
      city_id: Yup.string().required("Please select city!"),
      address: Yup.string().required("Please enter full address!"),
      state: Yup.string().required("Please select state!"),
      pin_code: Yup.string().required("Please enter your pin code!").matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(true);
      // console.log("AddTrainer",values);
      var formData = new FormData();
      formData.append("trainer_id", trainers.id);
      formData.append("first_name", values.fname);
      formData.append("last_name", values.lname);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("state_id", values.state);
      formData.append("city_id", values.city_id);
      formData.append("pincode", values.pin_code);
      formData.append("category_ids[0]", values.categoryId);
      formData.append("profile_picture", values.image);

      let url = "club-add-trainer";
      if (trainers.id) url = "club-edit-trainer";
      axios.post(url, formData).then((res) => {
        this.props.onUpdateLoader(false);
        console.log("Add/edit-trainer", res);
        if (res.data.result) {
          this.props.onUpdateSuccess(res.data.result.meaning);
          this.props.history.push("/our-trainers");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (res.data.error) {
          if (res.data.error.first_name) {
            this.props.onUpdateError(res.data.error.first_name[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.last_name) {
            this.props.onUpdateError(res.data.error.last_name[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.phone) {
            this.props.onUpdateError(res.data.error.phone[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.image) {
            this.props.onUpdateError(res.data.error.image[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.dob) {
            this.props.onUpdateError(res.data.error.dob[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.gender) {
            this.props.onUpdateError(res.data.error.gender[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.city_id) {
            this.props.onUpdateError(res.data.error.city_id[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.state_id) {
            this.props.onUpdateError(res.data.error.state_id[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.address) {
            this.props.onUpdateError(res.data.error.address[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.pincode) {
            this.props.onUpdateError(res.data.error.pincode[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.message) {
            this.props.onUpdateError(res.data.error.meaning);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
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
                    <h1>{trainers.id ? "Edit" : "Add"} Trainer</h1>
                    <div className="dasbordRightBody">
                      <Message />
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
                          <Form action="edit-profile-service-offered.html">
                            <div className="row">
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>First name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="fname"
                                  />
                                  <ErrorMessage
                                    name="fname"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Last name</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="lname"
                                  />
                                  <ErrorMessage
                                    name="lname"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Contact</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter Contact Number"
                                    name="phone"
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
                                <div className="form_fild_area_m frm_grp iputBx">
                                  <label>Catagory</label>
                                  <Field
                                    as="select"
                                    className="chosen-select"
                                    name="categoryId"
                                  >
                                    <option value="">Select Catagory</option>
                                    {this.state.categoryIds &&
                                    this.state.categoryIds.length > 0
                                      ? this.state.categoryIds.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                key={"category" + index}
                                                value={item.id}
                                              >
                                                {item.name}
                                              </option>
                                            );
                                          }
                                        )
                                      : null}
                                  </Field>
                                  <ErrorMessage
                                    name="categoryId"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12 mb-2">
                                <div className="uplodimg">
                                  <span>Trainer Profile Image</span>
                                  <div className="uplodimgfil">
                                    <input
                                      name="image"
                                      type="file"
                                      className="inputfile inputfile-1"
                                      id="file-1"
                                      accept="image/*"
                                      autoComplete="off"
                                      onChange={(e) => {
                                        setFieldValue(
                                          "image",
                                          e.target.files[0]
                                        );
                                        setFieldTouched("image");
                                        this.fileChangedHandler(e);
                                      }}
                                    />
                                    <label htmlFor="file-1">
                                      Upload Trainer Image
                                      <img src={process.env.PUBLIC_URL + "/images/clickhe.png"} alt="" />
                                    </label>
                                  </div>
                                  <div className="uplodimgfilimg">
                                    <em>
                                      {this.state.TrainerProfilePic ? (
                                        <img
                                          src={this.state.TrainerProfilePic}
                                          alt=""
                                        />
                                      ) : null}
                                    </em>
                                  </div>
                                </div>
                              </div>
                              {/* </div> */}
                              <div className="col-md-12 col-sm-12">
                                <h3>Address Information</h3>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="iputBx">
                                  <label>Full address</label>
                                  <Field
                                    type="text"
                                    className
                                    placeholder="Enter here"
                                    name="address"
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
                                    placeholder="Enter here"
                                    name="pin_code"
                                    onChange={(e)=>{
                                      let result = e.target.value.replace(/\D/g, '');
                                      setFieldValue("pin_code",result)
                                  }}
                                  />
                                  <ErrorMessage
                                    name="pin_code"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="footdashSec for_backk_btnn">
                              <input
                                type="submit"
                                value={trainers.id ?"Save all changes":"Save"}
                                className="subbtn"
                              />
                               <button className="back_btnn01" onClick={()=>this.props.history.push("/our-trainers")}>Back</button>
                            </div>
                            <FormikErrorFocus
                              offset={0}
                              align={"middle"}
                              focusDelay={200}
                              ease={"linear"}
                              duration={1000}
                            />
                          </Form>
                        )}
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AddTrainer);
