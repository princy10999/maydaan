
import { AUTH_LOGOUT} from "../../store/action/actionTypes";
import {connect} from 'react-redux';
import { removeLSItem, setLSItem } from "../../shared/LocalStorage";

const logout = (props) => {
    props.logoutUser();
    props.history.push("/login");
    removeLSItem("email");
            removeLSItem("password");
    return false;
};
const mapDispatchToProps=dispatch=>{
	return{
		logoutUser:()=>dispatch({type:AUTH_LOGOUT})
	}
}

export default connect(null,mapDispatchToProps)(logout);
