import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";
import config from "../../config";

export const initGA = () => {
    ReactGA.initialize(config.GOOGLE_ANALYTICS_ID);
};

export const trackPageView = (path) => {
    ReactGA.send({ hitType: "pageview", page: path });
};

// Send Web Vitals to GA
// reportWebVitals((metric) => {
//     ReactGA.event({
//       category: "Web Vitals",
//       action: metric.name,
//       value: Math.round(metric.value), // Convert float to int
//       nonInteraction: true, // Avoid affecting bounce rate
//     });
//   });


const NavigationTracker = () => {
    const location = useLocation();
    const previousPathname = useRef();
    const isInitialized = useRef(false);

    useEffect(() => {
        // Initialize GA only once
        if (!isInitialized.current) {
            initGA();
            isInitialized.current = true;
        }

        // call the trackPageView only of the path is changed
        if (previousPathname.current !== location.pathname) {
            trackPageView(location.pathname);
            previousPathname.current = location.pathname; // Update stored path
        }
    }, [location.pathname]); // Runs only when pathname changes

    return null; // No UI needed
};

export default NavigationTracker;