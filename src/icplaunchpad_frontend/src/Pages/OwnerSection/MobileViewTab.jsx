import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import ProjectTokenAbout from "./about/ProjectTokenAbout";
import PreviousSale from "./PreviousSale/PreviousSale.jsx";
import FAQsDiscussion from "./FAQsDiscussion/FaqDiscussionTab.jsx";
import Pooolinfo from "./pooolinfo/Pooolinfo";
import Token from "./token/Token";
import "./tokenpage.css";

const MobileViewTab = ({actor , poolData, presaleData}) => {
    const [activeTab, setActiveTab] = useState("About");
  const renderContent = () => {
    switch (activeTab) {
      case "ABOUT":
        return <ProjectTokenAbout presaleData={presaleData} />;
      case "TOKEN":
        return <Token ledger_canister_id ={poolData?.canister_id} actor={actor}/>;
      case "POOL INFO":
        return <Pooolinfo poolData={poolData}/>;
      case "FAQs & DISCUSSION":
        return <FAQsDiscussion />;
      case "PREVIOUS SALE":
        return <PreviousSale/>;
      default:
        return <ProjectTokenAbout />;
    }
  };

  const mobileTabs = [
    { name: "ABOUT", content: renderContent() },
    { name: "TOKEN", content: renderContent() },
    { name: "POOL INFO", content: renderContent() },
    { name: "FAQs & DISCUSSION", content: renderContent() },
    { name: "PREVIOUS SALE", content: renderContent() },
  ];

  return (
    <>
     <div className="rounded-[17.44px] p-1 xxs1:p-4 bg-black">
              <div className="space-y-4 ">
                {mobileTabs.map((tab) => (
                  <div key={tab.name} className="bg-[#FFFFFF1A] rounded-2xl">
                    <div
                      className=" rounded-lg p-4  my-4 flex justify-between  "
                      onClick={() => setActiveTab(tab.name)}
                    >
                      <div>{tab.name}</div>
                      <div>
                        {activeTab === tab.name ? (
                          <GoChevronDown className="w-7 h-7" />
                        ) : (
                          <GoChevronRight className="w-7 h-7" />
                        )}
                      </div>
                    </div>
                    <CSSTransition
                      in={activeTab === tab.name}
                      timeout={300}
                      classNames="fade "
                      unmountOnExit
                    >
                      <div className="mt-5">{tab.content}</div>
                    </CSSTransition>
                  </div>
                ))}
              </div>
            </div>
    </>
  )
}

export default MobileViewTab