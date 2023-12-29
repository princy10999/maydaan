import React,{Component} from "react";
import {connect} from 'react-redux';
import { Link } from "react-router-dom";
import { UPDATE_ERROR, UPDATE_SUCCESS } from "../../store/action/actionTypes";
class Message extends Component{
    updateErroMessage=()=>{
        setTimeout(() => {
            this.props.onUpdateError("")
        }, 9000)
    }
    updateSuccessMessage=()=>{
        setTimeout(() => {
            this.props.onUpdateSuccess("")
        }, 9000)
    }
	render(){
        if(this.props.error){
            this.updateErroMessage();
        }
         if(this.props.success){
            this.updateSuccessMessage();
        }
		return(
           <>
                {this.props.success?
                <div className="alert alert-success alert-dismissible" style={{textAlign: 'center'}}>
                    <span>{this.props.success}</span>
                    <Link to="#" className="close" onClick={()=> this.props.onUpdateSuccess("")} >&times;</Link>
                </div>:""}
                {this.props.error?
                <div className="alert alert-danger alert-dismissible" style={{textAlign: 'center'}}>
                    <span>{this.props.error}</span>
                    <Link to="#" className="close" onClick={()=> this.props.onUpdateError("")} >&times;</Link>
                </div>:""}
           </>
		)
	}
}
const mapStateToProps=state=>{
	return {
		success:state.success,
		error:state.error
	}
}
const mapDispatchToProps=dispatch=>{
	return{
		onUpdateSuccess:(cnt)=>dispatch({type:UPDATE_SUCCESS,value:cnt}),
		onUpdateError:(cnt)=>dispatch({type:UPDATE_ERROR,value:cnt}),
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(Message);