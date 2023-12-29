import React, { Component } from "react";
import Layout from "../Layout/Layout";
import Sidebar from "../Layout/Sidebar";
import axios from "../../shared/axios";
import {
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
} from "../../store/action/actionTypes";
import { connect } from "react-redux";
import Message from "../Layout/Message";
// import edit from "../../assets/images/edit.png";
// import block from "../../assets/images/block.png";
// import unblock from "../../assets/images/unblock.png";
// import view from "../../assets/images/view.png";
// import paglefthov from "../../assets/images/paglefthov.png";
// import pagleft from "../../assets/images/pagleft.png";
// import pagright from "../../assets/images/pagright.png";
// import pagrightho from "../../assets/images/pagrightho.png";
// import no_result from "../../assets/images/no-result.png";
// import pro_pick from "../../assets/images/pro_pick.png";
// import delete_dash from "../../assets/images/delete-dash.png";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import swal from "sweetalert";
// import { USER_IMAGE } from "../../store/action/actionTypes";
import { BASE_URL } from "../../store/action/actionTypes";
import { getLSItem } from "../../shared/LocalStorage";

// let currentPath="";
const profileImagePath = BASE_URL + "/storage/app/public/profile_pics/";
class OurMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      club_member_data: [],
      page_count: 0,
      per_page: 0,
      offset: 0,
      total: 0,
      loader:false
    };
  }

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // currentPath = document.location.pathname;
    let user = JSON.parse(getLSItem("user"));
    let data1 = {
      params: {
        club_id: user.id,
        trainer_id: this.props.match.params.id,
      },
    };
    axios.post("get-trainer-info", data1).then((res) => {
      this.props.onUpdateLoader(false);
      this.setState({loader:false})
      this.setState({
        trainer: res.data.result.trainer
      })
    })
    this.getData();
  }
  getData=()=>{
    if (this.props.match.params.id) {
      document.title = "Maydaan | View Members";
      var body = {
        params: {
          trainer_assoc_memebers: "Y",
          t_id: this.props.match.params.id,
          offset: this.state.offset,
        },
      };
    } else if(this.props.user.type==="C"){
      document.title = "Maydaan | Club Members";
      body = {
        params: {
          offset: this.state.offset,
        },
      };
    }
    else{
      document.title = "Maydaan | Our Members";
      body = {
        params: {
          offset: this.state.offset,
        },
      };
    }
    this.props.onUpdateLoader(true);
    this.setState({loader:true})
    axios.post("/our-joined-users", body).then((res) => {
      // console.log("members", res);
      this.props.onUpdateLoader(false);
      this.setState({loader:false})
      this.setState({
        club_member_data: res.data.result.users,
        page_count: res.data.result.page_count,
        per_page: res.data.result.per_page,
        total: res.data.result.total,
      });
    });
  }
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.per_page;
    // console.log(offset);
    this.setState({ offset: offset }, () => {
      this.getData();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  status = (id,S) => {
    let st=S;
    let txt= "Are you sure you want to approve this member?"
    if(S==="I"){
      txt= "Are you sure you want to disapprove this member?"
    }
    var data = {
      params: {
        id: id,
        status:st
      },
    };
    swal({
      text: txt,
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        axios.post("change-status", data).then((resp) => {
          if (resp.data.result) {
            this.props.onUpdateSuccess(resp.data.result.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
            this.getData();
          }
          else if(resp.data.error){
            this.props.onUpdateError(resp.data.error.meaning);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        });
      }
    });
  };
  
  render() { 
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
                    <h1>{this.props.match.params.id?this.state.trainer?`View Members (${this.state.trainer.first_name} ${this.state.trainer.last_name})`:null:this.props.user.type==="C"?"Club Members":"Our Members"}</h1>
                    <div className="dasbordRightBody for_table_stc">
                    <Message />
                      {this.props.match.params.id?
                      <buttton className="back_btnn01 back_btnn_new01 back_btnn_new02" onClick={()=>this.props.history.push("/our-trainers")} style={{marginBottom:"10px"}} >Back</buttton>:null}
                    {this.state.club_member_data && this.state.club_member_data.length>0? (
                      <div className="table_01 table">
                        <div className="row amnt-tble">
                          <div className="cel_area amunt cess nw1">&nbsp;</div>
                          <div className="cel_area amunt cess nw22 exc-fix">
                            Name & Contact
                          </div>
                          <div className="cel_area amunt cess nw3 exc-fix">
                            Location
                          </div>
                          <div className="cel_area amunt cess nw41 exc-fix">Paid on</div>
                          <div className="cel_area amunt cess nw51 exc-fix">
                            Next due date
                          </div>
                          <div className="cel_area amunt cess nw52 exc-fix">Membership Status</div>
                          {this.props.match.params.id?
                           <div className="cel_area amunt cess exc-fix">
                            Status
                          </div>:null}
                          <div className="cel_area amunt cess nw36">&nbsp;</div>
                          {/* <div className="cel_area amunt cess nw36">&nbsp;</div> */}
                        </div>
                        
                            {this.state.club_member_data.map((item, index) => (
                              <div className="row small_screen2">
                                <div className="cel_area amunt-detail cess">
                                  <span className="sm_size mmbr_pic">
                                    <img
                                      src={item.get_member.profile_picture!==null?
                                        profileImagePath +
                                        item.get_member.profile_picture:(process.env.PUBLIC_URL + "/images/pro_pick.png")
                                      }
                                      alt=""
                                    />
                                  </span>
                                </div>

                                <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">
                                    Name & Contact
                                  </span>{" "}
                                  <span className="sm_size">
                                    {item.get_member.first_name}{" "}
                                    {item.get_member.last_name}
                                    <strong>{item.get_member.phone}</strong>
                                  </span>
                                </div>
                                <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">
                                    Location
                                  </span>{" "}
                                  <span className="sm_size">
                                    {item.get_member.user_state_details
                                      ? item.get_member.user_state_details.name
                                      : null}
                                  </span>
                                </div>
                                {!this.props.match.params.id?
                                (<div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">Paid on</span>{" "}
                                  <span className="sm_size">
                                    {item.paid_on}
                                  </span>{" "}
                                </div>):
                                (<div className="cel_area amunt-detail cess exs-det">
                                {" "}
                                <span className="hide_big">Paid on</span>{" "}
                                <span className="sm_size">
                                  {item.get_subscription?item.get_subscription[0].paid_on:null}
                                </span>{" "}
                              </div>)}
                              {!this.props.match.params.id?
                                (<div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">
                                    Next due date
                                  </span>
                                  <span className="sm_size">
                                    {item.expire_date}
                                  </span>
                                </div>):(
                                  <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">
                                    Next due date
                                  </span>
                                  <span className="sm_size">
                                  {item.get_subscription?item.get_subscription[0].expire_date:null}
                                  </span>
                                </div>
                                )}
                                 {!this.props.match.params.id?
                                <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">Status</span>
                                    {item.is_subscribe === "Y"
                                      ? <span className="sm_size clor_done">Active</span>
                                      : <span className="sm_size clor_cancel">Inactive</span>}
                                </div>
                                :
                                <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">Membership Status</span>
                                    {item.get_subscription && item.get_subscription[0].is_subscribe === "Y"
                                      ? <span className="sm_size clor_done">Active</span>
                                      : <span className="sm_size clor_cancel">Inactive</span>}
                                </div>}
                                {this.props.match.params.id?
                                <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">
                                    Status
                                  </span>{" "}
                                  {item.status && item.status==="AA"?
                                  <span className="sm_size" style={{color:"#f0a80c"}}>
                                    Awaiting Approval
                                  </span>:
                                  item.status==="A"?
                                  <span className="sm_size clor_done">
                                  Approved
                                </span>
                                :
                                <span className="sm_size clor_cancel">Disapproved</span>}
                                </div>:null}
                                <div className="cel_area amunt-detail cess exs-det">
                                  {" "}
                                  <span className="hide_big">Action</span>
                                  <ul>
                                  {this.props.match.params.id && item.status === "AA"?
                                  <>
                                  <li>
                                          <Link
                                            to="#"
                                            onClick={() => this.status(item.id,"A")}
                                          >
                                            <img
                                              src= {process.env.PUBLIC_URL + "/images/approved.png"}
                                              alt=""
                                              title="Approve"
                                            />{" "}
                                          </Link>
                                        </li>
                                        <li>
                                          <Link
                                            to="#"
                                            onClick={() => this.status(item.id,"I")}
                                          >
                                            <img
                                              src= {process.env.PUBLIC_URL + "/images/disapprove-btn.png"}
                                              alt=""
                                              title="Disapprove"
                                            />{" "}
                                          </Link>
                                        </li>
                                        </>:null}
                                    <li>
                                      {this.props.user.type==="T"?
                                      <Link to={`our-member-details/${item.id}/A/${item.user_id}`}>
                                        <img
                                          src={process.env.PUBLIC_URL + "/images/view.png"}
                                          alt=""
                                          title="View Details"
                                        />
                                      </Link>
                                      :
                                      <Link to={this.props.match.params.id?`/member-details/${item.id}/${this.props.match.params.id}/${item.trainer_id}`:`/club-member-details/${item.id}/${item.get_user?item.get_user.club_id:""}`}>
                                        <img
                                          src={process.env.PUBLIC_URL + "/images/view.png"}
                                          alt=""
                                          title="View Details"
                                        />
                                      </Link>}
                                    </li>
                                    {/* {!this.props.match.params.id?
                                    <li><Link to="#">
                                      <img src={process.env.PUBLIC_URL + "/images/block.png"} alt="" title="Change Status"/></Link></li>:null}  */}
                                  </ul>
                                </div>
                              </div>
                            ))}
                         
                      </div>) : (
                        <>
                        { !this.state.loader ?
                        <div className="n-resul">
                          <img src={process.env.PUBLIC_URL + "/images/no-result.png"} alt="" />
                          <p>
                            You have currently no members! 
                          </p>
                        </div>
                        :null}
                        </>
                      )}
                    </div>
                  </div>
                  {this.state.page_count>1?
                  <div className="pag_red">
                    <div className="paginationsec">
                      <ReactPaginate
                        activeClassName="actv"
                        activeLinkClassName="actv"
                        initialPage={0}
                        breakLabel="....."
                        onPageChange={(e) => this.handlePageClick(e)}
                        pageCount={this.state.page_count}
                        previousLabel={
                          <>
                            <img src={process.env.PUBLIC_URL + "/images/pagleft.png"} alt="" className="dpb" />
                            <img src={process.env.PUBLIC_URL + "/images/paglefthov.png"} alt="" className="dpn" />
                          </>
                        }
                        nextLabel={
                          <>
                            <img src={process.env.PUBLIC_URL + "/images/pagright.png"} alt="" className="dpb" />
                            <img src={process.env.PUBLIC_URL + "/images/pagrightho.png"} alt="" className="dpn" />
                          </>
                        }
                        marginPagesDisplayed={1}
                        renderOnZeroPageCount={null}
                      />
                    </div>
                  </div>
                  :null}
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
export default connect(mapStateToProps, mapDispatchToProps)(OurMembers);
