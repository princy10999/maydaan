import React, { Component } from 'react'
import Layout from '../Layout/Layout'
import axios from "../../shared/axios";
import swal from "sweetalert";
import {UPDATE_LOADER} from '../../store/action/actionTypes'
import {connect} from 'react-redux'
import Titles from "../Titles";
import { Helmet } from "react-helmet";

class Faq extends Component {
    constructor(props) {
        super(props);
        this.state={
            faqMember:[],
            faqClub:[],
            faqTrainer:[],
            type:""
        }
    }
    componentDidMount() {
        // document.title = "Maydaan | FAQ";
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.props.onUpdateLoader(true);
        axios.post('show-faq-list', { "params": { "type": "M" } }).then(res => {
          // console.log("faq",res);
            this.props.onUpdateLoader(false);
            if (res.data.error) {
                if (res.data.error) {
                    swal(res.data.error.meaning, {
                        icon: "error",
                    });
                }
            } else if (res.data.result && res.data.result.faqs) {
              document.querySelector("#btn1").classList.add("active")
                this.setState({
                    faqMember: res.data.result.faqs,
                    faqClub:[],
                    faqTrainer:[]
                });
            }
        });
      }
      fetchData=()=>{
          let data={
            "params": {
              "type": this.state.type
            }
          }
        this.props.onUpdateLoader(true);
        axios.post('show-faq-list', data).then(res => {
            this.props.onUpdateLoader(false);
            // console.log("faq",res);
            if (res.data.error) {
                if (res.data.error) {
                    swal(res.data.error.meaning, {
                        icon: "error",
                    });
                }
            } else if (res.data.result && res.data.result.faqs && res.data.result.faqs[0].type==="C") {
              document.querySelector("#btn2").classList.add("active") 
              document.querySelector("#btn1").classList.remove("active")
              document.querySelector("#btn3").classList.remove("active")
              this.setState({
                    faqClub: res.data.result.faqs,
                    faqMember:[],
                    faqTrainer:[]
                });
            }else if(res.data.result && res.data.result.faqs && res.data.result.faqs[0].type==="T") {
              document.querySelector("#btn3").classList.add("active") 
              document.querySelector("#btn1").classList.remove("active")
              document.querySelector("#btn2").classList.remove("active")
              this.setState({
                    faqTrainer: res.data.result.faqs,
                    faqMember:[],
                    faqClub:[]
                });
            }else if(res.data.result && res.data.result.faqs && res.data.result.faqs[0].type==="M") {
              document.querySelector("#btn1").classList.add("active") 
              document.querySelector("#btn2").classList.remove("active")
              document.querySelector("#btn3").classList.remove("active")
              this.setState({
                faqMember: res.data.result.faqs,
                faqClub:[],
                faqTrainer:[]
            });
          }
        });
    }
  render() {
    const {faqMember,faqClub,faqTrainer}=this.state;

    return (
    <>
        <Helmet>
      <title>{Titles?.faq?.title}</title>
      <meta
          name="description"
          content={Titles?.faq?.description}
      />
      <meta property="og:title" content={Titles?.faq?.ogTitle} />
      <meta property="og:description" content={Titles?.faq?.ogDescription} />
      <meta property="og:image" content={Titles?.faq?.ogImage} />
      <link rel="canonical" href={Titles?.faq?.link} />
    </Helmet>
      <Layout>
        <div className="back-col-main">
          <div className="mai-abt">
        <div className="container">
          <div className="cnt-heading faq">
            <h3>Frequently Asked Questions</h3>
            <p>Here are some of the basic Frequently Asked Questions</p>
          </div>
          <div className="tab">
            <button className="tablinks" id="btn1" onClick={()=>this.setState({type:"M"},
            () => this.fetchData())}>For Member</button>
            <button className="tablinks" id="btn2" onClick={()=>this.setState({type:"C"},
            () => this.fetchData())}>For Club</button>
            <button className="tablinks" id="btn3" onClick={()=>this.setState({type:"T"},
            () => this.fetchData())}>For Trainer</button>
          </div>
          {/* Tab content */}
          
          {faqMember && faqMember.length>0?
           <>
            {faqMember.map((item,index)=>{ 
                return(
              <div className="accordion_container" key={item.id}>
                <div className="accordion_head" data-id={index+1} ><p>{item.question}</p><span className={`plusminus plusminus${index+1}`}>+</span></div>
                <div className={`accordion_body aa${index+1}`} style={{display: "none"}} >
                  <p>{item.answer}
                  </p>
                </div>
              </div> )})}     
              </>:null}
        
          {faqClub && faqClub.length>0?
           <>
            {faqClub.map((item,index)=>{ 
                return(
              <div className="accordion_container" key={item.id}>
                <div className="accordion_head" data-id={index+1}><p>{item.question}</p><span className={`plusminus plusminus${index+1}`}>+</span></div>
                <div className={`accordion_body aa${index+1}`} style={{display: "none"}} >
                  <p>{item.answer}
                  </p>
                </div>
              </div> )})}     
              </>:null}
          {faqTrainer && faqTrainer.length>0?
           <>
            {faqTrainer.map((item,index)=>{ 
                return(
              <div className="accordion_container" key={item.id}>
                <div className="accordion_head" data-id={index+1}><p>{item.question}</p><span className={`plusminus plusminus${index+1}`}>+</span></div>
                <div className={`accordion_body aa${index+1}`} style={{display: "none"}} >
                  <p>{item.answer}
                  </p>
                </div>
              </div> )})}     
              </>:null}
     
        
       
        </div>
      </div>
      </div>
      </Layout>
    </>
    )
  }
}
const mapDispatchToProps = dispatch => {
    return {
        onUpdateLoader: (cnt) => dispatch({ type: UPDATE_LOADER, value: cnt }),
    }
}
export default connect(null, mapDispatchToProps)(Faq);
