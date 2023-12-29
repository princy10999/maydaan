import React, { Component } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import FieldError from "../../shared/FieldError";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import clickhe from "../../assets/images/clickhe.png";
import swal from "sweetalert";
import * as Yup from "yup";
import * as moment from "moment";
import axios from "../../shared/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormikErrorFocus from "formik-error-focus";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import { BASE_URL } from "../../store/action/actionTypes";
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import TimePicker from '@mui/lab/TimePicker';


class CreateEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
      eventPic: [],
      image: [],
      states: [],
      city: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.onUpdateLoader(true);
    axios.post("/get-list", { params: {} }).then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("===",res);
      this.setState({ states: res.data.result.states });
    });
    if (this.props.match.params.slug) {
      document.title = "Maydaan | Edit Event";
      this.props.onUpdateLoader(true);
      let data1 = {
        params: {
          slug: this.props.match.params.slug,
        },
      };
      axios.post("view-event-details", data1).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("Event-info", res);
        this.setState({
          event: res.data.result.event,
          city: res.data.result.cities,
        });
        this.setState({
          eventPic:
            res.data.result.event && res.data.result.event.event_image !== null
              ? BASE_URL +
                "/storage/app/public/event_images/" +
                res.data.result.event.event_image
              : null,
        });
      });
    } else {
      document.title = "Maydaan | Add Event";
    }
  }
  fileChangedHandler = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      this.setState({ eventPic: reader.result });
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
    const { states, city, event } = this.state;
    const initialValues = {
      ename: event.event_title ? event.event_title : "",
      date: event.event_date ? new Date(event.event_date) : "",
      time: event.event_time ?  new Date("2014-08-18T"+event.event_time) : "",
      about: event.about_event ? event.about_event : "",
      address: event.address ? event.address : "",
      state: event.state_id ? event.state_id : "",
      city_id: event.city_id ? event.city_id : "",
      pin_code: event.pincode ? event.pincode : "",
      image: "",
    };
    const validationSchema = Yup.object({
      ename: Yup.string().required("Please enter event name!"),
      date: Yup.date()
        .required("Please enter date!")
        .min(
          moment().format("YYYY-MM-DD"),
          "Date of event can not be in the past!"
        )
        .nullable(),
      time: Yup.string().required("Please enter time!").nullable(),
      about: Yup.string().required("Please enter about the event!"),
      city_id: Yup.string().required("Please select city!"),
      address: Yup.string().required("Please enter full address!"),
      state: Yup.string().required("Please select state!"),
      pin_code: Yup.string().required("Please enter your pin code!").matches(/^[1-9][0-9]{5}$/, "Invalid pin code!"),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(true);
      //   console.log("AddEvent",values);
      const NewDate = moment(values.date, "YYYY-MM-DD");
      const NewTime=moment(values.time).format("hh:mm:ss A")
      var formData = new FormData();
      formData.append("event_id", event.id);
      formData.append("event_title", values.ename);
      formData.append("event_date", NewDate);
      formData.append("event_time", NewTime);
      formData.append("about_event", values.about);
      formData.append("address", values.address);
      formData.append("state_id", values.state);
      formData.append("city_id", values.city_id);
      formData.append("pincode", values.pin_code);
      formData.append("event_image", values.image);

      let url = "add-event";
      if (event.id) url = "edit-event";
      axios.post(url, formData).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("Add/edit-event", res);
        if (res.data.result) {
          this.props.onUpdateSuccess(res.data.result.meaning);
          this.props.history.push("/event-management");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (res.data.error) {
          if (res.data.error.event_title) {
            this.props.onUpdateError(res.data.error.event_title[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.event_date) {
            this.props.onUpdateError(res.data.error.event_date[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.event_time) {
            this.props.onUpdateError(res.data.error.event_time[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.event_image) {
            this.props.onUpdateError(res.data.error.event_image[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.about_event) {
            this.props.onUpdateError(res.data.error.about_event[0]);

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
                    <h1>{event.id ? "Edit" : "Add"} Event</h1>
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
                              <div className="col-md-12 col-sm-12">
                                <div className="iputBx">
                                  <label>Event Title</label>
                                  <Field
                                    type="text"
                                    placeholder="Enter here"
                                    name="ename"
                                  />
                                  <ErrorMessage
                                    name="ename"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Date</label>
                                  <DatePicker
                                  placeholderText="Select Date"
                                    onChange={(value) => {
                                      setFieldTouched("date");
                                      setFieldValue("date", value);
                                    }}
                                    selected={values.date}
                                    name="date"
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
                                    name="date"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                    <label>Time</label>
                                    <LocalizationProvider  dateAdapter={AdapterDateFns}>
                                    <TimePicker
                                      name="time" 
                                      value={values.time}
                                      onChange={(value) => {
                                        setFieldTouched("time");
                                        setFieldValue("time", value);
                                      }}
                                      renderInput={(params) => <TextField  {...params} />}
                                    />
                                    </LocalizationProvider>
                                    <ErrorMessage
                                    name="time"
                                    component={FieldError}
                                  />
                                </div>
                                </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="iputBx">
                                  <label>About the event</label>
                                  <Field
                                    as="textarea"
                                    placeholder="Enter here"
                                    name="about"
                                  />
                                  <ErrorMessage
                                    name="about"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="uplodimg">
                                <div className="upld-txt">
                                  <span>Event Image</span>
                                  <p>(Recomended size: 5:4 aspect ratio )</p>
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
                                      Upload Event Image
                                      <img src={process.env.PUBLIC_URL + "/images/clickhe.png"} alt="" />
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="uploaded_ppc">
                                  <div className="up_pic h_auto">
                                  <span>
                                  {this.state.eventPic ? (
                                    <img src={this.state.eventPic} alt="" />
                                  ) : null}
                                  </span>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <h3>Event Location</h3>
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
                                value={event.id?"Save all changes":"Post Event"}
                                className="subbtn"
                              />
                              <button className="back_btnn01" onClick={()=>this.props.history.push("/event-management")}>Back</button>
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

export default connect(null, mapDispatchToProps)(CreateEvent);
