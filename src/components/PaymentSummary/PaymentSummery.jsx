import React from 'react'
import { useEffect } from 'react'
import Layout from '../Layout/Layout'
import Titles from "../Titles";
import { Helmet } from "react-helmet";


const PaymentSummery = () => {
    useEffect(() => {
      // document.title = "Maydaan | Payment Summery";
        window.scrollTo(0,0)
    }, [])
  return (
   <>
      <Helmet>
        <title>{Titles?.paymentSummery?.title}</title>
        <meta
            name="description"
            content={Titles?.paymentSummery?.description}
        />
        <meta property="og:title" content={Titles?.paymentSummery?.ogTitle} />
        <meta property="og:description" content={Titles?.paymentSummery?.ogDescription} />
        <meta property="og:image" content={Titles?.paymentSummery?.ogImage} />
        <link rel="canonical" href={Titles?.paymentSummery?.link} />
      </Helmet>
   <Layout>
    <div class="results">
         <div class="container">
            <div class="row align-items-center">
               <div class="col-12">
                  <nav aria-label="breadcrumb" class="bread fllw">
                     <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="#">Home</a></li>
                        <li class="breadcrumb-item bread-arrow"><a href="#">Place Order</a></li>
                        <li class="breadcrumb-item active bread-arrow" aria-current="page">Payment Summery</li>
                     </ol>
                  </nav>
               </div>
            </div>
         </div>
      </div>
      <div class="main-search-area pay-sum pt-4">
         <div class="container">
            <div class="row">
               <div class="col-12">
                  <div class="right-cart pay-sum-crt">
                     <h3>Payment details</h3>
                     <div class="total">
                        <ul>
                           <li><p>Subtotal(5 Items)</p><span><i class="fa fa-inr" aria-hidden="true"></i>2560.00</span></li>
                           <li><p>Discount</p><span><i class="fa fa-inr" aria-hidden="true"></i>400.00</span></li>
                        </ul>
                     </div>
                     <div class="pay pay-sm-ttl d-flex justify-content-between">
                        <p>Total payable amount:</p>
                        <p class="mnt-002 text-white"><i class="fa fa-inr" aria-hidden="true"></i>2160.00</p>
                     </div>
                     
                     <div class="pay-btn">
                        <div class="pay-inpt">
                           <div class="row">
                              <div class="col-md-7 col-12">
                                 <div class="form-group log-group pay-frm">                                 
                                    <input type="text" value="" id="" class="form-control" placeholder="" required />
                                    <label for="" class="log-label">Card Number</label>
                                 </div>
                              </div>
                              <div class="col-md-3 col-6">
                                 <div class="form-group log-group pay-frm">
                                    <input type="text" value="" id="" class="form-control" placeholder="" required />
                                    <label for="" class="log-label">Expiry Date</label>
                                 </div>
                              </div>
                              <div class="col-md-2 col-6">
                                 <div class="form-group log-group pay-frm">
                                    <input type="text" value="" id="" class="form-control" placeholder="" required />
                                    <label for="" class="log-label">CVV</label>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <ul>
                           <li class="shp"><a href="#">Pay</a></li>
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </Layout>
   </>
  )
}

export default PaymentSummery