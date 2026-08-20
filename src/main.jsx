import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowDownRight, ArrowUpRight, ChevronDown, Dribbble, Instagram, Mail, MessageCircle, Phone, Sparkles, X } from 'lucide-react'
import './styles.css'
import profileImage from './assets/profile.jpg'
import cameraImage from './assets/hero-camera.png'
import esPortrait from './assets/projects/es/portrait-web.jpg'
import esHalfViews from './assets/projects/es/half-views-web.jpg'
import esFullViews from './assets/projects/es/full-views-web.jpg'
import esExpressions from './assets/projects/es/expressions-web.jpg'
import esCollage01 from './assets/projects/es/collage-01-web.jpg'
import esPoster02 from './assets/projects/es/poster-02-web.jpg'
import bag01 from './assets/projects/es/bag-01-web.jpg'
import bag02 from './assets/projects/es/bag-02-web.jpg'
import fashionCollage from './assets/projects/es/fashion-collage-web.jpg'
import fashionPortrait from './assets/projects/es/fashion-portrait-web.jpg'
import spring01 from './assets/projects/es/spring-01-web.jpg'
import spring02 from './assets/projects/es/spring-02-web.jpg'
import fashionBlue from './assets/projects/es/fashion-blue-web.jpg'
import Aurora from './components/Aurora'

const githubMediaBase = 'https://raw.githubusercontent.com/Kokoro111/Xayron-/main/public/videos'
const videoWorksBase = `${githubMediaBase}/video-works`

const projects = [
  {
    no: '01',
    title: 'Video\nWorks',
    type: '视频作品',
    className: 'neuro',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=85',
    materials: [
      { title: 'FILA 山猫鞋', src: `${videoWorksBase}/fila-trail-h265.mp4`, kind: 'video' },
      { title: 'FILAKIDS BFC', src: `${videoWorksBase}/filakids-bfc.mp4`, kind: 'video' },
      { title: 'FILA 探险家', src: `${videoWorksBase}/fila-explorer.m4v`, kind: 'video' },
      { title: 'LEGO DreamZZZ', src: `${videoWorksBase}/lego-dreamzzz.m4v`, kind: 'video' },
      { title: '壳牌星域概念卡车', src: `${videoWorksBase}/${encodeURIComponent('壳牌中国 X 一汽解放 星域概念卡车-三维CG_三维动画视频-新片场.mp4')}`, kind: 'video' },
      { title: '视频作品 06', src: `${videoWorksBase}/video-06.mp4`, kind: 'video' },
    ],
  },
  {
    no: '02',
    title: 'AI\ncreation',
    type: 'AI 生成式创作',
    className: 'form',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1800&q=85',
    materials: [
      { title: '时尚拼贴', src: fashionCollage },
      { title: '时尚肖像', src: fashionPortrait },
      { title: '春日时尚 01', src: spring01 },
      { title: '春日时尚 02', src: spring02 },
      { title: '蓝调时尚', src: fashionBlue },
      { title: 'ES 复古拼贴海报', src: esCollage01 },
      { title: 'ES 海报图片 02', src: esPoster02 },
      { title: 'ES 半身定妆图', src: esPortrait },
      { title: 'ES 半身三视图', src: esHalfViews },
      { title: 'ES 全身三视图', src: esFullViews },
      { title: 'ES 表情图', src: esExpressions },
      { title: '包袋视觉 01', src: bag01 },
      { title: '包袋视觉 02', src: bag02 },
    ],
  },
  {
    no: '03',
    title: 'FPV Highlight\nReel',
    type: 'FPV 集锦',
    className: 'other',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1800&q=85',
    materials: [
      { title: 'FPV 2023 Highlight Reel', src: `${githubMediaBase}/fpv-hero.mp4`, kind: 'video' },
    ],
  },
]

const strengths = [
  ['01', '视觉叙事', '将复杂概念转译为有情绪张力的视觉语言。'],
  ['02', 'AI 创意', '用生成式工具探索更快、更意外的创作路径。'],
  ['03', '品牌构建', '从策略到表达，建立经得起时间考验的系统。'],
  ['04', '跨界协作', '与不同领域的团队共创，连接更大的可能。'],
]

function setRandomVideoPreviewFrame(event) {
  const video = event.currentTarget
  const duration = Number(video.duration)

  if (!Number.isFinite(duration) || duration <= 0) return

  // Keep clear of opening/closing slates, where black frames are most common.
  const start = Math.min(2.5, duration * 0.18)
  const end = Math.max(start, duration - Math.min(2, duration * 0.1))
  video.currentTime = start + Math.random() * Math.max(0, end - start)
}

function playRandomProjectClip(event) {
  const video = event.currentTarget
  const duration = Number(video.duration)

  if (!Number.isFinite(duration) || duration <= 0) return

  // Reserve a full five-second viewing window so the next transition is never a black end frame.
  const start = Math.min(2.5, duration * 0.18)
  const end = Math.max(start, duration - 5.5)
  video.currentTime = start + Math.random() * Math.max(0, end - start)
  video.play().catch(() => {})
}

function ProjectCover({ project, slide }) {
  const materials = project.materials ?? []
  const material = materials.length ? materials[slide % materials.length] : { src: project.image }
  const coverKey = `${material.src}-${slide}`
  const [activeCover, setActiveCover] = useState(() => ({ ...material, coverKey }))
  const [leavingCover, setLeavingCover] = useState(null)

  useEffect(() => {
    if (activeCover.coverKey === coverKey) return

    setLeavingCover(activeCover)
    setActiveCover({ ...material, coverKey })
    const timer = window.setTimeout(() => setLeavingCover(null), 650)
    return () => window.clearTimeout(timer)
  }, [coverKey])

  const renderCover = (cover, transitionClass) => {
    const isClipPreview = project.no === '01'

    if (cover.kind === 'video') {
      return <video className={`project-cover ${transitionClass}`} key={`${cover.coverKey}-${transitionClass}`} src={cover.src} muted autoPlay={isClipPreview} playsInline preload="metadata" onLoadedMetadata={isClipPreview ? playRandomProjectClip : setRandomVideoPreviewFrame} />
    }

    return <img className={`project-cover ${transitionClass}`} key={`${cover.coverKey}-${transitionClass}`} src={cover.src ?? project.image} alt="" />
  }

  return <>{leavingCover && renderCover(leavingCover, 'is-leaving')}{renderCover(activeCover, 'is-entering')}</>
}

function App() {
  const [cameraInFront, setCameraInFront] = useState(true)
  const [navFloating, setNavFloating] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [activeMaterial, setActiveMaterial] = useState(0)
  const [isMaterialViewerOpen, setIsMaterialViewerOpen] = useState(false)
  const [projectCoverSlides, setProjectCoverSlides] = useState({ '01': 0, '02': 0, '03': 0 })
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setCameraInFront((value) => !value), 5200)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const coverCycle = 5000
    const transitionDuration = 650
    const pauseAfterTransition = 500
    const timers = projects.map((project, index) => {
      const changeCover = () => setProjectCoverSlides((slides) => ({
        ...slides,
        [project.no]: slides[project.no] + 1,
      }))
      const delay = coverCycle + index * (transitionDuration + pauseAfterTransition)
      let interval
      const timeout = window.setTimeout(() => {
        changeCover()
        interval = window.setInterval(changeCover, coverCycle)
      }, delay)
      return { timeout, getInterval: () => interval }
    })

    return () => timers.forEach(({ timeout, getInterval }) => {
      window.clearTimeout(timeout)
      window.clearInterval(getInterval())
    })
  }, [])

  useEffect(() => {
    const updateNav = () => setNavFloating(window.scrollY > 120)
    updateNav()
    window.addEventListener('scroll', updateNav, { passive: true })
    return () => window.removeEventListener('scroll', updateNav)
  }, [])

  useEffect(() => {
    const isAssetTarget = (target) => target instanceof Element && Boolean(target.closest('img, video, .material-thumb'))
    const preventAssetMenu = (event) => {
      if (isAssetTarget(event.target)) event.preventDefault()
    }
    const preventSaveShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && ['s', 'u'].includes(event.key.toLowerCase())) event.preventDefault()
    }
    document.addEventListener('contextmenu', preventAssetMenu)
    document.addEventListener('dragstart', preventAssetMenu)
    document.addEventListener('keydown', preventSaveShortcut)

    return () => {
      document.removeEventListener('contextmenu', preventAssetMenu)
      document.removeEventListener('dragstart', preventAssetMenu)
      document.removeEventListener('keydown', preventSaveShortcut)
    }
  }, [])

  useEffect(() => {
    document.querySelectorAll('.material-lightbox video').forEach((video) => {
      video.setAttribute('controlsList', 'nodownload noremoteplayback')
      video.disablePictureInPicture = true
    })
  }, [activeProject, isMaterialViewerOpen])

  useEffect(() => {
    if (!isMaterialViewerOpen || activeProject?.materials?.[activeMaterial]?.kind !== 'video') return

    const frame = window.requestAnimationFrame(() => {
      const player = document.querySelector('.material-lightbox video')
      if (player) player.volume = 0.3
    })

    return () => window.cancelAnimationFrame(frame)
  }, [activeMaterial, activeProject, isMaterialViewerOpen])

  const currentYear = now.getFullYear()
  const workYears = Math.max(1, currentYear - 2023 + 1)
  const liveDate = new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(now)
  const liveTime = new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(now)
  const materialItems = activeProject?.materials ?? []
  const selectedMaterial = materialItems[activeMaterial]

  return <main className="site-shell">
    <Aurora colorStops={['#08251f', '#1c6749', '#245b88']} amplitude={0.7} blend={0.58} speed={0.32} />
    <section className={`hero ${navFloating ? 'has-floating-nav' : ''}`} id="top">
      <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2000&q=85">
        <source src={`${githubMediaBase}/fpv-hero.mp4`} type="video/mp4" />
        <source src="https://cdn.coverr.co/videos/coverr-liquid-paint-1571/1080p.mp4" type="video/mp4" />
      </video>
      <div className="hero-vignette" />
      <div className="hero-grain" />
      <nav className={`nav wrap ${navFloating ? 'is-floating' : ''}`}>
        <a className="brand" href="#top"><span>XAYRON</span><i /></a>
        <div className="nav-links"><a href="#about">关于</a><a href="#work">项目</a><a href="#capability">能力</a></div>
        <a className="nav-contact" href="#contact">联系我 <ArrowUpRight size={14} /></a>
      </nav>
      <div className="hero-content wrap">
        <div className="hero-topline"><p className="eyebrow"><span /> Filmmaker · Shanghai</p><p>PORTFOLIO / {currentYear} · {liveDate} {liveTime}</p></div>
        <div className="hero-ellipse" aria-hidden="true" />
        <div className="hero-title"><span>{currentYear}</span><strong>Portfo<em>lio</em></strong></div>
        <div className={`hero-camera ${cameraInFront ? 'is-front' : 'is-back'}`}><img src={cameraImage} alt="相机三维模型" /></div>
        <div className={`hero-statement ${cameraInFront ? 'is-back' : 'is-front'}`}>Turn the <em>fantastical</em><br />into the feasible<small>让天马行空的幻想，变成可行之事</small></div>
        <div className="hero-meta"><span>XAYRON STUDIO<br />FILMMAKER<br />{currentYear} PORTFOLIO</span><span>TURN THE<br />FANTASTICAL<br />INTO THE FEASIBLE</span></div>
        <div className="hero-tags"><i>AI‑aided creation</i><i>Visual design</i><i>Film & TV creator</i></div>
        <div className="hero-bottom"><p>SELECTED WORKS · 01 — 05</p><a href="#work" className="scroll"><ChevronDown size={20} /> 向下探索</a></div>
      </div>
      <div className="hero-index">01 <span>/</span> 05</div>
    </section>

    <section className="about wrap" id="about">
      <div className="section-label">( 01 ) &nbsp; ABOUT ME</div>
      <div className="about-grid">
        <div className="portrait"><img src={profileImage} alt="设计师 Xayron" /><div className="portrait-mark">X.</div></div>
        <div className="about-copy">
          <div className="about-text"><p className="intro">你好，我是 <strong>Xayron</strong>。一名专注于品牌视觉、数字体验与 AI 创作的影视从业者。</p><p className="muted">我相信创作不是堆砌，而是让想法被感知的方式。过去这些年，我与文化、科技和生活方式领域的品牌一起，把模糊的愿景变成清晰而独特的体验。</p></div>
          <div className="education"><div className="education-label">EDUCATION / 01</div><div className="education-school"><strong>武昌工学院</strong><span>Wuchang Institute of Technology</span></div><div className="education-major">本科 · 摄影系 <i /> 2019 — 2023</div><p><b>主修课程：</b>摄影技术与技巧、摄像技术基础、摄影构图、照明技术、PHOTOSHOP 图片艺术、产品摄影、人像摄影、专题摄影、商业广告摄影、摄影综合创作研究。</p></div>
          <div className="experience"><div className="experience-label">EXPERIENCE / 02</div><div className="experience-title"><strong>Wplus Studio</strong><span>2023</span></div><div className="experience-work"><div><b>FILA</b><p>探索者徒步鞋：FPV 航拍、制片、录音<br />BFC 网球短袖：制片、录音<br />山猫鞋 2 越野跑鞋：FPV 航拍、制片</p></div><div><b>LEGO 积木</b><p>乐高梦境城堡系列视频制作：摄像、录音<br />乐高太空机甲 3IN1 变格动画短片：创意分镜脚本策划、拍摄</p></div><div><b>可口可乐</b><p>可口可乐 FITA 成功回馈视频制作：拍摄</p></div><div><b>壳牌</b><p>壳牌星舰视频制作：制片</p></div></div><p className="experience-brands">合作品牌：FILA / lululemon / 壳牌 / 百威 / 江南布衣 / 可口可乐 / 优衣库 / 日加满 etc.</p></div>
        </div>
        <div className="stats"><div><b>{String(workYears).padStart(2, '0')}</b><span>年工作经验</span></div><div><b>16<sup>+</sup></b><span>合作品牌</span></div></div>
        <div className="about-contacts about-links"><a href="mailto:Xayron2001@outlook.com"><Mail size={16} /> Xayron2001@outlook.com</a><span><MessageCircle size={16} /> WeChat · X-Y Xiong</span><a href="tel:15827465662"><Phone size={16} /> 158 2746 5662</a></div>
      </div>
    </section>

    <section className="projects" id="work"><div className="wrap"><div className="section-head"><div className="section-label">( 02 ) &nbsp; SELECTED WORK</div><p>一些近期的<br />实验与实践</p></div><div className="project-list">{projects.map((p) => <article className={`project ${p.className}`} key={p.no} role="button" tabIndex="0" onClick={() => { setActiveProject(p); setActiveMaterial(0); setIsMaterialViewerOpen(false) }} onKeyDown={(event) => { if (event.key === 'Enter') { setActiveProject(p); setActiveMaterial(0); setIsMaterialViewerOpen(false) } }}><ProjectCover project={p} slide={projectCoverSlides[p.no]} /><div className="project-shade" /><div className="project-no">{p.no}</div><div className="project-content"><p>{p.type.replace('{YEAR}', currentYear)}</p><h2>{p.title.split('\n').map((t, i) => <React.Fragment key={t}>{t}{i === 0 && <br />}</React.Fragment>)}</h2></div><button className="round-link" type="button" aria-label={`打开 ${p.title} 素材库`}><ArrowUpRight size={24} /></button></article>)}</div></div></section>

    <section className="capability wrap" id="capability"><div className="section-head"><div className="section-label">( 03 ) &nbsp; CAPABILITIES</div><h2>不是风格的复刻，<br />而是新的表达。</h2></div><div className="strength-grid">{strengths.map(([num, title, desc]) => <article className="strength" key={num}><span>{num}</span><Sparkles size={20} strokeWidth={1.25} /><h3>{title}</h3><p>{desc}</p></article>)}</div></section>

    <footer id="contact"><div className="footer-orb" /><div className="wrap footer-inner"><div className="section-label">( 04 ) &nbsp; LET'S CREATE TOGETHER</div><p className="footer-kicker">有趣的项目，随时聊聊。</p><a className="mail-link" href="mailto:Xayron2001@outlook.com">Xayron2001@<em>outlook.com</em><ArrowUpRight /></a><div className="footer-contacts"><span>WECHAT · X-Y Xiong</span><a href="tel:15827465662">TEL · 158 2746 5662</a></div><div className="footer-bottom"><span>© {currentYear} XAYRON STUDIO</span><div><a href="#top">BACK TO TOP ↑</a></div></div></div></footer>
    {activeProject && <div className="material-overlay" role="presentation" onMouseDown={() => { setActiveProject(null); setIsMaterialViewerOpen(false) }}><section className="library-modal material-dialog" role="dialog" aria-modal="true" aria-label={`${activeProject.title} 素材库`} onMouseDown={(event) => event.stopPropagation()}><header><div><span>PROJECT {activeProject.no} / MATERIAL LIBRARY</span><h2>{activeProject.title.replace('\n', ' ')}</h2></div><button type="button" onClick={() => { setActiveProject(null); setIsMaterialViewerOpen(false) }} aria-label="关闭素材库"><X /></button></header><div className="material-grid" aria-label="素材缩略图">{(materialItems.length ? materialItems : Array.from({ length: 6 }, (_, index) => ({ title: `素材内容 ${String(index + 1).padStart(2, '0')}`, src: activeProject.image }))).map((item, index) => <button className="material-thumb" type="button" key={item.title} aria-label={item.kind === 'video' ? `播放视频素材 ${index + 1}` : `查看图片素材 ${index + 1}`} onClick={() => { setActiveMaterial(index); setIsMaterialViewerOpen(true) }}>{item.kind === 'video' ? <video src={item.src} muted playsInline preload="metadata" onLoadedMetadata={setRandomVideoPreviewFrame} /> : <img src={item.src ?? activeProject.image} alt="项目素材" />}<span>{String(index + 1).padStart(2, '0')}</span><i><ArrowUpRight size={17} /></i></button>)}</div><div className="material-dialog-footer"><p>{materialItems.length ? `当前项目已导入 ${materialItems.length} 项素材，点击缩略图即可放大查看。` : '后续将项目素材放入对应素材位，即可在此查看。'}</p><span>LIBRARY</span></div>{isMaterialViewerOpen && <div className="material-lightbox" role="presentation" onMouseDown={() => setIsMaterialViewerOpen(false)}><section role="dialog" aria-modal="true" aria-label="素材预览" onMouseDown={(event) => event.stopPropagation()}><button type="button" onClick={() => setIsMaterialViewerOpen(false)} aria-label="关闭素材预览"><X /></button>{selectedMaterial?.kind === 'video' ? <video key={selectedMaterial.src} src={selectedMaterial.src} controls autoPlay playsInline preload="metadata" /> : <img src={selectedMaterial?.src ?? activeProject.image} alt="项目素材放大预览" />}</section></div>}</section></div>}
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
