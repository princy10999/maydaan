import React, { Component } from "react";
import Layout from "../Layout/Layout";
import axios from "../../shared/axios";
import swal from "sweetalert";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class TermsAndConditions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      terms: [],
    };
  }
  componentDidMount() {
    // document.title = "Maydaan | Terms and Conditions";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.onUpdateLoader(true);
    axios.post("show-terms-conditions").then((res) => {
      console.log("t&c", res);
      this.props.onUpdateLoader(false);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result && res.data.result.terms_conditions) {
        this.setState({
          terms: res.data.result.terms_conditions,
        });
      }
    });
  }
  render() {
    const { terms } = this.state;
    return (
      <>
        <Helmet>
          <title>{Titles?.termsAndConditions?.title}</title>
          <meta
            name="description"
            content={Titles?.termsAndConditions?.description}
          />
          <meta
            property="og:title"
            content={Titles?.termsAndConditions?.ogTitle}
          />
          <meta
            property="og:description"
            content={Titles?.termsAndConditions?.ogDescription}
          />
          <meta
            property="og:image"
            content={Titles?.termsAndConditions?.ogImage}
          />
          <link rel="canonical" href={Titles?.termsAndConditions?.link} />
        </Helmet>
        <Layout>
          <div className="mai-abt">
            {terms ? (
              <div className="container">
                <h2 className="term_head">{terms.heading}</h2>
                <div className="term_box">
                  <div
                    dangerouslySetInnerHTML={{ __html: terms.description }}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Layout>
      </>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(TermsAndConditions);
