import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import pro_pick from "../../assets/images/pro_pick.png";
// import dashico1 from "../../assets/images/dashico1.png";
// import dashico2 from "../../assets/images/dashico2.png";
// import dashico7 from "../../assets/images/dashico7.png";
// import dashico8 from "../../assets/images/dashico8.png";
// import dashico6 from "../../assets/images/dashico6.png";
// import dashico3 from "../../assets/images/dashico3.png";
// import dashico4 from "../../assets/images/dashico4.png";
// import dashico5 from "../../assets/images/dashico5.png";
// import dashico9 from "../../assets/images/dashico9.png";
// import bank_details2 from "../../assets/images/bank_details2.png";
// import gallery2 from "../../assets/images/gallery2.png";
// import event_icon from "../../assets/images/event_icon.png";
// import change_password from "../../assets/images/change_password.png";
// import manage_membership_icon from "../../assets/images/manage_membership_icon.png";
// import my_earning from "../../assets/images/my_earning.png";
// import attendence from "../../assets/images/attendence.png";
import { connect } from "react-redux";
import { BASE_URL } from "../../store/action/actionTypes";
import swal from "sweetalert";

const profileImagePath = BASE_URL + "/storage/app/public/profile_pics/";

class Sidebar extends Component {
  logout=()=>{
    swal({
      text: "Are you sure you want to logout?",
      icon: "warning",
      dangerMode: true,
      buttons: true,
      className: "war005",
    }).then((isConfirmed) => {
      if (isConfirmed) {
        this.props.history.push("/logout");
      }
    });
  };
  render() {
    const pathname = this.props.location.pathname;
    return (
      <>
        <div className="col-lg-3 col-md-12 col-sm-12 rpl-0 mobile_sh">
          <div className="dasbordLeftsec">
            <Link
              to="#url"
              className="showmeu"
              data-toggle="collapse"
              data-target="#demo"
            >
              <i className="fa fa-bars" />
              Show Menus
            </Link>
            <div className="dasbordLeft ">
              <div className="profibx">
                <em>
                  <img
                    src={
                      this.props.user && this.props.user.profile_picture
                        ? profileImagePath +
                          "/" +
                          this.props.user.profile_picture
                        :(process.env.PUBLIC_URL + "/images/pro_pick.png")
                    }
                    alt=""
                  />
                </em>
                {this.props.user
                    &&this.props.user.type !== "C"?
                <strong>
                  {this.props.user
                    ? this.props.user.first_name +
                      " " +
                      this.props.user.last_name
                    : null}
                </strong>:null}
                {this.props.user
                    &&this.props.user.type === "C"?
                <strong>
                  {this.props.user
                    &&this.props.user.club_name?this.props.user.club_name:null}
                </strong>:null}
                {this.props.user
                    &&this.props.user.type === "C"?
                <p className="cl-us-na">{this.props.user
                    ? this.props.user.first_name +
                      " " +
                      this.props.user.last_name
                    : null}</p>:null}
                <p>{this.props.user ? this.props.user.email : null}</p>
              </div>
              <div className="dasbordLeftlink">
                <ul>
                  <li>
                    <Link
                       to={
                        this.props.user && this.props.user.type === "M"
                          ? "/user-dashboard"
                          : "/dashboard"
                      }
                      className={
                        pathname === "/user-dashboard" ||
                        pathname === "/dashboard"
                          ? "activee_linkk"
                          : ""
                      }
                    >
                      <span>
                        <img src={process.env.PUBLIC_URL + "/images/dashico1.png"} alt="" />
                      </span>
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={
                        this.props.user && this.props.user.type === "M"
                          ? "/user-edit-profile"
                          : this.props.user && this.props.user.type === "C"
                          ? "/club-edit-profile"
                          : this.props.user && this.props.user.type === "T"
                          ? "/trainer-edit-profile"
                          : "#"
                      }
                      className={
                        pathname === "/user-edit-profile" ||
                        pathname === "/club-edit-profile" ||
                        pathname === "/trainer-edit-profile"
                          ? "activee_linkk"
                          : ""
                      }
                    >
                      <span>
                        <img src={process.env.PUBLIC_URL + "/images/dashico2.png"} alt="" />
                      </span>
                      Create Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/change-password"
                      className={
                        pathname === "/change-password" ? "activee_linkk" : ""
                      }
                    >
                      <span>
                        <img src={process.env.PUBLIC_URL + "/images/change_password.png"} alt="" />
                      </span>
                      Change Password
                    </Link>
                  </li>
                  <li>
                        <Link to="/my-orders"className={
                        pathname === "/my-orders"||
                        pathname === "/order-details" ? "activee_linkk" : ""
                      }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico6.png"} alt="" />
                          </span>
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link to="/wish-list" className={
                        pathname === "/wish-list" ? "activee_linkk" : ""
                      }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico3.png"} alt="" />
                          </span>
                          My Wish List
                        </Link>
                      </li>
                  {this.props.user && (this.props.user.type === "M"|| this.props.user.type === "T") ? (
                    <>
                      <li>
                        <Link to="/my-trainers" className={
                        pathname === "/my-trainers"||
                        pathname === "/my-trainer-details"
                         ? "activee_linkk" : ""
                      }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico7.png"} alt="" />
                          </span>
                          My Trainers
                        </Link>
                      </li>
                      <li>
                        <Link to="/my-associated-clubs" 
                        className={
                        pathname === "/my-associated-clubs"||
                        pathname === "/my-associated-club-details" ? "activee_linkk" : ""
                      }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico8.png"} alt="" />
                          </span>
                          My Associated Clubs
                        </Link>
                      </li> 
                    </>
                  ) : null}
                  {this.props.user && (this.props.user.type === "C" ||this.props.user.type === "T")? (
                    <>
                      <li>
                        <Link
                          to="/gallery"
                          className={
                            pathname === "/gallery" ||
                            pathname === "/add-gallery"
                              ? "activee_linkk"
                              : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/gallery2.png"} alt="" />
                          </span>
                          Gallery
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/bank-details"
                          className={
                            pathname === "/bank-details" ? "activee_linkk" : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/bank_details2.png"} alt="" />
                          </span>
                          Bank Details
                        </Link>
                      </li>
                      <li>
                        <Link to="/my-earning" className={
                            pathname === "/my-earning" ? "activee_linkk" : ""
                          }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/my_earning.png"} alt="" />
                          </span>
                          My Earning
                        </Link>
                      </li>
                      <li>
                        <Link to="/withdrawal" className={
                            pathname === "/withdrawal" ? "activee_linkk" : ""
                          }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/withdrawl.png"} alt="" />
                          </span>
                          Withdrawal
                        </Link>
                      </li>
                      <li>
                        <Link 
                        to="/my-reviews" className={
                            pathname === "/my-reviews" ? "activee_linkk" : ""
                          }
                        // to="#"
                          >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico3.png"} alt="" />
                          </span>
                          My Review{" "}
                        </Link>
                      </li>
                    </>
                    ):null}
                    {this.props.user && this.props.user.type === "C"?(
                    <>
                    <li>
                        <Link to="/event-management"
                        className={
                          pathname === "/event-management" ||
                          pathname === "/add-event"
                            ? "activee_linkk"
                            : ""
                        }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/event_icon.png"} alt="" />
                          </span>
                          Manage Event
                        </Link>
                      </li>
                      <li>
                        <Link to="/manage-membership" className={
                            pathname === "/manage-membership" ? "activee_linkk" : ""
                          }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/manage_membership_icon.png"} alt="" />
                          </span>
                          Manage Membership{" "}
                        </Link>
                      </li>
                      <li>
                        <Link to="/manage-products" className={
                            pathname === "/manage-products" || pathname==="/add-product" ? "activee_linkk" : ""}>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico8.png"} alt="" />
                          </span>
                          Manage Product
                        </Link>
                      </li>
                      <li>
                        <Link to="/manage-order" className={
                            pathname === "/manage-order"? "activee_linkk" : ""}>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico6.png"} alt="" />
                          </span>
                          Manage Order
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/our-trainers"
                          className={
                            pathname === "/add-trainer" ||
                            pathname === "/our-trainers"
                              ? "activee_linkk"
                              : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico5.png"} alt="" />
                          </span>
                          Our Trainers
                        </Link>
                      </li>
                      <li>
                      <Link to="/club-members" 
                      className={
                        pathname === "/club-members" ? "activee_linkk" : ""
                      }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico7.png"} alt="" />
                          </span>
                          Club Members
                        </Link>
                      </li>
                    </>
                  ) : null}
                  {this.props.user && this.props.user.type === "T" ? (
                    <>
                      <li>
                        <Link to="/manage-subscription" className={
                            pathname === "/manage-subscription" ? "activee_linkk" : ""
                          }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/manage_membership_icon.png"} alt="" />
                          </span>
                          Manage Subscription{" "}
                        </Link>
                      </li>
                      <li>
                      <Link to="/our-members" 
                      className={
                        pathname === "/our-members" ? "activee_linkk" : ""
                      }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico7.png"} alt="" />
                          </span>
                          Our Members
                        </Link>
                      </li>
                      <li>
                        <Link to="/take-attendance" className={
                            pathname === "/take-attendance" ? "activee_linkk" : ""
                          }>
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/attendence.png"} alt="" />
                          </span>
                          Take Attendance
                        </Link>
                      </li>
                    </>
                  ) : null}
                  <li>
                        <Link
                          to="/payment-details"
                          className={
                            pathname === "/payment-details" ? "activee_linkk" : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/my_earning.png"} alt="" />
                          </span>
                          Payment Details
                        </Link>
                      </li>
                   <li>
                        <Link
                          to="/my-posted-reviews"
                          className={
                            pathname === "/my-posted-reviews" ? "activee_linkk" : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico3.png"} alt="" />
                          </span>
                          My Posted Reviews
                        </Link>
                      </li>
                  <li>
                        <Link
                          to="/address-book"
                          className={
                            pathname === "/address-book" ? "activee_linkk" : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico4.png"} alt="" />
                          </span>
                          Address Book
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/add-address"
                          className={
                            pathname === "/add-address" ? "activee_linkk" : ""
                          }
                        >
                          <span>
                            <img src={process.env.PUBLIC_URL + "/images/dashico5.png"} alt="" />
                          </span>
                          Add Address
                        </Link>
                      </li>
                  <li>
                    <Link onClick={this.logout}>
                      <span>
                        <img src={process.env.PUBLIC_URL + "/images/dashico9.png"} alt="" />
                      </span>
                      Log Out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default connect(mapStateToProps, null)(withRouter(Sidebar));
