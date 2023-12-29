import React, { Component } from "react";
import { connect } from "react-redux";
class Loader extends Component {
  render() {
    return (
      <>
        {this.props.loader ? (
          <div className="loader_img_new2">
            <div className="loader_divs_new">
              <div className="loader5"></div>
            </div>
          </div>
        ) : null}
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    loader: state.loader,
  };
};
export default connect(mapStateToProps, null)(Loader);
