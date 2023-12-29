import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import pagleft from "../../assets/images/pagleft.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import no_result from "../../assets/images/no-result.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import view from "../../assets/images/view.png";
// import block from "../../assets/images/block.png";
// import edit from "../../assets/images/edit.png";
import ReactPaginate from "react-paginate";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import swal from "sweetalert";
import axios from "../../shared/axios";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class EventManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      EventList: [],
      page_count: 0,
      per_page: 0,
      offset: 0,
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Event Management"eventManagement
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios
      .post("manage-events", { params: { offset: this.state.offset } })
      .then((res) => {
        // console.log("event", res);
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
        this.setState({
          EventList: res.data.result.events,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
        });
      });
  };
  status = (id) => {
    var data = {
      params: {
        id: id,
      },
    };
    swal({
      text: "Are you sure you want to change status of this event?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("status-change-event", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.getData();
          }
        });
      }
    });
  };
  delete = (id) => {
    var data = {
      params: {
        id: id,
      },
    };
    swal({
      text: "Are you sure you want to delete this event?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("delete-event", data).then((resp) => {
          if (resp.data.result) {
            if (this.state.EventList.length === 1 && this.state.offset > 0) {
              this.setState(
                { offset: this.state.offset - this.state.per_page },
                () => {
                  this.getData();
                }
              );
            } else {
              this.getData();
            }
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    this.setState({ offset: offset }, () => {
      this.getData();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  render() {
    const { EventList } = this.state;
    return (
      <>
        <Helmet>
          <title>{Titles?.eventManagement?.title}</title>
          <meta name="description" content={Titles?.eventManagement?.description} />
          <meta property="og:title" content={Titles?.eventManagement?.ogTitle} />
          <meta
            property="og:description"
            content={Titles?.eventManagement?.ogDescription}
          />
          <meta property="og:image" content={Titles?.eventManagement?.ogImage} />
          <link rel="canonical" href={Titles?.eventManagement?.link} />
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
                      <h1>Event Management</h1>
                      <div
                        className="dasbordRightBody for_table_stc"
                        style={{ position: "relative" }}
                      >
                        <Message />
                        <div className="prod_add">
                          <Link to="add-event">
                            <i className="fa fa-plus" aria-hidden="true" />
                            Create Event
                          </Link>
                        </div>
                        {/* <span class="line-full"></span>	 */}
                        {/*TABLE AREA START*/}
                        {EventList && EventList.length > 0 ? (
                          <div className="table_01 table">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw2">
                                Event Title
                              </div>
                              <div className="cel_area amunt cess nw4">
                                Date
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Time
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Location
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Status
                              </div>
                              <div className="cel_area amunt cess nw6 w16">
                                &nbsp;
                              </div>
                            </div>
                            {/*table row-1*/}
                            {EventList && EventList.length > 0
                              ? EventList.map((item) => {
                                  return (
                                    <div className="row small_screen2">
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Event Title
                                        </span>{" "}
                                        <span className="sm_size">
                                          {item.event_title}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Date
                                        </span>{" "}
                                        <span className="sm_size">
                                          {item.event_date}
                                        </span>{" "}
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Time</span>
                                        <span className="sm_size">
                                          {item.event_time}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Location
                                        </span>
                                        <span className="sm_size">
                                          {" "}
                                          {item.user_state_details.name}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Status</span>
                                        <span className="sm_size">
                                          {item.status === "A" ? (
                                            <>
                                              <span className="sm_size clor_done">
                                                Upcoming
                                              </span>
                                            </>
                                          ) : null}
                                          {item.status === "C" ? (
                                            <>
                                              <span className="sm_size clor_cancel">
                                                Canceled
                                              </span>
                                            </>
                                          ) : null}
                                          {item.status === "CM" ? (
                                            <>
                                              <span className="sm_size">
                                                Completed
                                              </span>
                                            </>
                                          ) : null}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Action</span>
                                        <ul>
                                          {item.status === "A" ? (
                                            <li>
                                              <Link
                                                to={`/event-details/${item.slug}`}
                                              >
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/view.png"
                                                  }
                                                  alt=""
                                                  title="view"
                                                />{" "}
                                              </Link>
                                            </li>
                                          ) : null}
                                          {item.status === "A" ? (
                                            <li>
                                              <Link
                                                to="#"
                                                onClick={() =>
                                                  this.status(item.id)
                                                }
                                              >
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/block.png"
                                                  }
                                                  alt=""
                                                  title="Cancel"
                                                />
                                              </Link>
                                            </li>
                                          ) : null}
                                          {item.status === "A" ? (
                                            <li>
                                              <Link
                                                to={`/edit-event/${item.slug}`}
                                              >
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/edit.png"
                                                  }
                                                  title="Edit"
                                                  alt=""
                                                />{" "}
                                              </Link>
                                            </li>
                                          ) : null}
                                          {item.status !== "CM" ? (
                                            <li>
                                              {" "}
                                              <Link
                                                to="#"
                                                onClick={() =>
                                                  this.delete(item.id)
                                                }
                                              >
                                                <img
                                                  src={
                                                    process.env.PUBLIC_URL +
                                                    "/images/delete-dash.png"
                                                  }
                                                  alt=""
                                                  title="Delete"
                                                />{" "}
                                              </Link>
                                            </li>
                                          ) : null}
                                        </ul>
                                      </div>
                                    </div>
                                  );
                                })
                              : null}
                          </div>
                        ) : (
                          <>
                            {!this.state.loader ? (
                              <div className="n-resul">
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/no-result.png"
                                  }
                                  alt=""
                                />
                                <p>
                                  Your Event management is empty! Click "Add to
                                  Event" button to add events.
                                </p>
                              </div>
                            ) : null}
                          </>
                        )}
                        {/*TABLE AREA END*/}
                        {this.state.page_count > 1 ? (
                          <div className="pag_red pag_for_dash">
                            <div className="paginationsec">
                              <ReactPaginate
                                activeClassName="actv"
                                activeLinkClassName="actv"
                                initialPage={0}
                                breakLabel="....."
                                onPageChange={(e) => this.handlePageClick(e)}
                                pageCount={this.state.page_count}
                                previousLabel={
                                  <>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/pagleft.png"
                                      }
                                      alt=""
                                      className="dpb"
                                    />
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/paglefthov.png"
                                      }
                                      alt=""
                                      className="dpn"
                                    />
                                  </>
                                }
                                nextLabel={
                                  <>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/pagright.png"
                                      }
                                      alt=""
                                      className="dpb"
                                    />
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/pagrightho.png"
                                      }
                                      alt=""
                                      className="dpn"
                                    />
                                  </>
                                }
                                marginPagesDisplayed={1}
                                renderOnZeroPageCount={null}
                              />
                            </div>
                          </div>
                        ) : null}
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
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(EventManagement);
