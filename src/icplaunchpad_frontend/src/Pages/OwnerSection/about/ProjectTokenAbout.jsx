import React, { useState, useEffect } from 'react';
import RectangleVideo from "../../../../assets/images/RectangleVideo.png";
import ExcludeButton from "../../../../assets/images/ExcludeButton.png";

const ProjectTokenAbout = ({ presaleData }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {!isMobile && (
        <div className="flex gap-5 text-[14px] flex-col">
          <div>
            {presaleData?.description}
          </div>
        
          <div className="relative">

            {presaleData ? <video
              src={presaleData?.project_video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg"
            />
              :
              <>
                <img src={RectangleVideo} alt="Video Thumbnail" className="rounded-lg w-full h-auto" draggable="false" />
                <img
                  src={ExcludeButton}
                  alt="Play Button"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer"
                  draggable="false"
                />
              </>
            }
          </div>

        </div>
      )}

      {isMobile && (
        <div className="flex gap-5 p-2 text-[14px] flex-col ">
          <div >
            Lorem ipsum dolor sit amet consectetur. Proin volutpat ornare arcu sit vulputate pellentesque id viverra. Malesuada id tellus et at. Ut morbi faucibus id commodo ac eget. Hendrerit nisl vestibulum lectus varius euismod molestie euismod urna phasellus.
          </div>
          <h3 className=' text-[20px] bg-gradient-to-r  
      from-[#F3B3A7] to-[#CACCF5] text-transparent bg-clip-text '>Lorem ipsum </h3>
          <div>
            Lorem ipsum dolor sit amet consectetur. Proin volutpat ornare arcu sit vulputate pellentesque id viverra. Malesuada id tellus et at. Ut morbi faucibus id commodo ac eget. Hendrerit nisl vestibulum lectus varius euismod molestie euismod urna phasellus. Ante sit proin mi donec elit sodales. Ac sed amet sed vestibulum pulvinar dui faucibus. Nullam et enim odio cursus bibendum amet parturient.
          </div>
          <div className="relative">
          { presaleData ? <video
              src={presaleData?.project_video}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-lg"
            />
              :
              <>
                <img src={RectangleVideo} alt="Video Thumbnail" className="rounded-lg w-full h-auto" draggable="false" />
                <img
                  src={ExcludeButton}
                  alt="Play Button"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer"
                  draggable="false"
                />
              </>
            }
          </div>

        </div>
      )}
    </>
  )
}
export default ProjectTokenAbout