import React, { Component } from "react";
import { Link } from "react-router-dom";
// import footer_logo from "../../assets/images/footer-logo.png";
// import facebook from "../../assets/images/facebook.png";
// import f_twitter from "../../assets/images/f-twitter.png";
// import instagram from "../../assets/images/instagram.png";
// import go_to_top from "../../assets/images/go-to-top.png";
import axios from "../../shared/axios";
import swal from "sweetalert";
// import {
//   FacebookShareButton,
//   TwitterShareButton
// } from "react-share";

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: [],
    };
  }
  componentDidMount() {
    axios.post("show-contact-us-details").then((res) => {
      // console.log("details", res);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result) {
        this.setState({
          details: res.data.result.details,
        });
      }
    });
  }
  render() {
    const { details } = this.state;
    return (
      <>
        <div className="footer">
          <div className="container">
            <div className="footer-logo">
              <img src={process.env.PUBLIC_URL + "/images/maydaan_logo_fot.png"} alt="" />
            </div>
            {details ? (
              <div className="contact">
                <p>
                  <div
                    dangerouslySetInnerHTML={{ __html: details.footer_text }}
                  />
                </p>
                <ul className="social">
                  <li>
                  <a href={details.facebook_link} target="_blank">
                      <img src={process.env.PUBLIC_URL + "/images/facebook.png"} alt="" />
                  </a>
                  </li>
                  <li>
                  <a href={details.twitter_link} target="_blank">
                      <img src={process.env.PUBLIC_URL + "/images/f-twitter.png"} alt="" />
                    </a>
                  </li>
                  <li>
                  <a href={details.instagram_ink} target="_blank">
                      <img src={process.env.PUBLIC_URL + "/images/instagram.png"} alt="" />
                  </a>
                  </li>
                </ul>
                <p>
                  {details.address}
                  <br />
                  Contact :{" "}
                  <a href={`tel:+91${details.phone_number_1}`}>
                    {details.phone_number_1}
                  </a>
                  /
                  <a href={`tel:+91${details.phone_number_2}`}>
                    {details.phone_number_2}
                  </a>
                  /<a href={`mailto:${details.email}`}>{details.email}</a>
                </p>
              </div>
            ) : null}
            <div className="footer-menu">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
                <li>
                  <Link to="/about-us">About us</Link>
                </li>
                <li>
                  <Link to="/contact-us">Contact us</Link>
                </li>
                <li>
                  <Link to="/faq">FAQ</Link>
                </li>
                <li>
                  <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link to="/help">Help</Link>
                </li>
                <li>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="copy">
            <div className="container">
              <p>
                Copyright © 2022{" "}
                <Link to="/" className="yel">
                  www.maydaan.in
                </Link>{" "}
                <span className="line" /> All rights reserved
              </p>
            </div>
          </div>
        </div>

        {/* <div id="stop" className="scrollTop">
          <span>
            <Link to="#">
              <img src={process.env.PUBLIC_URL + "/images/go-to-top.png"} alt="" />
            </Link>
          </span>
          <p>Scroll to top</p>
        </div> */}
      </>
    );
  }
}
export default Footer;
