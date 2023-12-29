import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import { useParams } from "react-router";
import axios from "../../shared/axios";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import { useDispatch} from "react-redux";
import { BASE_URL, UPDATE_CART_ITEM } from "../../store/action/actionTypes";
import edit_pen from "../../assets/images/edit-pen.png";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import logo_sml from "../../assets/images/top-logo.png";

const PlaceOrder = () => {
  const initialState = {
    product: [],
    order: [],
    shipping: [],
    billing: [],
  };
  const [state, setState] = useState(initialState);
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    document.title = "Maydaan | Place Order";
    window.scrollTo({ top: 0, behavior: "smooth" });
    let data = {
      params: {
        id: params.id,
      },
    };
    dispatch({ type: UPDATE_LOADER, value: true });
    axios.post("/orderDetails", data).then((res) => {
      dispatch({ type: UPDATE_LOADER, value: false });
      // console.log("order",res);
      if (res.data.result && res.data.result.order) {
        setState((prevState) => {
          return {
            ...prevState,
            order: res.data.result.order,
          };
        });
      }
      if (
        res.data.result &&
        res.data.result.order &&
        res.data.result.order.get_order_details
      ) {
        setState((prevState) => {
          return {
            ...prevState,
            product: res.data.result.order.get_order_details,
          };
        });
      }
      if (
        res.data.result &&
        res.data.result.order &&
        res.data.result.order.get_shipping_address
      ) {
        setState((prevState) => {
          return {
            ...prevState,
            shipping: res.data.result.order.get_shipping_address,
          };
        });
      }
      if (
        res.data.result &&
        res.data.result.order &&
        res.data.result.order.get_billing_address
      ) {
        setState((prevState) => {
          return {
            ...prevState,
            billing: res.data.result.order.get_billing_address,
          };
        });
      }
    });
  }, []);
  const { order, product} = state;

  const summery = () => {
    let data = {
      params: {
        id: params.id,
      },
    };
    dispatch({ type: UPDATE_LOADER, value: true });
    axios.post("/placeOrder", data).then((res) => {
      console.log("res1",res);
      dispatch({ type: UPDATE_LOADER, value: false });
      if (res.data.result) {
        const options = {
          key: res?.data?.result?.RAZORPAY_KEY,
          amount: order.total_after_discount * 100,
          currency: "INR",
          name: "Maydaan-Project",
          description: "Payment",
          image: logo_sml,
          handler: (res) => {
            dispatch({ type: UPDATE_LOADER, value: true });
            if(res?.razorpay_payment_id){
            let body = {
              params: {
                id: params.id,
                payment_response: res,
                transaction_id: res?.razorpay_payment_id,
                status: "S"
              }
            };
            axios.post("/makeOrderPayment", body).then((response) => {
              console.log("res2",response)
              dispatch({ type: UPDATE_LOADER, value: false });
              if(response?.data?.result){
                dispatch({ type: UPDATE_CART_ITEM, value: "" });
                swal({
                  title: "Success",
                  text: response?.data?.result.meaning,
                  icon: "success",
                  button: "OK",
                }).then((isConfirmed) => {
                  if(isConfirmed){
                    history.push("/my-orders")
                  }
                });
              }})
            }
          },
          theme: {
            color: "black",
          },
        };
        const rzpay = new window.Razorpay(options);
        rzpay.open();
      } else if (res.data.error) {
        swal({
          title: "Error",
          text: res.data.error.meaning,
          icon: "error",
          button: "OK",
        });
      }
    });
    console.log("res");
   
    
  };
  return (
    <Layout>
      <div className="results">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12">
              <nav aria-label="breadcrumb" className="bread">
                <ol className="breadcrumb bread-place">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <Link to="/checkout/N">Checkout</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Place Order
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div className="main-check-area">
        <div className="container">
          <div className="check-area">
            <div className="left-check">
              <h3>Product Information</h3>
              <div className="prod-info">
                <ul>
                  {product && product.length > 0
                    ? product.map((item, index) => {
                        return (
                          <li key={index}>
                            <div className="prod-img pprd_pic001 pprd_pic002">
                              <img
                                src={
                                  item.get_product &&
                                  item.get_product.get_default_image
                                    ? BASE_URL +
                                      "/storage/app/public/product_images/" +
                                      item.get_product.get_default_image.image
                                    : process.env.PUBLIC_URL +
                                      "/images/pro_pick.png"
                                }
                                alt=""
                              />
                              <div className="num">{item.qty}</div>
                            </div>
                            <div className="prod">
                              <span className="sm_size pprd_pic">
                                <h2>
                                  {item.get_product && item.get_product.title
                                    ? item.get_product.title
                                    : null}
                                </h2>
                                <p>
                                  Seller:{" "}
                                  {item.get_product &&
                                  item.get_product.get_user &&
                                  item.get_product.get_user.club_name
                                    ? item.get_product.get_user.club_name
                                    : null}
                                </p>
                              </span>
                            </div>
                            <div className="prc">
                              <p>
                                <i className="fa fa-inr" aria-hidden="true"></i>
                                {item.unit_price_discounted}
                              </p>
                            </div>
                          </li>
                        );
                      })
                    : null}
                </ul>
              </div>
              <h3>Payment Details</h3>
              <div className="total">
                <ul>
                  <li>
                    <p>
                      Subtotal(
                      {order && order.total_item ? order.total_item : "0"}{" "}
                      Items)
                    </p>
                    <span>
                      <i className="fa fa-inr" aria-hidden="true"></i>
                      {order && order.total_before_discount
                        ? order.total_before_discount
                        : "0.00"}
                    </span>
                  </li>
                  <li>
                    <p>Discount</p>
                    <span>
                      <i className="fa fa-inr" aria-hidden="true"></i>
                      {order && order.total_discount
                        ? order.total_discount
                        : "0.00"}
                    </span>
                  </li>
                </ul>
              </div>
              <div className="pay">
                <p>
                  Total payable amount:
                  <span>
                    <i className="fa fa-inr" aria-hidden="true"></i>
                    {order && order.total_after_discount
                      ? order.total_after_discount
                      : "0.00"}
                  </span>
                </p>
              </div>
            </div>
            <div className="right-check">
              <div className="shp-info">
                <h3>Shipping Information</h3>
                {order ? (
                  <div className="shp-info-box">
                    <h4> {order.shipping_first_name + " " + order.shipping_last_name}</h4>
                    <p>{order.shipping_email}</p>
                    <p>{order.shipping_phone}</p>
                    <p>
                      {order.shipping_full_address},
                      {order && order.get_shipping_city
                        ? order.get_shipping_city.city
                        : null}
                      ,
                      {order && order.get_shipping_state
                        ? order.get_shipping_state.name
                        : null}{" "}
                      - {order.shipping_zipcode}
                    </p>
                    <Link to={`/checkout/${order.id}`} className="edit-pen">
                      <img src={edit_pen} alt="" />
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="bl-info">
                <h3>Billing Information</h3>
                {order ? (
                  <div className="shp-info-box">
                     <h4> {order.billing_first_name + " " + order.billing_last_name}</h4>
                    <p>{order.billing_email}</p>
                    <p>{order.billing_phone}</p>
                    <p>
                      {order.billing_full_address},
                      {order && order.get_billing_city
                        ? order.get_billing_city.city
                        : null}
                      ,
                      {order && order.get_billing_state
                        ? order.get_billing_state.name
                        : null}{" "}
                      - {order.billing_zipcode}
                    </p>
                    <Link to={`/checkout/${order.id}`} className="edit-pen">
                      <img src={edit_pen} alt="" />
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="checkout-btn">
                <ul>
                  <li className="chck" onClick={() => summery()}>
                    Pay Now
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlaceOrder;
