import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom";
// import SLIDER from "../../assets/images/SLIDER.png";
// import search_box from "../../assets/images/search-box.png";
// import star_yel from "../../assets/images/star-yel.png";
// import star_ash from "../../assets/images/star-ash.png";
// import product_img_1 from "../../assets/images/product-img-1.jpg";
// import product_arrow from "../../assets/images/product-arrow.png";
// import rupee_green from "../../assets/images/rupee-green.png";
// import rupees from "../../assets/images/rupees.png";
// import star_point from "../../assets/images/star-point.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import locationicon from "../../assets/images/location-icon.png";
// import pro_pick from "../../assets/images/pro_pick.png";
// import no_result from "../../assets/images/no-result.png";
import Slider from "@material-ui/core/Slider";
import { Formik, Field, Form } from "formik";
import axios from "../../shared/axios";
import ReactPaginate from "react-paginate";
import {
  UPDATE_LOADER,
  BASE_URL,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import { Rating } from "../../shared/Rating";
import { setLSItem } from "../../shared/LocalStorage";
// import { getText } from "../../shared/common";
import swal from "sweetalert";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class SearchProduct extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      totalP: 0,
      min_price: 0,
      max_price: 0,
      from_price: 0,
      to_price: 0,
      sliderValue: [0, 0],
      product: [],
      categories: [],
      keyword: "",
      avg_review: "",
      category_ids: [],
      page_type: "L",
      loader: false,
      wishlistData: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Search Product";
    window.scrollTo({ top: 0, behavior: "smooth" });
    const search = this.props.location.search;
    const key = new URLSearchParams(search).get("keyword");
    if (key !== null) {
      this.setState({ keyword: key, page_type: "L" }, () => this.filter());
    } else {
      this.setState({ page_type: "" }, () => this.filter());
    }
    if(localStorage.getItem("auth_token")){
    axios.post("listFavourite").then((resp) => {
      if (resp.data.result.fav_arr) {
        this.setState({ wishlistData: resp.data.result.fav_arr });
      }
    });
  }
  }
  componentDidUpdate(prevState) {
    const search = this.props.location.search;
    const key = new URLSearchParams(search).get("keyword");
    const search1 = prevState.location.search;
    const key1 = new URLSearchParams(search1).get("keyword");
    if (key != key1) {
      this.setState(
        {
          keyword: "",
          category_ids: [],
          avg_review: "",
          from_price: 0,
          to_price: 0,
          offset: 0,
          page_type: "",
        },
        () => this.filter()
      );
    }
  }
  filter = () => {
    let body = {
      params: {
        offset: this.state.offset,
        min_range: this.state.from_price,
        max_range: this.state.to_price,
        keyword: this.state.keyword,
        avg_review: this.state.avg_review,
        order_by: this.state.order_by,
        category_id: this.state.category_ids,
      },
    };
    if (this.props.user) {
      body = {
        params: {
          offset: this.state.offset,
          min_range: this.state.from_price,
          max_range: this.state.to_price,
          keyword: this.state.keyword,
          avg_review: this.state.avg_review,
          order_by: this.state.order_by,
          category_id: this.state.category_ids,
          user_id: this.props.user.id,
        },
      };
    }

    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/search-products", body).then((res) => {
      // console.log("search", res);
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      if (res.data.result) {
        this.setState({
          categories: res.data.result.categories,
          product: res.data.result.products,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          totalP: res.data.result.tot_product,
          total: res.data.result.res_tot_product,
          max_price: res.data.result.max_range,
          min_price: res.data.result.min_range,
          to_price: res.data.result.max_range,
          from_price: res.data.result.min_range,
          sliderValue: [
            parseFloat(res.data.result.min_range),
            parseFloat(res.data.result.max_range),
          ],
        });
      }
    });
  };
  handleSliderChange = (event, value) => {
    this.setState({ sliderValue: value });
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
        keyword: "",
        category_ids: [],
        avg_review: "",
        from_price: 0,
        to_price: 0,
        offset: 0,
        page_type: "",
      },
      () => this.filter()
    );
  };
  wishlist = (id) => {
    if (localStorage.getItem("auth_token")) {
      var data = {
        params: {
          product_id: id,
        },
      };
      axios
        .post("addToFavourite", data)

        .then((resp) => {
          swal({
            title: "Success",
            text: resp.data.result.meaning,
            icon: "success",
            button: "Ok",
          });
          this.setState({ wishlistData: resp.data.result.fav_arr });
        });
    } else {
      swal({
        title: "",
        text: "Please login to continue",
        icon: "warning",
        button: "Ok",
      });
    }
  };

  addCart = (id) => {
    if (localStorage.getItem("auth_token")) {
      var data = {
        params: {
          product_id: id,
          qty: 1,
        },
      };
      axios.post("add-to-cart", data).then((resp) => {
        // console.log("lll0",resp);
        if (resp.data.result && resp.data.result.cartMaster) {
          setLSItem("cart_detail", resp.data.result.cartMaster);
          this.props.updateCartItem(resp.data.result.cartMaster);
          swal({
            title: "Success",
            text: resp.data.result.meaning,
            icon: "success",
            button: "Ok",
          });
        } else if (resp.data.error) {
          swal({
            title: "Failed",
            text: resp.data.error.meaning,
            icon: "warning",
            button: "Ok",
          });
        }
      });
    } else {
      swal({
        title: "",
        text: "Please login to continue",
        icon: "warning",
        button: "Ok",
      });
    }
  };
  render() {
    const {
      categories,
      sliderValue,
      min_price,
      max_price,
      product,
      total,
      totalP,
      offset,
      keyword,
      per_page,
      category_ids,
    } = this.state;

    const initialValues = {
      keyword: keyword ? keyword : "",
      avg_review: "",
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
          avg_review: values.avg_review,
          from_price: sliderValue[0],
          to_price: sliderValue[1],
          offset: 0,
        },
        () => this.filter()
      );
    };
    return (

     <>
      <Helmet>
        <title>{Titles?.searchProduct?.title}</title>
        <meta
            name="description"
            content={Titles?.searchProduct?.description}
        />
        <meta property="og:title" content={Titles?.searchProduct?.ogTitle} />
        <meta property="og:description" content={Titles?.searchProduct?.ogDescription} />
        <meta property="og:image" content={Titles?.manageOrder?.ogImage} />
        <link rel="canonical" href={Titles?.searchProduct?.link} />
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
                      Search Product
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
                {product && product.length > 0 ? (
                  <h3 className="display">
                    Displaying ({offset + 1} -{" "}
                    {offset + per_page < total
                      ? offset + per_page
                      : total !== 0
                      ? total
                      : totalP}
                    ) of {totalP} results for Product
                  </h3>
                ) : null}
              </div>
              <div className="sorrtyy">
                <div className="form-group filter-form ne_sorts">
                  <label htmlFor>Sort by :</label>
                  <select
                    className="form-control rm88"
                    onChange={(e) => {
                      this.updateOrderBy(e);
                    }}
                  >
                    <option value="D">Recently Added</option>
                    <option value="L">Price low to high</option>
                    <option value="H">Price High to low</option>
                    <option value="A">Alphabetical order</option>
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
                      {({ values, setFieldValue, resetForm }) => {
                        return (
                          <Form>
                            <h3>
                              <img
                                src={
                                  process.env.PUBLIC_URL + "/images/SLIDER.png"
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
                              <h4>Catagory</h4>
                              <div className="btm-radio prd-rad">
                                {categories && categories.length > 0
                                  ? categories.map((value, index) => {
                                      return (
                                        <label
                                          className="check"
                                          key={"cate" + index}
                                        >
                                          {value.name}
                                          <Field
                                            type="checkbox"
                                            name="category_ids"
                                            value={value.id.toString()}
                                          />
                                          <span className="checkmark" />
                                        </label>
                                      );
                                    })
                                  : null}
                              </div>
                            </div>
                            <div className="catagory">
                              <h4>Avarage Review</h4>
                              <div className="btm-radio prd-rad">
                                <label className="check" htmlFor="chk9">
                                  <ul>
                                    <li>
                                      <Rating rating={4} />
                                    </li>
                                    <p>(4 stars &amp; above)</p>
                                  </ul>
                                  <Field
                                    id="chk9"
                                    type="radio"
                                    name="avg_review"
                                    onChange={(e) => {
                                      setFieldValue("avg_review", "4");
                                    }}
                                    checked={
                                      values.avg_review === "4" ? "checked" : ""
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                                <label className="check" htmlFor="chk10">
                                  <ul>
                                    <li>
                                      <Rating rating={3} />
                                    </li>
                                    <p>(3 stars &amp; above)</p>
                                  </ul>
                                  <input
                                    id="chk10"
                                    type="radio"
                                    name="avg_review"
                                    onChange={(e) => {
                                      setFieldValue("avg_review", "3");
                                    }}
                                    checked={
                                      values.avg_review === "3" ? "checked" : ""
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                                <label className="check" htmlFor="chk11">
                                  <ul>
                                    <li>
                                      <Rating rating={2} />
                                    </li>
                                    <p>(2 stars &amp; above)</p>
                                  </ul>
                                  <input
                                    id="chk11"
                                    type="radio"
                                    name="avg_review"
                                    onChange={(e) => {
                                      setFieldValue("avg_review", "2");
                                    }}
                                    checked={
                                      values.avg_review === "2" ? "checked" : ""
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
                                <label className="check" htmlFor="chk12">
                                  <ul>
                                    <li>
                                      <Rating rating={1} />
                                    </li>
                                    <p>(1 stars &amp; above)</p>
                                  </ul>
                                  <input
                                    id="chk12"
                                    type="radio"
                                    name="avg_review"
                                    onChange={(e) => {
                                      setFieldValue("avg_review", "1");
                                    }}
                                    checked={
                                      values.avg_review === "1" ? "checked" : ""
                                    }
                                  />
                                  <span className="checkmark" />
                                </label>
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
                                      sliderValue[0] && sliderValue[1] !== "NaN"
                                        ? "₹" +
                                          sliderValue[0] +
                                          " - " +
                                          "₹" +
                                          sliderValue[1]
                                        : "₹ 0" + " - " + "₹ 0"
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
                      {product && product.length > 0 ? (
                        product.map((item, index) => {
                          return (
                            <div
                              className="col-xl-4 col-lg-6 col-md-6 col-sm-6 new_col"
                              key={`prod` + index}
                            >
                              <div className="product-card">
                                <div className="product-img">
                                  <Link to={`/product-details/${item.slug}/${item.id}`}>
                                  <img
                                    src={
                                      item.get_default_image
                                        ? BASE_URL +
                                          "/storage/app/public/product_images/" +
                                          item.get_default_image.image
                                        : process.env.PUBLIC_URL +
                                          "/images/pro_pick.png"
                                    }
                                    alt=""
                                    className="main-img"
                                  /></Link>
                                  {Math.round(item.percentage) > 0 ? (
                                    <div className="discount">
                                      <p>-{Math.round(item.percentage)}%</p>
                                    </div>
                                  ) : null}
                                  <div className="wish">
                                    <Link
                                      to="#"
                                      id={"wish" + index}
                                      className={
                                        this.state.wishlistData &&
                                        this.state.wishlistData.some(
                                          (v) => parseInt(v) === item.id
                                        )
                                          ? "wish-act"
                                          : "heart"
                                      }
                                      onClick={() => this.wishlist(item.id)}
                                    />
                                    <Link
                                      to="#"
                                      id={"cart" + index}
                                      className="bag"
                                      onClick={() => this.addCart(item.id)}
                                    />
                                  </div>
                                </div>
                                <h3><Link style={{color:"inherit"}} to={`/product-details/${item.slug}/${item.id}`}>{item.title}</Link></h3>
                                {localStorage.getItem("auth_token") ? (
                                  <h4>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupee-green.png"
                                      }
                                      alt=""
                                    />
                                    {item.discounted_price!=="0.00"?item.discounted_price:item.original_price}
                                    {Math.round(item.percentage) > 0 ? (
                                      <span>
                                        <img
                                          src={
                                            process.env.PUBLIC_URL +
                                            "/images/rupees.png"
                                          }
                                          alt=""
                                        />
                                        {item.original_price}
                                      </span>
                                    ) : null}
                                  </h4>
                                ) : (
                                  <h4>
                                    <Link to="/login" className="log-pls">
                                      Login to view price
                                    </Link>
                                  </h4>
                                )}
                                <div className="product-star">
                                  <div className="star">
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/star-point.png"
                                      }
                                      alt=""
                                    />
                                    <p>{item.avg_review}</p>
                                  </div>
                                  <Link
                                    // to="#"
                                    to={`/product-details/${item.slug}/${item.id}`}
                                    className="pro-btn"
                                  >
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/product-arrow.png"
                                      }
                                      alt=""
                                      className="pro-arrow"
                                    />
                                  </Link>
                                </div>
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
                            src={process.env.PUBLIC_URL + "/images/pagleft.png"}
                            alt=""
                            className="dpb"
                          />
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/paglefthov.png"
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
                              process.env.PUBLIC_URL + "/images/pagright.png"
                            }
                            alt=""
                            className="dpb"
                          />
                          <img
                            src={
                              process.env.PUBLIC_URL + "/images/pagrightho.png"
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
                ):null}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------left panel start----------------- */}
      </Layout>
     </>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    updateCartItem: (cnt) => dispatch({ type: UPDATE_CART_ITEM, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(SearchProduct);
