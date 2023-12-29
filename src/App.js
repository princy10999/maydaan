import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
  UserRoute,
  GuestRoute,
  ClubRoute,
  PrivateRoute,
  TrainerRoute,
  NotUserRoute,
  NotClubRoute
} from "./shared/private-route";
import Home from "./components/Home/Home";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import UserEditProfile from "./components/EditProfile/UserEditProfile";
import AddAddress from "./components/Address/AddAddress";
import EmailVerification from "./components/Signup/EmailVerification";
import AddressBook from "./components/Address/AddressBook";
import Logout from "./components/Logout/Logout";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import ClubEditProfile from "./components/EditProfile/ClubEditProfile";
import SearchClub from "./components/Search/SearchClub";
import AddTrainer from "./components/ClubTrainer/AddTrainer";
import OurTrainers from "./components/ClubTrainer/OurTrainers";
import TrainerEditProfile from "./components/EditProfile/TrainerEditProfile";
import BankDetails from "./components/BankDetails/BankDetails";
import UserDashboard from "./components/Dashboard/UserDashboard";
import AddGallery from "./components/Gallery/AddGallery";
import Gallery from "./components/Gallery/Gallery";
import ClubDetails from "./components/Details/ClubDetails";
import ManageMembership from "./components/ManageMembership/ManageMembership";
import CreateEvent from "./components/Event/CreateEvent";
import EventManagement from "./components/Event/EventManagement";
import EventDetails from "./components/Event/EventDetails";
import SearchEvent from "./components/Search/SearchEvent";
import EventDetail from "./components/Details/EventDetail";
import Faq from "./components/ContentManagement/Faq";
import About_Us from "./components/ContentManagement/About_Us";
import ContactUs from "./components/ContentManagement/ContactUs";
import TermsAndConditions from "./components/ContentManagement/TermsAndConditions";
import PrivacyPolicy from "./components/ContentManagement/PrivacyPolicy";
import MyAssociatedClubs from "./components/MyAssociatedClubs/MyAssociatedClubs";
import MyTrainers from "./components/MyTrainers/MyTrainers";
import MyAssociatedClubDetails from "./components/MyAssociatedClubs/MyAssociatedClubDetails";
import MyTrainerDetails from "./components/MyTrainers/MyTrainerDetails";
import MyOrders from "./components/MyOrders/MyOrders";
// import MyOrders2 from "./components/MyOrders/MyOrders2";
import OrderDetails from "./components/MyOrders/OrderDetails";
import PostReview from "./components/PostReview/PostReview";
import WishList from "./components/WishList/WishList";
import Dashboard from "./components/Dashboard/Dashboard";
import SearchProduct from "./components/Search/SearchProduct";
import ProductDetails from "./components/Details/ProductDetails";
import Help from "./components/ContentManagement/Help";
import Payment from "./components/Payment/Payment";
import OurMembers from "./components/ClubTrainer/OurMembers";
import AddProduct from "./components/Product/AddProduct";
import ManageProduct from "./components/Product/ManageProduct";
import TakeAttendance from "./components/Attendance/TakeAttendance";
import MyAttendance from "./components/Attendance/MyAttendance";
import TakeAttendancebyTrainer from "./components/Attendance/TakeAttendancebyTrainer";
import ViewAttendance from "./components/Attendance/ViewAttendance";
import SearchTrainer from "./components/Search/SearchTrainer";
import TrainerDetails from "./components/Details/TrainerDetails";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckOut/Checkout";
import PlaceOrder from "./components/PlaceOrder/PlaceOrder";
import PaymentSummery from "./components/PaymentSummary/PaymentSummery";
import OurMemberDetails from "./components/ClubTrainer/OurMemberDetails";
import ManageOrder from "./components/ManageOrder/ManageOrder";
import MyReview from "./components/MyReview/MyReview";
import MyEarning from "./components/MyEarning/MyEarning";
import MyEarningFromProduct from "./components/MyEarning/MyEarningFromProduct";
import ViewMyEarningFromProduct from "./components/MyEarning/ViewMyEarningFromProduct";
import MyEarningFromMembership from "./components/MyEarning/MyEarningFromMembership";
import FeesDetails from "./components/MyEarning/FeesDetails";
import Withdrawal from "./components/Withdrawal/Withdrawal";
import AddBanner from "./components/Gallery/AddBanner";
import MyPostedReview from "./components/MyPostedReview/MyPostedReview";
import PaymentDetails from "./components/PaymentDetails/PaymentDetails";
import ViewClubPaymentDetails from "./components/PaymentDetails/ViewClubPaymentDetails";
import ViewTrainerPaymentDetaails from "./components/PaymentDetails/ViewTrainerPaymentDetaails";
import ViewProductPaymentDetails from "./components/PaymentDetails/ViewProductPaymentDetails";

function App() {
  return (
    <>
      <Router basename={"/preview/"}>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/search-club" component={SearchClub} exact />
          <Route path="/search-event" component={SearchEvent} exact />
          <Route path="/search-product" component={SearchProduct} exact />
          <Route path="/search-trainer" component={SearchTrainer} exact />
          <Route path="/club-details/:slug/:id" component={ClubDetails} exact />
          <Route path="/event-detail/:slug" component={EventDetail} exact />
          <Route path="/trainer-details/:slug/:id" component={TrainerDetails} exact />
          <Route path="/product-details/:slug/:id" component={ProductDetails} exact />
          <GuestRoute path="/signup" component={Signup} exact />
          <GuestRoute
            path="/email-verification/:otp"
            component={EmailVerification}
            exact
          />
          <GuestRoute path="/login" component={Login} exact />
          <GuestRoute
            path="/forgot-password"
            component={ForgotPassword}
            exact
          />
          <GuestRoute
            path="/reset-password/:otp"
            component={ResetPassword}
            exact
          />
          <UserRoute
            path="/user-edit-profile"
            component={UserEditProfile}
            exact
          />
          <PrivateRoute path="/add-address" component={AddAddress} exact />
          <PrivateRoute key="edit-address" path="/edit-address/:id" component={AddAddress} />
          <PrivateRoute key="add-address" path="/address-book" component={AddressBook} exact />
          <UserRoute path="/user-dashboard" component={UserDashboard} exact />
          <NotUserRoute path="/dashboard" component={Dashboard} exact />
          <NotClubRoute path="/my-trainer-details/:id/:type/:member_id" component={MyTrainerDetails} exact />
          <PrivateRoute path="/my-orders" component={MyOrders} exact />
          {/* <UserRoute path="/my-orders2" component={MyOrders2} exact /> */}
          <PrivateRoute key="Order Details" path="/order-details/:id" component={OrderDetails} exact />
          <PrivateRoute key="Product Review" path="/post-review/:id/:mid" component={PostReview} exact />
          <NotClubRoute key="Club Review" path="/post-your-review/:cid/:member_id" component={PostReview} exact />
          <NotClubRoute key="Trainer Review" path="/post-my-review/:tId/:type/:member_id" component={PostReview} exact/>
          <PrivateRoute path="/wish-list" component={WishList} exact />
          <NotClubRoute path="/my-trainers" component={MyTrainers} exact />
          <NotClubRoute path="/my-attendance/:id/:sId/:type/:member_id" component={MyAttendance} exact />
          <ClubRoute path="/take-attendance/:id" component={TakeAttendance} exact />
          <ClubRoute path="/view-attendance/:id" component={ViewAttendance} exact />
          <NotUserRoute path="/take-attendance" component={TakeAttendancebyTrainer} exact />
          <PrivateRoute
            path="/change-password"
            component={ChangePassword}
            exact
          />
          <PrivateRoute path="/logout" component={Logout} exact />
          <ClubRoute
            path="/club-edit-profile"
            component={ClubEditProfile}
            exact
          />
          <ClubRoute path="/add-trainer" component={AddTrainer} exact />
          <ClubRoute path="/edit-trainer/:id" component={AddTrainer} exact />
          <ClubRoute path="/our-trainers" component={OurTrainers} exact />
          <NotUserRoute path="/add-gallery" component={AddGallery} exact />
          <NotUserRoute path="/edit-gallery/:id" component={AddGallery} exact />
          <NotUserRoute path="/gallery" component={Gallery} exact />
          <NotUserRoute path="/add-banner" component={AddBanner} exact />
          <TrainerRoute
            path="/trainer-edit-profile"
            component={TrainerEditProfile}
            exact
          />
          <NotUserRoute path="/bank-details" component={BankDetails} exact />
          <ClubRoute key="manage-membership" path="/manage-membership" component={ManageMembership} exact />
          <TrainerRoute key="manage-subscription" path="/manage-subscription" component={ManageMembership} exact />
          <ClubRoute path="/add-event" component={CreateEvent} exact />
          <ClubRoute path="/edit-event/:slug" component={CreateEvent} exact />
          <ClubRoute path="/event-management" component={EventManagement} exact />
          <ClubRoute path="/event-details/:slug" component={EventDetails} exact />
          <ClubRoute key="view-members" path="/view-members/:id" component={OurMembers} exact />
          <ClubRoute key="member-details" path="/member-details/:id/:mId/:user_id" component={OurMemberDetails} exact />
          <ClubRoute key="club-members" path="/club-members" component={OurMembers} exact />
          <ClubRoute key="club-member-details" path="/club-member-details/:id/:club_id" component={OurMemberDetails} exact />
          <TrainerRoute key="our-member-details" path="/our-member-details/:tmId/:type/:user_id" component={OurMemberDetails} exact />
          <TrainerRoute key="our-members" path="/our-members" component={OurMembers} exact />
          <ClubRoute path="/add-product" component={AddProduct} exact />
          <ClubRoute path="/edit-product/:slug" component={AddProduct} exact />
          <ClubRoute path="/manage-products" component={ManageProduct} exact />
          <Route path='/faq' component={Faq}  />
          <Route path='/about-us' component={About_Us}  />
          <Route path='/contact-us' component={ContactUs}  />
          <Route path='/terms-and-conditions' component={TermsAndConditions}  />
          <Route path='/privacy-policy' component={PrivacyPolicy}  />
          <Route path='/help' component={Help}  />
          <NotClubRoute path="/my-associated-clubs" component={MyAssociatedClubs} exact />
          <NotClubRoute path="/my-associated-club-details/:id/:member_id" component={MyAssociatedClubDetails} exact />
          <NotClubRoute
            path="/payment/:slug/:id"
            component={Payment}
            exact
          />
          <PrivateRoute path="/cart" component={Cart} exact />
          <PrivateRoute path="/checkout/:uid" component={Checkout} exact /> 
          <PrivateRoute path="/place-order/:id" component={PlaceOrder} exact /> 
          <PrivateRoute path="/payment-summery" component={PaymentSummery} exact /> 
          <ClubRoute path="/manage-order" component={ManageOrder} exact/>
          <ClubRoute key="club order details" path="/order-detail/:mid" component={OrderDetails} exact />
          <NotUserRoute path="/my-reviews" component={MyReview} exact/>
          <PrivateRoute path="/my-posted-reviews" component={MyPostedReview} exact/>
          <NotUserRoute key="My earning" path="/my-earning" component={MyEarning} exact/>
          <NotUserRoute path="/my-earning-from-product" component={MyEarningFromProduct} exact/>
          <NotUserRoute path="/view-my-earning-from-product/:id" component={ViewMyEarningFromProduct} exact/>
          <NotUserRoute path="/my-earning-from-membership" component={MyEarningFromMembership} exact/>
          <NotUserRoute path="/fees-details/:id" component={FeesDetails} exact/>
          <NotUserRoute path="/withdrawal" component={Withdrawal} exact/>
          <PrivateRoute path="/payment-details" component={PaymentDetails} exact/>
          <NotClubRoute path="/view-club-payment-details/:id" component={ViewClubPaymentDetails} exact/>
          <NotClubRoute path="/view-trainer-payment-details/:id" component={ViewTrainerPaymentDetaails} exact/>
          <PrivateRoute path="/view-product-payment-details/:id" component={ViewProductPaymentDetails} exact/>
        </Switch>
      </Router>
    </>
  );
}

export default App;
