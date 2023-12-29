import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_LOADER} from "../../store/action/actionTypes";
import axios from "../../shared/axios";
import dateFormat from "dateformat";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

function PaymentList({ value }) {
  const dispatch = useDispatch();
  const initialState = {
    page_count: 0,
    per_page: 0,
    total: 0,
    payment: [],
    Value: value,
  };
  const [state, setState] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    getData();
  }, [value]);

  const getData = () => {
    let url = "my-given-order-product-payments";
    if (value === "Club") {
      url = "my-membership-related-payments";
    }
    if (value === "Trainer") {
      url = "my-membership-to-individual-trainer-related-payments";
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
        if (resp.data.result && resp.data.result.order) {
          setState((prevState) => {
            return {
              ...prevState,
              payment: resp.data.result.order,
              page_count: resp.data.result.page_count,
              per_page: resp.data.result.per_page,
              total: resp.data.result.total,
            };
          });
        }
        if (resp.data.result && resp.data.result.MemberToSubscription) {
          setState((prevState) => {
            return {
              ...prevState,
              payment: resp.data.result.MemberToSubscription,
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
    setOffset(offset, () => {
      getData();
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const { payment, page_count } = state;
  return (
    <div className="dasbordRightBody" style={{ position: "relative" }}>
      <div className="review-area-main">
        {payment && payment.length > 0 ? (
          <div className="table_01 table">
            <div className="row amnt-tble">
              {value === "Product" ? (
                <div className="cel_area amunt cess nw1 ">Order Id</div>
              ) : null}
              <div className="cel_area amunt cess nw2 ">Payment Date</div>
              {value !== "Product" ? (
                <div className="cel_area amunt cess nw3 ">Payment To</div>
              ) : null}
              <div className="cel_area amunt cess nw5 ">Amount</div>
              <div className="cel_area amunt cess nw36">&nbsp;</div>
            </div>
            {payment.map((item, index) => {
              return (
                <div className="row small_screen2" key={index}>
                  {value === "Product" ? (
                    <div className="cel_area amunt-detail cess ">
                      <span className="hide_big">Order Id</span>
                      <span className="sm_size">{item.order_number}</span>
                    </div>
                  ) : null}
                  <div className="cel_area amunt-detail cess ">
                    <span className="hide_big">Payment Date</span>
                    <span className="sm_size">
                      {dateFormat(item.created_at, "dd-mm-yyyy")}
                    </span>
                  </div>
                  {value !== "Product" ? (
                    <div className="cel_area amunt-detail cess ">
                      <span className="hide_big">Payment To</span>
                      <span className="sm_size">
                        {item.get_user
                          ? value === "Club" && item.get_user.club_name
                            ? item.get_user.club_name
                            : item.get_user.first_name +
                              " " +
                              item.get_user.last_name
                          : null}
                      </span>
                    </div>
                  ) : null}
                  <div className="cel_area amunt-detail cess">
                    <span className="hide_big">Amount</span>
                    <span className="sm_size">
                      <img
                        src={process.env.PUBLIC_URL + "/images/rupe.png"}
                        alt=""
                      />
                      {value !== "Product" && item.get_payment
                        ? item.get_payment.amount
                        : item.payable_amount}
                    </span>
                  </div>
                  <div className="cel_area amunt-detail cess exs-det">
                    <span className="hide_big">Action</span>
                    <ul>
                      <li>
                        <Link to={value==="Club"?`/view-club-payment-details/${item.id}`:value==="Trainer"?`view-trainer-payment-details/${item.id}`:value==="Product"?`view-product-payment-details/${item.id}`:"#"}>
                          <img
                            src={process.env.PUBLIC_URL + "/images/view.png"}
                            alt=""
                            title="View Details"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {!loader ? (
              <div className="n-resul">
                <img
                  src={process.env.PUBLIC_URL + "/images/no-result.png"}
                  alt=""
                />
                <p>No Payment Record found!</p>
              </div>
            ) : null}
          </>
        )}
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
    </div>
  );
}

export default PaymentList;
