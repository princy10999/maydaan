import React,{Component} from "react";
import Layout from '../Layout/Layout';
// import err from '../../assets/images/err.png';
// import success from '../../assets/images/success.png';
import { Link } from "react-router-dom";
import axios from "../../shared/axios";
import { connect } from "react-redux";
import {UPDATE_LOADER}from "../../store/action/actionTypes";

class EmailVerification extends Component{
     constructor(props) {
		super(props);
		this.state = {
			type: ""
		};
	}
    componentDidMount(){
        this.props.onUpdateLoader(true);
        document.title = "Maydaan | Email Verification";
          let data ={
            "params": {
              "email_vcode": this.props.match.params.otp
            }
          }
		axios.post('/email-verification',data).then(res=>{
            this.props.onUpdateLoader(false);
            if ((res.data.success)) {
                this.setState({ type: "S"});
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else if(res.data.error){
                this.setState({ type: "F"});
                window.scrollTo({ top: 0, behavior: "smooth" });
            }

        });
    }
	render(){
         
		return(
            <Layout>
                <div className="loader_img">
                    <div className="container">
                        <div className="row">
                            <div className="loader_divs">
                                {this.state.type==="F"?
                                    <div className="scs_msg">
                                        <img src={process.env.PUBLIC_URL + "/images/err.png"} alt="error"/>
                                        <h2>Error</h2>
                                        <p>Your verification link has been expired.</p>
                                        <Link to="/login">Go to Login</Link>
                                    </div>
                                :this.state.type==="S"?
                                    <div className="scs_msg">
                                        <img src={process.env.PUBLIC_URL + "/images/success.png"} alt="success" />
                                        <h2>Success !</h2>
                                        <p>Your email is verified successfully. Now you can Sign in with your email and password.</p>
                                        <Link to="/login">Go to Login</Link>
                                    </div>
                                :
                                    <div className="loader4"></div>
                                }
                            </div>
                        </div>
                    </div>
                </div>    
            </Layout>
		)
	}
}
const mapDispatchToProps = (dispatch) => {
    return {
      
      onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    };
  };
  export default connect(null, mapDispatchToProps) (EmailVerification);