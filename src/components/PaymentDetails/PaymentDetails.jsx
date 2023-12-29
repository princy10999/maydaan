import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { connect } from "react-redux";
import PaymentList from "./PaymentList";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "Product",
    };
  }
  openPayment = (category) => {
    document.getElementById(category).style.display = "block";
  };

  componentDidMount() {
    // document.title = "Maydaan | Payment Details";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.openPayment("Product");
  }
  render() {
    const openPayment = (evt, category) => {
      this.setState({ value: category });
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(category).style.display = "block";
      evt.currentTarget.className += " active";
    };
    const { value } = this.state;
    return (
      <>
        <Helmet>
          <title>{Titles?.paymentDetails?.title}</title>
          <meta
            name="description"
            content={Titles?.paymentDetails?.description}
          />
          <meta property="og:title" content={Titles?.paymentDetails?.ogTitle} />
          <meta
            property="og:description"
            content={Titles?.paymentDetails?.ogDescription}
          />
          <meta property="og:image" content={Titles?.paymentDetails?.ogImage} />
          <link rel="canonical" href={Titles?.paymentDetails?.link} />
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
                      <h1>Payment Details</h1>
                      <div className="tab rvw-tab d-flex">
                        <button
                          className="tablinks active"
                          onClick={(event) => openPayment(event, "Product")}
                          id="defaultOpen"
                        >
                          Payment <span>for Product</span>
                        </button>
                        {this.props.user && this.props.user.type !== "C" ? (
                          <>
                            <button
                              className="tablinks"
                              onClick={(event) => openPayment(event, "Club")}
                            >
                              Payment <span>for Club</span>
                            </button>
                            <button
                              className="tablinks"
                              onClick={(event) => openPayment(event, "Trainer")}
                            >
                              Payment <span>for Trainer</span>
                            </button>
                          </>
                        ) : null}
                      </div>
                      <div id="Product" className="tabcontent rvw-tabcontant">
                        <PaymentList value={value} />
                      </div>
                      {this.props.user && this.props.user.type !== "C" ? (
                        <>
                          <div id="Club" className="tabcontent rvw-tabcontant">
                            <PaymentList value={value} />
                          </div>
                          <div
                            id="Trainer"
                            className="tabcontent rvw-tabcontant"
                          >
                            <PaymentList value={value} />
                          </div>
                        </>
                      ) : null}
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, null)(PaymentDetails);
