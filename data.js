const PROJECTS = [
  {
    tag: "RF / ANALOG",
    name: "G-DiffPS",
    desc: "Physics-informed graph diffusion for amortized, multi-topology RF phase shifter synthesis.",
    venue: "MLCAD 2026",
    href: "#publications",
    glyph: `<line x1="20" y1="60" x2="60" y2="30" stroke="var(--edge)"/><line x1="60" y1="30" x2="120" y2="30" stroke="var(--edge)"/><line x1="120" y1="30" x2="165" y2="60" stroke="var(--edge)"/><line x1="60" y1="30" x2="90" y2="65" stroke="var(--edge)"/><line x1="120" y1="30" x2="90" y2="65" stroke="var(--edge)"/><circle cx="20" cy="60" r="3.5" fill="var(--node)"/><circle cx="60" cy="30" r="3.5" fill="var(--node)"/><circle cx="120" cy="30" r="3.5" fill="var(--node)"/><circle cx="90" cy="65" r="3.5" fill="var(--node)"/><circle cx="165" cy="60" r="4.5" fill="var(--node-bright)"/>`
  },
  {
    tag: "ANALOG / RL",
    name: "RL-AmpSyn",
    desc: "Reinforcement-learning-enhanced operational amplifier generation and optimization.",
    venue: "Interactive demo",
    href: "#lab",
    glyph: `<path d="M15 70 Q 55 70 75 20 Q 95 70 165 70" fill="none" stroke="var(--edge)"/><circle cx="15" cy="70" r="3" fill="var(--node)"/><circle cx="75" cy="20" r="4" fill="var(--node-bright)"/><circle cx="165" cy="70" r="3" fill="var(--node)"/>`
  },
  {
    tag: "PHOTONICS",
    name: "PICasso",
    desc: "AI-enabled design framework for autonomous optimization of silicon photonic devices.",
    venue: "ICLAD 2026",
    href: "#publications",
    glyph: `<line x1="12" y1="45" x2="65" y2="45" stroke="var(--edge)"/><circle cx="100" cy="45" r="24" stroke="var(--edge)" fill="none"/><line x1="135" y1="45" x2="175" y2="45" stroke="var(--edge)"/><circle cx="65" cy="45" r="3" fill="var(--node)"/><circle cx="135" cy="45" r="3" fill="var(--node)"/><circle cx="100" cy="21" r="3" fill="var(--node-bright)"/>`
  },
  {
    tag: "IMC / ARCH",
    name: "LIMCA",
    desc: "LLM for automating analog in-memory computing architecture design exploration.",
    venue: "IEEE TCAD 2026",
    href: "#publications",
    glyph: `<line x1="25" y1="15" x2="25" y2="65" stroke="var(--edge)"/><line x1="55" y1="15" x2="55" y2="65" stroke="var(--edge)"/><line x1="85" y1="15" x2="85" y2="65" stroke="var(--edge)"/><line x1="115" y1="15" x2="115" y2="65" stroke="var(--edge)"/><line x1="12" y1="25" x2="128" y2="25" stroke="var(--edge)"/><line x1="12" y1="45" x2="128" y2="45" stroke="var(--edge)"/><line x1="12" y1="65" x2="128" y2="65" stroke="var(--edge)"/><circle cx="25" cy="25" r="3" fill="var(--node)"/><circle cx="55" cy="45" r="3" fill="var(--node-bright)"/><circle cx="85" cy="65" r="3" fill="var(--node)"/><circle cx="115" cy="25" r="3" fill="var(--node)"/>`
  }
];

const PUBLICATIONS = [
  { year: 2026, venue: "MLCAD", tag: "analog", title: "G-DiffPS: Physics-Informed Graph Diffusion Policy for Amortized Multi-Topology RF Phase Shifter Synthesis", note: "Fall, S., Vungarala, D., & Angizi, S. (Accepted)" },
  { year: 2026, venue: "ICLAD", tag: "photonics", title: "PICasso: An AI-Enabled Design Framework for Autonomous Optimization of Silicon Photonic Devices", note: "Vungarala, D. et al. (Accepted)" },
  { year: 2026, venue: "FCCM", tag: "analog", title: "RL-AmpSyn: Reinforcement Learning-Enhanced Operational Amplifier Generation and Optimization with LLMs", note: "Vungarala, D., Fall, S., Roohi, A., Zand, R., & Angizi, S. (Accepted)" },
  { year: 2026, venue: "VTS", tag: "digital", title: "Closing the Loop in LLM-Based Hardware Generation: An Autonomous Agentic Workflow for Robust TPU Design", note: "Vungarala, D. et al. (Accepted)" },
  { year: 2025, venue: "ICLAD", tag: "digital", title: "FedChip: Federated LLM for Artificial Intelligence Accelerator Chip Design", note: "Nazzal, M., Nguyen, K., Vungarala, D. et al. · arXiv:2508.13162" },
  { year: 2026, venue: "TCAD", tag: "imc", title: "LIMCA: LLM for Automating Analog In-Memory Computing Architecture Design Exploration", note: "Vungarala, D. et al. · IEEE TCAD · arXiv:2503.13301" },
  { year: 2025, venue: "ICLAD", tag: "digital", title: "TPU-Gen: LLM-Driven Custom Tensor Processing Unit Generator", note: "Vungarala, D. et al. · arXiv:2503.05951" },
  { year: 2025, venue: "FCCM", tag: "imc", title: "LLM-IMC: Automating Analog In-Memory Computing Architecture Generation with LLMs", note: "Vungarala, D. et al." },
  { year: 2024, venue: "ICRC", tag: "analog", title: "SPICEPilot: AI-Guided SPICE Code Generation", note: "Vungarala, D., Alam, S., Ghosh, A., & Angizi, S. · arXiv:2410.20553" },
  { year: 2025, venue: "ISCAS", tag: "digital", title: "SA-DS: A Dataset for LLM-Driven AI Accelerator Design Generation", note: "Vungarala, D. et al. · arXiv:2404.10875" },
  { year: 2025, venue: "GLSVLSI", tag: "imc", title: "From Prompt to Accelerator: A Perspective on LLM-Based Analog In-Memory Accelerator Design Automation", note: "Vungarala, D. et al." },
  { year: 2025, venue: "GLSVLSI", tag: "digital", title: "Maximizing Sub-Array Resource Utilization in Digital Processing-in-Memory", note: "Aragonda, G., Najafi, D., Vungarala, D. et al." },
  { year: 2023, venue: "MWSCAS", tag: "digital", title: "Comparative Study of Low Bit-width DNN Accelerators: Opportunities and Challenges", note: "Vungarala, D. et al., pp. 797–800" },
  { year: 2023, venue: "AIM", tag: "digital", title: "Pinch Sensor: An Input Device for In-Hand Manipulation with the Index Finger and Thumb", note: "Wang, C., Vungarala, D., Navarro, K., Adwani, N., & Han, T." }
];

const TIMELINE = [
  { role: "Research Assistant, ACAD Lab", org: "New Jersey Institute of Technology", date: "Jan 2024 — Present" },
  { role: "Research Intern", org: "Cognichip Inc.", date: "Sept 2025 — Aug 2026" },
  { role: "Teaching Assistant / Instructor", org: "New Jersey Institute of Technology", date: "Spring 2024 — Summer 2025" },
  { role: "Research Assistant, VLSI Lab", org: "New Jersey Institute of Technology", date: "Summer 2023" }
];

const CV_DATA = {
  education: [
    { title: "PhD, Computer Engineering", sub: "New Jersey Institute of Technology · Jan 2024 — Present (Expected May 2027) · CGPA 4.0/4.0" },
    { title: "MS, Electrical and Electronics Engineering", sub: "New Jersey Institute of Technology · Oct 2022 — Dec 2023 · CGPA 3.5/4.0" }
  ],
  awards: [
    { title: "NSF Student Award", sub: "MWSCAS '23" },
    { title: "Best Technical Presentation", sub: "" },
    { title: "Smart India Hackathon Finalist", sub: "" },
    { title: "Gold Medalist, State Boxing (twice)", sub: "" },
    { title: "Black Belt, Martial Arts", sub: "" }
  ],
  skills: [
    { title: "Programming", sub: "VHDL, Python, C, HSPICE, SPICE, Chisel HDL, Scala" },
    { title: "Tools", sub: "Mentor Graphics, ModelSim, MATLAB, PySpice, OpenROAD, Synopsys Design Compiler, Linux" },
    { title: "Hardware", sub: "Keysight Semiconductor Analyzer, Cascade MicroTech, Oscilloscope" }
  ],
  service: [
    { title: "Peer Reviewer", sub: "IEEE/ACM ICCAD, DATE, DAC, ASP-DAC, ICLAD, ISCAS" },
    { title: "Undergraduate Mentoring", sub: "ACAD Lab REU / research mentees" }
  ]
};
