import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import { BASE_URL } from "../../store/action/actionTypes";
import axios from "../../shared/axios";
// import pro_pick from "../../assets/images/pro_pick.png"

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: [],
      eventPic: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Event Details";
    this.props.onUpdateLoader(true);
    let data1 = {
      params: {
        slug: this.props.match.params.slug,
      },
    };
    axios.post("view-event-details", data1).then((res) => {
      this.props.onUpdateLoader(false);
    //   console.log("Event-info", res);
      this.setState({
        event: res.data.result.event,
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
  }
  render() {
    const { event } = this.state;
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
                {event ? (
                  <div className="col-lg-9 col-md-12 col-sm-12 rpr-0">
                    <div className="dasbordRightlink ">
                      <h1>Event Details</h1>
                      <div className="dasbordRightBody pb-3">
                        <div className="row">
                          <div className="col-12">
                          <buttton className="back_btnn01 back_btnn_new01 back_btnn_new02" onClick={()=>this.props.history.push("/event-management")}>Back</buttton>
                            <div className="evnt-002">
                              <div className="evnt-002-img">
                                <img
                                    src={event.event_image? this.state.eventPic:(process.env.PUBLIC_URL + "/images/pro_pick.png")}
                                    alt=""
                                    className="img-fluid"
                                  />
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6 col-12">
                            <div className="evnt-002">
                              <h6>Event Title</h6>
                              <p>: {event.event_title}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-12">
                            <div className="evnt-002">
                              <h6>Event Status</h6>
                              <p
                                className={
                                  event.status === "A" ? "green" : event.status === "C" ?"red":""
                                }
                              >
                                : {event.status === "A" ? "Upcoming" :event.status === "C" ?"Cancelled":"Completed"}
                              </p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-12">
                            <div className="evnt-002">
                              <h6>Event Date</h6>
                              <p>: {event.event_date}</p>
                            </div>
                          </div>
                          <div className="col-sm-6 col-12">
                            <div className="evnt-002">
                              <h6>Event Time</h6>
                              <p>: {event.event_time}</p>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="evnt-002">
                              <h6>Venue</h6>
                              <p>
                                : {event.address},
                                {event.user_city_details
                                  ? event.user_city_details.city
                                  : null}
                                ,
                                {event.user_state_details
                                  ? event.user_state_details.name
                                  : null}
                                ,Pin-{event.pincode}
                              </p>
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="evnt-002">
                              <h6>Description</h6>
                              <p dangerouslySetInnerHTML={{ __html: event.about_event ? event.about_event : "" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
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

export default connect(null, mapDispatchToProps)(EventDetails);
