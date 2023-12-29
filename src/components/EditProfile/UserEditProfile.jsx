import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import clickhe from "../../assets/images/clickhe.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import * as moment from "moment";
import axios from "../../shared/axios";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
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

class UserEditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      profilePicture: null,
      image: [],
      states: [],
      city: [],
    };
  }
  componentDidMount() {
    this.props.onUpdateLoader(true);
    // document.title = "Maydaan | User Edit Profile";
    window.scrollTo({ top: 0, behavior: "smooth" });
    axios.post("/view-info").then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("view info",res);
      if (res.data.error) {
        swal(res.data.error.meaning, {
          icon: "error",
        });
      } else if (res.data.result && res.data.result.user) {
        let city = [];
        if (res.data.result.cities) city = res.data.result.cities;
        this.setState({
          user: res.data.result.user,
          city: res.data.result.cities,
        });
      }
    });
    axios.post("/get-list", { params: {} }).then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("===",res);
      this.setState({ states: res.data.result.states });
    });
    this.setState({
      profilePicture:
        this.props.user && this.props.user.profile_picture !== null
          ? profileImagePath + "/" + this.props.user.profile_picture
          : null,
    });
  }
  fileChangedHandler = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      this.setState({ profilePicture: reader.result });
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
    const { states, city, user } = this.state;
    const initialValues = {
      fname: user.first_name ? user.first_name : "",
      lname: user.last_name ? user.last_name : "",
      email: user.email ? user.email : "",
      phone: user.phone ? user.phone : "",
      gender: user.gender ? user.gender : "",
      date_of_birth: user.dob ? new Date(user.dob) : "",
      image: "",
      address: user.address ? user.address : "",
      state:user.state_id && user.state_id!=="0" ? user.state_id : "",
      city_id: user.city_id && user.city_id!=="0" ? user.city_id : "",
      pin_code: user.pincode ? user.pincode : "",
    };

    const validationSchema = Yup.object({
      fname: Yup.string().required("Please enter your first name!"),
      lname: Yup.string().required("Please enter your last name!"),
      phone: Yup.string()
        .required("Please enter your phone number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid mobile number")
        .min(10, "Phone number must be at least 10 characters")
        .max(10, "Phone number contains maximum 10 characters"),
      gender: Yup.string().required("Please select gender!"),
      date_of_birth: Yup.date()
        .required("Please enter your date of birth!")
        .max(moment().format("YYYY-MM-DD"),"Date of birth can not be in the future!")
        .nullable(),
      city_id: Yup.string().required("Please select city!"),
      address: Yup.string().required("Please enter your full address!"),
      state: Yup.string().required("Please select state!"),
      pin_code: Yup.string().required("Please enter your pin code!").matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
      // image: Yup.mixed()
      //   .notRequired()
      //   .nullable()
      //   .test(
      //     "fileType",
      //     "Incorrect file type! Please select a jpg/png/jpeg file!",
      //     (file) =>
      //       file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
      //   ),
    });
    const onSubmit = (values) => {
      var image = document.getElementById("container_img");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if(image.width <= 700 && image.height <= 700 && image.width >= 100 && image.height >= 100){
      this.props.onUpdateLoader(true);
      // console.log("User Edit Profile", values);
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
      formData.append("profile_picture", values.image);

      axios.post("/update-user-profile", formData).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("User_edit_profile",res);

        if (res.data.result && res.data.result.user) {
          this.props.onUpdateUser(res.data.result.user);
          this.props.onUpdateSuccess(res.data.result.meaning);
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
    }else{
      swal({
        title: "",
        icon: "warning",
        text: "Please upload profile Image in between 100 to 700 pixel of height and width.",
      });
     }
    };
    // console.log(".....",this.state.user);
    return (
    <>
        <Helmet>
      <title>{Titles?.userEditProfile?.title}</title>
      <meta
          name="description"
          content={Titles?.userEditProfile?.description}
      />
      <meta property="og:title" content={Titles?.userEditProfile?.ogTitle} />
      <meta property="og:description" content={Titles?.userEditProfile?.ogDescription} />
      <meta property="og:image" content={Titles?.userEditProfile?.ogImage} />
      <link rel="canonical" href={Titles?.userEditProfile?.link} />
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
                    <h1>Edit Profile</h1>
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
                              <div className="col-sm-12">
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
                                        this.fileChangedHandler(
                                          e.target.files[0]
                                        );
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
                                  {/* <ErrorMessage
                                    name="image"
                                    component={FieldError}
                                  /> */}
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
                            <div className="footdashSec">
                              <button type="submit" className="subbtn" >
                                Save all changes
                              </button>
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
export default connect(mapStateToProps, mapDispatchToProps)(UserEditProfile);
