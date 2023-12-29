import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import clickhe from "../../assets/images/clickhe.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Formik, Form, ErrorMessage, Field } from "formik";
import SelectField from "../../shared/SelectField";
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
import Titles from "../Titles";
import { Helmet } from "react-helmet";

const profileImagePath = BASE_URL + "/storage/app/public/profile_pics/";

class ClubEditProfile extends Component {
  File2 = [];
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      profilePicture: null,
      image: [],
      states: [],
      city: [],
      categoryIds: [],
      msg: "Y",
    };
  }
  componentDidMount() {
    this.props.onUpdateLoader(true);
    // document.title = "Maydaan | Club Edit Profile";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    axios.post("/view-info").then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("view info", res);
      if (res.data.error) {
        swal(res.data.error.meaning, {
          icon: "error",
        });
      } else if (res.data.result && res.data.result.user) {
        if (res.data.result.cities)
          this.setState({
            user: res.data.result.user,
            states: res.data.result.states,
            city: res.data.result.cities,
            categoryIds: res.data.result.categories,
          });
        if (res.data.result.user.phone !== null) {
          this.setState({ msg: "N" });
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
  fileChangedHandler = (event) => {
    this.setState({ image: event.target.files[0] });
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      this.setState({ profilePicture: reader.result });
    }.bind(this);
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

  render() {
    const { states, city, user, categoryIds, msg } = this.state;
    let categoryList = [];
    let userCategoryList = [];
    if (categoryIds && categoryIds.length > 0) {
      categoryList = categoryIds.map((item, index) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    }
    if (user && user.get_associated_category) {
      userCategoryList = user.get_associated_category.map((item, index) => {
        return {
          label: item.get_category_details.name,
          value: item.get_category_details.id,
        };
      });
    }

    const initialValues = {
      fname: user.first_name ? user.first_name : "",
      lname: user.last_name ? user.last_name : "",
      club_name: user.club_name ? user.club_name : "",
      email: user.email ? user.email : "",
      phone: user.phone ? user.phone : "",
      about_club: user.about_club ? user.about_club : "",
      year_of_establishment: user.year_of_establishment
        ? new Date(user.year_of_establishment)
        : "",
      image: "",
      address: user.address ? user.address : "",
      state: user.state_id && user.state_id !== "0" ? user.state_id : "",
      city_id: user.city_id && user.city_id !== "0" ? user.city_id : "",
      pin_code: user.pincode ? user.pincode : "",
      terms_condition: user.terms_conditions ? user.terms_conditions : "",
      categoryids: userCategoryList,
    };
    const validationSchema = Yup.object({
      fname: Yup.string().required("Please enter your first name!"),
      lname: Yup.string().required("Please enter your last name!"),
      club_name: Yup.string().required("Please enter your club name!"),
      phone: Yup.string()
        .required("Please enter your contact number!")
        .matches(/^([0-9\s\-+()]*)$/, "Invalid phone number")
        .min(10, "Phone number must be at least 10 characters")
        .max(10, "Phone number contains maximum 10 characters"),
      about_club: Yup.string().required("Please enter about the club!"),
      year_of_establishment: Yup.date()
        .required("Please enter your year of establishment!")
        .max(
          moment().format("YYYY-MM-DD"),
          "Year of establishment can not be in the future!"
        )
        .nullable(),
      terms_condition: Yup.string().required(
        "Please enter terms and conditions!"
      ),
      city_id: Yup.string().required("Please select city!"),
      address: Yup.string().required("Please enter your full address!"),
      state: Yup.string().required("Please select state!"),
      pin_code: Yup.string()
        .required("Please enter your pin code!")
        .matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
      categoryids: Yup.array().min(
        1,
        "Please select subjects or sports they are associated into!"
      ),
    });
    const onSubmit = (values) => {
      var image = document.getElementById("container_img");
      // console.log('====================================');
      // console.log("`${image.width} x ${image.height}`",`${image.width} x ${image.height}`);
      // console.log('====================================');
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (
        image.width <= 700 &&
        image.height <= 700 &&
        image.width >= 100 &&
        image.height >= 100
      ) {
        this.props.onUpdateLoader(true);
        // console.log("User Edit Profile Formdata", values);
        const NewDate = moment(values.year_of_establishment, "YYYY-MM-DD");
        var formData = new FormData();
        formData.append("first_name", values.fname);
        formData.append("last_name", values.lname);
        formData.append("club_name", values.club_name);
        formData.append("address", values.address);
        formData.append("year_of_establishment", NewDate);
        formData.append("about_club", values.about_club);
        formData.append("phone", values.phone);
        formData.append("state_id", values.state);
        formData.append("city_id", values.city_id);
        formData.append("pincode", values.pin_code);
        formData.append("terms_conditions", values.terms_condition);
        formData.append("video_url", "N");
        for (const key in values.categoryids) {
          formData.append(
            "category_ids[" + key + "]",
            values.categoryids[key].value
          );
        }
        formData.append("profile_picture", this.state.image);

        axios.post("/update-club-profile", formData).then((res) => {
          this.File2 = [];
          this.props.onUpdateLoader(false);
          // console.log("Club_edit_profile", res);
          if (res.data.result && res.data.result.user) {
            this.props.onUpdateUser(res.data.result.user);
            if (msg === "N") {
              this.props.onUpdateSuccess(res.data.result.meaning);
            } else if (msg === "Y") {
              swal({
                title: "",
                text: "Your profile is updated successfully! To make it publicly available, please set your monthly membership fees.",
                icon: "success",
              }).then((isConfirmed) => {
                if (isConfirmed) {
                  this.props.history.push("/manage-membership");
                }
              });
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.error) {
            if (res.data.error.first_name) {
              this.props.onUpdateError(res.data.error.first_name[0]);

              window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (res.data.error) {
              if (res.data.error.last_name) {
                this.props.onUpdateError(res.data.error.last_name[0]);

                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            } else if (res.data.error) {
              if (res.data.error.club_name) {
                this.props.onUpdateError(res.data.error.club_name[0]);

                window.scrollTo({ top: 0, behavior: "smooth" });
              }
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
            if (res.data.error.year_of_establishment) {
              this.props.onUpdateError(res.data.error.year_of_establishment[0]);

              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            if (res.data.error.about_club) {
              this.props.onUpdateError(res.data.error.about_club[0]);

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
      } else {
        swal({
          title: "",
          icon: "warning",
          text: "Please upload club logo in between 100 to 700 pixel of height and width.",
        });
      }
    };
    // console.log("==",initialValues);
    return (
      <>
        <Helmet>
          <title>{Titles?.clubEditProfile?.title}</title>
          <meta
            name="description"
            content={Titles?.clubEditProfile?.description}
          />
          <meta
            property="og:title"
            content={Titles?.clubEditProfile?.ogTitle}
          />
          <meta
            property="og:description"
            content={Titles?.clubEditProfile?.ogDescription}
          />
          <meta
            property="og:image"
            content={Titles?.clubEditProfile?.ogImage}
          />
          <link rel="canonical" href={Titles?.clubEditProfile?.link} />
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
                                <div className="col-md-12 col-sm-12">
                                  <div className="iputBx">
                                    <label>Club name</label>
                                    <Field
                                      type="text"
                                      placeholder="Enter here"
                                      name="club_name"
                                    />
                                    <ErrorMessage
                                      name="club_name"
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
                                      onChange={(e) => {
                                        let result = e.target.value.replace(
                                          /\D/g,
                                          ""
                                        );
                                        setFieldValue("phone", result);
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
                                    <label>Year of establishment</label>
                                    <DatePicker
                                      placeholderText="Select"
                                      onChange={(value) => {
                                        setFieldTouched(
                                          "year_of_establishment"
                                        );
                                        setFieldValue(
                                          "year_of_establishment",
                                          value
                                        );
                                      }}
                                      selected={values.year_of_establishment}
                                      name="year_of_establishment"
                                      dateFormat="MMMM d, yyyy"
                                      className="form-control"
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      max={moment().format("YYYY-MM-DD")}
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                    />
                                    <ErrorMessage
                                      name="year_of_establishment"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                  <div className="form_fild_area_m frm_grp iputBx">
                                    <label>
                                      Subjects or sports they are associated
                                      into{" "}
                                    </label>
                                    <SelectField
                                      className="chosen-select"
                                      name="categoryids"
                                      placeholder="Select"
                                      options={categoryList ? categoryList : []}
                                      value={values.categoryids}
                                      isMulti={true}
                                      onChange={setFieldValue}
                                      onBlur={setFieldTouched}
                                      touched={touched.categoryids}
                                      isClearable={true}
                                      backspaceRemovesValue={true}
                                    />
                                    <ErrorMessage
                                      name="categoryids"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                                <div className="col-md-12 col-sm-12">
                                  <div className="iputBx">
                                    <label>About the Club</label>
                                    <Field
                                      as="textarea"
                                      placeholder="About"
                                      name="about_club"
                                    />
                                    <ErrorMessage
                                      name="about_club"
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
                                      <span>Club Logo</span>
                                      <p>
                                        (Recomended size: 1:1 aspect ratio )
                                      </p>
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
                                          setFieldTouched("image");
                                          this.fileChangedHandler(e);
                                        }}
                                      />
                                      <label htmlFor="file-1">
                                        Upload Club Logo
                                        <img
                                          src={
                                            process.env.PUBLIC_URL +
                                            "/images/clickhe.png"
                                          }
                                          alt=""
                                        />
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
                                          this.setState({ city: [] });
                                        } else {
                                          setFieldValue(
                                            "state",
                                            e.target.value
                                          );
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
                                      onChange={(e) => {
                                        let result = e.target.value.replace(
                                          /\D/g,
                                          ""
                                        );
                                        setFieldValue("pin_code", result);
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
export default connect(mapStateToProps, mapDispatchToProps)(ClubEditProfile);
