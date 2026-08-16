const THRUSTS = [
  {
    label: "analog / rf",
    projects: "RL-AmpSyn · G-DiffPS",
    glyph: `<line x1="20" y1="45" x2="60" y2="20" stroke="var(--edge)"/><line x1="60" y1="20" x2="120" y2="20" stroke="var(--edge)"/><line x1="120" y1="20" x2="160" y2="45" stroke="var(--edge)"/><line x1="60" y1="20" x2="90" y2="50" stroke="var(--edge)"/><rect x="14" y="39" width="12" height="12" fill="none" stroke="var(--node)"/><circle cx="60" cy="20" r="4" fill="var(--node)"/><circle cx="120" cy="20" r="4" fill="var(--node)"/><circle cx="160" cy="45" r="4" fill="var(--node-bright)"/><path d="M82 44 a8 8 0 1 1 16 0" stroke="var(--node)" fill="none"/>`
  },
  {
    label: "photonics",
    projects: "PICasso · PICasso+",
    glyph: `<line x1="15" y1="30" x2="70" y2="30" stroke="var(--edge)"/><circle cx="105" cy="30" r="24" stroke="var(--edge)" fill="none"/><line x1="140" y1="30" x2="200" y2="30" stroke="var(--edge)"/><circle cx="70" cy="30" r="3.5" fill="var(--node)"/><circle cx="140" cy="30" r="3.5" fill="var(--node)"/><circle cx="105" cy="6" r="3" fill="var(--node-bright)"/>`
  },
  {
    label: "digital / tpu",
    projects: "TPU-Gen · ARCANE",
    glyph: `<rect x="20" y="10" width="14" height="14" fill="none" stroke="var(--edge)"/><rect x="20" y="28" width="14" height="14" fill="none" stroke="var(--edge)"/><rect x="60" y="19" width="14" height="14" fill="none" stroke="var(--edge)"/><line x1="34" y1="17" x2="60" y2="26" stroke="var(--edge)"/><line x1="34" y1="35" x2="60" y2="26" stroke="var(--edge)"/><line x1="74" y1="26" x2="130" y2="26" stroke="var(--edge)"/><circle cx="27" cy="17" r="2.5" fill="var(--node)"/><circle cx="27" cy="35" r="2.5" fill="var(--node)"/><circle cx="67" cy="26" r="2.5" fill="var(--node)"/><circle cx="130" cy="26" r="3" fill="var(--node-bright)"/>`
  },
  {
    label: "in-memory computing",
    projects: "LIMCA · IMCsim",
    glyph: `<line x1="20" y1="10" x2="20" y2="40" stroke="var(--edge)"/><line x1="45" y1="10" x2="45" y2="40" stroke="var(--edge)"/><line x1="70" y1="10" x2="70" y2="40" stroke="var(--edge)"/><line x1="10" y1="15" x2="80" y2="15" stroke="var(--edge)"/><line x1="10" y1="35" x2="80" y2="35" stroke="var(--edge)"/><circle cx="20" cy="15" r="2.5" fill="var(--node)"/><circle cx="45" cy="15" r="2.5" fill="var(--node-bright)"/><circle cx="70" cy="35" r="2.5" fill="var(--node)"/><line x1="80" y1="25" x2="140" y2="25" stroke="var(--edge)"/><circle cx="140" cy="25" r="3" fill="var(--node)"/>`
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
