import Layout from "./Layout.jsx";

import Home from "./Home";

import NapzTerminal from "./NapzTerminal";

import NapzImageGen from "./NapzImageGen";

import Pricing from "./Pricing";

import Community from "./Community";

import Roadmaps from "./Roadmaps";

import Settings from "./Settings";

import Profile from "./Profile";

import Discover from "./Discover";

import NapzVideoGen from "./NapzVideoGen";

import Contact from "./Contact";

import TestTerminal from "./TestTerminal";

import APIMarketplace from "./APIMarketplace";

import WebsiteBuilder from "./WebsiteBuilder";

import MyCreations from "./MyCreations";

import Backups from "./Backups";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    NapzTerminal: NapzTerminal,
    
    NapzImageGen: NapzImageGen,
    
    Pricing: Pricing,
    
    Community: Community,
    
    Roadmaps: Roadmaps,
    
    Settings: Settings,
    
    Profile: Profile,
    
    Discover: Discover,
    
    NapzVideoGen: NapzVideoGen,
    
    Contact: Contact,
    
    TestTerminal: TestTerminal,
    
    APIMarketplace: APIMarketplace,
    
    WebsiteBuilder: WebsiteBuilder,
    
    MyCreations: MyCreations,
    
    Backups: Backups,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/NapzTerminal" element={<NapzTerminal />} />
                
                <Route path="/NapzImageGen" element={<NapzImageGen />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/Community" element={<Community />} />
                
                <Route path="/Roadmaps" element={<Roadmaps />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/Discover" element={<Discover />} />
                
                <Route path="/NapzVideoGen" element={<NapzVideoGen />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/TestTerminal" element={<TestTerminal />} />
                
                <Route path="/APIMarketplace" element={<APIMarketplace />} />
                
                <Route path="/WebsiteBuilder" element={<WebsiteBuilder />} />
                
                <Route path="/MyCreations" element={<MyCreations />} />
                
                <Route path="/Backups" element={<Backups />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}