import React,{useState,useEffect} from 'react'
import RectangleVideo from "../../../../assets/images/RectangleVideo.png"
import ExcludeButton from "../../../../assets/images/ExcludeButton.png"

const ProjectTokenAbout = () => {
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
    {!isMobile &&(
    <div className="flex gap-5 text-[14px] flex-col ">
      <div >
        Lorem ipsum dolor sit amet consectetur. Proin volutpat ornare arcu sit vulputate pellentesque id viverra. Malesuada id tellus et at. Ut morbi faucibus id commodo ac eget. Hendrerit nisl vestibulum lectus varius euismod molestie euismod urna phasellus. Ante sit proin mi donec elit sodales. Ac sed amet sed vestibulum pulvinar dui faucibus. Nullam et enim odio cursus bibendum amet parturient. Tempus habitasse proin elementum faucibus semper dignissim risus. Sit consequat condimentum parturient accumsan ultrices purus quam est nibh. Porta diam ornare at velit orci maecenas nisl. Maecenas aliquam condimentum at semper urna dis suspendisse dignissim. Proin tincidunt facilisis scelerisque rhoncus congue ipsum nisi. Eget pharetra malesuada eu ipsum. Quis dignissim vestibulum ultrices sed at scelerisque. Feugiat gravida at feugiat sapien. Ac blandit quis adipiscing facilisis id augue fermentum et tristique. Turpis vitae nisl auctor lectus eget praesent. Purus quis arcu fames in viverra. Velit consequat aliquam massa volutpat non vitae blandit. Ut est aenean arcu placerat consequat. Scelerisque pellentesque risus sit vivamus pellentesque volutpat. Suspendisse quis sit dictum cras sed ullamcorper. Diam rhoncus elit dolor donec ut elementum nulla velit turpis. Pretium a enim ut nibh.
      </div>
      <h3 className=' text-[20px]  '>Lorem ipsum </h3>
      <div>
        Lorem ipsum dolor sit amet consectetur. Proin volutpat ornare arcu sit vulputate pellentesque id viverra. Malesuada id tellus et at. Ut morbi faucibus id commodo ac eget. Hendrerit nisl vestibulum lectus varius euismod molestie euismod urna phasellus. Ante sit proin mi donec elit sodales. Ac sed amet sed vestibulum pulvinar dui faucibus. Nullam et enim odio cursus bibendum amet parturient.
      </div>
      <div className="relative">
        <img src={RectangleVideo} alt="Video Thumbnail" className="rounded-lg w-full h-auto" draggable="false" />
        <img
          src={ExcludeButton}
          alt="Play Button"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer"
          draggable="false"
        />
      </div>

    </div>
    )}

{isMobile &&(
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
        <img src={RectangleVideo} alt="Video Thumbnail" className="rounded-lg w-full h-auto" draggable="false" />
        <img
          src={ExcludeButton}
          alt="Play Button"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 cursor-pointer"
          draggable="false"
        />
      </div>

    </div>
    )}
    </>
  )
}
export default ProjectTokenAbout