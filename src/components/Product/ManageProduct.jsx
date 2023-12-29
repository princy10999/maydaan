import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";
import axios from "../../shared/axios";
// import edit from "../../assets/images/edit.png";
// import pagleft from "../../assets/images/pagleft.png";
// import delete_dash from "../../assets/images/delete-dash.png";
// import rupe from "../../assets/images/rupe.png";
// import no_result from "../../assets/images/no-result.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import block from "../../assets/images/block.png";
// import unblock from "../../assets/images/unblock.png";
// import pro_pick from "../../assets/images/pro_pick.png";
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
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class ManageProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      page_count: 0,
      per_page: 0,
      offset: 0,
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Manage Products";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios
      .post("product-list", { params: { offset: this.state.offset } })
      .then((res) => {
        // console.log("products", res);
        this.props.onUpdateLoader(false);
        this.setState({ loader: false });
        this.setState({
          productList: res.data.result.products,
          page_count: res.data.result.page_count,
          per_page: res.data.result.per_page,
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

  delete = (id) => {
    var data = {
      params: {
        id: id,
      },
    };
    swal({
      text: "Are you sure you want to delete this product?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("delete-product", data).then((resp) => {
          if (resp.data.result) {
            if (this.state.productList.length === 1 && this.state.offset > 0) {
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
          }
        });
      }
    });
  };
  status = (id, status) => {
    var status1 = "I";
    if (status === "I") {
      status1 = "A";
    }
    var data = {
      params: {
        id: id,
        status: status1,
      },
    };
    swal({
      text: "Are you sure you want to change status of this product?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("change-product-status", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.getData();
          }
        });
      }
    });
  };
  render() {
    const { productList } = this.state;
    return (
      <>
        <Helmet>
          <title>{Titles?.manageProduct?.title}</title>
          <meta name="description" content={Titles?.manageProduct?.description} />
          <meta property="og:title" content={Titles?.manageProduct?.ogTitle} />
          <meta
            property="og:description"
            content={Titles?.manageProduct?.ogDescription}
          />
          <meta property="og:image" content={Titles?.manageProduct?.ogImage} />
          <link rel="canonical" href={Titles?.manageProduct?.link} />
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
                      <h1>Product Management</h1>
                      <Message />
                      <div
                        className="dasbordRightBody for_table_stc"
                        style={{ position: "relative" }}
                      >
                        <div className="prod_add">
                          <Link to="/add-product">
                            <i className="fa fa-plus" aria-hidden="true" />
                            Add Product
                          </Link>
                        </div>
                        {/* <span class="line-full"></span>	 */}
                        {/*TABLE AREA START*/}
                        {productList && productList.length > 0 ? (
                          <div className="table_01 table">
                            <div className="row amnt-tble">
                              <div className="cel_area amunt cess nw1">
                                Image
                              </div>
                              <div className="cel_area amunt cess nw2">
                                Product Title
                              </div>
                              <div className="cel_area amunt cess nw4">
                                Category
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Original Price
                              </div>
                              <div className="cel_area amunt cess nw3">
                                Discounted Price
                              </div>
                              <div className="cel_area amunt cess nw6">
                                &nbsp;
                              </div>
                            </div>
                            {/*table row-1*/}
                            {productList && productList.length > 0
                              ? productList.map((item, index) => {
                                  return (
                                    <div
                                      className="row small_screen2"
                                      key={index}
                                    >
                                      <div className="cel_area amunt-detail cess">
                                        <span className="sm_size mng-p">
                                          <img
                                            src={
                                              item.get_default_image
                                                ? BASE_URL +
                                                  "/storage/app/public/product_images/" +
                                                  item.get_default_image.image
                                                : process.env.PUBLIC_URL +
                                                  "/images/pro_pick.png"
                                            }
                                            alt=""
                                            className="img-fluid"
                                          />
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Product Title
                                        </span>{" "}
                                        <span className="sm_size">
                                          {item.title}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Category
                                        </span>{" "}
                                        <span className="sm_size">
                                          {item.get_category_details
                                            ? item.get_category_details.name
                                            : null}
                                        </span>{" "}
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Original Price
                                        </span>
                                        <span className="sm_size">
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/images/rupe.png"
                                            }
                                            alt=""
                                          />
                                          {item.original_price}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">
                                          Discounted Price
                                        </span>
                                        <span className="sm_size">
                                          <img
                                            src={
                                              process.env.PUBLIC_URL +
                                              "/images/rupe.png"
                                            }
                                            alt=""
                                          />{" "}
                                          {item.discounted_price}
                                        </span>
                                      </div>
                                      <div className="cel_area amunt-detail cess">
                                        {" "}
                                        <span className="hide_big">Action</span>
                                        <ul>
                                          <li>
                                            <Link
                                              to={`/edit-product/${item.slug}`}
                                            >
                                              <img
                                                src={
                                                  process.env.PUBLIC_URL +
                                                  "/images/edit.png"
                                                }
                                                alt=""
                                                title="Edit Product"
                                              />
                                            </Link>
                                          </li>
                                          <li>
                                            <Link
                                              to="#"
                                              onClick={() =>
                                                this.status(
                                                  item.id,
                                                  item.status
                                                )
                                              }
                                            >
                                              <img
                                                src={
                                                  item.status === "A"
                                                    ? process.env.PUBLIC_URL +
                                                      "/images/block.png"
                                                    : process.env.PUBLIC_URL +
                                                      "/images/unblock.png"
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
                                              onClick={() =>
                                                this.delete(item.id)
                                              }
                                            >
                                              <img
                                                src={
                                                  process.env.PUBLIC_URL +
                                                  "/images/delete-dash.png"
                                                }
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
                                <img
                                  src={
                                    process.env.PUBLIC_URL +
                                    "/images/no-result.png"
                                  }
                                  alt=""
                                />
                                <p>
                                  Your Product Management is empty! Click "Add
                                  to Product" button to add products.
                                </p>
                              </div>
                            ) : null}
                          </>
                        )}
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
export default connect(null, mapDispatchToProps)(ManageProduct);
