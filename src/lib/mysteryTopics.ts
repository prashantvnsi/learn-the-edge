export type MysteryCategory =
    | "cosmology"
    | "physics"
    | "biology"
    | "neuroscience"
    | "earth"
    | "math"
    | "chemistry"
    | "ai";;

export type MysteryTopic = {
    id: string;
    title: string;
    category: MysteryCategory;
    hook: string;
    seed: number; // for CoverArt
    difficulty?: 1 | 2 | 3 | 4 | 5;
    // Optional: extra guidance for generation (helps quality)
    known?: string[];
    unknown?: string[];
    hypotheses?: string[];
    howToTest?: string[];
};

export const CATEGORY_META: Record<
    MysteryCategory,
    { label: string; badgeClass: string; gradientClass: string }
> = {
    cosmology: {
        label: "Cosmology",
        badgeClass: "bg-violet-500/15 text-violet-200 border-violet-400/30",
        gradientClass: "from-violet-500/30 via-fuchsia-500/20 to-sky-500/25",
    },
    physics: {
        label: "Physics",
        badgeClass: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
        gradientClass: "from-cyan-500/25 via-emerald-500/15 to-blue-500/25",
    },
    biology: {
        label: "Biology",
        badgeClass: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
        gradientClass: "from-emerald-500/25 via-lime-500/15 to-teal-500/25",
    },
    neuroscience: {
        label: "Mind & Brain",
        badgeClass: "bg-rose-500/15 text-rose-200 border-rose-400/30",
        gradientClass: "from-rose-500/25 via-orange-500/15 to-pink-500/25",
    },
    earth: {
        label: "Earth & Climate",
        badgeClass: "bg-amber-500/15 text-amber-200 border-amber-400/30",
        gradientClass: "from-amber-500/25 via-green-500/10 to-sky-500/25",
    },
    math: {
        label: "Math & Computation",
        badgeClass: "bg-indigo-500/15 text-indigo-200 border-indigo-400/30",
        gradientClass: "from-indigo-500/25 via-slate-500/10 to-fuchsia-500/25",
    },
    chemistry: {
        label: "Chemistry",
        badgeClass: "bg-teal-500/15 text-teal-200 border-teal-400/30",
        gradientClass: "from-teal-500/25 via-cyan-500/10 to-emerald-500/25",
    },
    ai: {
        label: "AI & Computing",
        badgeClass: "bg-sky-500/15 text-sky-200 border-sky-400/30",
        gradientClass: "from-sky-500/25 via-indigo-500/15 to-fuchsia-500/25",
    },
};

export const TOPICS: MysteryTopic[] = [
    {
        id: "dark-matter",
        title: "Dark Matter: The Invisible Sculptor of Galaxies",
        category: "cosmology",
        hook: "We see its gravity, but not its light.",
        seed: 11,
    },
    {
        id: "dark-energy",
        title: "Dark Energy: Why is the universe’s expansion accelerating?",
        category: "cosmology",
        hook: "The universe is speeding up — and we don’t know why.",
        seed: 13,
    },
    {
        id: "quantum-measurement",
        title: "Quantum Measurement: When does possibility become reality?",
        category: "physics",
        hook: "Quantum math predicts probabilities perfectly — but why do outcomes feel definite?",
        seed: 19,
    },
    {
        id: "abiogenesis",
        title: "Abiogenesis: How chemistry began to remember",
        category: "biology",
        hook: "How do lifeless molecules assemble into a system that can evolve?",
        seed: 31,
    },
    {
        id: "hubble-tension",
        title: "The Hubble Tension: Two rulers, two universe ages",
        category: "cosmology",
        hook: "One method says the universe expands faster than the other — and the gap won’t go away.",
        seed: 41,
        difficulty: 4,
        known: [
            "Early-universe measurements (CMB) infer a lower H0 than late-universe distance ladder methods.",
            "Systematic errors have been investigated for years without fully resolving the discrepancy."
        ],
        unknown: [
            "Whether the tension is due to hidden systematics or new physics.",
            "If new physics, what changes: dark energy behavior, neutrinos, or something else?"
        ],
        hypotheses: [
            "Early dark energy that briefly changes expansion before recombination.",
            "Unrecognized systematics in calibrators (Cepheids/SNe) or CMB modeling.",
            "New relativistic species or modified gravity effects."
        ],
        howToTest: [
            "Independent H0 measurements (strong lensing time delays, TRGB, standard sirens).",
            "Better CMB+BAO constraints and cross-checks across experiments.",
            "JWST-era distance ladder improvements and calibrator re-evaluation."
        ]
    },
    {
        id: "matter-antimatter",
        title: "Matter–Antimatter Asymmetry: Why is anything here at all?",
        category: "physics",
        hook: "The Big Bang should have made equal matter and antimatter — but the universe chose a side.",
        seed: 43,
        difficulty: 4,
        known: [
            "CP violation exists in the Standard Model but appears too small to explain the observed asymmetry.",
            "Baryogenesis requires conditions like CP violation, baryon number violation, and non-equilibrium processes."
        ],
        unknown: [
            "Where the missing antimatter went (or why it never formed in equal amounts).",
            "Whether new CP violation exists beyond the Standard Model."
        ],
        hypotheses: [
            "Leptogenesis via heavy neutrinos producing a lepton asymmetry that converts to baryon asymmetry.",
            "Electroweak baryogenesis with new particles/fields at the TeV scale.",
            "Other beyond-SM CP violating mechanisms."
        ],
        howToTest: [
            "Precision CP-violation measurements (quark and neutrino sectors).",
            "Searches for electric dipole moments (EDMs).",
            "Collider and astrophysical searches for new particles."
        ]
    },
    {
        id: "black-hole-information",
        title: "Black Hole Information: Does the universe forget?",
        category: "cosmology",
        hook: "If black holes evaporate, where does the information go — and what does that say about reality?",
        seed: 47,
        difficulty: 5,
        known: [
            "Hawking radiation suggests black holes can evaporate.",
            "Quantum mechanics is unitary (information-preserving) in standard formulations."
        ],
        unknown: [
            "How information is encoded in radiation, if at all.",
            "Whether spacetime locality breaks down near horizons."
        ],
        hypotheses: [
            "Information escapes in subtle correlations of Hawking radiation.",
            "Firewalls or modifications at the horizon.",
            "Holography: boundary descriptions encode bulk information."
        ],
        howToTest: [
            "Theoretical consistency checks across quantum gravity approaches.",
            "Analog black hole experiments (limited but suggestive).",
            "Better understanding of quantum entanglement in gravity (islands, etc.)."
        ]
    },
    {
        id: "quantum-gravity",
        title: "Quantum Gravity: Do spacetime and gravity have atoms?",
        category: "physics",
        hook: "General relativity treats spacetime as smooth — quantum theory suggests everything comes in quanta.",
        seed: 53,
        difficulty: 5,
        known: [
            "GR and quantum field theory are extremely successful in their domains.",
            "They become conceptually incompatible at singularities and Planck scales."
        ],
        unknown: [
            "What the microscopic structure of spacetime is (if any).",
            "How gravity fits into quantum frameworks without infinities."
        ],
        hypotheses: [
            "String theory: fundamental strings/branes and extra dimensions.",
            "Loop quantum gravity: quantized geometry (areas/volumes).",
            "Emergent gravity: spacetime emerges from entanglement/information."
        ],
        howToTest: [
            "Indirect signals: early-universe imprints, black hole physics constraints.",
            "High-precision tests of GR and possible deviations.",
            "Quantum experiments probing gravity-mediated entanglement (early-stage)."
        ]
    },
    {
        id: "why-time-flows",
        title: "Why does time seem to flow only forward?",
        category: "physics",
        hook: "The laws mostly work both ways — so why do we remember the past and not the future?",
        seed: 59,
        difficulty: 4,
        known: [
            "Microscopic laws are mostly time-reversal symmetric.",
            "Entropy increases in closed systems (Second Law), defining an arrow of time."
        ],
        unknown: [
            "Why the early universe began in such a low-entropy state.",
            "Whether the arrow of time is fundamental or emergent."
        ],
        hypotheses: [
            "Cosmological initial conditions set the arrow.",
            "Time’s arrow emerges from statistical mechanics and coarse-graining.",
            "Quantum measurement/decoherence plays a role in perceived irreversibility."
        ],
        howToTest: [
            "Better constraints on early-universe conditions and inflationary models.",
            "Experiments on thermodynamics in quantum systems.",
            "Foundational tests of time symmetry and irreversibility."
        ]
    },
    {
        id: "turbulence",
        title: "Turbulence: Why is flowing water so hard to predict?",
        category: "physics",
        hook: "A faucet’s swirl hides one of the deepest unsolved problems in physics and math.",
        seed: 61,
        difficulty: 5,
        known: [
            "Navier–Stokes equations describe fluid motion remarkably well.",
            "Turbulence is strongly nonlinear and chaotic across many scales."
        ],
        unknown: [
            "Whether smooth solutions always exist for Navier–Stokes in 3D (millennium problem).",
            "A complete predictive theory for turbulence statistics across regimes."
        ],
        hypotheses: [
            "Energy cascade models and intermittency corrections.",
            "Data-driven closures and reduced-order models.",
            "New mathematical techniques for singularity control."
        ],
        howToTest: [
            "Higher-resolution experiments and simulations to test scaling laws.",
            "Mathematical progress on existence/regularity.",
            "Cross-domain validation (atmosphere, oceans, engineering flows)."
        ]
    },
    {
        id: "p-vs-np",
        title: "P vs NP: When is solving as easy as checking?",
        category: "math",
        hook: "If P=NP, huge parts of computing, cryptography, and optimization would flip overnight.",
        seed: 67,
        difficulty: 5,
        known: [
            "Many important problems are NP-complete (hard in the worst case).",
            "We can verify solutions quickly, but finding them seems hard."
        ],
        unknown: [
            "Whether every efficiently verifiable problem is also efficiently solvable.",
            "The deep structure of computational hardness."
        ],
        hypotheses: [
            "Most researchers believe P ≠ NP, but no proof exists.",
            "Hardness may depend on fine-grained complexity assumptions."
        ],
        howToTest: [
            "New proof techniques in complexity theory (circuit lower bounds, etc.).",
            "Connections to algebraic geometry and logic.",
            "Exploring barriers (relativization, natural proofs) and breaking them."
        ]
    },
    {
        id: "consciousness",
        title: "Consciousness: Why is there something it’s like to be you?",
        category: "neuroscience",
        hook: "Brains process information — but subjective experience feels like a different kind of fact.",
        seed: 71,
        difficulty: 5,
        known: [
            "Specific brain networks correlate with awareness and reportable experience.",
            "Lesions, anesthesia, and sleep reliably change conscious states."
        ],
        unknown: [
            "Why certain computations feel like experience rather than dark processing.",
            "How to measure consciousness in non-verbal beings (infants, animals, AI)."
        ],
        hypotheses: [
            "Global Workspace: consciousness as broadcast across brain systems.",
            "Integrated Information Theory: experience corresponds to integrated causal structure.",
            "Predictive processing: perception as controlled hallucination with precision weighting."
        ],
        howToTest: [
            "Better perturbational measures (TMS/EEG, anesthesia gradients).",
            "Adversarial predictions between theories (different measurable signatures).",
            "Cross-species and clinical tests (disorders of consciousness)."
        ]
    },
    {
        id: "origin-of-life",
        title: "Origin of Life: The jump from chemistry to evolution",
        category: "biology",
        hook: "At some point molecules stopped merely reacting and started copying with variation.",
        seed: 73,
        difficulty: 4,
        known: [
            "Simple organic molecules form naturally in many environments.",
            "RNA can store information and catalyze reactions (ribozymes)."
        ],
        unknown: [
            "The first self-sustaining system: RNA world, metabolism-first, or something else?",
            "How early replication avoided error catastrophe."
        ],
        hypotheses: [
            "RNA world: informational polymers first.",
            "Metabolism-first: energy cycles and networks before genetics.",
            "Compartment-first: membranes enabling selection on protocells."
        ],
        howToTest: [
            "Lab synthesis of plausible protocells with growth/division.",
            "Geochemical simulations of early Earth conditions.",
            "Search for biosignatures and prebiotic chemistry on other worlds."
        ]
    },
    {
        id: "why-we-sleep",
        title: "Why do we sleep? The brain’s daily surrender",
        category: "biology",
        hook: "Sleep is costly and risky — so why do almost all complex animals need it?",
        seed: 79,
        difficulty: 3,
        known: [
            "Sleep affects memory, immune function, metabolism, and brain clearance processes.",
            "Sleep deprivation impairs cognition and can be fatal in extreme cases."
        ],
        unknown: [
            "Which function is primary: memory, repair, energy optimization, synaptic homeostasis, clearance…?",
            "Why different sleep stages exist (REM vs non-REM) with distinct roles."
        ],
        hypotheses: [
            "Synaptic homeostasis: downscaling connections to maintain learning capacity.",
            "Glymphatic clearance: removing metabolic waste from brain tissue.",
            "Memory consolidation and emotional regulation as core drivers."
        ],
        howToTest: [
            "Stage-specific interventions and causal manipulations in humans/animals.",
            "Longitudinal studies linking sleep architecture to cognition and disease.",
            "Mechanistic imaging/biomarkers for clearance and synaptic remodeling."
        ]
    },
    {
        id: "alignment",
        title: "AI Alignment: How do we guarantee an AI wants what we want?",
        category: "ai",
        hook: "Getting high scores isn’t the same as doing the right thing — especially at scale.",
        seed: 101,
        known: [
            "Models optimize objectives that can be misspecified or incomplete.",
            "Good performance on benchmarks doesn’t guarantee safe behavior in the wild.",
            "Training creates incentives that can differ from human intent."
        ],
        unknown: [
            "Whether scalable alignment is possible for very capable systems.",
            "How to specify values/constraints without loopholes or ambiguity.",
            "How to robustly prevent goal misgeneralization."
        ],
        hypotheses: [
            "Iterated oversight and scalable supervision (humans + models).",
            "Mechanistic interpretability to verify internal representations.",
            "Constitutional / rule-based training combined with monitoring."
        ],
        howToTest: [
            "Red teaming with adversarial prompts and environments.",
            "Generalization tests far outside training distribution.",
            "Audits using interpretability + formal verification where possible."
        ],
    },
    {
        id: "interpretability",
        title: "Interpretability: What is a neural network really thinking?",
        category: "ai",
        hook: "We can train systems that work — but can’t explain their internals reliably.",
        seed: 103,
        known: [
            "Neural nets contain distributed representations and nonlinear feature circuits.",
            "Some techniques recover meaningful features (attribution, sparse probing, circuits).",
            "Interpretability can fail under distribution shift or adversarial pressure."
        ],
        unknown: [
            "Whether we can produce faithful, scalable explanations for large models.",
            "How to detect deception or hidden objectives using internal signals.",
            "What level of abstraction is the ‘right’ explanation for humans."
        ],
        hypotheses: [
            "Sparse feature decompositions (dictionary learning) reveal stable concepts.",
            "Circuit-based analysis can map pathways for specific behaviors.",
            "Hybrid explanations: mechanistic + causal + user-level narratives."
        ],
        howToTest: [
            "Hold-out ‘explanation benchmarks’ where ground-truth mechanisms are known.",
            "Interventions: edit internal features and observe causal behavior changes.",
            "Robustness tests: explanations should predict behavior under perturbations."
        ],
    },
    {
        id: "ai-reasoning",
        title: "Reasoning in AI: Do models truly reason or just pattern-match?",
        category: "ai",
        hook: "Sometimes models look like they reason — until the rules change slightly.",
        seed: 107,
        known: [
            "Models can solve many reasoning-like tasks, but are brittle to format changes.",
            "Chain-of-thought can improve performance but isn’t always faithful.",
            "Tool use and retrieval can boost reliability dramatically."
        ],
        unknown: [
            "Whether internal representations correspond to systematic reasoning algorithms.",
            "How to get consistent reasoning under distribution shift.",
            "How to evaluate reasoning quality beyond final-answer accuracy."
        ],
        hypotheses: [
            "Hybrid systems (LLM + tools + verifiers) emulate reasoning more reliably.",
            "Training on process-level supervision yields more robust reasoning.",
            "Explicit planning modules or memory structures improve generalization."
        ],
        howToTest: [
            "Counterfactual evaluation: small rule changes, compositional generalization tests.",
            "Verifier-based eval: check intermediate steps against formal constraints.",
            "Ablations/interventions on internal activations to test causal reasoning."
        ],
    },
    {
        id: "hallucinations",
        title: "Hallucinations: Why do AI models confidently make things up?",
        category: "ai",
        hook: "Fluent language can hide uncertainty — and sometimes invent facts.",
        seed: 109,
        known: [
            "Models are trained to predict plausible continuations, not guaranteed truth.",
            "Retrieval and grounding reduce hallucinations, but don’t eliminate them.",
            "Uncertainty calibration is hard for generative models."
        ],
        unknown: [
            "How to ensure truthfulness without sacrificing helpfulness and creativity.",
            "How to measure factual reliability across domains and time.",
            "How to prevent subtle ‘near-truth’ distortions."
        ],
        hypotheses: [
            "Grounding with citations + constrained decoding reduces ungrounded claims.",
            "Training with verifiers / tool checks reduces hallucinations.",
            "Better uncertainty estimation (selective answering) improves trust."
        ],
        howToTest: [
            "Open-book evaluations with required citations and source auditing.",
            "Adversarial fact-checking and time-sensitive tests.",
            "Calibration metrics: abstain vs answer tradeoff curves."
        ],
    },
    {
        id: "robustness",
        title: "Robustness: Why do small changes break AI systems?",
        category: "ai",
        hook: "A tiny perturbation can cause a model to fail — why is intelligence so fragile?",
        seed: 113,
        known: [
            "Adversarial examples exist in vision and language settings.",
            "Distribution shift is a major cause of real-world failures.",
            "Ensembles and augmentation help, but don’t fully solve it."
        ],
        unknown: [
            "Whether there’s a universal recipe for robustness under shift.",
            "How to guarantee safety when inputs can be adversarial.",
            "How to detect when the model is out of its depth."
        ],
        hypotheses: [
            "Self-monitoring (uncertainty + anomaly detection) prevents silent failures.",
            "Robust training objectives can align gradients with meaningful features.",
            "Causal representation learning improves generalization."
        ],
        howToTest: [
            "Stress tests across many shifts: noise, style, domain, task framing.",
            "Adversarial red-team suites for your specific app scenario.",
            "Out-of-distribution detection benchmarks tied to real deployment data."
        ],
    },
    {
        id: "abiotic-organic-synthesis",
        title: "Prebiotic Chemistry: Which path built life’s first ingredients?",
        category: "chemistry",
        hook: "We can make many building blocks — but which route actually happened on early Earth?",
        seed: 201,
        known: [
            "Simple organics can form under plausible conditions (atmospheres, vents, meteorites).",
            "Multiple synthesis pathways exist for amino acids, nucleobases, lipids."
        ],
        unknown: [
            "Which pathway dominated in Earth’s early environment.",
            "How fragile intermediates accumulated rather than getting destroyed."
        ],
        hypotheses: [
            "Wet-dry cycles concentrate and polymerize molecules.",
            "Hydrothermal vents drive energy-rich chemistry.",
            "Extraterrestrial delivery provided crucial feedstock."
        ],
        howToTest: [
            "Lab simulations that integrate realistic geochemistry + timescales.",
            "Better constraints on early atmosphere/ocean composition.",
            "Comparisons with chemistry found in meteorites/comets."
        ],
    },
    {
        id: "enzyme-origin",
        title: "The Origin of Enzymes: How did chemistry invent catalysts?",
        category: "chemistry",
        hook: "Life runs on catalysts — but where did the first catalytic systems come from?",
        seed: 203,
        known: [
            "RNA can catalyze reactions (ribozymes).",
            "Mineral surfaces can catalyze some key reactions."
        ],
        unknown: [
            "How early catalysis became specific and efficient.",
            "How catalytic networks avoided collapsing into side reactions."
        ],
        hypotheses: [
            "RNA-world catalysis predates proteins.",
            "Mineral-assisted proto-metabolism preceded genetics.",
            "Simple peptides acted as early catalysts and scaffolds."
        ],
        howToTest: [
            "Discover minimal catalytic sequences and conditions supporting them.",
            "Map catalytic networks and their stability under plausible environments.",
            "Demonstrate self-sustaining autocatalytic sets experimentally."
        ],
    },
    {
        id: "chemical-origins-of-homochirality",
        title: "Homochirality: Why does life choose one ‘handedness’?",
        category: "chemistry",
        hook: "Biology uses mostly left-handed amino acids — why not a 50/50 mix?",
        seed: 207,
        known: [
            "Non-living chemistry typically produces racemic mixtures.",
            "Some physical processes can bias chirality slightly."
        ],
        unknown: [
            "How small biases amplified into global biological uniformity.",
            "Whether chirality selection is contingent or inevitable."
        ],
        hypotheses: [
            "Asymmetric catalysis amplified by autocatalytic feedback.",
            "Circularly polarized light induced bias in space/early Earth.",
            "Crystallization selection mechanisms."
        ],
        howToTest: [
            "Reproduce plausible amplification pathways in lab prebiotic setups.",
            "Measure chiral excess signatures in meteorites and interstellar chemistry.",
            "Model long-term stability of chiral dominance under environmental noise."
        ],
    },
    {
        id: "room-temperature-superconductivity",
        title: "Room-Temperature Superconductivity: Can resistance vanish without extreme cooling?",
        category: "chemistry",
        hook: "We can superconduct at high pressures — but can we do it in everyday materials?",
        seed: 211,
        known: [
            "Superconductivity arises from collective quantum states.",
            "Some hydrides show high critical temperatures under extreme pressure."
        ],
        unknown: [
            "A reliable pathway to ambient-pressure, high-temperature superconductors.",
            "Which mechanisms dominate in unconventional superconductors."
        ],
        hypotheses: [
            "New lattice structures that stabilize strong electron-phonon coupling.",
            "Exotic pairing mechanisms in layered materials.",
            "Materials-by-design guided by computation and synthesis."
        ],
        howToTest: [
            "Systematic synthesis + characterization of candidate families.",
            "Better theory linking structure to pairing mechanisms.",
            "Reproducible experiments with transparent measurement protocols."
        ],
    },
    {
        id: "earthquake-prediction",
        title: "Earthquake Prediction: Is short-term prediction fundamentally impossible?",
        category: "earth",
        hook: "We can forecast risk over decades — but can we ever predict next week’s quake?",
        seed: 301,
        known: [
            "Fault systems are complex, nonlinear, and partially observed.",
            "We can map hazard zones and recurrence statistics in some regions."
        ],
        unknown: [
            "Whether reliable short-term precursors exist across different fault types.",
            "Whether the system is too chaotic/noisy for deterministic prediction."
        ],
        hypotheses: [
            "Some precursors exist but are buried in noise and require dense sensing.",
            "Prediction is limited, but early-warning seconds/minutes can be improved.",
            "New statistical models can improve probabilistic near-term forecasts."
        ],
        howToTest: [
            "Massively improved sensor networks (seismic, GPS, strain, fluids).",
            "Retrospective testing on blind datasets (no cherry-picking).",
            "Physics-based simulations + data assimilation."
        ],
    },
    {
        id: "cloud-feedback",
        title: "Cloud Feedback: The biggest uncertainty in climate sensitivity",
        category: "earth",
        hook: "A small change in clouds can swing the future warming by a lot — and clouds are hard.",
        seed: 307,
        known: [
            "Clouds affect Earth’s energy balance through albedo and greenhouse effects.",
            "Different cloud types respond differently to warming."
        ],
        unknown: [
            "Net cloud feedback sign/magnitude in key regions.",
            "How small-scale cloud microphysics aggregates to global effects."
        ],
        hypotheses: [
            "Low cloud cover changes could amplify warming.",
            "Aerosol interactions complicate observed relationships.",
            "High-resolution models may converge on more stable estimates."
        ],
        howToTest: [
            "More detailed satellite observations and retrieval improvements.",
            "Cloud-resolving models at scale + better parameterizations.",
            "Long-term regional process studies linking microphysics to radiation."
        ],
    },
    {
        id: "lightning-initiation",
        title: "Lightning Initiation: What actually triggers the first spark?",
        category: "earth",
        hook: "We know storms build charge — but how does the discharge begin?",
        seed: 311,
        known: [
            "Charge separation occurs in thunderclouds via ice/graupel collisions.",
            "Lightning produces strong electric fields and complex leader structures."
        ],
        unknown: [
            "The exact initiation mechanism and the role of cosmic rays/runaway electrons.",
            "Why some storms produce lots of lightning and others don’t."
        ],
        hypotheses: [
            "Runaway breakdown driven by energetic electrons.",
            "Localized field enhancements due to turbulence and hydrometeors.",
            "Hybrid mechanisms combining microphysics and high-energy processes."
        ],
        howToTest: [
            "High-speed radio/optical mapping of leader formation.",
            "In-storm measurements via drones/balloons with careful safety constraints.",
            "Coupled storm microphysics + electromagnetism simulations."
        ],
    },
    {
        id: "climate-predictability",
        title: "Climate Predictability: Where does chaos end and forecast skill begin?",
        category: "earth",
        hook: "Some climate patterns are predictable months ahead — others vanish into chaos.",
        seed: 313,
        known: [
            "ENSO provides seasonal predictability in many regions.",
            "Ocean heat content provides memory in the climate system."
        ],
        unknown: [
            "Limits of predictability for regional extremes (heatwaves, floods).",
            "How model biases constrain practical forecast skill."
        ],
        hypotheses: [
            "Better ocean observations + assimilation extends predictability windows.",
            "High-resolution models capture key dynamics behind extremes.",
            "Multi-model ensembles reduce uncertainty and bias."
        ],
        howToTest: [
            "Forecast skill competitions on blinded hindcast sets.",
            "Improved observing systems (Argo, satellites) + assimilation methods.",
            "Better evaluation metrics tied to decisions (risk, extremes)."
        ],
    },

];
