import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
// import event_img_big from "../../assets/images/event-img-big.jpg";
// import clock from "../../assets/images/clock.png";
// import event_deets_bg from "../../assets/images/event-deets-bg.png";
// import location_big from "../../assets/images/location-big.png";
// import list from "../../assets/images/list.png";
// import club_logo_1 from "../../assets/images/club-logo-1.png";
// import event_arrow from "../../assets/images/event-arrow.png";
// import event_img from "../../assets/images/event-img.jpg";
// import location_icon from "../../assets/images/location-icon.png";
// import location from "../../assets/images/location.png";
// import phone from "../../assets/images/phone.png";
// import mail_icon from "../../assets/images/mail-icon.png";
// import owl_detail_1 from "../../assets/images/owl-detail-1.jpg";
// import pro_pick from "../../assets/images/pro_pick.png";
// import price_tag_ash from "../../assets/images/price-tag-ash.png";
// import gallary_head from "../../assets/images/gallary-head.png";
// import ReactPlayer from "react-player/youtube";
// import product_bg from "../../assets/images/product-bg.png";
// import rupee_green from "../../assets/images/rupee-green.png";
// import rupees from "../../assets/images/rupees.png";
// import star_point from "../../assets/images/star-point.png";
// import product_arrow from "../../assets/images/product-arrow.png";
import ReactReadMoreReadLess from "react-read-more-read-less";
import OwlCarousel from "react-owl-carousel";
import { useParams } from "react-router";
import axios from "../../shared/axios";
import { USER_IMAGE, BASE_URL } from "../../store/action/actionTypes";
import dateFormat from "dateformat";
import { UPDATE_LOADER } from "../../store/action/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { getText } from "../../shared/common";

const owl5 = {
  loop: true,
  nav: true,
  dots: false,
  margin: 30,
  responsive: {
    0: {
      items: 1,
    },
    767: {
      items: 2,
    },
    1000: {
      items: 2.5,
    },
  },
};

const EventDetail=()=>{
  const User = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialState = {
    event: [],
    eventPic: [],
    similar: [],
    user: [],
  };
  const [state, setState] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const params = useParams();
  useEffect(() => {
    dispatch({ type: UPDATE_LOADER, value: true });
    setLoader(true)
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Maydaan | Club Details";
    var data = {
      params: {
        slug: params.slug,
        pagetype: "L",
      },
    };
    if(User){
      data = {
        params: {
          slug: params.slug,
          pagetype: "L",
          user_id:User.id
        },
      };
    }
    axios.post("view-event-details", data).then((res) => {
      dispatch({ type: UPDATE_LOADER, value: false });
      setLoader(false)
      // console.log("event", res);
      setState((prevState) => {
        return {
          ...prevState,
          event: res.data.result.event,
          similar: res.data.result.similar_events,
        };
      });
      if (res.data.result.event) {
        setState((prevState) => {
          return {
            ...prevState,
            user: res.data.result.event.get_user,
            eventPic:
              res.data.result.event &&
              res.data.result.event.event_image !== null
                ? BASE_URL +
                  "/storage/app/public/event_images/" +
                  res.data.result.event.event_image
                : null,
          };
        });
      }
    });
  }, [params.slug]);
  const { event, user, eventPic, similar } = state;
  return (
    <Layout>
      <div className="mai002">
        <img src={process.env.PUBLIC_URL + "/images/event-deets-bg.png"} className="event-deets-bg" alt="" />
        {event ? (
          <div className="container">
            <div className="evnt-intro">
              <div className="row">
                <div className="col-lg-6 col-12">
                  <div className="evnt-02">
                    {!loader?
                    <img
                      src={event.event_image ? eventPic :(process.env.PUBLIC_URL + "/images/pro_pick.png")}
                      alt=""
                      className="img-fluid"
                    />:null}
                  </div>
                </div>
                <div className="col-lg-6 col-12">
                  <div className="evnt-02-txt">
                    <div className="evnt-03">
                      <h2>{event.event_title}</h2>
                      <h5>
                        <img src={process.env.PUBLIC_URL + "/images/clock.png"} alt="" />
                        {event.event_date}
                        <span className="long" />
                        {event.event_time}
                      </h5>
                      <div className="evnt-loc">
                        <img src={process.env.PUBLIC_URL + "/images/location-big.png"} alt="" />
                        <h5>
                          {event.address ? event.address : null},{" "}
                          {event.user_city_details
                            ? event.user_city_details.city
                            : null}
                          ,{" "}
                          {event.user_state_details
                            ? event.user_state_details.name
                            : null}
                          , Pin-{event.pincode}
                        </h5>
                      </div>
                    </div>
                    {user ? (
                      <div className="evnt-04">
                        <div className="logo-04">
                          <img
                            src={
                              user.profile_picture !== null
                                ? USER_IMAGE + user.profile_picture
                                : (process.env.PUBLIC_URL + "/images/pro_pick.png")
                            }
                            className="img-fluid"
                            alt=""
                          />
                        </div>
                        <div className="logo-intro">
                          <h3>{user.club_name}</h3>
                          <p>Organiser</p>
                          <p>Phone : {user.phone}</p>
                          <p>
                            <span>Email :</span> {user.email}
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="about">
              <h2>ABOUT THE EVENT</h2>
              <ReactReadMoreReadLess
                charLimit={150}
                readMoreText={"Read more +"}
                readLessText={"Read less -"}
                ellipsis={"..."}
                readMoreClassName={"react-read-more-read-less react-read-more-read-less-more col-green"}
                readLessClassName={"react-read-more-read-less react-read-more-read-less-less col-green"}
              >
                {event.about_event ? getText(event.about_event) : ""}
              </ReactReadMoreReadLess>
            </div>
          </div>
        ) : null}
          <div className="events">
          {similar && similar.length > 0 ? (
            <div className="container">
              <div className="event-head">
                <h2>
                  Similar <span>events</span>
                </h2>
                <img className="event-arrow" src={process.env.PUBLIC_URL + "/images/event-arrow.png"} alt="" />
              </div>
              <OwlCarousel
                className="owl-carousel owl-theme owl-five"
                {...owl5}
              >
                {similar.map((item, index) => {
                  return (
                    <div className="item" key={index}>
                      <div className="event-card">
                        <div className="event-img">
                          <Link to={`/event-detail/${item.slug}`}>
                          <img
                            src={
                              BASE_URL +
                              "storage/app/public/event_images/" +
                              item.event_image
                            }
                            alt=""
                            className="event-main"
                          /></Link>
                          <div className="date">
                            <h5>{dateFormat(item.event_date, "d")}</h5>
                            <h6>{dateFormat(item.event_date, "mmm")}</h6>
                            <h4>{dateFormat(item.event_date, "yyyy")}</h4>
                          </div>
                          <div className="club-name">
                            <h5>
                              {item.get_user ? item.get_user.club_name : null}
                            </h5>
                            <h6>
                              <img src={process.env.PUBLIC_URL + "/images/location-icon.png"} alt="" />
                              {item.user_city_details
                                ? item.user_city_details.city
                                : null}
                            </h6>
                          </div>
                        </div>
                        <h3>
                          <Link to={`/event-detail/${item.slug}`}>
                            {item.event_title}
                          </Link>
                        </h3>
                        {item.about_event ?
                            <p>
                                  {item.about_event.length > 25
                                    ?  getText(item.about_event).substr(0, 25) + ".."
                                    :  getText(item.about_event)}</p>:
                                    <p>&nbsp;</p>}
                      </div>
                    </div>
                  );
                })}
              </OwlCarousel>
            </div>
             ) : null}
          </div>
      </div>
    </Layout>
  );
}

export default EventDetail;
