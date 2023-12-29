import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import { Formik, Form } from "formik";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  BASE_URL,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import swal from "sweetalert";
import Message from "../Layout/Message";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

const profileImagePath = BASE_URL + "storage/app/public/general_images";
class AddBanner extends Component {
  File2 = [];
  constructor(props) {
    super(props);
    this.state = {
      bannPicture: null,
      image: [],
      ban:"N"
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Add Banner Image";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.getData();
  }
  getData = () => {
    this.props.onUpdateLoader(true);
    axios.post("/update-banner-image-for-public-profile").then((res) => {
      this.props.onUpdateLoader(false);
      // console.log("bannerEdit", res);
      if (res.data.result && res.data.result.getUserToGallery) {
        this.setState({
          ban:"Y",
          bannPicture:
          res.data.result && res.data.result.getUserToGallery &&res.data.result.getUserToGallery.file!== null
              ? profileImagePath + "/" + res.data.result.getUserToGallery.file
              : null,
        });
      }
    });
  };
  fileChangedHandler = (event) => {
    this.setState({ image: event.target.files[0] });
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      this.setState({ bannPicture: reader.result });
    }.bind(this);
  };
  render() {
    const initialValues = {
      image: "",
    };
    const onSubmit = (values) => {
      var Image = document.getElementById("container_img");
      // console.log("`${image.width} x ${image.height}`",`${Image.width} x ${Image.height}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (
        Image.width <= 1024 &&
        Image.height <= 600 &&
        Image.width >= 500 &&
        Image.height >= 250
      ) {
        this.props.onUpdateLoader(true);
        var formData = new FormData();
        formData.append("image", this.state.image);
        axios
          .post("/update-banner-image-for-public-profile", formData)
          .then((res) => {
            this.File2 = [];
            this.props.onUpdateLoader(false);
            // console.log("banner", res);
            if (res.data.result) {
              this.props.onUpdateSuccess(res.data.result.meaning);
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else if (res.data.error) {
              if (res.data.error.image) {
                this.props.onUpdateError(res.data.error.image[0]);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              if (res.data.error.message) {
                this.props.onUpdateError(res.data.error.meaning);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          });
      } else {
        swal({
          title: "",
          icon: "warning",
          text: "Please upload banner Image in between 1024 to 250 pixel of width and height.",
        });
      }
    };
    return (
    <>
        <Helmet>
      <title>{Titles?.addBannerImage?.title}</title>
      <meta
          name="description"
          content={Titles?.manageOrder?.description}
      />
      <meta property="og:title" content={Titles?.addBannerImage?.ogTitle} />
      <meta property="og:description" content={Titles?.addBannerImage?.ogDescription} />
      <meta property="og:image" content={Titles?.addBannerImage?.ogImage} />
      <link rel="canonical" href={Titles?.addBannerImage?.link} />
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
                    <h1>{this.state.ban!==null && this.state.ban==="Y"?"Edit":"Add"} Banner Image for Public Profile</h1>
                    <div className="dasbordRightBody">
                      <Message />
                      <Formik
                        initialValues={initialValues}
                        onSubmit={onSubmit}
                        enableReinitialize={true}
                      >
                        {({
                          values,
                          touched,
                          setFieldValue,
                          setFieldTouched,
                        }) => (
                          <Form>
                            <div className="row">
                              <div className="col-md-12 col-sm-12">
                                <div className="uplodimg">
                                  <div className="upld-txt">
                                    <span>Upload Image</span>
                                    <p>(Recomended size: 4:3 aspect ratio )</p>
                                  </div>
                                  <div className="uplodimgfil">
                                    <input
                                      type="file"
                                      name="image"
                                      id="file-3"
                                      className="inputfile inputfile-1"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => {
                                        setFieldValue(
                                          "image",
                                          e.target.files[0]
                                        );
                                        setFieldTouched("image");
                                        this.fileChangedHandler(e);
                                      }}
                                    />
                                    <label htmlFor="file-3">
                                      Upload Images
                                      <img
                                        src={
                                          process.env.PUBLIC_URL +
                                          "/images/clickhe.png"
                                        }
                                        alt=""
                                      />
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="uploaded_ppc">
                                  {this.state.bannPicture ? (
                                    <div className="public-banner-image">
                                      <h3>Preview of the banner Image</h3>
                                      <img
                                        src={this.state.bannPicture}
                                        alt=""
                                      />
                                    </div>
                                  ) : null}
                                </div>
                                <img
                                  id="container_img"
                                  src={this.state.bannPicture}
                                  alt=""
                                />
                              </div>
                              <div className="footdashSec for_backk_btnn">
                                <button
                                  type="submit"
                                  className="subbtn"
                                  style={{ marginLeft: 15 }}
                                >
                                  Submit
                                </button>
                                <button
                                  className="back_btnn01"
                                  onClick={() =>
                                    this.props.history.push("/gallery")
                                  }
                                >
                                  Back
                                </button>
                              </div>
                            </div>
                          </Form>
                        )}
                      </Formik>
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
export default connect(null, mapDispatchToProps)(AddBanner);
