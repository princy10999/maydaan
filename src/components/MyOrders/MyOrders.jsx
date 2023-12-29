import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import swal from "sweetalert";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";
// import view from "../../assets/images/view.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import rupe from "../../assets/images/rupe.png";
import Message from "../Layout/Message";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class MyOrders extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      loader: false,
      order: [],
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // document.title = "Maydaan | My Orders";
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios
      .post("myOrder", {
        params: {
          offset: this.state.offset,
        },
      })
      .then((resp) => {
        // console.log("oDetails", resp);
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
        if (resp.data.result && resp.data.result.order) {
          this.setState({
            order: resp.data.result.order,
            page_count: resp.data.result.page_count,
            per_page: resp.data.result.per_page,
            total: resp.data.result.total,
          });
        }
      });
  };

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    this.setState({ offset: offset }, () => {
      this.getData();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  render() {
    const { order } = this.state;
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
                        <Message />
                        {/*TABLE AREA START*/}
                        {order && order.length > 0 ? (
                          <>
                            <div className="table_01 table">
                              <div className="row amnt-tble">
                                <div className="cel_area amunt cess nw1">
                                  Order Id
                                </div>
                                <div className="cel_area amunt cess nw3">
                                  Ordered On
                                </div>
                                <div className="cel_area amunt cess nw4">
                                  Order Total
                                </div>
                                <div className="cel_area amunt cess nw5">
                                  Status
                                </div>
                                <div className="cel_area amunt cess nw6">
                                  &nbsp;
                                </div>
                              </div>
                              {/*table row-1*/}

                              {order.map((item, index) => {
                                return (
                                  <div
                                    className="row small_screen2"
                                    key={index}
                                  >
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
                                        {dateFormat(
                                          item.created_at,
                                          "dd-mm-yyyy"
                                        )}
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
                                        {item.total_after_discount
                                          ? item.total_after_discount
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
                                      ) : item.status == "Dispatched" ? (
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
                                      ) : item.status == "CM" ? (
                                        <span className="sm_size clor_done">
                                          Completed
                                        </span>
                                      ) : item.status == "OD" ? (
                                        <span className="sm_size clor_done">
                                          Delivered
                                        </span>
                                      ) : item.status == "C" ? (
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
                                );
                              })}
                            </div>
                          </>
                        ) : (
                          <>
                            {!this.state.loader ? (
                              <div className="n-resul">
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/no-result.png"
                                  }
                                  alt=""
                                />
                                <p>You have not ordered yet!</p>
                              </div>
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                    {this.state.page_count > 1 ? (
                      <div className="pag_red">
                        <div className="paginationsec">
                          <ReactPaginate
                            activeClassName="actv"
                            activeLinkClassName="actv"
                            initialPage={0}
                            breakLabel="....."
                            onPageChange={(e) => this.handlePageClick(e)}
                            pageCount={this.state.page_count}
                            previousLabel={
                              <>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/pagleft.png"
                                  }
                                  alt=""
                                  className="dpb"
                                />
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/paglefthov.png"
                                  }
                                  alt=""
                                  className="dpn"
                                />
                              </>
                            }
                            nextLabel={
                              <>
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/pagright.png"
                                  }
                                  alt=""
                                  className="dpb"
                                />
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/pagrightho.png"
                                  }
                                  alt=""
                                  className="dpn"
                                />
                              </>
                            }
                            marginPagesDisplayed={1}
                            renderOnZeroPageCount={null}
                          />
                        </div>
                      </div>
                    ) : null}
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
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(MyOrders);
