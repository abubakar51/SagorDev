import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [siteSettings, setSiteSettings] = useState(null);
  const [aboutInfo, setAboutInfo] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dbStatus, setDbStatus] = useState({ connected: false, host: '' });
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [sRes, aRes, skRes, pRes, svRes, eRes, dbRes] = await Promise.all([
        fetch('/api/site-settings').then(r => r.json()),
        fetch('/api/about').then(r => r.json()),
        fetch('/api/skills').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/experiences').then(r => r.json()),
        fetch('/api/db-status').then(r => r.json())
      ]);

      if (sRes.success) setSiteSettings(sRes.data);
      if (aRes.success) setAboutInfo(aRes.data);
      if (skRes.success) setSkills(skRes.data);
      if (pRes.success) setProjects(pRes.data);
      if (svRes.success) setServices(svRes.data);
      if (eRes.success) setExperiences(eRes.data);
      if (dbRes.success) setDbStatus(dbRes);
    } catch (err) {
      console.error("Error fetching portfolio data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/contact', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) setMessages(data.data);
    } catch (e) {
      console.error("Error fetching messages:", e);
    }
  };

  useEffect(() => {
    fetchAllData();
    fetchMessages();
  }, []);

  // Update helper functions
  const updateSiteSettings = async (settings) => {
    const res = await fetch('/api/site-settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(settings),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setSiteSettings(data.data);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const updateAboutInfo = async (about) => {
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(about),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setAboutInfo(data.data);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  // Skills CRUD
  const addSkill = async (skill) => {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(skill),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setSkills(prev => [...prev, data.data]);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const updateSkill = async (id, skill) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(skill),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setSkills(prev => prev.map(s => s.id === id ? data.data : s));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const deleteSkill = async (id) => {
    const res = await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setSkills(prev => prev.filter(s => s.id !== id));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  // Projects CRUD
  const addProject = async (project) => {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(project),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setProjects(prev => [data.data, ...prev]);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const updateProject = async (id, project) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(project),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setProjects(prev => prev.map(p => p.id === id ? data.data : p));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const deleteProject = async (id) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setProjects(prev => prev.filter(p => p.id !== id));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  // Services CRUD
  const addService = async (service) => {
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(service),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setServices(prev => [...prev, data.data]);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const updateService = async (id, service) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(service),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setServices(prev => prev.map(s => s.id === id ? data.data : s));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const deleteService = async (id) => {
    const res = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setServices(prev => prev.filter(s => s.id !== id));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  // Experiences CRUD
  const addExperience = async (exp) => {
    const res = await fetch('/api/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(exp),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setExperiences(prev => [...prev, data.data]);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const updateExperience = async (id, exp) => {
    const res = await fetch(`/api/experiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(exp),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setExperiences(prev => prev.map(e => e.id === id ? data.data : e));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const deleteExperience = async (id) => {
    const res = await fetch(`/api/experiences/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setExperiences(prev => prev.filter(e => e.id !== id));
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  // Messages Actions
  const markMessageRead = async (id) => {
    const res = await fetch(`/api/contact/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
    }
  };

  const deleteMessage = async (id) => {
    const res = await fetch(`/api/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success) {
      setMessages(prev => prev.filter(m => m.id !== id));
    }
  };

  const sendContactMessage = async (contactForm) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm)
    });
    return res.json();
  };

  return (
    <PortfolioContext.Provider value={{
      siteSettings,
      aboutInfo,
      skills,
      projects,
      services,
      experiences,
      messages,
      dbStatus,
      loading,
      fetchAllData,
      fetchMessages,
      updateSiteSettings,
      updateAboutInfo,
      addSkill,
      updateSkill,
      deleteSkill,
      addProject,
      updateProject,
      deleteProject,
      addService,
      updateService,
      deleteService,
      addExperience,
      updateExperience,
      deleteExperience,
      markMessageRead,
      deleteMessage,
      sendContactMessage
    }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
