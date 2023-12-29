import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import pro_pick from "../../assets/images/pro_pick.png";
// import no_result from "../../assets/images/no-result.png";
// import SLIDER from "../../assets/images/SLIDER.png";
// import search_box from "../../assets/images/search-box.png";
// import location_icon from "../../assets/images/location-icon.png";
import { Formik, Field, Form } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";
import { UPDATE_LOADER, BASE_URL } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import * as moment from "moment";
import { getText } from "../../shared/common";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class SearchEvent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      events: [],
      states: [],
      page_type: "L",
      keyword: "",
      state_id: "",
      city_id: "",
      from_date: "",
      to_date: "",
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Search Event";
    const search = this.props.location.search;
    const key = new URLSearchParams(search).get("keyword");
    if (key !== null) {
      this.setState({ keyword: key });
      let body = {
        params: {
          offset: this.state.offset,
          city_id: this.state.city_id,
          keyword: key,
          page_type: "L",
          state_id: this.state.state_id,
          order_by: this.state.order_by,
          from_date: this.state.from_date,
          to_date: this.state.to_date,
        },
      };
      if (this.props.user) {
        body = {
          params: {
            offset: this.state.offset,
            city_id: this.state.city_id,
            keyword: key,
            page_type: "L",
            state_id: this.state.state_id,
            order_by: this.state.order_by,
            from_date: this.state.from_date,
            to_date: this.state.to_date,
            user_id: this.props.user.id,
          },
        };
      }
      this.props.onUpdateLoader(true);
      this.setState({ loader: true });
      axios.post("/search-events", body).then((res) => {
        // console.log("==",res);
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
        if (res.data.result) {
          this.setState({
            states: res.data.result.states,
            events: res.data.result.events,
            page_count: res.data.result.page_count,
            per_page: res.data.result.per_page,
            page_type: "",
            total: res.data.result.total,
          });
        }
      });
    } else {
      this.filter();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  componentDidUpdate(prevState) {
    const search = this.props.location.search;
    const key = new URLSearchParams(search).get("keyword");
    const search1 = prevState.location.search;
    const key1 = new URLSearchParams(search1).get("keyword");
    if (key != key1) {
      this.setState(
        {
          page_count: 0,
          per_page: 0,
          offset: 0,
          total: 0,
          events: [],
          states: [],
          city: [],
          page_type: "L",
          keyword: "",
          state_id: "",
          city_id: "",
          from_date: "",
          to_date: "",
        },
        () => this.filter()
      );
    }
  }
  filter = () => {
    let body = {
      params: {
        page_type: "L",
      },
    };
    if (this.props.user) {
      body = {
        params: {
          page_type: "L",
          user_id: this.props.user.id,
        },
      };
    }
    if (this.state.page_type !== "L") {
      body = {
        params: {
          offset: this.state.offset,
          city_id: this.state.city_id,
          keyword: this.state.keyword,
          state_id: this.state.state_id,
          order_by: this.state.order_by,
          from_date: this.state.from_date,
          to_date: this.state.to_date,
        },
      };
    }
    if (this.props.user && this.state.page_type !== "L") {
      body = {
        params: {
          offset: this.state.offset,
          city_id: this.state.city_id,
          keyword: this.state.keyword,
          state_id: this.state.state_id,
          order_by: this.state.order_by,
          from_date: this.state.from_date,
          to_date: this.state.to_date,
          user_id: this.props.user.id,
        },
      };
    }
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/search-events", body).then((res) => {
      // console.log("==",res);
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      if (res.data.result) {
        if (this.state.page_type == "L") {
          this.setState({
            states: res.data.result.states,
            page_type: "",
          });
        }
        this.setState({
          events: res.data.result.events,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
        });
      }
    });
  };
  updateOrderBy = (e) => {
    this.setState({ order_by: e.target.value }, () => {
      this.filter();
    });
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    if (this.state.page_type !== "L") {
      this.setState({ offset: offset }, () => {
        this.filter();
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  reset = (resetForm) => {
    resetForm();
    this.setState(
      {
        page_count: 0,
        per_page: 0,
        offset: 0,
        total: 0,
        events: [],
        states: [],
        city: [],
        page_type: "L",
        keyword: "",
        state_id: "",
        city_id: "",
        from_date: "",
        to_date: "",
      },
      () => this.filter()
    );
  };
  updateCity = (id) => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    if (id) {
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      axios.post("get-city", { params: { state_id: id } }).then((res) => {
        this.setState({ city: res.data.result.cities });
      });
    } else {
      this.setState({ city: [] });
    }
  };
  render() {
    const {
      events,
      states,
      keyword,
      state_id,
      total,
      offset,
      per_page,
      from_date,
      to_date,
      city,
    } = this.state;

    const initialValues = {
      keyword: keyword ? keyword : "",
      state_id: state_id,
      from_date: from_date,
      to_date: to_date,
    };
    const handleSubmit = (values, actions) => {
      // console.log(">>>",values);
      if (window.matchMedia("(max-width: 500px)").matches) {
        document.querySelector(".search-filter").style.display = "none";
      }
      this.setState(
        {
          keyword: values.keyword,
          state_id: values.state_id,
          city_id: values.city_id,
          from_date: values.from_date,
          to_date: values.to_date,
          offset: 0,
        },
        () => this.filter()
      );
    };

    return (
      <>
        <Helmet>
          <title>{Titles?.searchEvent?.title}</title>
          <meta name="description" content={Titles?.searchEvent?.description} />
          <meta property="og:title" content={Titles?.searchEvent?.ogTitle} />
          <meta
            property="og:description"
            content={Titles?.searchEvent?.ogDescription}
          />
          <meta property="og:image" content={Titles?.searchEvent?.ogImage} />
          <link rel="canonical" href={Titles?.searchEvent?.link} />
        </Helmet>

        <Layout>
          <div className="results">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-3 col-12">
                  <nav aria-label="breadcrumb" className="bread">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                      </li>
                      <li
                        className="breadcrumb-item active"
                        aria-current="page"
                      >
                        Search Event
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="col-md-3 switch">
                  <div className="panel-box">
                    <Link to="#" className="panelopen click_filter">
                      <i className="fa fa-filter" aria-hidden="true" />
                      Filters
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <h3 className="display">
                    {" "}
                    Displaying ({offset + 1} -{" "}
                    {offset + per_page < total ? offset + per_page : total}) of{" "}
                    {total} results for Events
                  </h3>
                </div>
                <div className="sorrtyy ">
                  <div className="form-group filter-form ne_sorts ">
                    <label htmlFor>Sort by :</label>
                    <select
                      className="form-control rm88"
                      onChange={(e) => {
                        this.updateOrderBy(e);
                      }}
                    >
                      <option value="">All</option>
                      <option value="U">Upcoming</option>
                      <option value="P">Past</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* --------------result bar end----------------- */}
          <div className="main-search-area">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 bor-r p-0">
                  <div className="mobile-list">
                    <p>
                      <i className="fa fa-filter" /> Show Filter
                    </p>
                  </div>
                  <div className="search-filter">
                    <div className="left-panel left-bar">
                      <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        enableReinitialize={true}
                      >
                        {({
                          values,
                          setFieldValue,
                          setFieldTouched,
                          resetForm,
                        }) => {
                          return (
                            <Form>
                              <h3>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/SLIDER.png"
                                  }
                                  alt=""
                                />
                                FILTER YOUR SEARCH
                              </h3>
                              <div className="form-group log-group left-log">
                                <Field
                                  type="text"
                                  name="keyword"
                                  className="form-control"
                                />
                                <label
                                  className={`log-label ${
                                    values.keyword ? "up-design" : ""
                                  }`}
                                >
                                  Keyword
                                </label>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/search-box.png"
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="catagory">
                                <h4>Location</h4>
                                <div className="form-group log-group left-log rm-28">
                                  <Field
                                    as="select"
                                    name="state_id"
                                    onChange={(e) => {
                                      setFieldValue("state_id", e.target.value);
                                      setFieldValue("city_id", "");
                                      if (e.target.value === "") {
                                        setFieldValue("city_id", "");
                                        setFieldValue("state_id", "");
                                        this.setState({ city: [] });
                                      } else {
                                        setFieldValue(
                                          "state_id",
                                          e.target.value
                                        );
                                        this.updateCity(e.target.value);
                                      }
                                    }}
                                  >
                                    <option value="">Select State</option>
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
                                </div>
                                {values.state_id ? (
                                  <div className="form-group log-group left-log rm-28">
                                    <Field as="select" name="city_id">
                                      <option value="">Select City</option>
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
                                  </div>
                                ) : null}
                              </div>
                              <div className="catagory">
                                <h4>Date</h4>
                                <div className="date-pkr">
                                  <label htmlFor>From Date</label>
                                  <span style={{ marginRight: "13px" }}>
                                    <DatePicker
                                      placeholderText="From Date"
                                      onChange={(value) => {
                                        setFieldTouched("from_date");
                                        setFieldValue("from_date", value);
                                      }}
                                      selected={values.from_date}
                                      name="from_date"
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
                                  </span>
                                  <label htmlFor>To Date</label>
                                  <span>
                                    <DatePicker
                                      placeholderText="To Date"
                                      onChange={(value) => {
                                        setFieldTouched("to_date");
                                        setFieldValue("to_date", value);
                                      }}
                                      selected={values.to_date}
                                      name="to_date"
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
                                  </span>
                                </div>
                              </div>
                              <div className="src-panel-btn">
                                <div className="left-panel-btn">
                                  <button type="submit">Apply Filter</button>
                                </div>
                                <div className="left-panel-btn">
                                  <button
                                    type="reset"
                                    onClick={() => this.reset(resetForm)}
                                  >
                                    Reset
                                  </button>
                                </div>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className="right-panel">
                    <div className="club-list-view">
                      <div className="row">
                        {events && events.length > 0 ? (
                          events.map((item, index) => {
                            return (
                              <div
                                className="col-sm-6 col-12 new_col"
                                key={`aeacr` + index}
                              >
                                <div className="event-card">
                                  <div className="event-img event-list">
                                    <Link to={`/event-detail/${item.slug}`}>
                                      <img
                                        src={
                                          item.event_image
                                            ? BASE_URL +
                                              "storage/app/public/event_images/" +
                                              item.event_image
                                            : process.env.PUBLIC_URL +
                                              "/images/pro_pick.png"
                                        }
                                        alt=""
                                        className="event-main"
                                      />
                                    </Link>
                                    <div className="date">
                                      <h5>
                                        {dateFormat(item.event_date, "d")}
                                      </h5>
                                      <h6>
                                        {dateFormat(item.event_date, "mmm")}
                                      </h6>
                                      <h4>
                                        {dateFormat(item.event_date, "yyyy")}
                                      </h4>
                                    </div>
                                    <div className="club-name event-tag">
                                      <h5>
                                        {item.get_user
                                          ? item.get_user.club_name
                                          : null}
                                      </h5>
                                      <h6>
                                        <img
                                          src={
                                            process.env.PUBLIC_URL +
                                            "/images/location-icon.png"
                                          }
                                          alt=""
                                        />
                                        {item.user_city_details
                                          ? item.user_city_details.city
                                          : null}
                                      </h6>
                                    </div>
                                  </div>
                                  <h3>
                                    <Link to={`/event-detail/${item.slug}`}>
                                      {item.event_title}
                                    </Link>
                                  </h3>
                                  {item.about_event ? (
                                    <p>
                                      {item.about_event.length > 25
                                        ? getText(item.about_event).substr(
                                            0,
                                            25
                                          ) + ".."
                                        : getText(item.about_event)}
                                    </p>
                                  ) : (
                                    <p>&nbsp;</p>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            {!this.state.loader ? (
                              <div className="col-12">
                                <div className="n-resul">
                                  <img
                                    src={
                                      process.env.PUBLIC_URL +
                                      "/images/no-result.png"
                                    }
                                    alt=""
                                  />
                                  <p>No result found!</p>
                                </div>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {this.state.page_count > 1 ? (
                    <div className="pag_red">
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
                                  process.env.PUBLIC_URL + "/images/pagleft.png"
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
              {/* ---------------left panel start----------------- */}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(SearchEvent);
