import React, { Component } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import fb from "../../assets/images/fb.png";
// import twitter from "../../assets/images/twitter.png";
// import menu from "../../assets/images/menu.png";
// import top_logo from "../../assets/images/top-logo.png";
import axios from "../../shared/axios";
import swal from "sweetalert";
import {
  FacebookShareButton,
  TwitterShareButton
} from "react-share";

class Header1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: []
    }}
  componentDidMount(){
    axios.post("show-contact-us-details").then((res)=>{
      // console.log("details",res);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result) {
        this.setState({
          details:res.data.result.details
        })
      }
    })
  }
  render() {
    const {details}=this.state
    return (
      <header className="header_sec ">
        <div className="top_bar">
          <nav className="navbar navbar-expand-lg ">
            <div className="container-fluid">
              <div className="socail_headers">
                <ul className="top-socail">
                  <li>
                  <FacebookShareButton url={window.location.href}>
                      <img src={process.env.PUBLIC_URL + "/images/fb.png"} alt="" />
                  </FacebookShareButton>
                  </li>
                  <li>
                  <TwitterShareButton url={window.location.href}>
                      <img src={process.env.PUBLIC_URL + "/images/twitter.png"} alt="" />
                  </TwitterShareButton>
                  </li>
                  
                </ul>
                <div className="logo outsd">
                <Link to="/">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/maydaan_logo_top.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
              </div>
              <div className="tab-scr-r8">
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#main_nav"
              >
                <span className="navbar-toggler-icon">
                  <img src={process.env.PUBLIC_URL + "/images/menu.png"} alt="" />
                </span>
              </button>
              <div className="collapse navbar-collapse" id="main_nav">
                <ul className="navbar-nav ml-auto menu_all_head">
                  <div className="nav-items-lft">
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-club">
                      {" "}
                      Club{" "}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-event">
                      {" "}
                      Event
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search-trainer">
                      {" "}
                      Trainer{" "}
                    </Link>
                  </li>
                  </div>
                  <div className="logo insd">
                <Link to="/">
                  <img
                    src={
                      process.env.PUBLIC_URL + "/images/maydaan_logo_top.png"
                    }
                    alt=""
                  />
                </Link>
              </div>
             
                  <div className="nav-items-r8">
                  {!this.props.user ? (
                    <li className="nav-item">
                      <Link  className="nav-link opn-lnk">
                        &nbsp;
                      </Link>
                    </li>
                  ) : null}
                  <li className="nav-item">
                    <Link className="nav-link link-4log" to="/login">
                      {" "}
                      Register/Login{" "}
                    </Link>
                  </li>
                  {!this.props.user ? (
                    <li className="nav-item">
                      <Link to="/search-product" className="nav-link">
                        Shop{" "}
                      </Link>
                    </li>
                  ) : null}
                  </div>
                </ul>
              </div>

              
              {/* navbar-collapse.// */}
              <div className="socail_headers">
                <ul className="top-socail">
                  
                  {details ? (
                    <li>
                      <a href={`mailto:${details.email}`}> {details.email}</a>
                    </li>
                  ) : null}
                </ul>
              </div>
              </div>
              </div>
            {/* container //  */}
          </nav>
        </div>
        {/* // <div className="logo_bar">
        //   <div className="container-fluid">
        //     <div className="headers_flex">
        //       <div className="logo">
        //         <Link to="/">
        //           <img src={process.env.PUBLIC_URL + "/images/maydaan_logo_top.png"} alt="" />
        //         </Link>
        //       </div>
        //     </div>
        //   </div>
        // </div> */}
      </header>
    );
  }
}

export default Header1;
