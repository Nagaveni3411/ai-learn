/**
 * @param {import('knex').Knex} knex
 */
exports.seed = async function seed(knex) {
  await knex("video_progress").del();
  await knex("refresh_tokens").del();
  await knex("enrollments").del();
  await knex("videos").del();
  await knex("sections").del();
  await knex("subjects").del();

  const subjects = [
    { title: "JavaScript Fundamentals", slug: "javascript-fundamentals", description: "Core JavaScript syntax and logic building.", is_published: true },
    { title: "React from Scratch", slug: "react-from-scratch", description: "Components, hooks, routing, and app architecture.", is_published: true },
    { title: "Node.js + Express APIs", slug: "node-express-apis", description: "Build production-grade REST APIs.", is_published: true },
    { title: "MySQL for Developers", slug: "mysql-for-developers", description: "SQL queries, schema design, and optimization.", is_published: true },
    { title: "Data Structures Basics", slug: "data-structures-basics", description: "Arrays, linked lists, stacks, queues, trees.", is_published: true },
    { title: "System Design Intro", slug: "system-design-intro", description: "Scalability, caching, queues, and architecture.", is_published: true },
    { title: "TypeScript Essentials", slug: "typescript-essentials", description: "Static typing for safer JavaScript codebases.", is_published: true },
    { title: "Git and GitHub Workflow", slug: "git-github-workflow", description: "Version control and team collaboration patterns.", is_published: true },
    { title: "AI for Web Developers", slug: "ai-for-web-developers", description: "Integrate AI features into web apps.", is_published: true },
    { title: "Next.js Complete Path", slug: "nextjs-complete-path", description: "SSR, routing, APIs, and deployment with Next.js.", is_published: true },
    { title: "CSS Masterclass", slug: "css-masterclass", description: "Layouts, animations, and responsive design.", is_published: true },
    { title: "Testing JavaScript Apps", slug: "testing-javascript-apps", description: "Unit, integration, and end-to-end testing.", is_published: true }
  ];

  const subjectIds = await knex("subjects").insert(subjects);

  const sectionsByCourse = ["Getting Started", "Core Concepts", "Project Build"];
  const sectionRows = [];
  for (let i = 0; i < subjectIds.length; i += 1) {
    for (let j = 0; j < sectionsByCourse.length; j += 1) {
      sectionRows.push({
        subject_id: subjectIds[i],
        title: sectionsByCourse[j],
        order_index: j + 1
      });
    }
  }
  const sectionIds = await knex("sections").insert(sectionRows);

  const sampleUrls = [
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=3JZ_D3ELwOQ",
    "https://www.youtube.com/watch?v=L_jWHffIx5E",
    "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
    "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    "https://www.youtube.com/watch?v=ktvTqknDobU"
  ];

  const videoRows = [];
  for (let i = 0; i < sectionIds.length; i += 1) {
    for (let idx = 1; idx <= 4; idx += 1) {
      videoRows.push({
        section_id: sectionIds[i],
        title: `Lesson ${idx}`,
        description: `Structured lesson ${idx} in this section.`,
        youtube_url: sampleUrls[(i + idx) % sampleUrls.length],
        order_index: idx,
        duration_seconds: 420 + idx * 180
      });
    }
  }

  await knex("videos").insert(videoRows);
};
