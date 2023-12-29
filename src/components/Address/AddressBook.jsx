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
// import edit from "../../assets/images/edit.png";
// import deletedash from "../../assets/images/delete-dash.png";
// import no_result from "../../assets/images/no-result.png";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import swal from "sweetalert";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class AddressBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addressBookList: [],
      loader: false,
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Address Book";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/address-list").then((res) => {
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      this.setState({ addressBookList: res.data.result.addressBookList });
    });
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    this.setState({ loader: true });
    axios.post("/address-list").then((res) => {
      this.props.onUpdateLoader(false);
      this.setState({ loader: false });
      this.setState({ addressBookList: res.data.result.addressBookList });
    });
  };
  delete = (id) => {
    var data = {
      params: {
        id: id,
      },
    };
    swal({
      text: "Are you sure you want to delete this address?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("address-delete", data).then((resp) => {
          if (resp.data.result) {
            this.getData();
            this.props.onUpdateSuccess(resp.data.result.meaning);
          }
        });
      }
    });
  };
  render() {
    const { addressBookList } = this.state;
    return (
     <>
       <Helmet>
      <title>{Titles?.addressBook?.title}</title>
      <meta
          name="description"
          content={Titles?.addressBook?.description}
      />
      <meta property="og:title" content={Titles?.addressBook?.ogTitle} />
      <meta property="og:description" content={Titles?.addressBook?.ogDescription} />
      <meta property="og:image" content={Titles?.addressBook?.ogImage} />
      <link rel="canonical" href={Titles?.addressBook?.link} />
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
                    <h1>Address Book</h1>
                    <div className="dasbordRightBody">
                      <Message />
                      <div className="row">
                        {addressBookList && addressBookList.length > 0 ? (
                          addressBookList.map((item) => {
                            return (
                              <div
                                className="col-lg-6 col-md-12 com_padd_both"
                                key={item.id}
                              >
                                <div className="dashbox">
                                  <div className="dashbox_head">
                                    {item.address_title?
                                    <h4>
                                      <span>({item.address_title})</span>
                                    </h4>:null}
                                    <ul>
                                      <li>
                                        <Link to={`/edit-address/${item.id}`}>
                                          <img src={process.env.PUBLIC_URL + "/images/edit.png"} alt="" />
                                        </Link>
                                      </li>
                                      <li>
                                        <Link
                                          to="#"
                                          onClick={() => this.delete(item.id)}
                                        >
                                          <img src={process.env.PUBLIC_URL + "/images/delete-dash.png"} alt="" />
                                        </Link>
                                      </li>
                                    </ul>
                                  </div>
                                  <div className="dashbox_body">
                                    <p>
                                      <strong> Name </strong>{" "}
                                      <span>
                                        {item.first_name + " " + item.last_name}
                                      </span>
                                    </p>
                                    <p>
                                      <strong> Address </strong>{" "}
                                      <span>
                                        {item.address},{" "}
                                        {item.user_city_details &&
                                        item.user_city_details.city
                                          ? item.user_city_details.city
                                          : null}
                                        , {item.user_state_details.name} -{" "}
                                        {item.pincode}
                                      </span>
                                    </p>
                                    <p>
                                      <strong> Phone </strong>{" "}
                                      <span>{item.phone}</span>
                                    </p>
                                    <p>
                                      <strong> Email </strong>{" "}
                                      <span style={{ wordBreak: "break-all" }}>
                                        {item.email}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <>
                            {!this.state.loader ? (
                              <div className="col-12">
                                <div className="n-resul">
                                  <img src={process.env.PUBLIC_URL + "/images/no-result.png"} alt="" />
                                  <p>
                                    Your address book is empty! Go to "Add
                                    Address" to add your address.
                                  </p>
                                </div>
                              </div>
                            ) : null}
                          </>
                        )}
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
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateSuccess: (cnt) => dispatch({ type: UPDATE_SUCCESS, value: cnt }),
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    onUpdateError: (cnt) => dispatch({ type: UPDATE_ERROR, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(AddressBook);
