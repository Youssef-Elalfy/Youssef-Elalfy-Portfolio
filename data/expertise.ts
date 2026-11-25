import type { Locale } from '@/i18n/config';

/**
 * Every skill lists the projects that actually use it (ids from data/projects.ts).
 * Evidence comes from source code, READMEs or, for UniFlow, the live production client.
 * Hosting platforms are listed under delivery, never as the defining technology.
 */
type Text = { en: string; ar: string };

export interface Skill {
  id: string;
  name: Text;
  note: Text;
  evidence: string[];
}

export interface SkillGroup {
  id: string;
  title: Text;
  summary: Text;
  skills: Skill[];
}

const same = (value: string): Text => ({ en: value, ar: value });

export const skillGroups: SkillGroup[] = [
  {
    id: 'frontend',
    title: { en: 'Frontend & interaction', ar: 'الواجهات والتفاعل' },
    summary: { en: 'Typed component systems, bilingual layouts and motion that explains what changed.', ar: 'أنظمة مكوّنات مكتوبة بأنواع صارمة، وواجهات ثنائية اللغة، وحركة تشرح ما الذي تغيّر.' },
    skills: [
      { id: 'typescript', name: same('TypeScript'), evidence: ['eduverse', 'nocturne', 'parall-01', 'sensora', 'masar-ai', 'sayntra', 'sadeeman-ai', 'merchantflow', 'uniflow'], note: { en: 'Strict mode across interfaces, APIs and shared contracts.', ar: 'وضع صارم في الواجهات والـAPIs والعقود المشتركة.' } },
      { id: 'react', name: same('React'), evidence: ['eduverse', 'nocturne', 'parall-01', 'sensora', 'masar-ai', 'sayntra', 'sadeeman-ai', 'merchantflow', 'uniflow'], note: { en: 'React 19 workspaces, from chat consoles to campus and commerce dashboards.', ar: 'مساحات عمل بـReact 19، من واجهات المحادثة إلى لوحات الجامعات والتجارة.' } },
      { id: 'nextjs', name: same('Next.js'), evidence: ['nocturne', 'parall-01', 'sensora', 'uniflow', 'sayntra', 'sadeeman-ai', 'merchantflow'], note: { en: 'App Router applications with server routes, auth flows and API proxying.', ar: 'تطبيقات App Router بمسارات خادم وتدفقات تسجيل دخول وتمرير للـAPI.' } },
      { id: 'javascript', name: same('JavaScript'), evidence: ['bella-tavola', 'uniflow', 'masar-ai', 'merchantflow'], note: { en: 'Including framework-free DOM work with focus management.', ar: 'بما في ذلك العمل المباشر على الـDOM بدون إطار عمل، مع إدارة التركيز.' } },
      { id: 'html-css', name: same('HTML & CSS'), evidence: ['bella-tavola', 'uniflow', 'merchantflow', 'masar-ai'], note: { en: 'Semantic markup, Grid, custom properties and container-aware layouts.', ar: 'ترميز دلالي وGrid ومتغيرات CSS وتخطيطات تتكيّف مع الحاوية.' } },
      { id: 'tailwind', name: same('Tailwind CSS'), evidence: ['uniflow', 'masar-ai', 'merchantflow'], note: { en: 'Design tokens and responsive utility systems.', ar: 'متغيرات تصميم وأنظمة utilities متجاوبة.' } },
      { id: 'bootstrap', name: same('Bootstrap'), evidence: ['penguin-academy'], note: { en: 'Blade and Bootstrap interfaces for role-based dashboards.', ar: 'واجهات Blade وBootstrap للوحات تختلف حسب الدور.' } },
      { id: 'threejs', name: same('Three.js / R3F'), evidence: ['eduverse', 'parall-01', 'sensora', 'masar-ai', 'sayntra', 'sadeeman-ai'], note: { en: 'Custom GLSL, React Three Fiber scenes, quality tiers and fallbacks.', ar: 'شيدرات GLSL مخصصة ومشاهد React Three Fiber بمستويات جودة وبدائل آمنة.' } },
      { id: 'shaders', name: { en: 'GLSL & real-time 3D', ar: 'GLSL والرسوميات اللحظية' }, evidence: ['sensora', 'parall-01', 'masar-ai'], note: { en: 'Procedural geometry, shader silk, glass and GPU-tier fallbacks.', ar: 'هندسة إجرائية وحرير بالشيدر وزجاج وبدائل حسب قوة الرسوميات.' } },
      { id: 'motion', name: { en: 'Motion design', ar: 'تصميم الحركة' }, evidence: ['nocturne', 'parall-01', 'sensora', 'masar-ai', 'merchantflow', 'sayntra'], note: { en: 'State-driven animation with reduced-motion alternatives.', ar: 'حركة مرتبطة بالحالة، مع بديل لمن يفضّل تقليل الحركة.' } },
      { id: 'gsap', name: same('GSAP & ScrollTrigger'), evidence: ['nocturne', 'parall-01', 'sensora'], note: { en: 'Scroll-directed film timelines that reverse exactly, with Lenis on one clock.', ar: 'خطوط زمنية سينمائية يقودها التمرير وتنعكس بدقة، مع Lenis على ساعة واحدة.' } },
      { id: 'rtl', name: { en: 'Arabic RTL & bilingual UI', ar: 'واجهات عربية RTL وثنائية اللغة' }, evidence: ['eduverse', 'parall-01', 'sensora', 'masar-ai', 'uniflow', 'sayntra', 'sadeeman-ai', 'merchantflow'], note: { en: 'Arabic-first layouts with an English mirror, not an afterthought.', ar: 'تخطيطات تبدأ بالعربية ولها نسخة إنجليزية، وليست ترجمة لاحقة.' } },
      { id: 'a11y', name: { en: 'Accessibility', ar: 'إتاحة الوصول' }, evidence: ['sensora', 'bella-tavola', 'masar-ai', 'sadeeman-ai'], note: { en: 'Keyboard paths, focus traps, reduced motion and semantic controls.', ar: 'تنقّل بلوحة المفاتيح، وحبس للتركيز داخل النوافذ، وتقليل الحركة، وعناصر دلالية.' } },
    ],
  },
  {
    id: 'backend',
    title: { en: 'Backend & APIs', ar: 'الخوادم والـAPIs' },
    summary: { en: 'Servers that authenticate, authorize and validate everything they receive.', ar: 'خوادم تتحقق من الهوية والصلاحيات وتفحص كل ما تستقبله.' },
    skills: [
      { id: 'api', name: { en: 'API design', ar: 'تصميم الـAPIs' }, evidence: ['uniflow', 'sayntra', 'penguin-academy', 'masar-ai', 'sadeeman-ai'], note: { en: 'Scoped endpoints that reuse the same domain rules as the interface — about thirty routes in UniFlow alone.', ar: 'نقاط وصول محددة الصلاحيات تعيد استخدام قواعد العمل نفسها — حوالي ثلاثين مسارًا في UniFlow وحده.' } },
      { id: 'cms', name: { en: 'Headless CMS (Payload)', ar: 'أنظمة إدارة المحتوى (Payload)' }, evidence: ['nocturne'], note: { en: 'Collections, drafts, versions, safe duplication and a block-based page builder.', ar: 'مجموعات ومسودات وإصدارات ونسخ آمن ومنشئ صفحات بالبلوكات.' } },
      { id: 'auth', name: { en: 'Authentication', ar: 'تسجيل الدخول والهوية' }, evidence: ['nocturne', 'uniflow', 'sayntra', 'penguin-academy', 'masar-ai', 'sadeeman-ai', 'merchantflow'], note: { en: 'Email and social sign-in, Sanctum, Fortify, signed sessions and Supabase Auth.', ar: 'دخول بالبريد والحسابات الاجتماعية، وSanctum وFortify وجلسات موقّعة وSupabase Auth.' } },
      { id: 'oauth', name: { en: 'OAuth & account security', ar: 'OAuth وأمان الحسابات' }, evidence: ['uniflow'], note: { en: 'Google and Facebook sign-in, account linking, authenticator-app recovery and account deletion.', ar: 'دخول بـGoogle وFacebook، وربط الحسابات، والاسترداد بتطبيق مصادقة، وحذف الحساب.' } },
      { id: 'rbac', name: { en: 'Roles & permissions', ar: 'الأدوار والصلاحيات' }, evidence: ['uniflow', 'sayntra', 'penguin-academy'], note: { en: 'Student, instructor, admin and technician roles enforced on routes and policies.', ar: 'أدوار الطالب والمحاضر والمدير والفني، مطبّقة على المسارات والسياسات.' } },
      { id: 'laravel', name: same('Laravel & PHP'), evidence: ['sayntra', 'penguin-academy'], note: { en: 'Policies, actions, services and transactional domain rules.', ar: 'سياسات وactions وخدمات وقواعد عمل داخل معاملات قاعدة البيانات.' } },
      { id: 'node', name: same('Node.js'), evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Node 24 services running strict TypeScript.', ar: 'خدمات Node 24 تعمل بـTypeScript صارم.' } },
      { id: 'fastify', name: same('Fastify'), evidence: ['sadeeman-ai'], note: { en: 'A Fastify 5 API with typed routes and server-only credentials.', ar: 'API مبني بـFastify 5 بمسارات مكتوبة الأنواع ومفاتيح لا تغادر الخادم.' } },
      { id: 'files', name: { en: 'File uploads & storage', ar: 'رفع الملفات وتخزينها' }, evidence: ['nocturne', 'uniflow'], note: { en: 'Uploads, profile photos and verification documents served through API routes.', ar: 'رفع ملفات وصور شخصية ومستندات تحقق، تُقدَّم عبر مسارات الـAPI.' } },
      { id: 'email', name: { en: 'Transactional email', ar: 'البريد التشغيلي' }, evidence: ['uniflow'], note: { en: 'Recovery and account email through Brevo, with rate-limit handling.', ar: 'رسائل الاسترداد والحساب عبر Brevo، مع التعامل مع حدود الإرسال.' } },
      { id: 'sse', name: same('Server-Sent Events'), evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Real agent progress streamed to the browser as it happens.', ar: 'بثّ تقدّم الوكيل الحقيقي إلى المتصفح لحظة بلحظة.' } },
      { id: 'zod', name: { en: 'Zod validation', ar: 'التحقق بـZod' }, evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Schemas at every boundary, shared between API and client.', ar: 'مخططات تحقق عند كل حد، مشتركة بين الخادم والواجهة.' } },
    ],
  },
  {
    id: 'data',
    title: { en: 'Data', ar: 'البيانات' },
    summary: { en: 'Relational models with the security rules living next to the data.', ar: 'نماذج علائقية تعيش قواعد الأمان فيها بجوار البيانات نفسها.' },
    skills: [
      { id: 'postgres', name: same('PostgreSQL'), evidence: ['nocturne', 'masar-ai', 'sadeeman-ai'], note: { en: 'Postgres 17 with trigram and vector extensions.', ar: 'Postgres 17 مع امتدادات البحث النصي والمتجهات.' } },
      { id: 'mysql', name: same('MySQL'), evidence: ['sayntra', 'penguin-academy'], note: { en: 'Relational constraints that protect tenant and course boundaries.', ar: 'قيود علائقية تحمي حدود كل مؤسسة وكل مقرر.' } },
      { id: 'supabase', name: same('Supabase'), evidence: ['masar-ai', 'sadeeman-ai', 'merchantflow'], note: { en: 'Auth, Postgres and migrations — never a service key in the browser.', ar: 'تسجيل دخول وPostgres وmigrations، بدون أي مفتاح خدمة في المتصفح.' } },
      { id: 'tenancy', name: { en: 'Multi-tenant data', ar: 'بيانات متعددة المؤسسات' }, evidence: ['sayntra', 'uniflow'], note: { en: 'Organizations, institutions and campuses kept apart by scope and approval.', ar: 'مؤسسات وجامعات وفروع منفصلة بالصلاحيات والموافقات.' } },
      { id: 'rls', name: { en: 'Row-level security', ar: 'أمان على مستوى الصف (RLS)' }, evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'RLS policies, tested locally on PGlite with the same SQL.', ar: 'سياسات RLS مختبرة محليًا على PGlite بنفس الـSQL.' } },
      { id: 'pgvector', name: same('pgvector'), evidence: ['masar-ai'], note: { en: 'Semantic recall for consented memory, with a trigram fallback.', ar: 'استرجاع دلالي للذاكرة الموافَق عليها، مع بديل بالبحث النصي.' } },
    ],
  },
  {
    id: 'ai',
    title: { en: 'AI systems', ar: 'أنظمة الذكاء الاصطناعي' },
    summary: { en: 'Agents that use tools, cite sources and ask before they act.', ar: 'وكلاء يستخدمون الأدوات، ويذكرون مصادرهم، ويستأذنون قبل أن يتصرفوا.' },
    skills: [
      { id: 'llm', name: { en: 'LLM integration', ar: 'دمج النماذج اللغوية' }, evidence: ['masar-ai', 'sadeeman-ai', 'uniflow'], note: { en: 'Gemini and Groq with failover; a five-provider, bring-your-own-key assistant in UniFlow.', ar: 'Gemini وGroq مع التحويل التلقائي، ومساعد في UniFlow يدعم خمسة مزوّدين بمفتاح المستخدم.' } },
      { id: 'tools', name: { en: 'Tool calling', ar: 'استدعاء الأدوات' }, evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Multi-step agent loops with validated arguments and timeouts.', ar: 'حلقات وكيل متعددة الخطوات بمدخلات مُتحقَّق منها ومهلات زمنية.' } },
      { id: 'research', name: { en: 'Grounded web research', ar: 'بحث موثّق على الويب' }, evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Tavily results with sources, retrieval time and citation checks.', ar: 'نتائج Tavily بمصادرها ووقت جلبها وفحص للاستشهادات.' } },
      { id: 'memory', name: { en: 'Consent-based memory', ar: 'ذاكرة بموافقة المستخدم' }, evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Remembering only after explicit opt-in, with forget and erase.', ar: 'لا يتذكر إلا بعد موافقة صريحة، مع إمكانية النسيان والمسح.' } },
      { id: 'voice', name: { en: 'Voice input', ar: 'الإدخال الصوتي' }, evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'Whisper transcription with an editable transcript before sending.', ar: 'تفريغ بـWhisper مع نص قابل للتعديل قبل الإرسال.' } },
    ],
  },
  {
    id: 'delivery',
    title: { en: 'Quality & delivery', ar: 'الجودة والتسليم' },
    summary: { en: 'Tests that run in a real browser; hosting treated as its own concern.', ar: 'اختبارات تعمل في متصفح حقيقي، والاستضافة مسألة مستقلة بذاتها.' },
    skills: [
      { id: 'playwright', name: same('Playwright'), evidence: ['masar-ai', 'sadeeman-ai'], note: { en: 'End-to-end runs on desktop and mobile profiles.', ar: 'اختبارات شاملة على أجهزة مكتبية ومحمولة.' } },
      { id: 'vitest', name: same('Vitest / node:test'), evidence: ['sadeeman-ai', 'masar-ai'], note: { en: 'Unit and integration suites, including in-memory Postgres.', ar: 'اختبارات وحدات وتكامل، منها Postgres يعمل في الذاكرة.' } },
      { id: 'phpunit', name: same('PHPUnit'), evidence: ['sayntra'], note: { en: 'Laravel feature and unit tests for the repair API.', ar: 'اختبارات Laravel لواجهة برمجة الإصلاحات.' } },
      { id: 'git', name: same('Git & GitHub'), evidence: ['parall-01', 'sensora', 'masar-ai', 'penguin-academy', 'sadeeman-ai', 'sayntra', 'merchantflow'], note: { en: 'Public and private repositories, clean history, no secrets committed.', ar: 'مستودعات عامة وخاصة، وتاريخ نظيف، وبدون أي أسرار مرفوعة.' } },
      { id: 'vercel', name: { en: 'Vercel hosting', ar: 'الاستضافة على Vercel' }, evidence: ['parall-01', 'sensora', 'sayntra', 'uniflow', 'merchantflow', 'bella-tavola'], note: { en: 'Where the public builds are deployed — hosting, not the application itself.', ar: 'مكان نشر النسخ العامة — استضافة، وليست التطبيق نفسه.' } },
    ],
  },
  {
    id: 'design',
    title: { en: 'Design', ar: 'التصميم' },
    summary: { en: 'The design work that makes the engineering usable.', ar: 'العمل التصميمي الذي يجعل الهندسة قابلة للاستخدام.' },
    skills: [
      { id: 'uiux', name: { en: 'UI/UX design', ar: 'تصميم UI/UX' }, evidence: ['uniflow', 'masar-ai', 'bella-tavola', 'ai-labs', 'sakeena'], note: { en: 'Flows, hierarchy and interface states designed before they are built.', ar: 'تدفقات وتسلسل بصري وحالات واجهة تُصمَّم قبل أن تُبنى.' } },
      { id: 'figma', name: same('Figma'), evidence: ['ai-labs', 'soleuxe', 'sakeena'], note: { en: 'Interface design studies, presented on Behance.', ar: 'دراسات تصميم واجهات منشورة على Behance.' } },
      { id: 'blender', name: same('Blender'), evidence: ['parall-01'], note: { en: 'A product model generated from a version-controlled Python script.', ar: 'نموذج منتج مولَّد من سكربت Python تحت إدارة الإصدارات.' } },
    ],
  },
];

export const pick = (text: Text, locale: Locale) => text[locale];
