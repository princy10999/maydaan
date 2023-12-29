import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import clickhe from "../../assets/images/clickhe.png";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import FieldError from "../../shared/FieldError";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import swal from "sweetalert";
import Message from "../Layout/Message";

class AddGallery extends Component {
  File2 = [];
  constructor(props) {
    super(props);
    this.state = {
      generalImages: [],
      videoUrl: "",
      video_id: "",
      width:[],
      height:[]
    };
  }
  componentDidMount() {
    this.props.onUpdateLoader(true);
    if (this.props.match.params.id) {
      const vId = this.props.match.params.id;
      this.setState({ video_id: vId });
      document.title = "Maydaan | Edit Gallery";
      window.scrollTo({ top: 0, behavior: "smooth" });
      axios.post("/view-gallery-typewise").then((res) => {
        this.props.onUpdateLoader(false);
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        } else if (res.data.result && res.data.result.get_user_gallery_links) {
          let a = res.data.result.get_user_gallery_links;
          a.map((item, index) => {
            if (vId == item.id) {
              this.setState({ videoUrl: item.file });
            }
          });
        }
      });
    } else {
      this.props.onUpdateLoader(false);
      document.title = "Maydaan | Add Gallery";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }
  fileChangedHandler1 = (event) => {
    let tempArr = [];
    this.setState({ generalImages: tempArr },()=>{
      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function (e) {
          if(file.size > 6500){
            let tempArr = [...this.state.generalImages];
          tempArr.push(reader.result);
          this.setState({ generalImages: tempArr });
          }
        }.bind(this);
      }
    });
  };
  render() {
    const { videoUrl, video_id } = this.state;
    const initialValues = {
      edit: video_id ? true : false,
      gallery_type: video_id ? "" : "I",
      general_img: "",
      video_url: videoUrl ? videoUrl : "",
    };
    const validationSchema = Yup.object({
      edit: Yup.boolean(),
      gallery_type: Yup.string().when("edit", {
        is: true,
        then: Yup.string().nullable(true),
        otherwise: Yup.string().required("Please select a gallery type!"),
      }),

      general_img: Yup.mixed().when("gallery_type", {
        is: "I",
        then: Yup.mixed().required("Please upload images!"),
      }),

      video_url: Yup.string().when("gallery_type", {
        is: "V",
        then: Yup.string()
          .matches( /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/,
            "Enter correct url!"
          )
          .required("Please enter your video url!"),
      }),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
          this.props.onUpdateLoader(true);
          var formData = new FormData();
          // console.log("formData",formData,this.File2);
          formData.append("type", values.gallery_type);
          this.File2.forEach((item, index) => {
            formData.append("images[" + index + "]", item);
          });
          formData.append("video_link", values.video_url);
          let data = {
            params: {
              gallery_id: video_id,
              video_link: values.video_url,
            },
          };
          if (video_id) {
            axios.post("edit-user-video-link", data).then((res) => {
              this.props.onUpdateLoader(false);
              // console.log("edit", res);
              if (res.data.result) {
                this.props.onUpdateSuccess(res.data.result.meaning);
                this.props.history.push("/gallery");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else if (res.data.error) {
                if (res.data.error.video_link) {
                  this.props.onUpdateError(res.data.error.video_link[0]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (res.data.error.message) {
                  this.props.onUpdateError(res.data.error.meaning);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            });
          } else {
            axios.post("add-user-gallery", formData).then((res) => {
              this.props.onUpdateLoader(false);
              if (res.data.result) {
                this.props.onUpdateSuccess(res.data.result.meaning);
                this.props.history.push("/gallery");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else if (res.data.error) {
                if (res.data.error.video_link) {
                  this.props.onUpdateError(res.data.error.video_link[0]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (res.data.error.images) {
                  this.props.onUpdateError(res.data.error.images[0]);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
                if (res.data.error.message) {
                  this.props.onUpdateError(res.data.error.meaning);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }
            });
          }
    };
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
                  <div className="dasbordRightlink">
                    <h1>{video_id ? 'Edit' :'Add'} To Gallery</h1>
                    <div className="dasbordRightBody">
                      <Message />
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
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
                              {!video_id ? (
                                <div className="col-md-6 col-sm-12">
                                  <div className="iputBx">
                                    <label>Gallery Type</label>
                                    <Field as="select" name="gallery_type">
                                      <option value="I">Image</option>
                                      <option value="V">Video</option>
                                    </Field>
                                    <ErrorMessage
                                      name="gallery_type"
                                      component={FieldError}
                                    />
                                  </div>
                                </div>
                              ) : null}
                              {values.gallery_type === "I" && !video_id ? (
                                <>
                                  <div className="col-md-12 col-sm-12">
                                    <div className="uplodimg">
                                      <div className="upld-txt">
                                      <span>Upload Images</span>
                                      <p>(Recomended size: 5:4 aspect ratio )</p>
                                      </div>                                      
                                      <div className="uplodimgfil">
                                        <input
                                          type="file"
                                          name="general_img"
                                          id="file-2"
                                          className="inputfile inputfile-1"
                                          accept="image/*"
                                          multiple
                                          onChange={(e) => {
                                            this.File2=[]
                                            e?.target?.files[0]?.size > 7500 ? setFieldValue(
                                              "general_img",
                                              e.target.files
                                            ) : swal({
                                              title: "",
                                              icon: "warning",
                                              text: "You need to upload a minimum size of 200px height and width image",
                                            });
                                            for (let i = 0; i < e.currentTarget.files.length; i++) {
                                              e.currentTarget.files[i].size > 7500 ? this.File2.push(
                                                e.currentTarget.files[i]
                                              ) : 
                                              swal({
                                                title: "",
                                                icon: "warning",
                                                text: "You need to upload a minimum size of 200px height and width image",
                                              });
                                            }
                                              this.fileChangedHandler1(e);
                                            }}
                                        />
                                        <label htmlFor="file-2">
                                          Upload Images
                                          <img src={process.env.PUBLIC_URL + "/images/clickhe.png"} alt="" />
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-12 col-sm-12">
                                    <div className="uploaded_ppc">
                                      {this.state.generalImages &&
                                      this.state.generalImages.length > 0
                                        ? this.state.generalImages.map(
                                            (item, index) => {
                                              return (
                                                <>
                                                <div className="up_pic">
                                                  <span>
                                                    <img src={item} alt="" />
                                                  </span>{" "}
                                                </div>
                                                <img id={`gal_img+${index}`} style={{display:"none"}} src={item} alt="" />
                                                </>
                                              );
                                            }
                                          )
                                        : null}
                                    </div>
                                    <ErrorMessage
                                      name="general_img"
                                      component={FieldError}
                                    />
                                  </div>
                                </>
                              ) : (
                                
                                <>
                                
                                  <div className="col-md-12 col-sm-12">
                                    <div className="iputBx">
                                      <label>Video URL</label>
                                      <Field
                                        type="text"
                                        placeholder="https://www.youtube.com/watch?v=QXhV148EryQ"
                                        name="video_url"
                                      />
                                      <ErrorMessage
                                        name="video_url"
                                        component={FieldError}
                                      />
                                    </div>
                                  </div>
                                </>
                              )}
                        
                              <div className="footdashSec for_backk_btnn">
                                <button
                                  type="submit"
                                  className="subbtn"
                                  style={{ marginLeft: 15 }}
                                >
                                  {video_id ?"Save all changes":"Submit"}
                                </button>
                                <button className="back_btnn01" onClick={()=>this.props.history.push("/gallery")}>Back</button>
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
export default connect(null, mapDispatchToProps)(AddGallery);
