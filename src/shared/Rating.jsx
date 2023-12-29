// import star1 from '../assets/images/star-yel.png'
// import star2 from '../assets/images/star2.png'

export const Rating=(props)=>{
  
    let item=[];
    for (let i = 1; i <6; i++)
        if(props.rating>=i)
            item.push(<span key={i}><img src={process.env.PUBLIC_URL + "/images/star-yel.png"} alt=""/></span>);
        else
            item.push(<span key={i}><img src={process.env.PUBLIC_URL + "/images/star2.png"} alt=""/></span>);
    return (<>{item}</>);

}