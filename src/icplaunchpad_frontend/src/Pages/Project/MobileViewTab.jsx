import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { GoChevronRight } from "react-icons/go";
import { GoChevronDown } from "react-icons/go";
import ProjectTokenAbout from "./about/ProjectTokenAbout";
import AffiliateProgram from "./AffiliateProgram/AffiliateProgram";
import FAQsDiscussion from "./FAQsDiscussion/FAQsDiscussion";
import Pooolinfo from "./pooolinfo/Pooolinfo";
import Token from "./token/Token";
import Tokenomic from "./Tokenomic/Tokenomic";
import "./projectpage.css";

const MobileViewTab = ({ledgerId,poolData,presaleData}) => {
    const [activeTab, setActiveTab] = useState("About");
  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <ProjectTokenAbout presaleData={presaleData} />;
      case "Token":
        return <Token ledgerId={ledgerId} />;
      case "Pool Info":
        return <Pooolinfo presaleData={presaleData} poolData={poolData} />;
      case "Affiliate Program":
        return <AffiliateProgram />;
      case "Tokenomic":
        return <Tokenomic />;
      case "FAQs & Discussion":
        return <FAQsDiscussion />;
      default:
        return <ProjectTokenAbout />;
    }
  };

  const mobileTabs = [
    { name: "About", content: renderContent() },
    { name: "Token", content: renderContent() },
    { name: "Pool Info", content: renderContent() },
    { name: "Affiliate Program", content: renderContent() },
    { name: "Tokenomic", content: renderContent() },
    { name: "FAQs & Discussion", content: renderContent() },
  ];

  return (
    <>
     <div className="rounded-[17.44px]   bg-black">
              <div className="space-y-4">
                {mobileTabs.map((tab) => (
                  <div key={tab.name}>
                    <div
                      className="bg-[#FFFFFF1A] text-white rounded-lg p-4  cursor-pointer flex justify-between"
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
                      classNames="fade"
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