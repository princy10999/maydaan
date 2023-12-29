import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import { Link } from "react-router-dom";
// import view from "../../assets/images/view.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import rupe from "../../assets/images/rupe.png";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class MyOrders extends Component {
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | My Orders";
  }
  render() {
    return (
   <>
       <Helmet>
          <title>{Titles?.myOrders?.title}</title>
          <meta name="description" content={Titles?.myOrders?.description} />
          <meta property="og:title" content={Titles?.myOrders?.ogTitle} />
          <meta
            property="og:description"
            content={Titles?.myOrders?.ogDescription}
          />
          <meta property="og:image" content={Titles?.myOrders?.ogImage} />
          <link rel="canonical" href={Titles?.myOrders?.link} />
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
                    <h1>My Orders</h1>
                    <div className="dasbordRightBody for_table_stc">
                      <div className="row">
                      <div className="col-lg-12 col-md-12 com_padd_both order_summary">
                          <div className="dashbox">
                            <div className="dashbox_head">
                              <h4>
                                Attendance Date
                                <span />
                              </h4>
                            </div>
                            <div className="dashbox_body tyaa atdn-dt" >
                              <div className="row">
                                <div className="col-md-5 col-12">
                                <div class="iputBx">
                                  <label>From Date</label>
                                  <input type="text" placeholder="Select" id="datepicker" class="date_calc"/>
                                </div>
                                </div>
                                <div className="col-md-5 col-12">
                                <div class="iputBx">
                                  <label> To Date</label>
                                  <input type="text" placeholder="Select" id="datepicker" class="date_calc"/>
                                </div>
                                </div>
                                <div className="col-2">
                                <div class="footdashSec atdn-dash">
                                  <input type="submit" value="Go" class="subbtn"/>
                                </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*TABLE AREA START*/}
                      <div className="table_01 table">
                        <div className="row amnt-tble">
                          <div className="cel_area amunt cess nw1">
                            Student Name
                          </div>                          
                          <div className="cel_area amunt cess mar24">
                            Present
                          </div>
                          <div className="cel_area amunt cess mar26">
                            Absent
                          </div>
                        </div>
                        {/*table row-1*/}
                        <div className="row small_screen2">
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Student Name</span>{" "}
                            <span className="sm_size">Abhijit Sawant</span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Present</span>{" "}
                            <span className="sm_size">
                              <div className="dot pre100">
                              <label class="rad">
                                        <input type="radio" name="radio1" id="p1"/>
                                        <span class="radio"></span>
                                    </label>
                              </div>
                            </span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Absent</span>{" "}
                            <span className="sm_size">
                              <div className="dot ab1">
                              <label class="rad">
                                        <input type="radio" name="radio1" id="pa1"/>
                                        <span class="radio"></span>
                               </label>
                              </div>
                              </span>
                          </div>
                        </div>
                        {/*table row-2*/}
                        <div className="row small_screen2">
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Student Name</span>{" "}
                            <span className="sm_size">Abhijit Sawant</span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Present</span>{" "}
                            <span className="sm_size">
                              <div className="dot pre100">
                              <label class="rad">
                                        <input type="radio" name="radio2" id="p2"/>
                                        <span class="radio"></span>
                                    </label>
                              </div>
                            </span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Absent</span>{" "}
                            <span className="sm_size">
                              <div className="dot ab1">
                              <label class="rad">
                                        <input type="radio" name="radio2" id="pa2"/>
                                        <span class="radio"></span>
                               </label>
                              </div>
                              </span>
                          </div>
                        </div>
                        {/*table row-3*/}
                        <div className="row small_screen2">
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Student Name</span>{" "}
                            <span className="sm_size">Abhijit Sawant</span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Present</span>{" "}
                            <span className="sm_size">
                              <div className="dot pre100">
                              <label class="rad">
                                        <input type="radio" name="radio3" id="p3"/>
                                        <span class="radio"></span>
                                    </label>
                              </div>
                            </span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Absent</span>{" "}
                            <span className="sm_size">
                              <div className="dot ab1">
                              <label class="rad">
                                        <input type="radio" name="radio3" id="pa3"/>
                                        <span class="radio"></span>
                               </label>
                              </div>
                              </span>
                          </div>
                        </div>
                        {/*table row-4*/}
                        <div className="row small_screen2">
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Student Name</span>{" "}
                            <span className="sm_size">Abhijit Sawant</span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Present</span>{" "}
                            <span className="sm_size">
                              <div className="dot pre100">
                              <label class="rad">
                                        <input type="radio" name="radio4" id="p4"/>
                                        <span class="radio"></span>
                                    </label>
                              </div>
                            </span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Absent</span>{" "}
                            <span className="sm_size">
                              <div className="dot ab1">
                              <label class="rad">
                                        <input type="radio" name="radio4" id="pa4"/>
                                        <span class="radio"></span>
                               </label>
                              </div>
                              </span>
                          </div>
                        </div>
                        {/*table row-5*/}
                        <div className="row small_screen2">
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Student Name</span>{" "}
                            <span className="sm_size">Abhijit Sawant</span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Present</span>{" "}
                            <span className="sm_size">
                              <div className="dot pre100">
                              <label class="rad">
                                        <input type="radio" name="radio5" id="p5"/>
                                        <span class="radio"></span>
                                    </label>
                              </div>
                            </span>
                          </div>
                          <div className="cel_area amunt-detail cess">
                            {" "}
                            <span className="hide_big">Absent</span>{" "}
                            <span className="sm_size">
                              <div className="dot ab1">
                              <label class="rad">
                                        <input type="radio" name="radio5" id="pa5"/>
                                        <span class="radio"></span>
                               </label>
                              </div>
                              </span>
                          </div>
                        </div>
                      </div>
                    </div>
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
export default MyOrders;
