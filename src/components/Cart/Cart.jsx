import React, { Component } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import axios from "../../shared/axios";
import { removeLSItem, setLSItem } from "../../shared/LocalStorage";
import {
  UPDATE_AUTH_TOKEN,
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  UPDATE_USER,
  UPDATE_CART_ITEM,
} from "../../store/action/actionTypes";
import { BASE_URL } from "../../store/action/actionTypes";
import swal from "sweetalert";
import { connect } from "react-redux";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
// import pro_pick from "../../assets/images/pro_pick.png";
// import no_result from "../../assets/images/no-result.png";
// import rupe from "../../assets/images/rupe.png"
// import delet from "../../assets/images/delet.png"

class Cart extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      cart_detail: [],
      cart: [],
      qty: 1,
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Cart";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getCart();
  }
  getCart = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios
      .post("get-cart", {
        params: {
          get_list_states: "Y",
        },
      })
      .then((resp) => {
        // console.log("lll",resp);
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
        if (resp.data.result && resp.data.result.cartMaster) {
          this.setState({
            cart: resp.data.result.cartMaster.get_cart_detail,
            cart_detail: resp.data.result.cartMaster,
          });
          setLSItem("cart_detail", resp.data.result.cartMaster);
          this.props.updateCartItem(resp.data.result.cartMaster);
        } else {
          this.props.updateCartItem("");
          this.setState({ cart: "", cart_detail: "" });
        }
      });
  };
  changeQty = (item, plusOrMinus) => {
    // console.log("lll",item);
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    var data = {
      params: {
        product_id: item.product_id,
        is_update_qty: "Y",
        qty:
          plusOrMinus == "plus"
            ? parseInt(item.qty) + 1
            : parseInt(item.qty) - 1,
      },
    };
    axios.post("add-to-cart", data).then((resp) => {
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      // console.log("lll0",resp);
      if (resp.data.result && resp.data.result.cartMaster) {
        setLSItem("cart_detail", resp.data.result.cartMaster);
        this.props.updateCartItem(resp.data.result.cartMaster);
        swal({
          title: "Success",
          text: "Product successfully updated to  your cart.",
          icon: "success",
          button: "Ok",
        });
        this.getCart();
      } else if (resp.data.error) {
        swal({
          title: "Failed",
          text: resp.data.error.meaning,
          icon: "warning",
          button: "Ok",
        });
      }
    });
  };
  delete = (id) => {
    var data = {
      params: {
        cart_details_id: id,
      },
    };
    swal({
      text: "Are you sure you want to remove this product from your cart?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        this.props.onUpdateLoader(true);
        this.setState({ loader: true });
        axios.post("remove-from-cart", data).then((resp) => {
          this.props.onUpdateLoader(false);
          this.setState({ loader: false });
          swal({
            title: "Success",
            text: resp.data.result.meaning,
            icon: "success",
            button: "Ok",
          });
          this.getCart();
        });
      }
    });
  };
  render() {
    const { cart, cart_detail } = this.state;
    return (
     <>
       <Helmet>
        <title>{Titles?.cart?.title}</title>
        <meta
            name="description"
            content={Titles?.cart?.description}
        />
        <meta property="og:title" content={Titles?.cart?.ogTitle} />
        <meta property="og:description" content={Titles?.cart?.ogDescription} />
        <meta property="og:image" content={Titles?.cart?.ogImage} />
        <link rel="canonical" href={Titles?.cart?.link} />
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
                      Shopping Cart
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* --------------result bar end----------------- */}
        <div className="main-cart-area">
          <div className="container">
            <div className="cart-area">
              {cart && cart.length > 0 ? (
                <>
                  <div className="left-cart">
                    {/*TABLE AREA START*/}
                    <div className="table_01 table">
                      <div className="row amnt-tble">
                        <div className="cel_area amunt cess nw1 amnt-shp">
                          Image
                        </div>
                        <div className="cel_area amunt cess nw1 amnt-shp">
                          Product Info
                        </div>
                        <div className="cel_area amunt cess nw3 amnt-shp">
                          Unit Price
                        </div>
                        <div className="cel_area amunt cess nw4 amnt-shp">
                          Quantity
                        </div>
                        <div className="cel_area amunt cess nw5 amnt-shp">
                          Total
                        </div>
                        <div className="cel_area amunt cess nw5 amnt-shp">
                          Action
                        </div>
                      </div>
                      {/*table row-1*/}
                      {cart.map((item, index) => {
                        return (
                          <div
                            className="row small_screen2 small_screen200"
                            key={index}
                          >
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big display_naa">
                                Image
                              </span>
                              <span className="sm_size pprd_pic pprd_pic001">
                                <img
                                  src={
                                    item.get_product_detail &&
                                    item.get_product_detail.get_default_image
                                      ? BASE_URL +
                                        "/storage/app/public/product_images/" +
                                        item.get_product_detail
                                          .get_default_image.image
                                      : process.env.PUBLIC_URL +
                                        "/images/pro_pick.png"
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big display_naa">
                                Product Info
                              </span>
                              <span className="sm_size pprd_pic">
                                <h2>
                                  {item.get_product_detail &&
                                  item.get_product_detail.title
                                    ? item.get_product_detail.title
                                    : null}
                                </h2>
                                <p>
                                Seller: {item.get_product_detail &&
                                  item.get_product_detail.get_user &&
                                  item.get_product_detail.get_user.club_name
                                    ? item.get_product_detail.get_user.club_name
                                    : null}
                                </p>
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">Unit Price</span>
                              <span className="sm_size">
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />
                                {item.unit_price_original}
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">Quantity</span>
                              <span className="sm_size">
                                <div id="input_div">
                                  <input
                                    type="button"
                                    defaultValue="-"
                                    id="moins"
                                    onClick={() => {
                                      if (item.qty > 1) {
                                        this.changeQty(item, "minus");
                                      }
                                    }}
                                  />
                                  <input
                                    type="text"
                                    size={25}
                                    value={item.qty}
                                    id="count"
                                  />
                                  <input
                                    type="button"
                                    defaultValue="+"
                                    id="plus"
                                    onClick={() => this.changeQty(item, "plus")}
                                  />
                                </div>
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">Total</span>
                              <span className="sm_size">
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/rupe.png"
                                  }
                                  alt=""
                                />{" "}
                                {item.total_price}
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">Action</span>
                              <a href="#" onClick={() => this.delete(item.id)}>
                                <img
                                  src={
                                    process.env.PUBLIC_URL + "/images/delet.png"
                                  }
                                  alt=""
                                  title="Delete"
                                  className="delet"
                                />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/*TABLE AREA END*/}
                  </div>
                  <div className="right-cart h_375">
                    <h3>Payment details</h3>
                    <div className="total">
                      <ul>
                        <li>
                          <p>
                            Subtotal(
                            {cart_detail && cart_detail.total_item
                              ? cart_detail.total_item
                              : "0"}{" "}
                            Items)
                          </p>
                          <span>
                            <i className="fa fa-inr" aria-hidden="true" />
                            {cart_detail && cart_detail.total_before_discount
                              ? cart_detail.total_before_discount
                              : "0.00"}
                          </span>
                        </li>
                        <li>
                          <p>Discount</p>
                          <span>
                            <i className="fa fa-inr" aria-hidden="true" />
                            {cart_detail &&
                            cart_detail.total_before_discount &&
                            cart_detail.total_after_discount
                              ? cart_detail.total_before_discount -
                                cart_detail.total_after_discount +
                                ".00"
                              : "0.00"}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="pay">
                      <p>
                        Total payable amount:
                        <span>
                          <i className="fa fa-inr" aria-hidden="true" />
                          {cart_detail && cart_detail.total_after_discount
                            ? cart_detail.total_after_discount
                            : "0.00"}
                        </span>
                      </p>
                    </div>
                    <div className="pay-btn">
                      <ul>
                        <li className="chck">
                          <Link
                            // to="#"
                            to={`/checkout/${"N"}`}
                          >
                            Continue to Checkout
                          </Link>
                        </li>
                        <li className="shp">
                          <Link to="/search-product">Continue Shopping</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {!this.state.loader ? (
                    <div className="n-resul" style={{ height: "auto" }}>
                      <img
                        src={process.env.PUBLIC_URL + "/images/no-result.png"}
                        alt=""
                      />
                      <p>Your cart is empty!</p>
                      <div className="pay-btn">
                        <ul>
                          <li className="shp">
                            <Link to="/search-product">Continue Shopping</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
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
    updateCartItem: (cnt) => dispatch({ type: UPDATE_CART_ITEM, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(Cart);
