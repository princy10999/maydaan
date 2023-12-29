import { BASE_URL } from "../store/action/actionTypes";
import pro_pick from "../assets/images/pro_pick.png"

export const getFileImage=(file)=>{
    let ext = file.split('.').pop();
    let filePrev = pro_pick;
    let img = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp', 'bmp', 'ico', 'cur', 'tif','tiff'];
    if (img.includes(ext.toLowerCase())) {
        filePrev = BASE_URL+"/" + file;
    } 
    return filePrev;
}

export function getText(html){
    var divContainer= document.createElement("div");
    divContainer.innerHTML = html;
    return divContainer.textContent || divContainer.innerText || "";
}
export function getText2(html){
    var divContainer=<div dangerouslySetInnerHTML={{ __html: html }} />  
    return divContainer
}