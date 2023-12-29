import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
// import product_img_1 from "../../assets/images/product-img-1.jpg";
// import rupee_green from "../../assets/images/rupee-green.png";
// import rupees from "../../assets/images/rupees.png";
// import star_point from "../../assets/images/star-point.png";
// import product_arrow from "../../assets/images/product-arrow.png";
// import product_img_2 from "../../assets/images/product-img-2.jpg";
// import product_img_3 from "../../assets/images/product-img-3.jpg";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import no_result from "../../assets/images/no-result.png";
// import pro_pick from "../../assets/images/pro_pick.png";
import swal from "sweetalert";
import axios from "../../shared/axios";
import ReactPaginate from "react-paginate";
import {
  UPDATE_LOADER,
  BASE_URL,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import { setLSItem } from "../../shared/LocalStorage";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class WishList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      wishlist: [],
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      loader: false,
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | My Wish List";
    this.getWishlist();
  }
  getWishlist = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios
      .post("listFavourite", {
        params: {
          offset: this.state.offset,
        },
      })
      .then((resp) => {
        // console.log("wishlist",resp);
        this.setState({
          wishlist: resp.data.result.UserToWishList,
          pageCount: resp.data.result.page_count,
          perPage: resp.data.result.per_page,
          total: resp.data.result.total,
        });
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
      });
  };
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    this.setState({ offset: offset }, () => {
      this.getWishlist();
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  remove = (id) => {
    var data = {
      params: {
        product_id: id,
      },
    };
    swal({
      text: "Are you sure you want to remove this product from your wishlist?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("addToFavourite", data).then((resp) => {
          swal({
            title: "Success",
            text: resp.data.result.meaning,
            icon: "success",
            button: "Ok",
          });
          this.getWishlist();
        });
      }
    });
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
            button: "OK",
          });
        } else if (resp.data.error) {
          swal({
            title: "Failed",
            text: resp.data.error.meaning,
            icon: "warning",
            button: "OK",
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
    const { wishlist } = this.state;
    return (
      <>
       <Helmet>
        <title>{Titles?.myWishList?.title}</title>
        <meta
            name="description"
            content={Titles?.myWishList?.description}
        />
        <meta property="og:title" content={Titles?.myWishList?.ogTitle} />
        <meta property="og:description" content={Titles?.myWishList?.ogDescription} />
        <meta property="og:image" content={Titles?.myWishList?.ogImage} />
        <link rel="canonical" href={Titles?.myWishList?.link} />
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
                    <h1>Wishlist</h1>
                    <div className="dasbordRightBody for_wish_list_main">
                      {wishlist && wishlist.length > 0 ? (
                        <>
                          {wishlist.map((item, index) => {
                            return (
                              <div
                                className="product-card for_wish_list"
                                key={index}
                              >
                                <div className="product-img">
                                  <Link to={item.get_product
                                      ?`/product-details/${item.get_product.slug}/${item.get_product.id}`:"#"}>
                                  <img
                                    src={
                                      item.get_product &&
                                      item.get_product.get_default_image
                                        ? BASE_URL +
                                          "/storage/app/public/product_images/" +
                                          item.get_product.get_default_image
                                            .image
                                        : process.env.PUBLIC_URL +
                                          "/images/pro_pick.png"
                                    }
                                    alt=""
                                    className="main-img"
                                  /></Link>
                                  <div
                                    className="wish_delet"
                                    onClick={() =>
                                      this.remove(
                                        item.get_product
                                          ? item.get_product.id
                                          : ""
                                      )
                                    }
                                  >
                                    <Link to="#">
                                      <i
                                        className="fa fa-times"
                                        aria-hidden="true"
                                      />
                                    </Link>
                                  </div>
                                  <div className="wish">
                                    {/*<Link to="#" class="heart"></Link>*/}
                                    <Link
                                      to="#"
                                      className="bag"
                                      id={"cart" + index}
                                      onClick={() => this.addCart(item.product_id)}
                                    />
                                  </div>
                                </div>
                                <h3><Link style={{color:"inherit"}} to={item.get_product
                                      ?`/product-details/${item.get_product.slug}/${item.get_product.id}`:"#"}>
                                  {item.get_product
                                    ? item.get_product.title
                                    : null}</Link>
                                </h3>
                                {item.get_product ? (
                                  <h4>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupee-green.png"
                                      }
                                      alt=""
                                    />
                                    {item.get_product.discounted_price}
                                    {Math.round(item.get_product.percentage) >
                                    0 ? (
                                      <span>
                                        <img
                                          src={
                                            process.env.PUBLIC_URL +
                                            "/images/rupees.png"
                                          }
                                          alt=""
                                        />
                                        {item.get_product.original_price}
                                      </span>
                                    ) : null}
                                  </h4>
                                ) : null}
                                <div className="product-star">
                                  <div className="star">
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/star-point.png"
                                      }
                                      alt=""
                                    />
                                    <p>
                                      {item.get_product
                                        ? item.get_product.avg_review
                                        : null}
                                    </p>
                                  </div>
                                  <Link
                                    // to="#"
                                    to={item.get_product
                                      ?`/product-details/${item.get_product.slug}/${item.get_product.id}`:"#"}
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
                            );
                          })}
                        </>
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
                              <p>Your wishlist is empty!</p>
                            </div>
                          ) : null}
                        </>
                      )}
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
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    updateCartItem: (cnt) => dispatch({ type: UPDATE_CART_ITEM, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(WishList);
