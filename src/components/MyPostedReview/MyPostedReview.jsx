import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { connect } from "react-redux";
import ReviewDetails from "../MyReview/ReviewDetails";
import Titles from "../Titles";
import { Helmet } from "react-helmet";


class MyPostedReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"ProductP"
    };
  }
  openReview = (cityName) => {
    document.getElementById(cityName).style.display = "block";
  };
  
  componentDidMount() {
    // document.title = "Maydaan | My Posted Review";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.openReview("ProductP")
  }
  render() {
    const openReview = (evt, cityName) => {
      this.setState({value:cityName})
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = document.getElementsByClassName("tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      document.getElementById(cityName).style.display = "block";
      evt.currentTarget.className += " active";
    };
    const {value } = this.state;
    return (
     <>
       <Helmet>
      <title>{Titles?.myPostedReview?.title}</title>
      <meta
          name="description"
          content={Titles?.myPostedReview?.description}
      />
      <meta property="og:title" content={Titles?.myPostedReview?.ogTitle} />
      <meta property="og:description" content={Titles?.myPostedReview?.ogDescription} />
      <meta property="og:image" content={Titles?.myPostedReview?.ogImage} />
      <link rel="canonical" href={Titles?.myPostedReview?.link} />
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
                    <h1>My Posted Reviews</h1>
                    <div className="tab rvw-tab d-flex">
                    <button
                        className="tablinks active"
                        onClick={(event) => openReview(event, "ProductP")}
                        id="defaultOpen"
                      >
                        Product <span>Review</span>
                      </button>
                    {this.props.user && this.props.user.type !== "C"?
                    <>
                      <button
                        className="tablinks"
                        onClick={(event) => openReview(event, "ClubP")}
                      >
                        Membership <span>Review</span>
                      </button>
                      <button
                        className="tablinks"
                        onClick={(event) => openReview(event, "TrainerP")}
                      >
                        Trainer <span>Review</span>
                      </button>
                      </>:null}
                    </div>
                    <div id="ProductP" className="tabcontent rvw-tabcontant">
                    <ReviewDetails value={value}/>
                    </div>
                    {this.props.user && this.props.user.type !== "C"?
                    <>
                    <div id="ClubP" className="tabcontent rvw-tabcontant">
                      <ReviewDetails value={value}/>
                    </div>
                    <div id="TrainerP" className="tabcontent rvw-tabcontant">
                    <ReviewDetails value={value}/>
                    </div></>:null}
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
export default connect(mapStateToProps, null)(MyPostedReview);
