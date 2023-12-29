import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
// import clickhe from "../../assets/images/clickhe.png";

// import delete_dash from "../../assets/images/delete-dash.png";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import * as moment from "moment";
import axios from "../../shared/axios";
import {
  UPDATE_USER,
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import swal from "sweetalert";
import Message from "../Layout/Message";
import { BASE_URL } from "../../store/action/actionTypes";
import FormikErrorFocus from "formik-error-focus";

const profileImagePath = BASE_URL + "/storage/app/public/profile_pics/";
class TrainerEditProfile extends Component {
  File2 = [];
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      profilePicture: null,
      image: [],
      states: [],
      city: [],
      catIds: [],
      msg:"Y"
    };
  }
  componentDidMount() {
    this.props.onUpdateLoader(true);
    // document.title = "Maydaan | Trainer Edit Profile";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    axios.post("/view-info").then((res) => {
      this.props.onUpdateLoader(false);
      //   console.log("view info", res);
      if (res.data.error) {
        swal(res.data.error.meaning, {
          icon: "error",
        });
      } else if (res.data.result && res.data.result.user) {
        let city = [];
        if (res.data.result.cities) city = res.data.result.cities;
        this.setState({
          user: res.data.result.user,
          states: res.data.result.states,
          city: res.data.result.cities,
          catIds: res.data.result.categories,
        });
        if(res.data.result.user.phone!==null){
          this.setState({msg:"N"})
        }
      }
    });
    this.setState({
      profilePicture:
        this.props.user && this.props.user.profile_picture !== null
          ? profileImagePath + "/" + this.props.user.profile_picture
          : null,
    });
  };
  updateCity = (id) => {
    this.props.onUpdateLoader(true);
    if (id) {
      this.props.onUpdateLoader(false);
      axios.post("get-city", { params: { state_id: id } }).then((res) => {
        this.setState({ city: res.data.result.cities });
      });
    } else {
      this.setState({ city: [] });
    }
  };

  fileChangedHandler = (event) => {
    this.setState({ image: event.target.files[0] });
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      this.setState({ profilePicture: reader.result });
    }.bind(this);
  };
  
  render() {
    const { states, city, user,msg } = this.state;
    const initialValues = {
      fname: user.first_name ? user.first_name : "",
      lname: user.last_name ? user.last_name : "",
      email: user.email ? user.email : "",
      phone: user.phone ? user.phone : "",
      about_trainer: user.about_trainer ? user.about_trainer : "",
      gender: user.gender ? user.gender : "",
      date_of_birth: user.dob ? new Date(user.dob) : "",
      image: "",
      address: user.address ? user.address : "",
      state: user.state_id && user.state_id!=="0" ? user.state_id : "",
      city_id: user.city_id && user.city_id!=="0"? user.city_id : "",
      pin_code: user.pincode ? user.pincode : "",
      terms_condition: user.terms_conditions ? user.terms_conditions : "",
      category_Id:
        user.get_associated_category &&
        user.get_associated_category.length > 0 &&
        user.get_associated_category[0].get_category_details &&
        user.get_associated_category[0].get_category_details.id
          ? user.get_associated_category[0].get_category_details.id
          : "",
    };

    const validationSchema = Yup.object({
      fname: Yup.string().required("Please enter your first name!"),
      lname: Yup.string().required("Please enter your last name!"),
      phone: Yup.string()
        .required("Please enter your phone number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid mobile number")
        .min(10, "Phone number must be at least 10 characters")
        .max(10, "Phone number contains maximum 10 characters"),
      about_trainer: Yup.string().required("Please enter about the trainer!"),
      gender: Yup.string().required("Please select gender!"),
      date_of_birth: Yup.date()
        .required("Please enter your date of birth!")
        .max(moment().format("YYYY-MM-DD"),"Date of birth can not be in the future!")
        .nullable(),
        
      terms_condition: Yup.string().required(
        "Please enter terms and conditions!"
      ),
      city_id: Yup.string().required("Please select city!"),
      address: Yup.string().required("Please enter your full address!"),
      state: Yup.string().required("Please select state!"),
      pin_code: Yup.string().required("Please enter your pin code!").matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
      category_Id: Yup.string().required("Please select subject or sports you are associated into!"),
    });

    const onSubmit = (values) => {
      var image = document.getElementById("container_img");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if(image.width <= 700 && image.height <= 700 && image.width >= 100 && image.height >= 100){
      this.props.onUpdateLoader(true);
      // console.log("FormData",values);
      const NewDate = moment(values.date_of_birth, "YYYY-MM-DD");
      var formData = new FormData();
      formData.append("first_name", values.fname);
      formData.append("last_name", values.lname);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("dob", NewDate);
      formData.append("address", values.address);
      formData.append("state_id", values.state);
      formData.append("city_id", values.city_id);
      formData.append("pincode", values.pin_code);
      formData.append("about_trainer", values.about_trainer);
      formData.append("year_of_establishment", "1980");
      formData.append("terms_conditions", values.terms_condition);
      formData.append("video_url", values.video_url);
      formData.append("category_ids[0]", values.category_Id);
      formData.append("profile_picture", this.state.image);
      this.File2.forEach((item, index) => {
        formData.append("images[" + index + "]", item);
      });

      axios.post("/update-trainer-profile", formData).then((res) => {
        this.File2 = [];
        this.props.onUpdateLoader(false);
        // console.log("Trainer_edit_profile", res);
        if (res.data.result.user && res.data.result) {
          this.props.onUpdateUser(res.data.result.user);
          if(msg==="N"){
            this.props.onUpdateSuccess(res.data.result.meaning);
          }else if(msg==="Y"){
            swal({
              title: "",
              text: "Your profile is updated successfully! To make it publicly available, please set your monthly membership fees.",
              icon: "success",
            }).then((isConfirmed) => {
              if (isConfirmed) {
                this.props.history.push("/manage-subscription");
              }
            });
          }
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
          if (res.data.error.terms_conditions) {
            this.props.onUpdateError(res.data.error.terms_conditions[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.phone) {
            this.props.onUpdateError(res.data.error.phone[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.profilePicture) {
            this.props.onUpdateError(res.data.error.profilePicture[0]);

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
          if (res.data.error.about_trainer) {
            this.props.onUpdateError(res.data.error.about_trainer[0]);

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
          if (res.data.error.category_ids) {
            this.props.onUpdateError(res.data.error.category_ids[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
         
          if (res.data.error.message) {
            this.props.onUpdateError(res.data.error.meaning);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      });
    }else{
      swal({
        title: "",
        icon: "warning",
        text: "Please upload profile Image in between 100 to 700 pixel of height and width.",
      });
     }
    };
    return (
     <>
       <Helmet>
        <title>{Titles?.trainerEditProfile?.title}</title>
        <meta
            name="description"
            content={Titles?.trainerEditProfile?.description}
        />
        <meta property="og:title" content={Titles?.trainerEditProfile?.ogTitle} />
        <meta property="og:description" content={Titles?.trainerEditProfile?.ogDescription} />
        <meta property="og:image" content={Titles?.trainerEditProfile?.ogImage} />
        <link rel="canonical" href={Titles?.trainerEditProfile?.link} />
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
                    <h1>Create Profile</h1>
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
                                  <label>Email</label>
                                  <Field
                                    type="text"
                                    className="readd_only"
                                    placeholder
                                    readOnly
                                    name="email"
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Phone</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
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
                              <div className="col-md-6 col-sm-6">
                                <div className="iputBx">
                                  <label>Gender</label>
                                  <Field as="select" name="gender">
                                    <option value="">Select</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                  </Field>
                                  <ErrorMessage
                                    name="gender"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>D.O.B</label>
                                  <DatePicker
                                  placeholderText="Select"
                                    onChange={(value) => {
                                      setFieldTouched("date_of_birth");
                                      setFieldValue("date_of_birth", value);
                                    }}
                                    selected={values.date_of_birth}
                                    name="date_of_birth"
                                    dateFormat="MMMM d, yyyy"
                                    className="form-control"
                                    dropdownMode="select"
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                   }}
                                  />
                                  <ErrorMessage
                                    name="date_of_birth"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="form_fild_area_m frm_grp iputBx">
                                  <label>
                                    Subject or sports you are associated into{" "}
                                  </label>
                                  <Field
                                    as="select"
                                    className="chosen-select"
                                    name="category_Id"
                                  >
                                    <option value="">Select Catagory</option>
                                    {this.state.catIds &&
                                    this.state.catIds.length > 0
                                      ? this.state.catIds.map((item, index) => {
                                          return (
                                            <option
                                              key={"category" + index}
                                              value={item.id}
                                            >
                                              {item.name}
                                            </option>
                                          );
                                        })
                                      : null}
                                  </Field>
                                  <ErrorMessage
                                    name="category_Id"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="iputBx">
                                  <label>About the Trainer</label>
                                  <Field
                                    as="textarea"
                                    placeholder="About"
                                    name="about_trainer"
                                  />
                                  <ErrorMessage
                                    name="about_trainer"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="iputBx">
                                  <label>Terms and conditions</label>
                                  <Field
                                    as="textarea"
                                    placeholder="Enter here"
                                    name="terms_condition"
                                  />
                                  <ErrorMessage
                                    name="terms_condition"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12 mb-2">
                                <div className="uplodimg">
                                <div className="upld-txt">
                                  <span>Profile Image</span>
                                  <p>(Recomended size: 1:1 aspect ratio )</p>
                                  </div>
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
                                      Upload Profile Image
                                      <img src={process.env.PUBLIC_URL + "/images/clickhe.png"} alt="" />
                                    </label>
                                  </div>
                                  <div className="uplodimgfilimg">
                                    <em>
                                      {this.state.profilePicture ? (
                                        <img
                                          src={this.state.profilePicture}
                                          alt=""
                                        />
                                      ) : null}
                                    </em>
                                  </div>
                                  <img
                                        id="container_img"
                                          src={this.state.profilePicture}
                                          alt=""
                                        />
                                </div>
                              </div>
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
                                        this.setState({city:[]})
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
                            <div className="footdashSec">
                              <input
                                type="submit"
                                value="Save all changes"
                                className="subbtn"
                              />
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
     </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateUser: (cnt) => dispatch({ type: UPDATE_USER, value: cnt }),
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
export default connect(mapStateToProps, mapDispatchToProps)(TrainerEditProfile);
