import React from 'react';
import { usePortfolio } from '../context/PortfolioContext.jsx';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Skills from '../components/Skills.jsx';
import Projects from '../components/Projects.jsx';
import Services from '../components/Services.jsx';
import Experience from '../components/Experience.jsx';
import Contact from '../components/Contact.jsx';
import Footer from '../components/Footer.jsx';

export default function PortfolioPage() {
  const { siteSettings } = usePortfolio();

  const showHero = siteSettings ? siteSettings.show_hero_section !== false : true;
  const showAbout = siteSettings ? siteSettings.show_about_section !== false : true;
  const showSkills = siteSettings ? siteSettings.show_skills_section !== false : true;
  const showProjects = siteSettings ? siteSettings.show_projects_section !== false : true;
  const showServices = siteSettings ? siteSettings.show_services_section !== false : true;
  const showExperience = siteSettings ? siteSettings.show_experience_section !== false : true;
  const showContact = siteSettings ? siteSettings.show_contact_section !== false : true;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />
      {showHero && <Hero />}
      {showAbout && <About />}
      {showSkills && <Skills />}
      {showProjects && <Projects />}
      {showServices && <Services />}
      {showExperience && <Experience />}
      {showContact && <Contact />}
      <Footer />
    </div>
  );
}
