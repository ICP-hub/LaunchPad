import React from 'react'
import RectangleVideo from "../../../../assets/images/RectangleVideo.png"
import ExcludeButton from "../../../../assets/images/ExcludeButton.png"

const ProjectTokenAbout = ({presaleData}) => {
  return (
    <div className=" flex gap-5 bg-[#FFFFFF1A] sm:bg-transparent  p-2 rounded-2xl md:text-[13px]  xl:text-[17px] flex-col">
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
  )
}
export default ProjectTokenAbout