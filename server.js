import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pg from 'pg';

dotenv.config();

let currentDir = process.cwd();
try {
  if (typeof __dirname !== 'undefined') {
    currentDir = __dirname;
  } else if (typeof import.meta !== 'undefined' && import.meta && import.meta.url) {
    currentDir = path.dirname(fileURLToPath(import.meta.url));
  }
} catch (e) {
  currentDir = process.cwd();
}

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.BETTER_AUTH_SECRET || process.env.JWT_SECRET || 'super_secret_portfolio_key_123';

// CORS & Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: true,
  credentials: true
}));

// PostgreSQL Pool setup supporting Pooler Connections
const { Pool } = pg;

const dbUser = process.env.DB_USER || 'postgres.avmduqbgjfurzzagzhsv';
const dbPass = process.env.DB_PASSWORD || 'SagorMia123@@##';
const dbHost = process.env.DB_HOST || 'aws-0-ap-south-1.pooler.supabase.com';
const dbPort = parseInt(process.env.DB_PORT || '6543', 10);
const dbName = process.env.DB_NAME || 'postgres';

const pool = new Pool({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPass,
  database: dbName,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10
});



// Database Initialization Function - Direct PostgreSQL Schema & Seeding
async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL Database Pooler!');

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT 'Admin',
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        id INT PRIMARY KEY DEFAULT 1,
        website_name VARCHAR(255),
        developer_name VARCHAR(255),
        developer_title VARCHAR(255),
        hero_title TEXT,
        hero_subtitle TEXT,
        primary_cta_text VARCHAR(255),
        primary_cta_link VARCHAR(255),
        secondary_cta_text VARCHAR(255),
        secondary_cta_link VARCHAR(255),
        avatar_url TEXT,
        resume_url TEXT,
        banner_url TEXT,
        header_logo_text VARCHAR(255),
        footer_text TEXT,
        github_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        twitter_url VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        location VARCHAR(255),
        live_site_url TEXT,
        show_hero_section BOOLEAN DEFAULT true,
        show_about_section BOOLEAN DEFAULT true,
        show_skills_section BOOLEAN DEFAULT true,
        show_projects_section BOOLEAN DEFAULT true,
        show_services_section BOOLEAN DEFAULT true,
        show_experience_section BOOLEAN DEFAULT true,
        show_contact_section BOOLEAN DEFAULT true,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Ensure columns exist if table was already created
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS live_site_url TEXT;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_hero_section BOOLEAN DEFAULT true;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_about_section BOOLEAN DEFAULT true;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_skills_section BOOLEAN DEFAULT true;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_projects_section BOOLEAN DEFAULT true;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_services_section BOOLEAN DEFAULT true;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_experience_section BOOLEAN DEFAULT true;
      ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS show_contact_section BOOLEAN DEFAULT true;

      CREATE TABLE IF NOT EXISTS about_info (
        id INT PRIMARY KEY DEFAULT 1,
        title TEXT,
        bio_text TEXT,
        years_experience VARCHAR(50),
        completed_projects VARCHAR(50),
        happy_clients VARCHAR(50),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        proficiency_percent INT DEFAULT 85,
        icon_name VARCHAR(100) DEFAULT 'Code',
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        short_description TEXT,
        full_description TEXT,
        banner_url TEXT,
        github_url VARCHAR(255),
        live_demo_url VARCHAR(255),
        featured BOOLEAN DEFAULT false,
        tags VARCHAR(255),
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon_name VARCHAR(100) DEFAULT 'Code',
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS experiences (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        company_or_institution VARCHAR(255) NOT NULL,
        role_or_degree VARCHAR(255) NOT NULL,
        start_date VARCHAR(100),
        end_date VARCHAR(100),
        location VARCHAR(255),
        description TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@developer.com';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPass, salt);

    const userRes = await client.query('SELECT * FROM admin_users WHERE email = $1', [adminEmail]);
    if (userRes.rows.length === 0) {
      await client.query(
        'INSERT INTO admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
        [adminEmail, hash, 'Developer Admin', 'admin']
      );
      console.log('Seeded initial admin user:', adminEmail);
    }

    // Ensure singleton rows exist for site_settings and about_info
    await client.query('INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING');
    await client.query('INSERT INTO about_info (id) VALUES (1) ON CONFLICT (id) DO NOTHING');

    client.release();
    console.log('Database tables verified successfully!');
  } catch (err) {
    console.error('Error connecting to or initializing PostgreSQL Pooler:', err);
  }
}

initDatabase();

// Auth Middleware
function verifyAdminToken(req, res, next) {
  const token = req.cookies.admin_token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin login required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired session' });
  }
}

// REST API ROUTES - DIRECT POSTGRESQL DRIVEN
// 1. Health & Database Status
app.get('/api/db-status', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      success: true,
      connected: true,
      host: dbHost,
      database: dbName
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      connected: false,
      error: err.message,
      host: dbHost,
      database: dbName
    });
  }
});

// 2. Authentication APIs
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      { email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      token,
      admin: { email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', verifyAdminToken, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('admin_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.put('/api/auth/change-password', verifyAdminToken, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'New password must be at least 6 characters' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE admin_users SET password_hash = $1 WHERE email = $2', [hash, req.admin.email]);
    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/auth/profile', verifyAdminToken, async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  if (!email || !name) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  try {
    const userRes = await pool.query('SELECT * FROM admin_users WHERE email = $1', [req.admin.email]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin user not found' });
    }
    const user = userRes.rows[0];

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, error: 'Current password is required to set a new password' });
      }
      const valid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!valid) {
        return res.status(400).json({ success: false, error: 'Current password is incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long' });
      }
    }

    // Check if new email is taken by another account
    if (email.toLowerCase() !== req.admin.email.toLowerCase()) {
      const existing = await pool.query('SELECT id FROM admin_users WHERE email = $1 AND email != $2', [email, req.admin.email]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ success: false, error: 'Email is already in use by another admin user' });
      }
    }

    let passwordHash = user.password_hash;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(newPassword, salt);
    }

    await pool.query(
      'UPDATE admin_users SET name = $1, email = $2, password_hash = $3 WHERE email = $4',
      [name, email, passwordHash, req.admin.email]
    );

    const token = jwt.sign(
      { email: email, name: name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: 'Admin profile updated successfully!',
      admin: { email: email, name: name, role: user.role }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Site Settings APIs
app.get('/api/site-settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0] });
    }
    return res.status(404).json({ success: false, error: 'Site settings not found' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/site-settings', verifyAdminToken, async (req, res) => {
  const s = req.body;
  try {
    const result = await pool.query(`
      UPDATE site_settings SET
        website_name = COALESCE($1, website_name),
        developer_name = COALESCE($2, developer_name),
        developer_title = COALESCE($3, developer_title),
        hero_title = COALESCE($4, hero_title),
        hero_subtitle = COALESCE($5, hero_subtitle),
        primary_cta_text = COALESCE($6, primary_cta_text),
        primary_cta_link = COALESCE($7, primary_cta_link),
        secondary_cta_text = COALESCE($8, secondary_cta_text),
        secondary_cta_link = COALESCE($9, secondary_cta_link),
        avatar_url = COALESCE($10, avatar_url),
        resume_url = COALESCE($11, resume_url),
        banner_url = COALESCE($12, banner_url),
        header_logo_text = COALESCE($13, header_logo_text),
        footer_text = COALESCE($14, footer_text),
        github_url = COALESCE($15, github_url),
        linkedin_url = COALESCE($16, linkedin_url),
        twitter_url = COALESCE($17, twitter_url),
        email = COALESCE($18, email),
        phone = COALESCE($19, phone),
        location = COALESCE($20, location),
        live_site_url = COALESCE($21, live_site_url),
        show_hero_section = COALESCE($22, show_hero_section),
        show_about_section = COALESCE($23, show_about_section),
        show_skills_section = COALESCE($24, show_skills_section),
        show_projects_section = COALESCE($25, show_projects_section),
        show_services_section = COALESCE($26, show_services_section),
        show_experience_section = COALESCE($27, show_experience_section),
        show_contact_section = COALESCE($28, show_contact_section),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `, [
      s.website_name !== undefined ? s.website_name : null,
      s.developer_name !== undefined ? s.developer_name : null,
      s.developer_title !== undefined ? s.developer_title : null,
      s.hero_title !== undefined ? s.hero_title : null,
      s.hero_subtitle !== undefined ? s.hero_subtitle : null,
      s.primary_cta_text !== undefined ? s.primary_cta_text : null,
      s.primary_cta_link !== undefined ? s.primary_cta_link : null,
      s.secondary_cta_text !== undefined ? s.secondary_cta_text : null,
      s.secondary_cta_link !== undefined ? s.secondary_cta_link : null,
      s.avatar_url !== undefined ? s.avatar_url : null,
      s.resume_url !== undefined ? s.resume_url : null,
      s.banner_url !== undefined ? s.banner_url : null,
      s.header_logo_text !== undefined ? s.header_logo_text : null,
      s.footer_text !== undefined ? s.footer_text : null,
      s.github_url !== undefined ? s.github_url : null,
      s.linkedin_url !== undefined ? s.linkedin_url : null,
      s.twitter_url !== undefined ? s.twitter_url : null,
      s.email !== undefined ? s.email : null,
      s.phone !== undefined ? s.phone : null,
      s.location !== undefined ? s.location : null,
      s.live_site_url !== undefined ? s.live_site_url : null,
      s.show_hero_section !== undefined ? s.show_hero_section : null,
      s.show_about_section !== undefined ? s.show_about_section : null,
      s.show_skills_section !== undefined ? s.show_skills_section : null,
      s.show_projects_section !== undefined ? s.show_projects_section : null,
      s.show_services_section !== undefined ? s.show_services_section : null,
      s.show_experience_section !== undefined ? s.show_experience_section : null,
      s.show_contact_section !== undefined ? s.show_contact_section : null
    ]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. About Info APIs
app.get('/api/about', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM about_info WHERE id = 1');
    if (result.rows.length > 0) {
      return res.json({ success: true, data: result.rows[0] });
    }
    return res.status(404).json({ success: false, error: 'About info not found' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/about', verifyAdminToken, async (req, res) => {
  const a = req.body;
  try {
    const result = await pool.query(`
      UPDATE about_info SET
        title = $1, bio_text = $2, years_experience = $3, completed_projects = $4,
        happy_clients = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `, [a.title, a.bio_text, a.years_experience, a.completed_projects, a.happy_clients]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Skills APIs
app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY order_index ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/skills', verifyAdminToken, async (req, res) => {
  const { category, name, proficiency_percent, icon_name, order_index } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO skills (category, name, proficiency_percent, icon_name, order_index) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [category, name, parseInt(proficiency_percent || 85, 10), icon_name || 'Code', parseInt(order_index || 0, 10)]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/skills/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { category, name, proficiency_percent, icon_name, order_index } = req.body;
  try {
    const result = await pool.query(
      'UPDATE skills SET category=$1, name=$2, proficiency_percent=$3, icon_name=$4, order_index=$5 WHERE id=$6 RETURNING *',
      [category, name, parseInt(proficiency_percent, 10), icon_name, parseInt(order_index, 10), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/skills/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query('DELETE FROM skills WHERE id = $1', [id]);
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Projects APIs
app.get('/api/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY order_index ASC, id DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/projects', verifyAdminToken, async (req, res) => {
  const { name, short_description, full_description, banner_url, github_url, live_demo_url, featured, tags, order_index } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (name, short_description, full_description, banner_url, github_url, live_demo_url, featured, tags, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [name, short_description, full_description, banner_url, github_url, live_demo_url, featured || false, tags, parseInt(order_index || 0, 10)]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/projects/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, short_description, full_description, banner_url, github_url, live_demo_url, featured, tags, order_index } = req.body;
  try {
    const result = await pool.query(
      'UPDATE projects SET name=$1, short_description=$2, full_description=$3, banner_url=$4, github_url=$5, live_demo_url=$6, featured=$7, tags=$8, order_index=$9 WHERE id=$10 RETURNING *',
      [name, short_description, full_description, banner_url, github_url, live_demo_url, featured, tags, parseInt(order_index, 10), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/projects/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Services APIs
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY order_index ASC, id ASC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/services', verifyAdminToken, async (req, res) => {
  const { title, description, icon_name, order_index } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO services (title, description, icon_name, order_index) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, icon_name || 'Code', parseInt(order_index || 0, 10)]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/services/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, description, icon_name, order_index } = req.body;
  try {
    const result = await pool.query(
      'UPDATE services SET title=$1, description=$2, icon_name=$3, order_index=$4 WHERE id=$5 RETURNING *',
      [title, description, icon_name, parseInt(order_index, 10), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/services/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Experience & Education APIs
app.get('/api/experiences', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experiences ORDER BY order_index ASC, id DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/experiences', verifyAdminToken, async (req, res) => {
  const { type, company_or_institution, role_or_degree, start_date, end_date, location, description, order_index } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO experiences (type, company_or_institution, role_or_degree, start_date, end_date, location, description, order_index) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [type || 'work', company_or_institution, role_or_degree, start_date, end_date, location, description, parseInt(order_index || 0, 10)]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/experiences/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { type, company_or_institution, role_or_degree, start_date, end_date, location, description, order_index } = req.body;
  try {
    const result = await pool.query(
      'UPDATE experiences SET type=$1, company_or_institution=$2, role_or_degree=$3, start_date=$4, end_date=$5, location=$6, description=$7, order_index=$8 WHERE id=$9 RETURNING *',
      [type, company_or_institution, role_or_degree, start_date, end_date, location, description, parseInt(order_index, 10), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Experience item not found' });
    }
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/experiences/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query('DELETE FROM experiences WHERE id = $1', [id]);
    res.json({ success: true, message: 'Experience item deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Contact Messages APIs
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email and message are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject || 'General Inquiry', message]
    );
    res.json({ success: true, message: 'Thank you! Your message has been sent successfully.', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/contact', verifyAdminToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_messages ORDER BY id DESC');
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/contact/:id/read', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query('UPDATE contact_messages SET is_read = true WHERE id = $1', [id]);
    res.json({ success: true, message: 'Message marked as read' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/contact/:id', verifyAdminToken, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query('DELETE FROM contact_messages WHERE id = $1', [id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve Vite Assets in Development or Static Dist in Production
async function startServer() {
  const distPath = path.join(process.cwd(), 'dist');
  const isProduction = process.env.NODE_ENV === 'production' || fs.existsSync(distPath);

  if (isProduction) {
    console.log(`Serving static production build from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('Starting Vite development server middleware...');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
