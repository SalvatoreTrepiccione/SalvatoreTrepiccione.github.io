/* ==========================================================================
   ALL SITE CONTENT LIVES HERE.
   Edit this file only: every section of the page is rebuilt from it.
   ========================================================================== */

window.SITE = {

  person: {
    name: "Salvatore Trepiccione",
    authorName: "S. Trepiccione",            // highlighted in author lists
    role: "PhD Candidate in Industrial Engineering",
    affiliation: "University of Naples Federico II",
    group: "DAF Research Group",
    photo: "salvatore.webp",
    email: "salvatore.trepiccione@unina.it",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/salvatore-trepiccione-237902254/" },
      { label: "GitHub",   url: "https://github.com/SalvatoreTrepiccione" }
    ],
    // Words cycling in the hero headline: "Designing ___ regional aircraft."
    rotating: ["hybrid-electric", "hydrogen", "multi-source", "cleaner"],
    profile:
      "I'm a PhD candidate at the University of Naples Federico II, working on the conceptual design of " +
      "hybrid-electric and hydrogen-powered regional aircraft. I lead the development of HEART, a MATLAB " +
      "design environment that sizes conventional, fuel-cell and turboelectric aircraft under the same " +
      "requirements, closes the liquid-hydrogen tank–airframe loop and explores the design space with " +
      "design of experiments, response surfaces and constrained optimisation."
  },

  stats: [
    { value: 1700, prefix: "~", label: "design runs in a single exploration campaign" },
    { value: 6,    label: "aircraft configurations · 80 & 100 pax, EIS 2040" },
    { value: 0.5,  decimals: 1, suffix: "%", label: "block-fuel gap vs ATR 72-500 data" },
    { value: 110,  suffix: "/110", label: "MSc and BSc, both summa cum laude" }
  ],

  // The PhD "flight" in the About section (progress is computed from today's date)
  phd: {
    from: "2024-11-01", to: "2027-10-31",
    title: "Multidisciplinary Design Exploration of Multi-Source Hybrid-Electric Regional Aircraft",
    supervisor: "Prof. Fabrizio Nicolosi",
    funding: "Doctoral scholarship funded by SmartUp Engineering"
  },

  // Flight log (chronological)
  journey: [
    {
      when: "2019 — 2022", title: "BSc in Aerospace Engineering", where: "University of Naples Federico II",
      badge: "110/110 cum laude",
      text: "Thesis: Geometric modelling and static stability analysis of the Canadair water bomber with JPAD and OpenVSP. I modelled the Viking Air CL-415 in JPAD and analysed its stability and control with the OpenVSP/VSPAERO vortex-lattice solver."
    },
    {
      when: "2022 — 2024", title: "MSc in Aerospace Engineering — Aeronautics", where: "University of Naples Federico II",
      badge: "110/110 cum laude with distinction · PEGASUS",
      text: "Thesis: Powertrain architecture modelling for hybrid-electric aircraft. I extended the SHARP Java API from three to four energy sources (gas turbine, fuel cell and two battery packs in a serial-parallel partial-hybrid architecture) and applied it to the aircraft of the EU HERA project to quantify the CO₂ reduction towards the 2050 targets."
    },
    {
      when: "Nov 2024 — Oct 2027", title: "PhD in Industrial Engineering (XL cycle)", where: "DAF Research Group · University of Naples Federico II",
      badge: "In progress",
      text: "Lead developer of HEART: geometry, weights and balance, aerodynamics, multi-source powertrain, mission and field performance, LH₂ tank integration, and a DOE → response surface → SQP exploration workflow. Coupled with the SHARP Java platform, packaged as a standalone executable."
    },
    {
      when: "Jun — Jul 2026", title: "Instructor — General Physics II (Electricity)", where: "Sant'Anna Institute × Jacksonville University · Sorrento",
      badge: "Teaching",
      text: "Taught PHYS 152 (4 credits) with PHYS 332 (1 credit) in English, with self-authored lecture notes, two mid-course exams, laboratory reports and a final exam."
    }
  ],

  // Places on the map. Naples is the home base; the others get a flight route.
  places: [
    { id: "nap", city: "Naples",   coords: [14.27, 40.85],  home: true, what: "Home base", detail: "University of Naples Federico II · DAF group" },
    { id: "trn", city: "Turin",    coords: [7.69, 45.07],   what: "CEAS Aerospace Europe · AIDAA", tag: "CEAS 2025", detail: "Dec 2025 · Sustainable aircraft propulsion with four energy sources" },
    { id: "syd", city: "Sydney",   coords: [151.21, -33.87], what: "ICAS 2026", detail: "Sep 2026 · two papers: hybrid-electric design exploration, winglet design" },
    { id: "xian", city: "Xi'an",   coords: [108.94, 34.34], what: "ICGA 2026", detail: "Nov 2026 · techno-economic assessment, 100-pax regional aircraft" },
    { id: "sor", city: "Sorrento", coords: [14.38, 40.63],  what: "Teaching", detail: "Jun–Jul 2026 · General Physics II, Jacksonville University programme", short: true }
  ],

  /* type: "Journal", "Conference", "Report" */
  publications: [
    {
      year: 2026, type: "Conference",
      title: "Techno-economic design assessment of hydrogen fuel-cell and hybrid-electric propulsion for a 100-passenger regional aircraft",
      authors: "F. Nicolosi, G. Melone, S. Trepiccione, M. Di Stasio",
      venue: "4th International Conference on Green Aviation (ICGA 2026), Xi'an, China, 2–4 November 2026", doi: ""
    },
    {
      year: 2026, type: "Conference",
      title: "Multidisciplinary design exploration of hybrid-electric regional aircraft",
      authors: "S. Trepiccione, G. Melone, F. Nicolosi, G. Piscopo, M. Di Stasio",
      venue: "35th Congress of the International Council of the Aeronautical Sciences (ICAS 2026), Sydney, Australia", doi: ""
    },
    {
      year: 2026, type: "Conference",
      title: "Cost-driven multidisciplinary framework for winglet design: a regional aircraft case study",
      authors: "L. Falcone, S. Corcione, F. Nicolosi, S. Trepiccione",
      venue: "35th Congress of the International Council of the Aeronautical Sciences (ICAS 2026), Sydney, Australia", doi: ""
    },
    {
      year: 2026, type: "Report",
      title: "HEART Mission Analysis Manager: a MATLAB framework for multi-architecture performance evaluation",
      authors: "S. Trepiccione",
      venue: "Technical documentation v2.0, University of Naples Federico II", doi: ""
    },
    {
      year: 2025, type: "Journal",
      title: "A mathematical model for hybrid-electric propulsion system for regional propeller-driven aircraft",
      authors: "G. Grazioso, M. Di Stasio, F. Nicolosi, S. Trepiccione",
      venue: "Energy Conversion and Management: X, 2025, art. 100957", doi: "10.1016/j.ecmx.2025.100957"
    },
    {
      year: 2025, type: "Conference",
      title: "Sustainable aircraft propulsion with four energy sources",
      authors: "S. Trepiccione, G. Grazioso, F. Nicolosi",
      venue: "10th CEAS Aerospace Europe Conference – 28th AIDAA Congress, Turin · Materials Research Proceedings, vol. 69, 2026",
      doi: "10.21741/9781644904251-114"
    }
  ],

  /* SUPERVISED THESES — the section appears automatically as soon as you add one.
     Example:
     { year: 2026, student: "Name Surname", level: "MSc", role: "Co-supervisor", title: "Thesis title" } */
  theses: [
    {
      year: 2026, period: "A.Y. 2025–26", level: "MSc", role: "Co-supervisor",
      student: "Emanuele Carbonaro & Pietro Iezza",
      title: "Numerical modeling of hydrogen PEMFC propulsion systems and BoP components for the pre-design of regional aircraft",
      summary: "A MATLAB tool that couples a PEM fuel-cell stack model with its balance of plant (centrifugal compressor and membrane humidifier), calibrated on commercial components and simulated along the full mission of a regional aircraft.",
      team: "Supervisor Prof. F. Nicolosi · co-supervised with M. Di Stasio and G. Melone"
    },
    {
      year: 2026, period: "A.Y. 2025–26", level: "BSc", role: "Co-supervisor",
      student: "Luca Scarpato",
      title: "Reverse Engineering: The Flight Performance of the North American P-51D Mustang",
      summary: "Flight mechanics of the P-51D computed in MATLAB: drag polar, thrust and power curves, climb, range and endurance, turn performance and V-n diagram, checked against historical data.",
      team: "Supervisor Prof. F. Nicolosi"
    }
  ],

  skills: [
    { title: "Aircraft design", items: ["Conceptual design & sizing", "Matching charts", "Weights & balance", "Mission & field performance", "Hybrid-electric powertrains", "LH₂ storage integration"] },
    { title: "Optimisation", items: ["Design of experiments", "Response surfaces", "SQP constrained optimisation", "Multidisciplinary workflows"] },
    { title: "Programming", items: ["MATLAB (OOP, GUIs, Compiler)", "Simulink", "Java", "Python", "C", "C++"] },
    { title: "Engineering tools", items: ["SHARP", "HEART", "JPAD", "OpenVSP / VSPAERO", "STAR-CCM+", "XFOIL", "JavaFoil", "MathCAD", "Autodesk Inventor"] },
    { title: "Development & docs", items: ["Git & GitHub (LFS)", "Eclipse", "LaTeX · Beamer · TikZ · PGFPlots", "Microsoft Office"] }
  ],

  languages: [
    { name: "Italian", level: "Native", cefr: 6 },
    { name: "English", level: "B2 · Cambridge certificate", cefr: 4 }
  ]
};
