//gallery file for page gallery and modal gallery
import React, { useState} from "react"

//image imports
//note: images are large and loading is choppy as a result
import { Freshman } from "./images";
import { Senior } from "./images"; 
import { Home } from "./images";
import { Sophmore } from "./images";
import { Junior } from "./images";
import { extra } from "./images";

//import mui libraries
import Masonry from '@mui/lab/Masonry';
import { Fade } from "@mui/material";
import Box from '@mui/material/Box';


//art description, var since the infromation changes based on the piece 
var description;

//modal component with parameters
//src: img
//alt: alt text if image doesn't load
//title,size,desc,medium: image information
//onClose,onLeft,onRight: take functions for left arrow, right arrow and close button
export const Modal = ({ src, alt, title, size, desc, medium, onClose ,onLeft,onRight}) => {
  
  //handles empty descriptions and non empty descriptions
  if(desc.length===0 ){
    description= <div></div>;
  }else{
   description= <div >Description: {desc}</div>;
  }
  return (
    <>
    {/*modal box for caroseul gallery viewing*/}
    <div className="modal-box">
        <div  onClick={onClose}>
            <img src={extra[4].img} alt={extra[4].Title} className="close" />
        </div>
        
        {/*div for the items seen in the modal:image, caption and navigation elements(arrows and close button)*/}
        <div className="modalstuff">
            <span className="modal-content" >
                <img src={src} alt={alt} />
            </span>
        <div className="caption">
            <div >Title: {title}</div>
            <div >Size: {size}</div>
            <div >Medium: {medium}</div>
            {description}
        </div>
      
        <div className="left" onClick={onLeft}>
            <img src={extra[2].img} alt={extra[2].Title} className="left"  />
        </div>
        <div className="right" onClick={onRight}>
            <img src={extra[3].img} alt={extra[3].Title}  className="right"/>
        </div>
        </div>
      
    </div>
    </>
  )
}

//gallery function, display images in a masonry format using MUI Masonry
export default function Gallery(props) {
  var year=Freshman;// used to change the array passed to .map() line 133
  var grade; //used for header display(currently not in use)
  var max=0; //max value used to track number of images per gallery and is used to reset the curValue if needed
  
  if(props.num === "1"){
    year=Freshman;
    grade="Freshman";
    max=7;
  }
  if(props.num === "2"){
    year=Sophmore;
    grade="Sophomore";
    max=12;
  }
  if(props.num === "3"){
    year=Junior;
    grade="Junior";
    max=9;
  }
  if(props.num === "4"){
    year=Senior;
    grade="Senior";
    max=9;
  }
  if(props.num === "5"){
    year=Home;
    grade="Home";
    max=2;
  }
  
  //states, open:modal, load: triggers fade, curValue: current value in modal gallery
  const [isOpen, setIsOpen] = useState(false)
  const [load, setLoad] = useState(true)
  const [curValue, setcurValue] = useState(0)

  const showModal = (value) => {
    //takes in index from year.map((item, index) to set curValue
    setIsOpen(true)
    setcurValue(value)
  }
 
  //left carousel navigation
  const leftNav = () => {
    if((curValue-1)<0){
      setcurValue(max)
    }else{
      setcurValue(curValue-1)
    }
  }
  
  //right carousel navigation
  const rightNav = () => {
    if((curValue+1)>max){
      setcurValue(0)
    }else{
    setcurValue(curValue+1)
    }
  }
  return (
    <>
    {/*MUI box to contain MUI masonry gallery*/}
    <Box sx={{ pl: 11, pr: 11, pt: 3, pb: 3 }} id='show' >
      <Masonry columns={{ sm: 1, md: 2, lg:3 , xl: 4 }} spacing={5} sx={{ width: "auto" }} className="galleryImg" >
        {year.map((item, index) => (
            <div key={index}>
            
            {/* fade animation from MUI to fade in images one by one*/}
            {/* fade only works going from home or about page to gallery, does not fade
            on changing galleries:need to fix*/}
            <Fade 
              in={load} 
              timeout={{ enter: 1000, exit: 500 }}
              style={{ transitionDelay: `${index * 150}ms` }}
              key={`asi-${item.key}-${index}`}>
            
            {/*img tag with image formatting*/}
            <img
              onClick={() => showModal(index)}
              src={`${item.img}?w=162&auto=format`}
              srcSet={`${item.img}?w=162&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                cursor: 'pointer',
              }} 
              />
            </Fade>
          </div>
        ))}
      </Masonry>
    </Box>
          
    {/*conditional rendering to display modal gallery*/}
          {isOpen && (
              <Modal
                src={`${year[curValue].img}?w=162&auto=format`}
                srcSet={`${year[curValue].img}}}?w=162&auto=format&dpr=2 2x`}
                alt={year[curValue].Title}
                title={year[curValue].Title}
                size={year[curValue].Size}
                medium={year[curValue].Medium}
                desc={year[curValue].Desc}
                onClose={() => setIsOpen(false)}
                onLeft={()=> leftNav()}
                onRight={()=> rightNav()}
              />
              )}
    </>
  );
}
