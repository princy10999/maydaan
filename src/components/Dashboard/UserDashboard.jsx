import React, { Component } from 'react'
import Layout from '../Layout/Layout'
import Sidebar from '../Layout/Sidebar'
import { Link } from 'react-router-dom/cjs/react-router-dom'
// import icon_new1 from '../../assets/images/icon_new1.png'
// import icon_new2 from '../../assets/images/icon_new2.png'
// import icon_new3 from '../../assets/images/icon_new3.png'
// import view from "../../assets/images/view.png"
// import rupe from "../../assets/images/rupe.png"
// import delete_dash from "../../assets/images/delete-dash.png"
import axios from "../../shared/axios";
import { UPDATE_LOADER} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import dateFormat from "dateformat";
import swal from "sweetalert";
import Message from "../Layout/Message";
import Titles from "../Titles";
import { Helmet } from "react-helmet";


class UserDashboard extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      dashboard:[]
    }}
    componentDidMount() {
        // document.title = "Maydaan | Dashboard";
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    axios.post("dashboard")
    .then(resp=>{
      // console.log("...",resp);
      this.props.onUpdateLoader(false);
    if(resp.data.result){
      this.setState({dashboard: resp.data.result})
    }
  })
  }
  render() {
    const {dashboard}=this.state
    return (
     <>
      <Helmet>
        <title>{Titles?.userDashboard?.title}</title>
        <meta
            name="description"
            content={Titles?.userDashboard?.description}
        />
        <meta property="og:title" content={Titles?.userDashboard?.ogTitle} />
        <meta property="og:description" content={Titles?.userDashboard?.ogDescription} />
        <meta property="og:image" content={Titles?.userDashboard?.ogImage} />
        <link rel="canonical" href={Titles?.userDashboard?.link} />
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
                <h1>Dashboard</h1>
                <div className="dasbordRightBody for_table_stc">
                <Message />	
                    <div className="infoo_dashboardd">
                    <span>Hi, {this.props.user ? this.props.user.first_name : null}</span>
                    <p>Welcome to Maydaan. </p>
                    </div>
                    <div className="statics">
                    <div className="statics_box">
                        <strong><img src={process.env.PUBLIC_URL + "/images/orders.png"} alt="" /></strong>
                        <div className="media-body">
                        <h6>Total Orders</h6>
                        <span>{dashboard.tot_orders}</span>
                        </div>
                    </div>
                    <div className="statics_box">
                        <strong><img src={process.env.PUBLIC_URL + "/images/icon_new2.png"} alt="" /></strong>
                        <div className="media-body">
                        <h6>Associated clubs</h6>
                        <span>{dashboard.tot_associated_clubs}</span>
                        </div>
                    </div>
                    <div className="statics_box mr-0">
                        <strong><img src={process.env.PUBLIC_URL + "/images/trainer.png"} alt="" /></strong>
                        <div className="media-body">
                        <h6>Trainers</h6>
                        <span>{dashboard.tot_associated_trainers}</span>
                        </div>
                    </div>
                    </div>
                    <div className="productss_orderr dashboardd">
                    <h5>Recent Purchase</h5>
                    {/*TABLE AREA START*/}
                    <div className="table_01 table">
                        <div className="row amnt-tble">
                        <div className="cel_area amunt cess nw1">Order Id</div>
                        <div className="cel_area amunt cess nw3">Ordered On</div>
                        <div className="cel_area amunt cess nw4">Order Total</div>
                        <div className="cel_area amunt cess nw5">Status</div>
                        <div className="cel_area amunt cess nw6">&nbsp;</div>
                        </div>
                        {/*table row-1*/}
                        {dashboard && dashboard.recent_orders && dashboard.recent_orders.length>0? dashboard.recent_orders.map((item,index)=>{
                          return(
                            <div className="row small_screen2" key={index}>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">
                                Order Id
                              </span>{" "}
                              <span className="sm_size">
                                {item.order_number
                                  ? item.order_number
                                  : null}
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">
                                Ordered On
                              </span>{" "}
                              <span className="sm_size">
                                {dateFormat(item.created_at, "dd-mm-yyyy")}
                              </span>
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">
                                Order Total
                              </span>{" "}
                              <span className="sm_size">
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/rupe.png"
                                  }
                                  alt=""
                                />{" "}
                                {item.get_order_details &&
                                item.get_order_details[0]
                                  ? item.get_order_details[0]
                                      .unit_price_discounted
                                  : null}
                              </span>{" "}
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">Status</span>
                              {item.status == "ICM" ? (
                                <span
                                  className="sm_size"
                                  style={{ color: "#fecf6d" }}
                                >
                                  Incomplete
                                </span>
                              ) :item.status == "Dispatched" ? (
                                <span
                                  className="sm_size"
                                  style={{ color: "#fecf6d" }}
                                >
                                  Dispatched
                                </span>
                              ) : item.status == "NW" ? (
                                <span
                                  className="sm_size"
                                  style={{ color: "#99e9eb" }}
                                >
                                  New Order
                                </span>
                              ) : item.status == "INP" ? (
                                <span
                                  className="sm_size"
                                  style={{ color: "#99e9eb" }}
                                >
                                  In Progress
                                </span>
                              ) : item.status == "OD" ? (
                                <span className="sm_size clor_done">
                                  Delivered
                                </span>
                              ) : item.status == "CM" ? (
                                <span className="sm_size clor_done">
                                  Completed
                                </span>
                              ) :item.status == "C" ? (
                                <span className="sm_size clor_cancel">
                                  Cancelled
                                </span>
                              ) : null}
                            </div>
                            <div className="cel_area amunt-detail cess">
                              {" "}
                              <span className="hide_big">Action</span>
                              <ul>
                                    <li>
                                      <Link 
                                      to={`/order-details/${item.id}`}
                                      >
                                        <img
                                          src={
                                            process.env.PUBLIC_URL +
                                            "/images/view.png"
                                          }
                                          title="View Order Details"
                                          alt=""
                                        />
                                      </Link>
                                    </li>
                                  </ul>
                            </div>
                          </div>
                        )
                        }):null}
                    </div>
                    {/*TABLE AREA END*/} 
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
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps) (UserDashboard)