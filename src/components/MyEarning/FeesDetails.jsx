import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { UPDATE_LOADER} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";

class FeesDetails extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      detail: [],
      fee: [],
    };
  }
  componentDidMount() {
    document.title = "Maydaan | Fees Details";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    let data = {
      params: {
        offset: this.state.offset,
        member_id: this.props.match.params.id,
      },
    };
    this.props.onUpdateLoader(true);
    axios.post("/club-member-fees-details", data).then((resp) => {
    //   console.log("fee", resp);
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(false);
      if (resp.data.result && resp.data.result.users) {
        this.setState({
          detail: resp.data.result,
          fee: resp.data.result.users,
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
    const { detail, fee } = this.state;
    return (
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
                  <div className="dasbordRightlink ">
                    <h1>Fees Details</h1>
                    <div className="dasbordRightBody pb-3">
                      <div className="row">
                        <div className="col-lg-12 col-md-12 com_padd_both order_summary">
                          <div className="dashbox">
                            <div className="dashbox_head">
                              <h4>
                                Fees Summary
                                <span />
                              </h4>
                              <buttton
                                className="back_btnn01 back_btnn_new01 back_btnn_new02"
                                onClick={() =>
                                  this.props.history.push(
                                    "/my-earning-from-membership"
                                  )
                                }
                              >
                                Back
                              </buttton>
                            </div>
                            <div className="dashbox_body tyaa width_65">
                              <p>
                                <strong> Member Name</strong>{" "}
                                <span>
                                  :{" "}
                                  {detail.member
                                    ? detail.member.first_name +
                                      " " +
                                      detail.member.last_name
                                    : null}
                                </span>
                              </p>
                              {detail.member && detail.member.gender ? (
                                <p>
                                  <strong> Gender : </strong>{" "}
                                  <span>{detail.member.gender}</span>
                                </p>
                              ) : null}
                              <p>
                                <strong> Joined On : </strong>{" "}
                                <span>
                                  {detail.joined_on}
                                </span>
                              </p>
                            </div>
                            <div className="dashbox_body small_bbxx tyaa width_35">
                              {detail.member && detail.member.phone ? (
                                <p>
                                  <strong> Phone No. : </strong>{" "}
                                  <span> +91{detail.member.phone}</span>
                                </p>
                              ) : null}
                              {detail.member &&
                              detail.member.user_city_details &&
                              detail.member.user_state_details ? (
                                <p>
                                  <strong> Location : </strong>{" "}
                                  <span>
                                    {detail.member.user_city_details.city +
                                      "," +
                                      detail.member.user_state_details.name}
                                  </span>
                                </p>
                              ) : null}
                              {detail.total_fees_paid ? (
                                <p>
                                  <strong> Total Fees Paid : </strong>{" "}
                                  <span>
                                    <img
                                      src={
                                        process.env.PUBLIC_URL +
                                        "/images/rupe.png"
                                      }
                                      alt=""
                                    />{" "}
                                    {detail.total_fees_paid}
                                  </span>
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="productss_orderr">
                          <h5>Fees</h5>
                          {/*TABLE AREA START*/}
                          <div className="table_01 table">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw3">
                                Paid On
                              </div>
                              <div className="cel_area amunt cess nw4">
                                Amount
                              </div>
                              <div className="cel_area amunt cess nw5 ">
                                Commission
                              </div>
                              <div className="cel_area amunt cess mc99 ">
                                Net Earning
                              </div>
                            </div>
                            {/*table row-1*/}
                            {fee && fee.length > 0
                              ? fee.map((item, index) => {
                                  return (
                                    <div
                                      className="row small_screen2"
                                      key={index}
                                    >
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Paid On
                                        </span>
                                        <span className="sm_size">
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/images/rupe.png"
                                            }
                                            alt=""
                                          />
                                          {item.paid_on}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Amount</span>
                                        <span className="sm_size">
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/images/rupe.png"
                                            }
                                            alt=""
                                          />
                                          {item.get_payment
                                            ? item.get_payment.amount
                                            : null}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">Commision</span>
                                    <span className="sm_size ">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_payment
                                        ? item.get_payment.commission
                                        : "0"}
                                    </span>
                                  </div>
                                  <div className="cel_area amunt-detail cess">
                                    {" "}
                                    <span className="hide_big">
                                      Net Earning
                                    </span>
                                    <span className="sm_size">
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/rupe.png"
                                        }
                                        alt=""
                                      />
                                      {item.get_payment
                                        ? item.get_payment
                                            .total_after_commission
                                        : "0"}
                                    </span>
                                  </div>
                                    </div>
                                  );
                                })
                              : null}
                          </div>
                          {/*TABLE AREA END*/}
                          {this.state.page_count > 1 ? (
                            <div className="pag_red pag_for_dash">
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
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(FeesDetails);
