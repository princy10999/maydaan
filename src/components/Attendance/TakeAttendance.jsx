import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
// import view from "../../assets/images/view.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import rupe from "../../assets/images/rupe.png";
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
import Message from "../Layout/Message";

// const ExampleCustomInput =()=> {

//   const {value, onClick} = this.props;

//   return (
//       <div className="form-group">
//           {/* <input type="text" className="form-control" value={value} onClick={onClick}/>
//           <IconCalendar className="date-picker-icon" onClick={onClick}></IconCalendar> */}
//            <input type="text" placeholder="Select" id="datepicker" class="date_calc" value={value} onClick={onClick}/>
//       </div>
//   );

// }

class TakeAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendance_data: [],
      userid: "",
      date: new Date(),
      trainer:[]
    };
  }

  componentDidMount() {
    let user = JSON.parse(getLSItem("user"));
    this.setUdata(user.id);
    // this.setState({userid: user.id})
    let data1 = {
      params: {
        club_id: user.id,
        trainer_id: this.props.match.params.id,
      },
    };
    axios.post("get-trainer-info", data1).then((res) => {
      this.props.onUpdateLoader(false);
      this.setState({
        trainer: res.data.result.trainer
      })
    })

    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Take Attendance";
  }

  setUdata = (id) => {
    this.setState({ userid: id });
    this.getlist(id);

    // console.log("--------",id,this.state.userid)
  };

  getlist = (id) => {
    let body = {
      params: {
        date: dateFormat(this.state.date, "yyyy-mm-dd"),
        club_id: id,
        trainer_id: this.props.match.params.id,
        member_id: "",
        status: "",
      },
    };

    this.props.onUpdateLoader(true);

    axios.post("/getAttendance", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.props.onUpdateLoader(false);
      this.setState({ attendance_data: res.data.result.club_assoc_members });
    });
  };

  takeAttendance = (id, status) => {
    let body = {
      params: {
        date: dateFormat(this.state.date, "yyyy-mm-dd"),
        club_id: this.state.userid,
        trainer_id: this.props.match.params.id,
        member_id: [id],
        status: [status],
      },
    };

    this.props.onUpdateLoader(true);

    axios.post("/takeAttendance", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      this.props.onUpdateLoader(false);
      if (res.data.result) {
        this.getlist(this.state.userid);

        this.props.onUpdateSuccess(res.data.result.meaning);
      }
      // this.setState({attendance_data: res.data.result.club_assoc_members})
    });
  };

  render() {
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
                    <Message />

                    <h1>{this.state.trainer?`Take Attendance (${this.state.trainer.first_name} ${this.state.trainer.last_name})`:null}</h1>
                    <div className="dasbordRightBody for_table_stc">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 com_padd_both order_summary">
                          <div className="dashbox">
                            <div className="dashbox_head">
                              <h4>
                                Attendance Date
                                <span />
                              </h4>

                              <button
                                className="back_btnn01 back_btnn_new01"
                                onClick={() =>
                                  this.props.history.push("/our-trainers")
                                }
                              >
                                Back
                              </button>
                            </div>
                            <div className="dashbox_body tyaa atdn-dt">
                              <div className="row">
                                <div className="col-md-5 col-12">
                                  <div class="iputBx">
                                    <label>Date</label>
                                    <DatePicker
                                      placeholderText="Select Date"
                                      onChange={(value) => {
                                        this.setState({ date: value });
                                      }}
                                      selected={this.state.date}
                                      name="date"
                                      dateFormat="yyyy-MM-dd"
                                      className="form-control"
                                      dropdownMode="select"
                                      showMonthDropdown
                                      showYearDropdown
                                      adjustDateOnChange
                                      // customInput={(<ExampleCustomInput/>)}
                                      // onKeyDown={(e) => {
                                      //   e.preventDefault();
                                      // }}
                                    />
                                    {/* <input type="text" placeholder="Select" id="datepicker" class="date_calc"/> */}
                                  </div>
                                </div>
                                <div className="col-2">
                                  <div class="footdashSec atdn-dash">
                                    <input
                                      type="submit"
                                      value="Go"
                                      class="subbtn"
                                      onClick={() =>
                                        this.getlist(this.state.userid)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*TABLE AREA START*/}
                      <div className="table_01 table">
                        <div className="row amnt-tble">
                          <div className="cel_area amunt cess nw1">
                            Member Name
                          </div>
                          <div className="cel_area amunt cess mar24">
                            Present
                          </div>
                          <div className="cel_area amunt cess mar26">
                            Absent
                          </div>
                        </div>
                        {/*table row-1*/}
                        {this.state.attendance_data ? (
                          <>
                            {this.state.attendance_data.map((item, index) => (
                              <div
                                className="row small_screen2"
                                key={`key${index}`}
                              >
                                <div className="cel_area amunt-detail cess">
                                  {" "}
                                  <span className="hide_big">
                                    Student Name
                                  </span>{" "}
                                  <span className="sm_size">
                                    {item.get_member.first_name}{" "}
                                    {item.get_member.last_name}
                                  </span>
                                </div>
                                <div className="cel_area amunt-detail cess">
                                  {" "}
                                  <span className="hide_big">Present</span>{" "}
                                  <span className="sm_size">
                                    <div className="dot pre100">
                                      <label class="rad">
                                        <input
                                          type="radio"
                                          name={`radio${index}`}
                                          id={`p${index}`}
                                          onClick={() =>
                                            this.takeAttendance(
                                              item.get_member.id,
                                              "P"
                                            )
                                          }
                                          checked={
                                            item.get_member
                                              .get_member_attandencc.length > 0
                                              ? item.get_member
                                                  .get_member_attandencc[0]
                                                  .status == "P"
                                                ? true
                                                : false
                                              : false
                                          }
                                        />
                                        <span class="radio"></span>
                                      </label>
                                    </div>
                                  </span>
                                </div>
                                <div className="cel_area amunt-detail cess">
                                  {" "}
                                  <span className="hide_big">Absent</span>{" "}
                                  <span className="sm_size">
                                    <div className="dot ab1">
                                      <label class="rad">
                                        <input
                                          type="radio"
                                          name={`radio${index}`}
                                          id={`pa${index}`}
                                          onClick={() =>
                                            this.takeAttendance(
                                              item.get_member.id,
                                              "A"
                                            )
                                          }
                                          checked={
                                            item.get_member
                                              .get_member_attandencc.length > 0
                                              ? item.get_member
                                                  .get_member_attandencc[0]
                                                  .status == "A"
                                                ? true
                                                : false
                                              : false
                                          }
                                        />
                                        <span class="radio"></span>
                                      </label>
                                    </div>
                                  </span>
                                </div>
                              </div>
                            ))}
                          </>
                        ) : null}
                      </div>
                      {/* <div className="col-2">
                                <div class="footdashSec atdn-dash">
                                  <input type="submit" value="Submit" class="subbtn" onClick={()=>this.takeAttendance()}/>
                                </div>
                                </div> */}
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
  };
};
export default connect(null, mapDispatchToProps)(TakeAttendance);
