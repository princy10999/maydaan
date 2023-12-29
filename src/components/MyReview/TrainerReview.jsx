import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_LOADER, USER_IMAGE } from "../../store/action/actionTypes";
import axios from "../../shared/axios";
import { Rating } from "../../shared/Rating";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { getText } from "../../shared/common";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";

function TrainerReview() {
  const dispatch = useDispatch();
  const initialState = {
    page_count: 0,
    per_page: 0,
    total: 0,
    tReview: [],
    tDetail: [],
    trainerList: [],
  };
  const [state, setState] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    dispatch({ type: UPDATE_LOADER, value: true });
    setLoader(true);
    let data = {
      params: {
        offset: offset,
      },
    };
    axios.post("/list-of-club-trainers", data).then((resp) => {
    //   console.log("Data", resp);
      dispatch({ type: UPDATE_LOADER, value: false });
      setLoader(false);
      if (resp.data.result && resp.data.result.users) {
        setState((prevState) => {
          return {
            ...prevState,
            trainerList: resp.data.result.users,
            page_count: resp.data.result.page_count,
            per_page: resp.data.result.per_page,
            total: resp.data.result.total,
          };
        });
      }
    });
  };
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * initialState.per_page;
    // console.log(offset);
    setOffset(offset, () => {
      getData();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const moreReview = (id) => {
    var data = {
      params: {
        user_id: id,
      },
    };
    dispatch({ type: UPDATE_LOADER, value: true });
    setLoader(true);
    axios.post("user-reviews", data).then((res) => {
      // console.log("lll0",res);
      dispatch({ type: UPDATE_LOADER, value: false });
      setLoader(false);
      if (res.data.result && res.data.result.reviews) {
        setState((prevState) => {
          return {
            ...prevState,
            tReviews: res.data.result.reviews,
          };
        });
      }
      if (res.data.result && res.data.result.user) {
        setState((prevState) => {
          return {
            ...prevState,
            tDetail: res.data.result.user,
          };
        });
      }
    });
  };
  const { tReviews, tDetail, page_count, trainerList } = state;
  return (
    <div className="dasbordRightBody" style={{ position: "relative" }}>
      <div className="review-area-main">
        {trainerList && trainerList.length > 0 ? (
          trainerList.map((item, index) => {
            return (
              <div className="trainer-rate marbt00123 trainer-rate0012">
                <div className="rate-name-img rate-name-img001">
                  <img
                    src={
                      item.profile_picture !== null
                        ? USER_IMAGE + item.profile_picture
                        : process.env.PUBLIC_URL + "/images/pro_pick.png"
                    }
                    alt=""
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="rate-name-inr">
                  <h3 className="martop001">
                    {item.first_name + " " + item.last_name}
                  </h3>
                  <h5>
                    Total Reviews:{" "}
                    <span>
                      {item.membership_total_no_of_reviews
                        ? item.membership_total_no_of_reviews
                        : 0}
                    </span>
                  </h5>
                  <div className="slr-rate">
                    <h5>Average Review:</h5>
                    <ul>
                      <li>
                        <Rating
                          rating={parseInt(
                            item.membership_avg_review
                              ? item.membership_avg_review
                              : 0
                          )}
                        />
                      </li>
                      <p style={{display:"contents"}}>({item.membership_avg_review
                              ? item.membership_avg_review
                              : 0})</p>
                    </ul>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn trnr-mr-cmnt"
                  data-toggle="modal"
                  data-target="#exampleModalCenter"
                  onClick={() => moreReview(item.id)}
                >
                  View Ratings
                </button>
              </div>
            );
          })
        ) : (
          <>
            {!loader ? (
              <div className="n-resul">
                <img
                  src={process.env.PUBLIC_URL + "/images/no-result.png"}
                  alt=""
                />
                <p>No reviews found!</p>
              </div>
            ) : null}
          </>
        )}
      </div>
      {page_count > 1 ? (
        <div className="pag_red page_red001">
          <div className="paginationsec">
            <ReactPaginate
              activeClassName="actv"
              activeLinkClassName="actv"
              initialPage={0}
              breakLabel="....."
              onPageChange={(e) => handlePageClick(e)}
              pageCount={page_count}
              previousLabel={
                <>
                  <img
                    src={process.env.PUBLIC_URL + "/images/pagleft.png"}
                    alt=""
                    className="dpb"
                  />
                  <img
                    src={process.env.PUBLIC_URL + "/images/paglefthov.png"}
                    alt=""
                    className="dpn"
                  />
                </>
              }
              nextLabel={
                <>
                  <img
                    src={process.env.PUBLIC_URL + "/images/pagright.png"}
                    alt=""
                    className="dpb"
                  />
                  <img
                    src={process.env.PUBLIC_URL + "/images/pagrightho.png"}
                    alt=""
                    className="dpn"
                  />
                </>
              }
              marginPagesDisplayed={1}
              renderOnZeroPageCount={null}
            />
          </div>
        </div>
      ) : null}
      <div
        className="modal fade modal-rate"
        id="exampleModalCenter"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content responsive_content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">
                <div className="row">
                  <div className="col-12">
                    {tDetail ? (
                      <div className="trainer-rate modal-trnr">
                        <div className="rate-name-img">
                          <img
                            src={
                              tDetail.profile_picture !== null
                                ? USER_IMAGE + tDetail.profile_picture
                                : process.env.PUBLIC_URL +
                                  "/images/pro_pick.png"
                            }
                            alt=""
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div className="rate-name-inr">
                          <h3>
                            {tDetail.first_name + " " + tDetail.last_name}
                          </h3>
                          <h5>
                            Total Reviews:{" "}
                            <span>
                              {tDetail.membership_total_no_of_reviews
                                ? tDetail.membership_total_no_of_reviews
                                : 0}
                            </span>
                          </h5>
                          <div className="slr-rate">
                            <h5>Average Review:</h5>
                            <ul>
                              <li>
                                <Rating
                                  rating={parseInt(
                                    tDetail.membership_avg_review
                                      ? tDetail.membership_tavg_review
                                      : 0
                                  )}
                                />
                              </li>
                              <p style={{display:"contents"}}>({tDetail.membership_avg_review
                              ? tDetail.membership_avg_review
                              : 0})</p>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </h5>
              <button
                type="button"
                className="close rate-close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body modal-rate-body">
              {tReviews && tReviews.length > 0 ? (
                tReviews.map((item, index) => {
                  return (
                    <div
                      className={
                        tReviews.length > 1
                          ? "rvw-crd mar-bt"
                          : "rvw-crd mar-bt mar-bt123"
                      }
                      key={index}
                    >
                      <div className="rvw-top ma-001">
                        <div className="review-area">
                          <div className="rvw-img">
                            <img
                              src={
                                item.get_user_details &&
                                item.get_user_details.profile_picture
                                  ? USER_IMAGE +
                                    item.get_user_details.profile_picture
                                  : process.env.PUBLIC_URL +
                                    "/images/pro_pick.png"
                              }
                              alt=""
                              className="img-fluid"
                            />
                          </div>
                          <div className="rvw-intro">
                            <h5>
                              {item.get_user_details
                                ? item.get_user_details.first_name +
                                  " " +
                                  item.get_user_details.last_name
                                : null}
                            </h5>
                            <ul>
                              <li>
                                <Rating rating={parseInt(item.ratings)} />
                              </li>
                              <p style={{display:"contents"}}>({item.ratings})</p>
                            </ul>
                          </div>
                        </div>
                        <h6>
                          <i className="fa fa-clock-o" aria-hidden="true" />
                          {dateFormat(
                            item.created_at,
                            "dddd, mmmm dS, yyyy, h:MM:ss TT"
                          )}
                        </h6>
                      </div>
                      {item.reviews !== null ? (
                        <div className="rvw-btm">
                          <ReactReadMoreReadLess
                          charLimit={150}
                          readMoreText={"Read more +"}
                          readLessText={"Read less -"}
                          ellipsis={"..."}
                          readMoreClassName={
                            "react-read-more-read-less react-read-more-read-less-more col-green"
                          }
                          readLessClassName={
                            "react-read-more-read-less react-read-more-read-less-less col-green"
                          }
                        >{item.reviews ? getText(item.reviews) : ""}</ReactReadMoreReadLess>
                        </div>
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <>
                  {!loader ? (
                    <p className="n-r-f001">No reviews found!</p>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainerReview;
