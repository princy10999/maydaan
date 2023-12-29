import React, { Component, Fragment } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { withRouter } from "react-router-dom";
import Header1 from "./Header1";
import Loader from "./Loader";
import { getLSItem } from "../../shared/LocalStorage";

class Layout extends Component {
  render() {
    const currentPath = this.props.location.pathname;
    return (
      <Fragment>
        <Loader />
        { getLSItem("auth_token") ? (
          <Header />
        ) : (
          <Header1 />
        )}
        {this.props.children}
        <Footer />
      </Fragment>
    );
  }
}
export default withRouter(Layout);
