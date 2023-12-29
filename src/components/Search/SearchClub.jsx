import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom";
// import recent_price from "../../assets/images/recent-price.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import price_tag from "../../assets/images/price-tag.png";
// import locationicon from "../../assets/images/location-icon.png";
// import pro_pick from "../../assets/images/pro_pick.png";
// import no_result from "../../assets/images/no-result.png";
// import SLIDER from "../../assets/images/SLIDER.png";
// import search_box from "../../assets/images/search-box.png";
import { Formik, Field, Form } from "formik";
import Slider from "@material-ui/core/Slider";
import axios from "../../shared/axios";
import ReactPaginate from "react-paginate";
import { UPDATE_LOADER, USER_IMAGE } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import { getText } from "../../shared/common";
import { Rating } from "../../shared/Rating";
import Titles from "../Titles";
import { Helmet } from "react-helmet";


class SearchClub extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      min_price: 0,
      max_price: 0,
      from_price: 0,
      to_price: 0,
      sliderValue: [0, 0],
      users: [],
      states: [],
      categories: [],
      page_type: "L",
      keyword: "",
      state_id: "",
      category_ids: [],
      loader:false
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Search Club";
    const search = this.props.location.search;
    const key = new URLSearchParams(search).get("keyword");
    this.setState({ keyword: key });
    let body = {
      params: {
        offset: this.state.offset,
        page_type: "L",
        keyword: key,
        order_by: this.state.order_by,
      },
    };
    if(this.props.user){
      body = {
        params: {
          offset: this.state.offset,
          page_type: "L",
          keyword: key,
          order_by: this.state.order_by,
          user_id:this.props.user.id
        },
      };
    }
    this.props.onUpdateLoader(true);
    this.setState({loader:true})
    axios.post("/search-club", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({loader:false})
      if (res.data.result) {
        this.setState({
          categories: res.data.result.categories,
          states: res.data.result.states,
          max_price: res.data.result.max_price,
          min_price: res.data.result.min_price,
          to_price: res.data.result.max_price,
          from_price: res.data.result.min_price,
          page_type: "",
          sliderValue: [
            parseFloat(res.data.result.min_price),
            parseFloat(res.data.result.max_price),
          ],
          users: res.data.result.users,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
        });
      }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  componentDidUpdate(prevState) {
    const search = this.props.location.search;
    const key = new URLSearchParams(search).get("keyword");
    const search1 = prevState.location.search;
    const key1 = new URLSearchParams(search1).get("keyword");
    if (key != key1) {
      this.setState({keyword:"",page_type:"L"})
    let body = {
      params: {
        offset: 0,
        min_price: 0,
        max_price: 0,
        keyword: "",
        state_id: "",
        order_by: this.state.order_by,
        category_id: [],
        page_type: "L",
      },
    };
    if(this.props.user){
      body = {
        params: {
          offset: 0,
        min_price: 0,
        max_price: 0,
        keyword: "",
        state_id: "",
        order_by: this.state.order_by,
        category_id: [],
        page_type: "L",
        user_id: this.props.user.id
        },
      };
    }
    this.props.onUpdateLoader(true);
    this.setState({loader:true})
    axios.post("/search-club", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false)
      this.setState({loader:false})
      if (res.data.result) {
        this.setState({
          users: res.data.result.users,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
          categories: res.data.result.categories,
          states: res.data.result.states,
          max_price: res.data.result.max_price,
          min_price: res.data.result.min_price,
          to_price: res.data.result.max_price,
          from_price: res.data.result.min_price,
          page_type: "",
          sliderValue: [
            parseFloat(res.data.result.min_price),
            parseFloat(res.data.result.max_price),
          ],
        });
    }
  })}
  }
  filter = () => {
    let body = {
      params: {
        page_type: "L",
        type: "C",
      },
    };
    if(this.props.user){
      body = {
        params: {
        page_type: "L",
        type: "C",
        user_id: this.props.user.id
        },
      };
    }
    if (this.state.page_type !== "L") {
      body = {
        params: {
          offset: this.state.offset,
          min_price: this.state.from_price,
          max_price: this.state.to_price,
          keyword: this.state.keyword,
          state_id: this.state.state_id,
          order_by: this.state.order_by,
          category_id: this.state.category_ids,
          type: "C",
        },
      };
    }
    if(this.props.user && this.state.page_type !== "L"){
      body = {
        params: {
          offset: this.state.offset,
          min_price: this.state.from_price,
          max_price: this.state.to_price,
          keyword: this.state.keyword,
          state_id: this.state.state_id,
          order_by: this.state.order_by,
          category_id: this.state.category_ids,
          user_id: this.props.user.id,
          type: "C",
        },
      };
    }
    // console.log("...",body);
    this.props.onUpdateLoader(true);
    this.setState({loader:true})
    axios.post("/search-club", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({loader:false})
      if (res.data.result) {
        if (this.state.page_type == "L") {
          this.setState({
            categories: res.data.result.categories,
            states: res.data.result.states,
            max_price: res.data.result.max_price,
            min_price: res.data.result.min_price,
            to_price: res.data.result.max_price,
            from_price: res.data.result.min_price,
            page_type: "",
            sliderValue: [
              parseFloat(res.data.result.min_price),
              parseFloat(res.data.result.max_price),
            ],
          });
        }
        this.setState({
          users: res.data.result.users,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
        });
      }
    });
  };
  reset = (resetForm) => {
    resetForm();
    this.setState({keyword:"",page_type:"L"})
    let body = {
      params: {
        offset: 0,
        min_price: 0,
        max_price: 0,
        keyword: "",
        state_id: "",
        order_by: this.state.order_by,
        category_id: [],
        page_type: "L",
      },
    };
    if(this.props.user){
      body = {
        params: {
          offset: 0,
          min_price: 0,
          max_price: 0,
          keyword: "",
          state_id: "",
          order_by: this.state.order_by,
          category_id: [],
          page_type: "L",
          user_id: this.props.user.id
        },
      };
    }
    this.props.onUpdateLoader(true);
    this.setState({loader:true})
    axios.post("/search-club", body).then((res) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({loader:false})
      if (res.data.result) {
        this.setState({
          users: res.data.result.users,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
          categories: res.data.result.categories,
          states: res.data.result.states,
          max_price: res.data.result.max_price,
          min_price: res.data.result.min_price,
          to_price: res.data.result.max_price,
          from_price: res.data.result.min_price,
          page_type: "",
          sliderValue: [
            parseFloat(res.data.result.min_price),
            parseFloat(res.data.result.max_price),
          ],
        });
    }
  })
}
    

  handleSliderChange = (event, value) => {
    this.setState({ sliderValue: value });
  };
  showAllCat = (id) => {
    document.querySelector(`.show-all-cal-${id}`).classList.add("small-let");
    document.querySelector(`.show-category-count-${id}`).style.display = "none";
    document.querySelector(`.show-all-category-${id}`).style.display = "block";
  };
  hideAllCat = (id) => {
    document.querySelector(`.show-all-cal-${id}`).classList.remove("small-let");
    document.querySelector(`.show-all-category-${id}`).style.display = "none";
    document.querySelector(`.show-category-count-${id}`).style.display =
      "block";
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    if(this.state.page_type !== "L"){
      this.setState({ offset: offset }, () => {
        this.filter();
      });
    }
      
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  updateOrderBy = (e) => {
    this.setState({ order_by: e.target.value }, () => {
      this.filter();
    });
  };
  render() {
    const {
      users,
      categories,
      states,
      max_price,
      min_price,
      sliderValue,
      keyword,
      category_ids,
      state_id,
      total,
      offset,
      per_page,
    } = this.state;
    const initialValues = {
      keyword: keyword ? keyword : "",
      state_id: state_id,
      category_ids: category_ids,
    };
    const handleSubmit = (values, actions) => {
      if (window.matchMedia("(max-width: 500px)").matches) {
        document.querySelector(".search-filter").style.display = "none";
      }
      this.setState(
        {
          keyword: values.keyword,
          category_ids: values.category_ids,
          state_id: values.state_id,
          from_price: sliderValue[0],
          to_price: sliderValue[1],
          offset: 0,
        },
        () => this.filter()
      );
    };
    // console.log("===",this.state.users);
    return (
     <>
       <Helmet>
        <title>{Titles?.searchClub?.title}</title>
        <meta
            name="description"
            content={Titles?.searchClub?.description}
        />
        <meta property="og:title" content={Titles?.searchClub?.ogTitle} />
        <meta property="og:description" content={Titles?.searchClub?.ogDescription} />
        <meta property="og:image" content={Titles?.searchClub?.ogImage} />
        <link rel="canonical" href={Titles?.searchClub?.link} />
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
                    <li className="breadcrumb-item active" aria-current="page">
                      Search Club
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
                {users.length > 0 ? (
                  <h3 className="display">
                    Displaying ({offset + 1} -{" "}
                    {offset + per_page < total ? offset + per_page : total}) of{" "}
                    {total} results for Club
                  </h3>
                ) : null}
              </div>
              <div className="col-lg-3 ">
                <div className="form-group filter-form ne_sorts">
                  <label>Sort by :</label>
                  <select 
                    className="form-control rm88 rm-width"
                    onChange={(e) => {
                      this.updateOrderBy(e);
                    }}
                  >
                    <option value="D">Recently Joined</option>
                    <option value="A">Alphabetical Order</option>
                    <option value="LH">Low to High Membership Amount</option>
                    <option value="HL">High to Low Membership Amount</option>
                    <option value="R">Review</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                      {({ values, setFieldValue ,resetForm}) => {
                        return (
                          <Form>
                            <h3>
                              <img src={process.env.PUBLIC_URL + "/images/SLIDER.png"} alt="" />
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
                              <img src={process.env.PUBLIC_URL + "/images/search-box.png"} alt="" />
                            </div>
                            <div className="form-group log-group left-log">
                              <Field as="select" name="state_id">
                                <option value="">Select Location</option>
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
                              <label>Location</label>
                            </div>
                            <div className="catagory">
                              <h4>Catagory</h4>
                              <div className="btm-radio prd-rad">
                                {categories && categories.length > 0
                                  ? categories.map((value, index) => {
                                      return (
                                        <label
                                          key={"cat" + index}
                                          className="check"
                                        >
                                          {value.name}
                                          <Field
                                            type="checkbox"
                                            name="category_ids"
                                            value={value.id.toString()}
                                          />
                                          <span class="checkmark"></span>
                                        </label>
                                      );
                                    })
                                  : null}
                              </div>
                            </div>
                            <div className="catagory">
                              <h4>Price Range</h4>
                              <div className="renge_area">
                                <div id="slider-range" />
                                <Slider
                                  min={parseFloat(min_price)}
                                  color="#da7b93"
                                  max={parseFloat(max_price)}
                                  value={sliderValue}
                                  step={1}
                                  onChange={this.handleSliderChange}
                                />
                                <p>
                                  <input
                                    type="text"
                                    id="amount"
                                    value={
                                      "₹" +
                                      sliderValue[0] +
                                      " - " +
                                      "₹" +
                                      sliderValue[1]
                                    }
                                    className="range-amount-sp"
                                  />
                                </p>
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
                      {users && users.length > 0 ? (
                        users.map((item, index) => {
                          return (
                            <div
                              className="col-xl-4 col-lg-6 col-md-6 col-sm-6 new_col"
                              key={`aeacr` + index}
                            >
                              <div className="club-card">
                                <Link
                                  to={`/club-details/${item.slug}/${item.id}`}
                                  className="join"
                                >
                                  Join
                                </Link>
                                <Link to={`/club-details/${item.slug}/${item.id}`}>
                                <img
                                  src={
                                    item.profile_picture
                                      ? USER_IMAGE + item.profile_picture
                                      : (process.env.PUBLIC_URL + "/images/pro_pick.png")
                                  }
                                  className="club-logo"
                                  alt={item.club_name}
                                /></Link>
                                <h3>
                                  <Link to={`/club-details/${item.slug}/${item.id}`}>
                                    {item.club_name &&
                                    item.club_name.length > 25
                                      ? item.club_name.substr(0, 25) + ".."
                                      : item.club_name}
                                  </Link>
                                </h3>
                                <div className="rating rating00111">
                                      <ul>
                                        <li>
                                        <Rating rating={parseInt(item.membership_avg_review?item.membership_avg_review:0)} />
                                        </li>
                                      </ul>
                                      <p>
                                        {item.membership_avg_review?item.membership_avg_review:0}(
                                        {item.membership_total_no_of_reviews?item.membership_total_no_of_reviews:0})
                                      </p>
                                </div>
                                <h4>
                                  <img src={process.env.PUBLIC_URL + "/images/location-icon.png"} alt="" />
                                  {item.user_state_details
                                    ? item.user_state_details.name
                                    : ""}
                                </h4>
                                {item.about_club ? (
                                  <p>
                                    {item.about_club &&
                                    item.about_club.length > 25
                                      ? getText(item.about_club).substr(0, 25) + ".."
                                      : getText(item.about_club)}
                                  </p>
                                ) : (
                                  <p>&nbsp;</p>
                                )}
                                <div className="topic">
                                  <div className="topic-icon">
                                    {/* <img src={price_tag} alt="" /> */}
                                  </div>
                                  <h5 className={`show-all-cal-${item.id}`}>
                                    <span
                                      key={`show-category-count-${item.id}`}
                                      className={`show-category-count-${item.id}`}
                                    >
                                      {item.get_associated_category &&
                                      item.get_associated_category.length > 0
                                        ? item.get_associated_category[0]
                                            .get_category_details.name
                                        : null}
                                      {item.get_associated_category &&
                                      item.get_associated_category.length >
                                        1 ? (
                                        <Link
                                          to="#"
                                          className="circle-more-icon"
                                          onClick={() =>
                                            this.showAllCat(item.id)
                                          }
                                        >
                                          +
                                          {item.get_associated_category.length -
                                            1}
                                        </Link>
                                      ) : null}
                                    </span>
                                    <span
                                      key={`show-all-category-${item.id}`}
                                      className={`show-all-category-${item.id}`}
                                      style={{ display: "none",marginLeft:"7px" }}
                                    >
                                      {item.get_associated_category &&
                                      item.get_associated_category.length > 0
                                        ? item.get_associated_category.map(
                                            (val, index) => {
                                              return (
                                                <>
                                                  {
                                                    val.get_category_details
                                                      .name
                                                  }
                                                  {index ===
                                                  item.get_associated_category
                                                    .length -
                                                    1
                                                    ? null
                                                    : ", "}
                                                </>
                                              );
                                            }
                                          )
                                        : null}
                                      {item.get_associated_category &&
                                      item.get_associated_category.length >
                                        1 ? (
                                        <Link
                                          to="#"
                                          className="circle-more-icon"
                                          onClick={() =>
                                            this.hideAllCat(item.id)
                                          }
                                        >
                                          -
                                        </Link>
                                      ) : null}
                                    </span>
                                  </h5>
                                </div>
                                <div className="member">
                                  <div className="mem-price">
                                    <img src={process.env.PUBLIC_URL + "/images/recent-price.png"} alt="" />
                                    <h6>
                                      <span> {item.membership_amount}</span>{" "}
                                      (per month)
                                    </h6>
                                  </div>
                                  <p>Member : {item.member_count}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <>
                        { !this.state.loader ?
                        <div className="col-12">
                          <div className="n-resul">
                            <img src={process.env.PUBLIC_URL + "/images/no-result.png"} alt="" />
                            <p>No result found!</p>
                          </div>
                        </div>
                        :null}
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
                          <img src={process.env.PUBLIC_URL + "/images/pagleft.png"} alt="" className="dpb" />
                          <img src={process.env.PUBLIC_URL + "/images/paglefthov.png"} alt="" className="dpn" />
                        </>
                      }
                      nextLabel={
                        <>
                          <img src={process.env.PUBLIC_URL + "/images/pagright.png"} alt="" className="dpb" />
                          <img src={process.env.PUBLIC_URL + "/images/pagrightho.png"} alt="" className="dpn" />
                        </>
                      }
                      marginPagesDisplayed={1}
                      renderOnZeroPageCount={null}
                    />
                  </div>
                </div>
                ):null}
              </div>
            </div>
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchClub);
