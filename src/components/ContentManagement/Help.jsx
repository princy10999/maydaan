import React, { Component } from "react";
import Layout from "../Layout/Layout";
import ineerbanner from "../../assets/images/ineer-banner.jpg";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import axios from "../../shared/axios";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import { connect } from "react-redux";

class Help extends Component {
  constructor(props) {
    super(props);
    this.state = {
      help: [],
    };
  }
  componentDidMount() {
    document.title = "Maydaan | Help";
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.props.onUpdateLoader(true);
    axios.post("show-help-list").then((res) => {
      this.props.onUpdateLoader(false);
    //   console.log("help", res);
      if (res.data.error) {
        if (res.data.error) {
          swal(res.data.error.meaning, {
            icon: "error",
          });
        }
      } else if (res.data.result && res.data.result.helpCategories) {
        this.setState({
          help: res.data.result.helpCategories,
        });
      }
    });
  }

  render() {
    const { help } = this.state;
    return (
      <Layout>
        <div className="abt-bnr hlp-bnr">
          <div className="abt-blr" />
          <div className="container">
            <div className="abt-bnr-txt">
              <h1>Help</h1>
              <p>How Can We Help You?</p>
            </div>
          </div>
        </div>
        <div className="bt-brd">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-12">
                <nav aria-label="breadcrumb" className="bread">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Help
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <div className="faq_sec help_sec">
          <div className="container">
            <div className="faq_inr">
              <div className="faq-tbs">
                <ul className="nav nav-tabs">
                  {help && help.length > 0
                    ? help.map((item, index) => {
                        return (
                          <li key={index}>
                            <Link
                              className={index === 0 ? "active" : ""}
                              data-toggle="tab"
                              to={"#helptab" + item.id}
                            >
                              {item.name}{" "}
                            </Link>
                          </li>
                        );
                      })
                    : null}
                </ul>
              </div>
              <div className="faq_tab_body">
                <div className="tab-content">
                  {help && help.length > 0
                    ? help.map((val, index) => {
                        return (
                          <div
                            className={`tab-pane ${
                              index === 0 ? "active" : ""
                            }`}
                            key={`hc-${val.id}`}
                            id={"helptab" + val.id}
                          >
                            <div className="accordian-faq">
                              <div
                                className="accordion"
                                id={"faqhelp" + val.id}
                              >
                                {val.get_help && val.get_help.length > 0
                                  ? val.get_help.map((item) => {
                                      return (
                                        <div
                                          className="card"
                                          key={`faq-${item.id}`}
                                        >
                                          <div
                                            className="card-header"
                                            id={"faqhead" + item.id}
                                          >
                                            <Link
                                              to="#"
                                              className="collapsed"
                                              data-toggle="collapse"
                                              data-target={"#faq" + item.id}
                                              aria-expanded="true"
                                              aria-controls={"faq" + item.id}
                                            >
                                              {item.question}
                                            </Link>
                                          </div>
                                          <div
                                            id={"faq" + item.id}
                                            className="collapse"
                                            aria-labelledby={
                                              "faqhead" + item.id
                                            }
                                            data-parent={"#faqhelp" + val.id}
                                          >
                                            <div className="card-body">
                                              <p className="pre_wrap">
                                                {" "}
                                                {item.answer}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })
                                  : null}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
  };
};
export default connect(null, mapDispatchToProps)(Help);