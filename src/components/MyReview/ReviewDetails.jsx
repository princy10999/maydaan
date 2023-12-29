import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_LOADER, USER_IMAGE } from "../../store/action/actionTypes";
import axios from "../../shared/axios";
import { Rating } from "../../shared/Rating";
import ReactReadMoreReadLess from "react-read-more-read-less";
import { getText } from "../../shared/common";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";

function ReviewDetails({ value }) {
  const dispatch = useDispatch();
  const initialState = {
    page_count: 0,
    per_page: 0,
    total: 0,
    review: [],
    user: [],
    Value: value,
  };
  const [state, setState] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getData();
  }, [value]);
  const getData = () => {
    let url = "my-received-product-reviews";
    if (value === "Club") {
      url = "my-received-user-reviews";
    }
    if (value === "ClubP") {
      url = "my-given-user-reviews";
    }
    if (value === "ProductP") {
      url = "my-given-product-reviews";
    }
    if (value === "TrainerP") {
      url = "my-list-of-trainer-review";
    }
    dispatch({ type: UPDATE_LOADER, value: true });
    setLoader(true);
    axios
      .post(url, {
        params: {
          offset: offset,
        },
      })
      .then((resp) => {
        // console.log("Data", resp);
        dispatch({ type: UPDATE_LOADER, value: false });
        setLoader(false);
        if (
          resp.data.result &&
          resp.data.result.reviews
        ) {
          setState((prevState) => {
            return {
              ...prevState,
              review: resp.data.result.reviews,
              page_count: resp.data.result.page_count,
              per_page: resp.data.result.per_page,
              total: resp.data.result.total,
            };
          });
        }
      if(resp.data.result && resp.data.result.user){
        setState((prevState)=>{
          return{
            ...prevState,
            user: resp.data.result.user,
            page_count: resp.data.result.page_count,
            per_page: resp.data.result.per_page,
            total: resp.data.result.total,
          }
        })
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
  const { review, user, page_count } = state;
  return (
    <div className="dasbordRightBody" style={{ position: "relative" }}>
      {value === "Product" || value==="Club"?<span className="line-full" />:null}
      <div className="row">
      {value === "Product" || value==="Club"?
        <div className="col-12">
          <div className="ovrll over">
            <h5>Over all Rating</h5>
            <div className="slr-rate">
              <ul>
                <Rating
                  rating={parseInt(
                    (value === "Club"||value === "ClubP") && user
                      ? user.membership_avg_review
                      : (value === "Product"||value === "ProductP") && user
                      ? user.avg_review
                      : 0
                  )}
                />
                <p>
                  {(value === "Club"||value === "ClubP") && user
                    ? user.membership_avg_review
                    : (value === "Product"||value === "ProductP") && user
                    ? user.avg_review
                    : 0}
                  (
                  {(value === "Club"||value === "ClubP") && user
                    ? user.membership_total_no_of_reviews
                    : (value === "Product"||value === "ProductP") && user
                    ? user.total_no_of_reviews
                    : 0}{" "}
                  Reviews)
                </p>
              </ul>
            </div>
          </div>
        </div>:null}
      </div>
      <div className="review-area-main">
        <div className="row">
          {review && review.length > 0 ? (
            review.map((item, index) => {
              return (
                <div className="col-12" key={"reviewfirst" + index}>
                  <div className="rvw-crd mar-bt marbt001">
                    <div className="rvw-top ma-001">
                      <div className="review-area">
                        <div className="rvw-img">
                          <img
                            style={{ height: "100%" }}
                            src={
                              value === "Product" || value==="Club"?
                              item.get_user_details &&
                              item.get_user_details.profile_picture
                                ? USER_IMAGE +
                                  item.get_user_details.profile_picture
                                : process.env.PUBLIC_URL +
                                  "/images/pro_pick.png"
                              :
                              item.get_for_user_details &&
                              item.get_for_user_details.profile_picture
                                ? USER_IMAGE +
                                  item.get_for_user_details.profile_picture
                                : process.env.PUBLIC_URL +
                                  "/images/pro_pick.png"
                            }
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                        <div className="rvw-intro">
                          <h5>{value === "Product" || value==="Club"?"By : ":"To : "}
                            { value === "Product" || value==="Club"?
                              item.get_user_details
                              ? item.get_user_details.first_name +
                                " " +
                                item.get_user_details.last_name
                              : null
                            :
                            item.get_for_user_details
                              ? item.get_for_user_details.first_name +
                                " " +
                                item.get_for_user_details.last_name
                              : null
                            }
                          </h5>
                          {item.get_for_user_details &&item.get_for_user_details.club_id!=="0"?
                          <h5 style={{fontSize:"16px"}}>{item.get_for_user_details && item.get_for_user_details.club_name
                            ? item.get_for_user_details.club_name
                            : null}</h5>:null}
                          <ul>
                            <Rating rating={parseInt(item.ratings)} />
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
                      <div className="rvw-btm11">
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
                        >
                          {item.reviews ? getText(item.reviews) : ""}
                        </ReactReadMoreReadLess>
                      </div>
                    ) : null}
                  </div>
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
    </div>
  );
}

export default ReviewDetails;
