import React, { Component } from 'react'
import Layout from '../Layout/Layout'
import axios from "../../shared/axios";
import swal from "sweetalert";
import {UPDATE_LOADER} from '../../store/action/actionTypes'
import {connect} from 'react-redux'
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class PrivacyPolicy extends Component {
    constructor(props) {
        super(props);
        this.state={
            privacy:[]
        }}
        componentDidMount() {
            // document.title = "Maydaan | Privacy Policy";
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.props.onUpdateLoader(true);
            axios.post('show-privacy-policy').then(res => {
              console.log("P&P",res);
                this.props.onUpdateLoader(false);
                if (res.data.error) {
                    if (res.data.error) {
                        swal(res.data.error.meaning, {
                            icon: "error",
                        });
                    }
                } else if (res.data.result && res.data.result.privacy_policy) {
                    this.setState({
                      privacy:res.data.result.privacy_policy
                    });
                }
            });
          }
  render() {
    const {privacy}=this.state;
    return (
      <>
       <Helmet>
        <title>{Titles?.privacyPolicy?.title}</title>
        <meta
            name="description"
            content={Titles?.privacyPolicy?.description}
        />
        <meta property="og:title" content={Titles?.privacyPolicy?.ogTitle} />
        <meta property="og:description" content={Titles?.privacyPolicy?.ogDescription} />
        <meta property="og:image" content={Titles?.privacyPolicy?.ogImage} />
        <link rel="canonical" href={Titles?.privacyPolicy?.link} />
      </Helmet>
<Layout>
          <div className="mai-abt">
        <div className="container">
          <h2 className="term_head">{privacy.heading}</h2>
          <div className="term_box">
          <div dangerouslySetInnerHTML={{ __html: privacy.description }} />   
          </div>
        </div>
      </div>

      </Layout>
      </>
      
    )
  }
}
const mapDispatchToProps = dispatch => {
    return {
        onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    }
}
export default connect(null, mapDispatchToProps)(PrivacyPolicy)
