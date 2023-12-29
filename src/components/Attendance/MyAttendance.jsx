import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import { getLSItem } from "../../shared/LocalStorage";
import DatePicker from "react-datepicker";
import dateFormat from "dateformat";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
// import { Calendar, momentLocalizer } from 'react-big-calendar';

// import moment from 'moment';

// import { Eventcalendar } from '@mobiscroll/react';

class MyAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance_data: [],
      absentData: [],
      userid: "",
      date: new Date(),
      details: [],
    };
  }

  componentDidMount() {
    let user = JSON.parse(getLSItem("user"));
    this.setUdata(user.id);
    // this.setState({userid: user.id})
    // console.log("...",this.props.match.params);
    var data = {
      params: {
        id: this.props.match.params.sId,
        offset: 0,
      },
    };
    this.props.onUpdateLoader(true);
    axios.post("view-trainer-to-member-details", data).then((res) => {
      this.props.onUpdateLoader(false);
      if (res.data.result && res.data.result.details) {
        this.setState({
          details: res.data.result.details,
        });
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | My Attendance";
  }
  setUdata = (id) => {
    this.setState({ userid: id });
    this.getlist(id);

    // console.log("--------",id,this.state.userid)
  };

  getlist = (id) => {
    let body = {
      params: {
        club_id: "",
        trainer_id: this.props.match.params.id,
        member_id: id,
        status: "P",
      },
    };

    this.props.onUpdateLoader(true);

    axios.post("/view-calendar-attendance", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.props.onUpdateLoader(false);
      this.setState({
        attendance_data: res.data.result.Attandencc,
        absentData: res.data.result.AbsentAttandencc,
      });
    });
  };

  render() {
    const { details } = this.state;
    return (
     <>
       {/* <Helmet>
      <title>{Titles?.manageOrder?.title}</title>
      <meta
          name="description"
          content={Titles?.manageOrder?.description}
      />
      <meta property="og:title" content={Titles?.manageOrder?.ogTitle} />
      <meta property="og:description" content={Titles?.manageOrder?.ogDescription} />
      <meta property="og:image" content={Titles?.manageOrder?.ogImage} />
      <link rel="canonical" href={Titles?.manageOrder?.link} />
    </Helmet> */}
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
                      My Attendance for(
                      {details &&
                      details.get_trainer &&
                      details.get_trainer.first_name &&
                      details.get_trainer.last_name
                        ? details.get_trainer.first_name +
                          " " +
                          details.get_trainer.last_name
                        : null}
                      )
                    </h1>
                    <div className="dasbordRightBody for_table_stc">
                      <buttton
                        className="back_btnn01 back_btnn_new01 back_btnn_new02"
                        onClick={() =>
                          this.props.history.push(
                            `/my-trainer-details/${this.props.match.params.sId}/${this.props.match.params.type}/${this.props.match.params.member_id}`
                          )
                        }
                      >
                        Back
                      </buttton>
                      <Calendar
                        tileClassName={({ date, view }) =>
                          this.state.attendance_data.map((item, index) =>
                            dateFormat(date, "yyyy-mm-dd") == item?.date &&
                            item?.status === "P"
                              ? "calendar-green"
                              : dateFormat(date, "yyyy-mm-dd") == item?.date &&
                                item?.status === "A"
                              ? "calendar-red"
                              : "calendar-normal"
                          )
                        }
                      />
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
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),

    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(MyAttendance);
