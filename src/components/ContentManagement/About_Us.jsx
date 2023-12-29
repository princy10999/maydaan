import React, { Component } from "react";
import Layout from "../Layout/Layout";
import axios from "../../shared/axios";
import { UPDATE_LOADER, BASE_URL } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import OwlCarousel from "react-owl-carousel";
import swal from "sweetalert";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
// import list_dot_pink from "../../assets/images/list-dot-pink.png";

const owl_achv = {
  loop: true,
  margin: 30,
  nav: false,
  dots: false,
  autoplay: true,
  responsive: {
    0: {
      items: 1,
    },
    600: {
      items: 3,
    },
    1000: {
      items: 5,
    },
    1200: {
      items: 5,
    },
  },
};
class About_Us extends Component {
  constructor(props) {
    super(props);
    this.state = {
      about: [],
      awards: [],
      heading: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | About Us";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.onUpdateLoader(true);
    axios.post("show-about-us").then((res) => {
      //   console.log("about-us",res);
      this.props.onUpdateLoader(false);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result && res.data.result.about_us) {
        this.setState({
          about: res.data.result.about_us,
          awards: res.data.result.AboutUsOurAcheivementAwards,
          heading: res.data.result.about_maydaan_subheading,
        });
      }
    });
  }

  render() {
    const { about, awards, heading } = this.state;
    return (
      <>
        <Helmet>
          <title>{Titles?.aboutUs?.title}</title>
          <meta name="description" content={Titles?.aboutUs?.description} />
          <meta property="og:title" content={Titles?.aboutUs?.ogTitle} />
          <meta
            property="og:description"
            content={Titles?.aboutUs?.ogDescription}
          />
          <meta property="og:image" content={Titles?.aboutUs?.ogImage} />
          <link rel="canonical" href={Titles?.aboutUs?.link} />
        </Helmet>
        <Layout>
          <div className="abt-main-back">
            <div className="abt-bnr">
              <div className="abt-blr" />
              <div className="container">
                <div className="abt-bnr-txt">
                  {heading && heading.length > 0 ? (
                    <h1>
                      {heading[0]}
                      <br />
                      {heading[1]}
                    </h1>
                  ) : null}
                  <p>{about.about_maydaan_subheading}</p>
                </div>
              </div>
            </div>
            <div className="bt-brd">
              <div className="container">
                <div className="row">
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
                          About Us
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div className="achivement">
              <div className="container">
                <div className="achv">
                  <div className="achv-hd">
                    <h2>{about.our_achivement_heading}</h2>
                    <p>{about.our_achivement_description}</p>
                  </div>
                  {awards && awards.length > 0 ? (
                    <div className="achv-scroll">
                      <span className="timeline" />
                      <OwlCarousel
                        className="owl-carousel owl-theme owl-achv"
                        {...owl_achv}
                      >
                        {awards.map((item) => {
                          return (
                            <div className="item">
                              <div className="achv-crd">
                                <h4>{item.awards_year}</h4>
                                <span className="tri001" />
                                <h5>{item.awards_title}</h5>
                                <p>{item.awards_description}</p>
                              </div>
                            </div>
                          );
                        })}
                      </OwlCarousel>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mai-spl">
              <div className="container">
                <div className="abt-spcl">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: about.what_makes_maydaan_special_dsc_1,
                    }}
                  />
                  <Link to="/contact-us" className="abt-spcl-btn">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
            <div className="mai-abt">
              <div className="container">
                <div className="mai-abt-tp">
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="tp-img">
                        <img
                          src={
                            BASE_URL +
                            "/storage/app/public/about_us_images/" +
                            about.what_makes_maydaan_special_image
                          }
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="tp-txt">
                        <h3>{about.what_makes_maydaan_special_heading}</h3>
                        <p>
                          {about.what_makes_maydaan_special_description_first}
                        </p>
                        <p>
                          {about.what_makes_maydaan_special_description_second}
                        </p>
                        <div className="tp-btn">
                          <Link to="/contact-us">Contact us</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mai-abt-btm">
                  <div className="row">
                    <div className="col-lg-6 col-12">
                      <div className="tp-txt">
                        <h3>{about.our_mission_vision_heading_1}</h3>
                        <p>{about.our_mission_vision_heading_description_1}</p>
                        <p>{about.omv_desc_2}</p>
                        <h4>{about.subcaption_text}</h4>
                        <ul>
                          <li>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/list-dot-pink.png"
                              }
                              alt=""
                            />
                            {about.subcaption_1}
                          </li>
                          <li>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/list-dot-pink.png"
                              }
                              alt=""
                            />
                            {about.subcaption_2}
                          </li>
                          <li>
                            <img
                              src={
                                process.env.PUBLIC_URL +
                                "/images/list-dot-pink.png"
                              }
                              alt=""
                            />
                            {about.subcaption_3}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12">
                      <div className="tp-img">
                        <img
                          src={
                            BASE_URL +
                            "/storage/app/public/about_us_images/" +
                            about.image_2
                          }
                          alt=""
                          className="img-fluid"
                        />
                      </div>
                    </div>
                  </div>
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
export default connect(null, mapDispatchToProps)(About_Us);
