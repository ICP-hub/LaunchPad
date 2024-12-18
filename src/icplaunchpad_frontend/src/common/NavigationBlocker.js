import { useEffect, useContext } from "react";
import { Navigate, UNSAFE_NavigationContext as NavigationContext, useNavigate } from "react-router-dom";

export function useBlocker(blocker, when = true) {
  const { navigator } = useContext(NavigationContext);
  const navigate=useNavigate()
  
  useEffect(() => {
    if (!when) return;

    // Save original navigation methods
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    const blockNavigation = (method) => (...args) => {
      const allow = blocker({ action: method === "push" ? "PUSH" : "REPLACE", location: args[0] });
      if (allow) {
        return navigator[method](...args);
      }
    };

    // Override push and replace methods
    navigator.push = blockNavigation("push");
    navigator.replace = blockNavigation("replace");

    // Cleanup on unmount
    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [navigator, blocker, when]);

  useEffect(() => {
    if (!when) return;

// Handle browser's back/forward buttons
const handlePopState = (event) => {
    event.preventDefault();
    const allow = blocker({ action: "POP", location: window.location.pathname });
  
    if (allow) {
      // If navigation is allowed, go back in history
     navigate('/')
    } else {
      // Push state back to prevent navigation
      window.history.pushState(null, null, window.location.pathname);
    }
  };
  
    // Add dummy state to trap back/forward navigation
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [blocker, when]);

  useEffect(() => {
    if (!when) return;

    // Prevent accidental navigation via reload or tab close
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want to leave this page?";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when]);
}
