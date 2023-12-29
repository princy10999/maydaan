import React, { Component } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import FieldError from "../../shared/FieldError";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
// import clickhe from "../../assets/images/clickhe.png";
// import big_img from "../../assets/images/big-img.png";
// import delete_dash from "../../assets/images/delete-dash.png";
import swal from "sweetalert";
import * as Yup from "yup";
import axios from "../../shared/axios";
import FormikErrorFocus from "formik-error-focus";
import { getFileImage } from "../../shared/common";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
import { BASE_URL } from "../../store/action/actionTypes";
import { Link } from "react-router-dom";
import $ from "jquery";

class AddProduct extends Component {
  File2 = [];
  constructor(props) {
    super(props);
    this.state = {
      Images: [],
      categoryIds: [],
      product: [],
      selected: [],
      selectedValue: "",
      default: "",
    };
  }
  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (this.props.match.params.slug) {
      document.title = "Maydaan | Edit Product";
      this.props.onUpdateLoader(true);
      let data = {
        params: {
          slug: this.props.match.params.slug,
          user_id:this.props.user.id
        },
      };
      axios.post("view-product-details", data).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("Product-info", res);
        this.setState({
          categoryIds: res.data.result.categories,
          product: res.data.result.product,
        });
        if (
          res.data.result &&
          res.data.result.product &&
          res.data.result.product.get_default_image
        ) {
          this.setState({
            default: res.data.result.product.get_default_image.id,
            selectedValue: res.data.result.product.get_default_image.id,
          });
        }
      });
    } else {
      document.title = "Maydaan | Add Product";
      this.props.onUpdateLoader(true);
      let data1 = {
        params: {
          club_category_send: "Y",
        },
      };
      axios.post("/view-info", data1).then((res) => {
        this.props.onUpdateLoader(false);
        // console.log("view info", res);
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        } else if (res.data.result) {
          this.setState({
            categoryIds: res.data.result.categories,
          });
        }
      });
    }
  }
  fileChangedHandler1 = (event) => {
    let tempArr = [...this.state.Images];
    let tempFileArr = [...this.state.selected];
    this.setState({ generalImages: tempArr }, () => {
      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        let ext = file.name.split(".").pop();
        if (file["type"].split("/")[0] === "image") {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = function (e) {
            let tempArr = [...this.state.Images];
            tempArr.push(reader.result);
            tempFileArr.push(file);
            this.setState({ Images: tempArr, selected: tempFileArr},()=>{$("#file-1").val("");});
          }.bind(this);
        }
      }
    });
  };
  deleleSelectedFile = (index) => {
    let tempArr = [...this.state.Images];
    let tempFileArr = [...this.state.selected];
    tempArr.splice(index, 1);
    tempFileArr.splice(index, 1);
    this.setState({ Images: tempArr, selected: tempFileArr });
  };
  deleleFile = (id) => {
    let pid = id;
    swal({
      title: "Are you sure?",
      text: "You want to delete this image?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let data = {
          params: {
            product_id: this.state.product.id,
            product_image_id: pid,
          },
        };
        this.props.onUpdateLoader(true);
        axios.post("/delete-image-product", data).then((res) => {
          this.props.onUpdateLoader(false);
          if (res.data.error) {
            this.props.onUpdateError(res.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (res.data.result) {
            let product = { ...this.state.product };
            product.get_images = product.get_images.filter(
              (result) => result.id !== pid
            );
            this.setState({ product });
            this.props.onUpdateSuccess(res.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  handleChange = (id) => {
    swal({
      text: "Are you sure you want to set this image as default product image?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        this.setState({
          selectedValue: id,
        });
        var data = {
          params: {
            product_image_id: id,
          },
        };
        axios.post("set-default-image-product", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };

  render() {
    const { product, Images } = this.state;
    const initialValues = {
      ptitle: product.title ? product.title : "",
      category_id: product.category_id ? product.category_id : "",
      oprice: product.original_price ? product.original_price : "",
      dprice: product.discounted_price ? product.discounted_price : "",
      pdetails: product.description ? product.description : "",
      files: [],
    };
    const validationSchema = Yup.object({
      ptitle: Yup.string().required("Please enter product Title!"),
      category_id: Yup.string().required("Please select category!"),
      oprice: Yup.number()
        .typeError("Original price must be in number!")
        .required("Please enter original price!"),
      dprice: Yup.number().typeError("Discounted price must be in number!").lessThan(Yup.ref("oprice"),`Discounted price must be less than original price!`),
      pdetails: Yup.string().required("Please enter product details!"),
    });
    const onSubmit = (values) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      this.props.onUpdateLoader(true);
      // console.log("AddProduct",values);
      var formData = new FormData();
      formData.append("id", product.id);
      formData.append("title", values.ptitle);
      formData.append("category_id", values.category_id);
      formData.append("description", values.pdetails);
      formData.append("original_price", values.oprice);
      formData.append("discounted_price", values.dprice);
      for (let i = 0; i < this.state.selected.length; i++) {
        formData.append("image[" + i + "]", this.state.selected[i]);
      }

      let url = "add-product";
      if (product.id) url = "edit-product";
      axios.post(url, formData).then((res) => {
        this.props.onUpdateLoader(false);
        //   console.log("Add/edit-product", res);
        if (res.data.result) {
          this.props.onUpdateSuccess(res.data.result.meaning);
          this.props.history.push("/manage-products");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else if (res.data.error) {
          if (res.data.error.title) {
            this.props.onUpdateError(res.data.error.title[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.category_id) {
            this.props.onUpdateError(res.data.error.category_id[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.description) {
            this.props.onUpdateError(res.data.error.description[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.image) {
            this.props.onUpdateError(res.data.error.image[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.original_price) {
            this.props.onUpdateError(res.data.error.original_price[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.discounted_price) {
            this.props.onUpdateError(res.data.error.discounted_price[0]);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
          if (res.data.error.message) {
            this.props.onUpdateError(res.data.error.meaning);

            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      });
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
                    <h1>{product.id ? "Edit" : "Add"} Product</h1>
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
                          <Form action="edit-profile-service-offered.html">
                            <div className="row">
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Product Title</label>
                                  <Field
                                    type="text"
                                    name="ptitle"
                                    placeholder="Enter Product Title"
                                  />
                                  <ErrorMessage
                                    name="ptitle"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="form_fild_area_m frm_grp iputBx">
                                  <label>Catagory </label>
                                  <Field
                                    as="select"
                                    name="category_id"
                                    placeholder="Select"
                                    className="chosen-select"
                                  >
                                    <option value="">Select Catagory</option>
                                    {this.state.categoryIds &&
                                    this.state.categoryIds.length > 0
                                      ? this.state.categoryIds.map(
                                          (item, index) => {
                                            return (
                                              <option
                                                key={"category" + index}
                                                value={item.id}
                                              >
                                                {item.name}
                                              </option>
                                            );
                                          }
                                        )
                                      : null}
                                  </Field>
                                  <ErrorMessage
                                    name="category_id"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Original Price</label>
                                  <Field
                                    type="text"
                                    name="oprice"
                                    placeholder="Enter Original Price"
                                    onChange={(e)=>{
                                      let result = e.target.value.replace(/\D/g, '');
                                      setFieldValue("oprice",result)
                                  }}
                                  />
                                  <ErrorMessage
                                    name="oprice"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-6 col-sm-12">
                                <div className="iputBx">
                                  <label>Discounted Price</label>
                                  <Field
                                    type="text"
                                    name="dprice"
                                    placeholder="Enter Discounted Price"
                                    onChange={(e)=>{
                                      let result = e.target.value.replace(/\D/g, '');
                                      setFieldValue("dprice",result)
                                  }}
                                  />
                                  <ErrorMessage
                                    name="dprice"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="iputBx">
                                  <label>Product Details</label>
                                  <Field
                                    as="textarea"
                                    name="pdetails"
                                    placeholder="Enter Product Details"
                                  />
                                  <ErrorMessage
                                    name="pdetails"
                                    component={FieldError}
                                  />
                                </div>
                              </div>
                              <div className="col-md-12 col-sm-12">
                                <div className="uplodimg">
                                  <span>Upload Product Images</span>
                                  <div className="uplodimgfil">
                                    <input
                                      type="file"
                                      name="files"
                                      id="file-1"
                                      className="inputfile inputfile-1"
                                      accept="image/*"
                                      multiple
                                      onChange={(e) => {
                                        this.File2 = [];
                                        setFieldValue("files", e.target.files);
                                        this.fileChangedHandler1(e);
                                      }}
                                    />
                                    <label htmlFor="file-1">
                                      Upload Product Images
                                      <img src={process.env.PUBLIC_URL + "/images/clickhe.png"} alt="" />
                                    </label>
                                  </div>
                                </div>
                              </div>
                              {Images.length > 0 ? (
                                <div className="col-md-12 col-sm-12">
                                  <div className="uploaded_ppc">
                                    <h6>Selected Files</h6>
                                    {Images.map((item, index) => (
                                      <div
                                        class="up_pic tul-pic-003"
                                        key={`img-${index}`}
                                      >
                                        <span>
                                          <img
                                            src={item}
                                            alt=""
                                            className="img-dwn-0069"
                                          />
                                        </span>
                                        <Link to="#" className="dlt-lnk">
                                          <img
                                            src={process.env.PUBLIC_URL + "/images/delete-dash.png"}
                                            alt=""
                                            onClick={() =>
                                              this.deleleSelectedFile(index)
                                            }
                                          />
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}

                              {product.get_images &&
                              product.get_images.length > 0 ? (
                                <div className="col-md-12 col-sm-12">
                                  <div className="uploaded_ppc">
                                    <h6>Uploaded Files</h6>
                                    {product.get_images.map((item, index) => (
                                      <div
                                        class="up_pic tul-pic-003"
                                        key={`img-${index}`}
                                      >
                                        <label
                                          className="rad up-pic-rad"
                                          title="Default Image"
                                        >
                                          <input
                                            type="radio"
                                            checked={
                                              this.state.selectedValue ===
                                              item.id
                                            }
                                            onChange={() =>
                                              this.handleChange(item.id)
                                            }
                                            value={this.state.selectedValue}
                                          />
                                          <span className="radio" />
                                        </label>

                                        <span>
                                          <img
                                            src={getFileImage(
                                              "storage/app/public/product_images/" +
                                                item.image
                                            )}
                                            alt=""
                                          />
                                        </span>
                                        <Link to="#" className="dlt-lnk">
                                          <img
                                            src={process.env.PUBLIC_URL + "/images/delete-dash.png"}
                                            alt=""
                                            onClick={() =>
                                              this.deleleFile(item.id)
                                            }
                                          />
                                        </Link>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="footdashSec for_backk_btnn">
                              <input
                                type="submit"
                                value={product.id ?"Save all Changes":"Submit"}
                                className="subbtn"
                              />
                              <button className="back_btnn01" onClick={()=>this.props.history.push("/manage-products")}>Back</button>
                            </div>
                            <FormikErrorFocus
                              offset={0}
                              align={"middle"}
                              focusDelay={200}
                              ease={"linear"}
                              duration={1000}
                            />
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
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddProduct);
