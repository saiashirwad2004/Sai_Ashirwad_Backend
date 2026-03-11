require('dotenv').config();
const mongoose = require('mongoose');

// Models
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');
const Skill = require('./models/Skill');
const Service = require('./models/Service');
const Experience = require('./models/Experience');
const Testimonial = require('./models/Testimonial');
const SiteConfig = require('./models/SiteConfig');

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected!\n');

  // ── SITE CONFIG ──────────────────────────────────────────
  console.log('📝 Seeding site config...');
  await SiteConfig.deleteMany({});
  await SiteConfig.create({
    siteName: 'AnandVerse',
    siteTagline: 'Full Stack Developer & Creative Technologist',
    ownerName: 'Anand',
    ownerTitle: 'Full Stack Developer & UI/UX Designer',
    ownerBio: 'I\'m a passionate full-stack developer with 5+ years of experience building modern, scalable web applications. I specialize in React, Node.js, and cloud technologies. When I\'m not coding, you\'ll find me exploring new technologies, contributing to open source, or creating digital art.',
    email: 'anand@anandverse.com',
    phone: '+91 9876543210',
    location: 'Hyderabad, India',
    socialLinks: {
      github: 'https://github.com/anand',
      linkedin: 'https://linkedin.com/in/anand',
      twitter: 'https://twitter.com/anand',
      instagram: 'https://instagram.com/anand',
      youtube: 'https://youtube.com/@anand',
      website: 'https://anandverse.com',
      dribbble: 'https://dribbble.com/anand',
    },
    heroHeading: "Hi, I'm Anand 👋",
    heroSubtitle: 'I craft pixel-perfect, performant web experiences',
    heroDescription: 'A full-stack developer who loves turning complex problems into simple, beautiful, and intuitive solutions. Specializing in React, Node.js, and modern web technologies.',
    heroCTA: {
      primary: { text: 'View My Work', link: '/projects' },
      secondary: { text: 'Get In Touch', link: '/contact' },
    },
    aboutDescription: 'With a strong foundation in both front-end and back-end technologies, I build end-to-end solutions that make a real impact. I\'m driven by a love for clean code, great design, and the endless possibilities of technology. My approach combines technical expertise with creative thinking to deliver products that users love.',
    stats: [
      { number: '50+', label: 'Projects Completed' },
      { number: '5+', label: 'Years Experience' },
      { number: '30+', label: 'Happy Clients' },
      { number: '15+', label: 'Technologies' },
    ],
    seoTitle: 'AnandVerse — Full Stack Developer Portfolio',
    seoDescription: 'Anand is a full-stack developer specializing in React, Node.js, and modern web technologies. View projects, blog posts, and get in touch.',
    seoKeywords: ['full stack developer', 'react developer', 'node.js developer', 'web developer', 'portfolio', 'UI/UX', 'Hyderabad'],
    footerText: 'Crafted with ❤️ and lots of ☕',
    copyrightName: 'Anand',
  });
  console.log('   ✅ Site config seeded');

  // ── PROJECTS ───────────────────────────────────────────
  console.log('📦 Seeding projects...');
  await Project.deleteMany({});
  await Project.insertMany([
    {
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      description: 'A modern, full-featured e-commerce platform with real-time inventory management, payment processing, and analytics dashboard.',
      longDescription: 'Built with React, Node.js, and MongoDB. Features include Stripe/Razorpay payment integration, real-time order tracking, admin dashboard with sales analytics, and a responsive mobile-first design. Handles 10K+ daily transactions.',
      category: 'web',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
      github: 'https://github.com/anand/ecommerce',
      live: 'https://shop.anandverse.com',
      featured: true,
      published: true,
      order: 1,
    },
    {
      title: 'AI Content Generator',
      slug: 'ai-content-generator',
      description: 'An AI-powered content generation tool using GPT-4 API for creating blog posts, social media content, and marketing copy.',
      longDescription: 'Leverages OpenAI GPT-4 for intelligent content generation. Includes templates for different content types, tone adjustment, SEO optimization, and a rich text editor with export options.',
      category: 'ai',
      tags: ['Next.js', 'OpenAI', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      github: 'https://github.com/anand/ai-content',
      live: 'https://ai.anandverse.com',
      featured: true,
      published: true,
      order: 2,
    },
    {
      title: 'Real-Time Chat App',
      slug: 'real-time-chat-app',
      description: 'A WhatsApp-like real-time messaging application with group chats, file sharing, voice notes, and end-to-end encryption.',
      category: 'mobile',
      tags: ['React Native', 'Socket.io', 'Express', 'MongoDB', 'WebRTC'],
      github: 'https://github.com/anand/chatapp',
      featured: true,
      published: true,
      order: 3,
    },
    {
      title: 'Portfolio Dashboard',
      slug: 'portfolio-dashboard',
      description: 'A minimalist stock portfolio tracker with real-time market data, charts, and automated alerts for price movements.',
      category: 'web',
      tags: ['Vue.js', 'D3.js', 'Python', 'FastAPI', 'WebSocket'],
      github: 'https://github.com/anand/portfolio-dash',
      live: 'https://dash.anandverse.com',
      featured: false,
      published: true,
      order: 4,
    },
    {
      title: 'Smart Home Controller',
      slug: 'smart-home-controller',
      description: 'IoT dashboard to monitor and control smart home devices — lights, thermostat, cameras, and automation routines.',
      category: 'iot',
      tags: ['React', 'MQTT', 'Raspberry Pi', 'Node.js', 'InfluxDB'],
      github: 'https://github.com/anand/smarthome',
      featured: false,
      published: true,
      order: 5,
    },
  ]);
  console.log('   ✅ 5 projects seeded');

  // ── BLOG POSTS ────────────────────────────────────────
  console.log('📝 Seeding blog posts...');
  await BlogPost.deleteMany({});
  await BlogPost.insertMany([
    {
      title: 'Building Scalable APIs with Node.js and Express',
      slug: 'building-scalable-apis-nodejs-express',
      excerpt: 'Learn how to architect and build production-ready RESTful APIs using Node.js, Express, and MongoDB with proper error handling, validation, and security.',
      content: `# Building Scalable APIs with Node.js and Express\n\nBuilding a scalable API is more than just writing endpoints. It requires careful architecture, proper error handling, and security best practices.\n\n## Project Structure\n\nI follow a modular pattern that separates concerns cleanly:\n\n\`\`\`\nsrc/\n├── controllers/    # Business logic\n├── models/         # Database schemas\n├── middleware/     # Auth, validation, errors\n├── routes/         # Route definitions\n├── utils/          # Helper functions\n└── server.js       # Entry point\n\`\`\`\n\n## Key Principles\n\n1. **Separation of Concerns** — Controllers handle logic, models handle data, routes handle HTTP\n2. **Error Handling** — Global error middleware catches everything\n3. **Validation** — Use express-validator for input sanitization\n4. **Security** — Helmet, rate limiting, CORS, JWT authentication\n5. **Performance** — Pagination, indexing, caching with Redis\n\n## Rate Limiting\n\nAlways protect your API from abuse:\n\n\`\`\`javascript\nconst rateLimit = require('express-rate-limit');\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  message: 'Too many requests'\n});\n\`\`\`\n\nBuilding APIs the right way from day one saves countless hours of refactoring later.`,
      tags: ['Node.js', 'Express', 'API', 'Backend', 'MongoDB'],
      category: 'backend',
      author: 'Anand',
      published: true,
      featured: true,
      views: 1247,
    },
    {
      title: 'React Performance Optimization: A Complete Guide',
      slug: 'react-performance-optimization-guide',
      excerpt: 'Master React performance with techniques like memoization, code splitting, virtual scrolling, and profiling tools to build blazing-fast applications.',
      content: `# React Performance Optimization\n\nPerformance is crucial for user experience. Here's a comprehensive guide to making your React apps fly.\n\n## 1. Memoization\n\nUse \`React.memo\`, \`useMemo\`, and \`useCallback\` wisely:\n\n\`\`\`tsx\nconst ExpensiveComponent = React.memo(({ data }) => {\n  const processed = useMemo(() => heavyComputation(data), [data]);\n  return <div>{processed}</div>;\n});\n\`\`\`\n\n## 2. Code Splitting\n\nLazy load routes and heavy components:\n\n\`\`\`tsx\nconst Dashboard = lazy(() => import('./Dashboard'));\n\`\`\`\n\n## 3. Virtual Scrolling\n\nFor long lists, use react-window or react-virtuoso:\n\n\`\`\`tsx\nimport { FixedSizeList } from 'react-window';\n\`\`\`\n\n## 4. State Management\n\n- Lift state up only when necessary\n- Use context for global state, but split contexts\n- Consider Zustand for complex state needs\n\n## 5. Profiling\n\nUse React DevTools Profiler to identify bottlenecks. Focus on components that re-render frequently.\n\nRemember: premature optimization is the root of all evil. Profile first, optimize second.`,
      tags: ['React', 'Performance', 'JavaScript', 'Frontend', 'Optimization'],
      category: 'frontend',
      author: 'Anand',
      published: true,
      featured: true,
      views: 892,
    },
    {
      title: 'Getting Started with Three.js in React',
      slug: 'threejs-in-react',
      excerpt: 'Create stunning 3D experiences in your React app using Three.js and React Three Fiber — from basics to particle systems.',
      content: `# Three.js in React\n\nAdding 3D to your web projects can create memorable user experiences. React Three Fiber makes it easy.\n\n## Setup\n\n\`\`\`bash\nnpm install three @react-three/fiber @react-three/drei\n\`\`\`\n\n## Basic Scene\n\n\`\`\`tsx\nimport { Canvas } from '@react-three/fiber';\n\nfunction Scene() {\n  return (\n    <Canvas>\n      <ambientLight intensity={0.5} />\n      <mesh>\n        <boxGeometry />\n        <meshStandardMaterial color="hotpink" />\n      </mesh>\n    </Canvas>\n  );\n}\n\`\`\`\n\n## Particle Systems\n\nParticle backgrounds create an immersive feel. Use Float32Arrays for performance:\n\n\`\`\`tsx\nconst particles = new Float32Array(count * 3);\nfor (let i = 0; i < count * 3; i++) {\n  particles[i] = (Math.random() - 0.5) * 10;\n}\n\`\`\`\n\nThe possibilities with 3D on the web are endless!`,
      tags: ['Three.js', 'React', '3D', 'WebGL', 'Animation'],
      category: 'frontend',
      author: 'Anand',
      published: true,
      featured: false,
      views: 634,
    },
    {
      title: 'Docker & Kubernetes for Node.js Developers',
      slug: 'docker-kubernetes-nodejs',
      excerpt: 'A practical guide to containerizing Node.js apps with Docker and orchestrating them with Kubernetes for production deployments.',
      content: `# Docker & Kubernetes for Node.js\n\nLearn how to containerize and deploy your Node.js applications at scale.\n\n## The Dockerfile\n\n\`\`\`dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 5000\nCMD ["node", "src/server.js"]\n\`\`\`\n\n## Multi-stage builds reduce image size by 60%+.\n\n## Kubernetes Deployment\n\n\`\`\`yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-server\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: api\n\`\`\`\n\nCombine with HPA for auto-scaling based on CPU/memory usage.\n\nContainer orchestration transforms how we deploy and manage applications.`,
      tags: ['Docker', 'Kubernetes', 'DevOps', 'Node.js', 'Cloud'],
      category: 'devops',
      author: 'Anand',
      published: true,
      featured: false,
      views: 421,
    },
  ]);
  console.log('   ✅ 4 blog posts seeded');

  // ── SKILLS ─────────────────────────────────────────────
  console.log('💡 Seeding skills...');
  await Skill.deleteMany({});
  await Skill.insertMany([
    { name: 'React / Next.js', level: 95, category: 'frontend', order: 1 },
    { name: 'TypeScript', level: 90, category: 'frontend', order: 2 },
    { name: 'Vue.js', level: 75, category: 'frontend', order: 3 },
    { name: 'HTML5 / CSS3', level: 95, category: 'frontend', order: 4 },
    { name: 'Tailwind CSS', level: 90, category: 'frontend', order: 5 },
    { name: 'Three.js / WebGL', level: 70, category: 'frontend', order: 6 },
    { name: 'Node.js / Express', level: 92, category: 'backend', order: 1 },
    { name: 'Python / FastAPI', level: 80, category: 'backend', order: 2 },
    { name: 'GraphQL', level: 75, category: 'backend', order: 3 },
    { name: 'REST API Design', level: 95, category: 'backend', order: 4 },
    { name: 'MongoDB', level: 90, category: 'database', order: 1 },
    { name: 'PostgreSQL', level: 82, category: 'database', order: 2 },
    { name: 'Redis', level: 78, category: 'database', order: 3 },
    { name: 'Firebase', level: 85, category: 'database', order: 4 },
    { name: 'Git / GitHub', level: 95, category: 'tools', order: 1 },
    { name: 'Docker', level: 80, category: 'tools', order: 2 },
    { name: 'AWS / GCP', level: 75, category: 'tools', order: 3 },
    { name: 'Figma', level: 82, category: 'tools', order: 4 },
    { name: 'CI/CD Pipelines', level: 78, category: 'tools', order: 5 },
  ]);
  console.log('   ✅ 19 skills seeded');

  // ── SERVICES ──────────────────────────────────────────
  console.log('🛠️  Seeding services...');
  await Service.deleteMany({});
  await Service.insertMany([
    {
      title: 'Full Stack Web Development',
      description: 'End-to-end web application development using modern technologies. From concept to deployment, I build scalable, performant solutions.',
      icon: 'Code2',
      category: 'development',
      features: ['React / Next.js Frontend', 'Node.js / Express Backend', 'Database Design & Optimization', 'API Development (REST & GraphQL)', 'Cloud Deployment (AWS, Vercel)'],
      isActive: true, order: 1,
    },
    {
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces designed with users in mind. From wireframes to pixel-perfect designs that delight users.',
      icon: 'Palette',
      category: 'design',
      features: ['User Research & Personas', 'Wireframing & Prototyping', 'Visual Design Systems', 'Responsive Design', 'Figma & Adobe XD'],
      isActive: true, order: 2,
    },
    {
      title: 'Mobile App Development',
      description: 'Cross-platform mobile apps using React Native. Native-like performance with a single codebase for iOS and Android.',
      icon: 'Smartphone',
      category: 'development',
      features: ['React Native Development', 'iOS & Android', 'Push Notifications', 'Offline Support', 'App Store Optimization'],
      isActive: true, order: 3,
    },
    {
      title: 'Video Production & Editing',
      description: 'Professional video content creation for social media, commercials, and brand storytelling.',
      icon: 'Video',
      category: 'social media',
      features: ['Instagram Reels', 'YouTube Shorts', 'TikTok Content', 'Commercial Ads', 'Travel & Vlog Editing'],
      isActive: true, order: 4,
    },
    {
      title: 'DevOps & Cloud',
      description: 'Streamline your development pipeline with CI/CD, containerization, and cloud infrastructure management.',
      icon: 'Cloud',
      category: 'infrastructure',
      features: ['Docker & Kubernetes', 'CI/CD Pipelines', 'AWS / GCP / Azure', 'Monitoring & Logging', 'Infrastructure as Code'],
      isActive: true, order: 5,
    },
  ]);
  console.log('   ✅ 5 services seeded');

  // ── EXPERIENCE ─────────────────────────────────────────
  console.log('💼 Seeding experience...');
  await Experience.deleteMany({});
  await Experience.insertMany([
    {
      title: 'Senior Full Stack Developer',
      organization: 'TechCorp Solutions',
      period: '2023 - Present',
      description: 'Leading a team of 5 developers building a SaaS platform serving 50K+ users. Architected the microservices backend, implemented CI/CD, and improved app performance by 40%.',
      type: 'work', location: 'Hyderabad, India', current: true, order: 1,
    },
    {
      title: 'Full Stack Developer',
      organization: 'StartupXYZ',
      period: '2021 - 2023',
      description: 'Built and maintained 3 production web applications from scratch. Integrated payment gateways, implemented real-time features, and mentored junior developers.',
      type: 'work', location: 'Bangalore, India', current: false, order: 2,
    },
    {
      title: 'Frontend Developer',
      organization: 'Digital Agency Co.',
      period: '2019 - 2021',
      description: 'Developed responsive websites and web apps for 20+ clients. Specialized in React and Vue.js with a focus on performance and accessibility.',
      type: 'work', location: 'Remote', current: false, order: 3,
    },
    {
      title: 'B.Tech in Computer Science',
      organization: 'Indian Institute of Technology',
      period: '2015 - 2019',
      description: 'Graduated with distinction. Specialized in algorithms, data structures, and software engineering. Led the tech club and organized hackathons.',
      type: 'education', location: 'India', current: false, order: 1,
    },
    {
      title: 'AWS Certified Solutions Architect',
      organization: 'Amazon Web Services',
      period: '2022',
      description: 'Professional-level certification covering compute, storage, networking, and architecture best practices on AWS.',
      type: 'certification', current: false, order: 1,
    },
    {
      title: 'Open Source Contributor',
      organization: 'Various Projects',
      period: '2020 - Present',
      description: 'Active contributor to React ecosystem projects. Contributed to Next.js documentation and several popular npm packages.',
      type: 'volunteer', current: true, order: 1,
    },
  ]);
  console.log('   ✅ 6 experience entries seeded');

  // ── TESTIMONIALS ──────────────────────────────────────
  console.log('⭐ Seeding testimonials...');
  await Testimonial.deleteMany({});
  await Testimonial.insertMany([
    {
      name: 'Priya Sharma',
      role: 'Product Manager',
      company: 'TechStart Inc.',
      content: 'Anand delivered our e-commerce platform ahead of schedule and exceeded all expectations. His attention to detail and ability to translate complex requirements into clean, functional code is remarkable. The site handles 10K+ daily transactions flawlessly.',
      rating: 5, approved: true, featured: true,
    },
    {
      name: 'Rajesh Kumar',
      role: 'CTO',
      company: 'InnovateLabs',
      content: 'Working with Anand was a fantastic experience. He not only built our entire backend infrastructure but also suggested improvements we hadn\'t thought of. His code quality is exceptional — clean, well-documented, and maintainable.',
      rating: 5, approved: true, featured: true,
    },
    {
      name: 'Sarah Chen',
      role: 'Founder',
      company: 'DesignFlow Studio',
      content: 'Anand took our Figma designs and turned them into a beautiful, responsive web app with smooth animations. He has a rare combination of technical skill and design sensibility. Highly recommended for any frontend project.',
      rating: 5, approved: true, featured: true,
    },
    {
      name: 'Mike Johnson',
      role: 'CEO',
      company: 'CloudScale Solutions',
      content: 'Anand set up our entire cloud infrastructure on AWS with Docker and Kubernetes. Our deployment time went from hours to minutes. Great communicator and delivers on time.',
      rating: 4, approved: true, featured: false,
    },
    {
      name: 'Anika Patel',
      role: 'Marketing Director',
      company: 'GrowthPulse',
      content: 'The portfolio website Anand built for us generates 3x more leads than our old site. The design is stunning, the SEO is on point, and the load times are incredibly fast.',
      rating: 5, approved: true, featured: false,
    },
  ]);
  console.log('   ✅ 5 testimonials seeded');

  console.log('\n🎉 Seeding complete! All collections populated.\n');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
