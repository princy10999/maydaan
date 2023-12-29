import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "../../shared/axios";
// import edit from "../../assets/images/edit.png";
// import pagleft from "../../assets/images/pagleft.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import no_result from "../../assets/images/no-result.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import block from "../../assets/images/block.png";
// import unblock from "../../assets/images/unblock.png";
import { BASE_URL } from "../../store/action/actionTypes";
import ReactPaginate from "react-paginate";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import swal from "sweetalert";
import ReactPlayer from "react-player/youtube";
import Titles from "../Titles";
import { Helmet } from "react-helmet";


class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      galleryList: [],
      page_count: 0,
      per_page: 0,
      offset: 0,
      loader: false,
      banner:"N"
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Gallery";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios
      .post("list-of-user-gallery", { params: { offset: this.state.offset } })
      .then((res) => {
        // console.log("gallery", res);
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
        this.setState({
          galleryList: res.data.result.list,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
          banner:res.data.result.is_uploaded_banner_gallery
        });
      });
  };
  delete = (id) => {
    var data = {
      params: {
        gallery_id: id,
      },
    };
    swal({
      text: "Are you sure you want to delete this file?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("delete-user-gallery", data).then((resp) => {
          if (resp.data.result) {
            // console.log("kp",this.state.galleryList.length, this.state.offset);
            if (this.state.galleryList.length === 1 && this.state.offset > 0) {
              this.setState(
                { offset: this.state.offset - this.state.per_page },
                () => {
                  this.getData();
                }
              );
            } else {
              this.getData();
            }
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (resp.data.error) {
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
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
  status = (id) => {
    var data = {
      params: {
        gallery_id: id,
      },
    };
    swal({
      text: "Are you sure you want to change status of this file?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("change-status-user-gallery", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            this.getData();
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (resp.data.error) {
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };

  render() {
    const { galleryList,banner } = this.state;
    return (
  <>
        <Helmet>
      <title>{Titles?.gallery?.title}</title>
      <meta
          name="description"
          content={Titles?.gallery?.description}
      />
      <meta property="og:title" content={Titles?.gallery?.ogTitle} />
      <meta property="og:description" content={Titles?.gallery?.ogDescription} />
      <meta property="og:image" content={Titles?.gallery?.ogImage} />
      <link rel="canonical" href={Titles?.gallery?.link} />
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
                    <h1>Gallery</h1>
                    <div
                      className="dasbordRightBody for_table_stc"
                      style={{ position: "relative" }}
                    >
                      <Message />
                      {/* <div className="prod_add">
                        <Link to="/add-gallery">
                          <i className="fa fa-plus" aria-hidden="true" />
                          Add to gallery
                        </Link>
                      </div> */}
                      <div className="prod_add prod_add0012">
                        <Link to="/add-banner" className="prod_add_l0">
                          <i className={banner==="Y"?"fa fa-edit":"fa fa-plus"} aria-hidden="true" />
                          {banner==="Y"?"Edit":"Add"} Banner Image
                        </Link>
                        <Link to="/add-gallery" className="prod_ad_g_00">
                          <i className="fa fa-plus" aria-hidden="true" />
                          Add to gallery
                        </Link>
                      </div>
                      {/*TABLE AREA START*/}
                      {galleryList && galleryList.length > 0 ? (
                        <div className="table_01 table">
                          <div className="row amnt-tble">
                            <div className="cel_area amunt cess nw2">
                              Gallery File
                            </div>
                            <div className="cel_area amunt cess nw4">
                              Gallery Type
                            </div>
                            <div className="cel_area amunt cess nw3">
                              Status
                            </div>
                            <div className="cel_area amunt cess nw3">
                              &nbsp;
                            </div>
                          </div>
                          {galleryList && galleryList.length > 0
                            ? galleryList.map((item,index) => {
                                return (
                                  <div
                                    className="row small_screen2"
                                    key={item.id}
                                  >
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">
                                        Gallery File
                                      </span>
                                      <div className="sm_size">
                                        <div className="gal005">
                                          {item.type === "I" ? (
                                            <img
                                              src={
                                                BASE_URL +
                                                "/storage/app/public/general_images/" +
                                                item.file
                                              }
                                              alt=""
                                            />
                                          ) : (
                                            <ReactPlayer
                                              width={70}
                                              height={60}
                                              url={item.file}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="cel_area amunt-detail cess">
                                      {" "}
                                      <span className="hide_big">
                                        Gallery Type
                                      </span>{" "}
                                      <span className="sm_size">
                                        {item.type === "I"
                                          ? "Image"
                                          : "Video Link"}
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
                                      <ul>
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
                                            />
                                          </Link>
                                        </li>
                                        {item.type !== "I" ? (
                                          <>
                                            <li>
                                              <Link
                                                to={`/edit-gallery/${item.id}`}
                                              >
                                                <img
                                                  src={process.env.PUBLIC_URL + "/images/edit.png"}
                                                  title="Edit"
                                                  alt=""
                                                />{" "}
                                              </Link>
                                            </li>
                                          </>
                                        ) : null}
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
                                      </ul>
                                    </div>
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      ) : (
                        <>
                          {!this.state.loader ? (
                            <div className="n-resul">
                              <img src={process.env.PUBLIC_URL + "/images/no-result.png"} alt="" />
                              <p>
                                Your gallery is empty! Click "Add to Gallery"
                                button to add gallery items.
                              </p>
                            </div>
                          ) : null}
                        </>
                      )}
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
                                  <img src={process.env.PUBLIC_URL + "/images/pagleft.png"} alt="" className="dpb" />
                                  <img
                                    src={process.env.PUBLIC_URL + "/images/paglefthov.png"}
                                    alt=""
                                    className="dpn"
                                  />
                                </>
                              }
                              nextLabel={
                                <>
                                  <img src={process.env.PUBLIC_URL + "/images/pagright.png"} alt="" className="dpb" />
                                  <img
                                    src={process.env.PUBLIC_URL + "/images/pagrightho.png"}
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
export default connect(null, mapDispatchToProps)(Gallery);
