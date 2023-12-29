import React, { Component } from "react";
import Layout from "../Layout/Layout";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import swal from "sweetalert";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import logo_sml from "../../assets/images/top-logo.png";

class Payment extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      Details: [],
    };
  }
  componentDidMount() {
    document.title = "Maydaan | Payment";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.onUpdateLoader(true);
    var data = {
      params: {
        slug: this.props.match.params.slug,
      },
    };
    axios.post("/view-public-profile", data).then((res) => {
      this.props.onUpdateLoader(false);
      if (res.data.result && res.data.result.user) {
        this.setState({ Details: res.data.result.user });
      }
    });
  }
  submit = () => {
    var data1 = {
      params: {
        for_id: this.state.Details.id,
      },
    };
    this.props.onUpdateLoader(true);
    axios.post("/join-now", data1).then((res) => {
      // console.log("join",res);
      this.props.onUpdateLoader(false);
      if (res.data.error) {
        if (res.data.error) {
          swal({
            title: "Error!",
            text: res.data.error.meaning,
            icon: "error",
          })
          this.props.onUpdateError(res.data.error.meaning);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (res.data.result) {
        const options = {
          key: res?.data?.result?.RAZORPAY_KEY,
          amount: this.state.Details.membership_amount * 100,
          currency: "INR",
          name: "Maydaan-Project",
          description: "Payment",
          image: logo_sml,
          handler: (resp) => {
            this.props.onUpdateLoader(true);
            if(resp?.razorpay_payment_id){
            let body = {
              params: {
                payment_table_id: res?.data?.result?.p?.id,
                payment_response: resp,
                transaction_id: resp?.razorpay_payment_id,
                status: "S"
              }
            };
            axios.post("/make-payment", body).then((response) => {
              console.log("res2",response)
              this.props.onUpdateLoader(false);
              if(response?.data?.result){
                swal({
                  title: "Success!",
                  text: "Joined Succesfully!",
                  icon: "success",
                }).then((isConfirmed) => {
                  if (isConfirmed) {
                    if(this.state.Details.type==="T"){
                      this.props.history.push(
                      `/trainer-details/${this.props.match.params.slug}/${this.props.match.params.id}`
                    );
                    }else{
                      this.props.history.push(
                        `/club-details/${this.props.match.params.slug}/${this.props.match.params.id}`
                      );
                    }
                    
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
      }
    });
  };
  render() {
    const { Details } = this.state;
    return (
      <Layout>
        <div className="results">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-12">
                <nav aria-label="breadcrumb" className="bread fllw">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item bread-arrow">
                      <Link
                        to={Details.type==="T"?`/trainer-details/${this.props.match.params.slug}`:`/club-details/${this.props.match.params.slug}`}
                      >
                        {Details.type==="T"?"Trainer Details":"Club Details"}
                      </Link>
                    </li>
                    <li
                      className="breadcrumb-item active bread-arrow"
                      aria-current="page"
                    >
                      Payment
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        {/* --------------result bar end----------------- */}
        <div className="main-search-area pay-sum">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="right-cart pay-sum-crt right-cart001">
                {Details ? 
                  <h3>
                    Payment details ( {Details.type==="T"?"Applying for":"Joining"} :{" "}
                    {Details.type==="T" ? Details.first_name + " " + Details.last_name:Details.club_name})
                  </h3>:null}
                  <div className="total">
                    <ul>
                      <li>
                        <p>Total payable amount:</p>
                        <span>
                          <i className="fa fa-inr" aria-hidden="true" />
                          {Details ? Details.membership_amount : null}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="pay-btn">
                    {/* <div className="pay-inpt">
                      <div className="row">
                        <div className="col-md-7 col-12">
                          <div className="form-group log-group pay-frm">
                            <input
                              type="text"
                              id
                              className="form-control"
                              placeholder
                              required
                            />
                            <label htmlFor className="log-label">
                              Card Number
                            </label>
                          </div>
                        </div>
                        <div className="col-md-3 col-6">
                          <div className="form-group log-group pay-frm">
                            <input
                              type="text"
                              id
                              className="form-control"
                              placeholder
                              required
                            />
                            <label htmlFor className="log-label">
                              Expiry Date
                            </label>
                          </div>
                        </div>
                        <div className="col-md-2 col-6">
                          <div className="form-group log-group pay-frm">
                            <input
                              type="text"
                              id
                              className="form-control"
                              placeholder
                              required
                            />
                            <label htmlFor className="log-label">
                              CVV
                            </label>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    <ul>
                      <li className="shp" onClick={() => this.submit()}>
                        <Link to="#">Pay</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {/* ---------------left panel start----------------- */}
          </div>
        </div>
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

export default connect(null, mapDispatchToProps)(Payment);
