import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import { USER_IMAGE } from "../../store/action/actionTypes";
import Titles from "../Titles";
import { Helmet } from "react-helmet";
// import edit from "../../assets/images/edit.png";
// import take_attendence from "../../assets/images/take-attendence.png";
// import view_attendence from "../../assets/images/view-attendence.png";
// import block from "../../assets/images/block.png";
// import unblock from "../../assets/images/unblock.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import no_result from "../../assets/images/no-result.png";
// import pro_pick from "../../assets/images/pro_pick.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import view from "../../assets/images/view.png";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import swal from "sweetalert";

class OurTrainers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trainerList: [],
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      loader:false
    };
  }

  componentDidMount() {
    // document.title = "Maydaan | Our Trainers";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }

  getData = () => {
    this.props.onUpdateLoader(true);
    this.setState({loader:true})

    axios
      .post("/list-of-club-trainers", { params: { offset: this.state.offset } })
      .then((res) => {
        this.props.onUpdateLoader(false);
        this.setState({loader:false})

        // console.log("trainers", res);
        this.setState({
          trainerList: res.data.result.users,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          total: res.data.result.total,
        });
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
  status = (id) => {
    var data = {
      params: {
        trainer_id: id,
      },
    };
    swal({
      text: "Are you sure you want to change status of the trainer?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("change-club-trainers-status", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.getData();
          }
          else if(resp.data.error){
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  delete = (id) => {
    var data = {
      params: {
        user_id: id,
      },
    };
    swal({
      text: "Are you sure you want to delete this trainer details?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("delete-user-details", data).then((resp) => {
          if (resp.data.result) {
            this.getData();
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }else if(resp.data.error){
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  render() {
    const { trainerList } = this.state;
    return (
     <>
      <Helmet>
        <title>{Titles?.manaourTrainerseOrder?.title}</title>
        <meta
            name="description"
            content={Titles?.ourTrainers?.description}
        />
        <meta property="og:title" content={Titles?.ourTrainers?.ogTitle} />
        <meta property="og:description" content={Titles?.ourTrainers?.ogDescription} />
        <meta property="og:image" content={Titles?.ourTrainers?.ogImage} />
        <link rel="canonical" href={Titles?.ourTrainers?.link} />
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
                    <h1>Our Trainers</h1>
                    <div className="dasbordRightBody for_table_stc">
                      <Message />
                      <div
                        className="prod_add"
                        style={{
                          display: "block",
                          float: "right",
                          width: "100%",
                        }}
                      >
                        <Link to="/add-trainer">
                          <i className="fa fa-plus" aria-hidden="true" />
                          Add Trainer
                        </Link>
                      </div>
                      {trainerList && trainerList.length > 0 ? (
                        <div className="table_01 table">
                          <div className="row amnt-tble">
                            <div className="cel_area amunt cess nw1">
                              &nbsp;
                            </div>
                            <div className="cel_area amunt cess nw2">
                              Name &amp; Contact
                            </div>
                            <div className="cel_area amunt cess nw3">
                              Location
                            </div>
                            <div className="cel_area amunt cess nw4">
                              Category
                            </div>
                            <div className="cel_area amunt cess nw5">
                              Status
                            </div>
                            <div className="cel_area amunt cess nw9">
                              &nbsp;
                            </div>
                          </div>
                          {trainerList && trainerList.length > 0
                            ? trainerList.map((item) => {
                                return (
                                  <div
                                    className="row small_screen2"
                                    key={item.id}
                                  >
                                    <div className="cel_area amunt-detail cess">
                                      <span className="sm_size mmbr_pic">
                                        <img
                                          src={item.profile_picture!==null?
                                            USER_IMAGE + item.profile_picture :(process.env.PUBLIC_URL + "/images/pro_pick.png")
                                          }
                                          alt=""
                                        />
                                      </span>
                                    </div>
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">
                                        Name &amp; Contact
                                      </span>{" "}
                                      <span className="sm_size">
                                        {item.first_name + " " + item.last_name}{" "}
                                        <strong>{item.phone}</strong>
                                      </span>
                                    </div>
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">
                                        Location
                                      </span>{" "}
                                      <span className="sm_size">
                                        {item.user_state_details.name}
                                      </span>
                                    </div>
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">
                                        Category
                                      </span>{" "}
                                      <span className="sm_size">
                                        {item.get_associated_category &&item.get_associated_category[0] &&
                                        item.get_associated_category[0]
                                          .get_category_details
                                          ? item.get_associated_category[0]
                                              .get_category_details.name
                                          : null}
                                      </span>{" "}
                                    </div>
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">Status</span>
                                      {item.status === "A" ? (
                                        <span className="sm_size clor_done">
                                          Active
                                        </span>
                                      ) : (
                                        <span className="sm_size clor_cancel">
                                          Inactive
                                        </span>
                                      )}
                                    </div>
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">Action</span>
                                      <ul className="m-line-2">
                                        <li>
                                          <Link to={`/edit-trainer/${item.id}`}>
                                            <img
                                              src={process.env.PUBLIC_URL + "/images/edit.png"}
                                              title="Edit Details"
                                              alt=""
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            to="#"
                                            onClick={() => this.status(item.id)}
                                          >
                                            <img
                                              src={
                                                item.status === "A"
                                                  ? (process.env.PUBLIC_URL + "/images/block.png")
                                                  : (process.env.PUBLIC_URL + "/images/unblock.png")
                                              }
                                              alt=""
                                              title={
                                                item.status === "A"
                                                  ? "Block"
                                                  : "Unblock"
                                              }
                                            />{" "}
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            to="#"
                                            onClick={() => this.delete(item.id)}
                                          >
                                            <img
                                              src={process.env.PUBLIC_URL + "/images/delete-dash.png"}
                                              alt=""
                                              title="Delete"
                                            />{" "}
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to={`/view-members/${item.id}`}>
                                            <img
                                              src={process.env.PUBLIC_URL + "/images/view.png"}
                                              title="View members"
                                              alt=""
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                        <Link to={`/take-attendance/${item.id}`}>
                                            <img
                                              src={process.env.PUBLIC_URL + "/images/take-attendence.png"}
                                              title="Take Attendance"
                                              alt=""
                                            />
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to={`/view-attendance/${item.id}`}>
                                            <img
                                              src={process.env.PUBLIC_URL + "/images/view-attendence.png"}
                                              title="View Attendance"
                                              alt=""
                                            />
                                          </Link>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      ) : (
                        <>
                        { !this.state.loader ?
                        <div className="n-resul">
                          <img src={process.env.PUBLIC_URL + "/images/no-result.png"} alt="" />
                          <p>
                            You have currently no trainers! Click "Add Trainer"
                            button to add trainers.
                          </p>
                        </div>
                        :null}
                        </>
                      )}
                    </div>
                  </div>
                  {this.state.page_count>1?
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
                            <img src={process.env.PUBLIC_URL + "/images/pagleft.png"} alt="" className="dpb" />
                            <img src={process.env.PUBLIC_URL + "/images/pagrightho.png"} alt="" className="dpn" />
                          </>
                        }
                        nextLabel={
                          <>
                            <img src={process.env.PUBLIC_URL + "/images/pagright.png"} alt="" className="dpb" />
                            <img src={process.env.PUBLIC_URL + "/images/pagrightho.png"} alt="" className="dpn" />
                          </>
                        }
                        marginPagesDisplayed={1}
                        renderOnZeroPageCount={null}
                      />
                    </div>
                  </div>
                  :null}
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
export default connect(null, mapDispatchToProps)(OurTrainers);
