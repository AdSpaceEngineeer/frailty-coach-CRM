export const safetyQuestions = [
  {
    id: "chestPain",
    label: "Chest pain, faintness, or severe breathlessness during activity",
    severity: "block"
  },
  {
    id: "newWeakness",
    label: "New sudden weakness, confusion, or neurological symptoms",
    severity: "block"
  },
  {
    id: "sharpPain",
    label: "Sharp joint pain or new injury",
    severity: "block"
  },
  {
    id: "unsafeSetup",
    label: "No stable chair/counter or clear walking path available",
    severity: "supervise"
  },
  {
    id: "needsAid",
    label: "Uses a walking aid or needs hands-on help",
    severity: "supervise"
  }
];

export const fallQuestions = [
  {
    id: "fellYear",
    label: "Had a fall in the last 12 months"
  },
  {
    id: "feelsUnsteady",
    label: "Feels unsteady when standing or walking"
  },
  {
    id: "worriesFall",
    label: "Worries about falling"
  },
  {
    id: "medsDizzy",
    label: "Medicines or dizziness affect balance"
  }
];

export const personas = {
  grace: {
    id: "grace",
    name: "Grace, 84",
    description: "Frail, recent fall, low activity",
    profile: {
      ageBand: "80+",
      mobilityAid: "cane",
      supervisionPreference: "caregiver nearby"
    },
    assessment: {
      tugSeconds: 22.4,
      chairStands: 4,
      balanceStage: 2,
      balanceSeconds: 7,
      gaitSpeed: 0.52,
      confidence: "medium"
    },
    safety: {
      chestPain: false,
      newWeakness: false,
      sharpPain: false,
      unsafeSetup: false,
      needsAid: true
    },
    fallRisk: {
      fellYear: true,
      feelsUnsteady: true,
      worriesFall: true,
      medsDizzy: false
    },
    wearable: {
      steps: 1850,
      activeMinutes: 12,
      sedentaryHours: 10.4,
      walkingSpeed: 0.58,
      restingHeartRate: 78,
      heartRecovery: 9,
      sleepHours: 5.7,
      sleepRegularity: 58,
      source: "Synced wearable"
    },
    adherence: {
      completedThisWeek: 1,
      missedSessions: 2
    },
    history: [
      { daysAgo: 28, score: 18, tugSeconds: 24.2, chairStands: 3, balanceStage: 1 },
      { daysAgo: 20, score: 20, tugSeconds: 23.7, chairStands: 3, balanceStage: 2 },
      { daysAgo: 14, score: 22, tugSeconds: 22.9, chairStands: 4, balanceStage: 2 },
      { daysAgo: 7, score: 25, tugSeconds: 22.6, chairStands: 4, balanceStage: 2 },
      { daysAgo: 2, score: 28, tugSeconds: 22.4, chairStands: 4, balanceStage: 2 }
    ]
  },
  daniel: {
    id: "daniel",
    name: "Daniel, 76",
    description: "Pre-frail, mostly independent",
    profile: {
      ageBand: "75-79",
      mobilityAid: "none",
      supervisionPreference: "independent"
    },
    assessment: {
      tugSeconds: 12.6,
      chairStands: 9,
      balanceStage: 3,
      balanceSeconds: 14,
      gaitSpeed: 0.92,
      confidence: "high"
    },
    safety: {
      chestPain: false,
      newWeakness: false,
      sharpPain: false,
      unsafeSetup: false,
      needsAid: false
    },
    fallRisk: {
      fellYear: false,
      feelsUnsteady: true,
      worriesFall: true,
      medsDizzy: false
    },
    wearable: {
      steps: 4700,
      activeMinutes: 28,
      sedentaryHours: 8.1,
      walkingSpeed: 0.95,
      restingHeartRate: 70,
      heartRecovery: 16,
      sleepHours: 6.5,
      sleepRegularity: 72,
      source: "Synced wearable"
    },
    adherence: {
      completedThisWeek: 3,
      missedSessions: 1
    },
    history: [
      { daysAgo: 28, score: 54, tugSeconds: 14.1, chairStands: 8, balanceStage: 3 },
      { daysAgo: 20, score: 57, tugSeconds: 13.5, chairStands: 9, balanceStage: 3 },
      { daysAgo: 14, score: 59, tugSeconds: 13.0, chairStands: 9, balanceStage: 3 },
      { daysAgo: 7, score: 61, tugSeconds: 12.8, chairStands: 9, balanceStage: 3 },
      { daysAgo: 2, score: 61, tugSeconds: 12.6, chairStands: 9, balanceStage: 3 }
    ]
  },
  mei: {
    id: "mei",
    name: "Mei, 69",
    description: "Robust, wants to stay strong",
    profile: {
      ageBand: "65-69",
      mobilityAid: "none",
      supervisionPreference: "independent"
    },
    assessment: {
      tugSeconds: 8.7,
      chairStands: 15,
      balanceStage: 4,
      balanceSeconds: 21,
      gaitSpeed: 1.22,
      confidence: "high"
    },
    safety: {
      chestPain: false,
      newWeakness: false,
      sharpPain: false,
      unsafeSetup: false,
      needsAid: false
    },
    fallRisk: {
      fellYear: false,
      feelsUnsteady: false,
      worriesFall: false,
      medsDizzy: false
    },
    wearable: {
      steps: 8400,
      activeMinutes: 54,
      sedentaryHours: 5.9,
      walkingSpeed: 1.2,
      restingHeartRate: 62,
      heartRecovery: 27,
      sleepHours: 7.4,
      sleepRegularity: 87,
      source: "Synced wearable"
    },
    adherence: {
      completedThisWeek: 5,
      missedSessions: 0
    },
    history: [
      { daysAgo: 28, score: 78, tugSeconds: 9.2, chairStands: 14, balanceStage: 4 },
      { daysAgo: 20, score: 80, tugSeconds: 9.0, chairStands: 15, balanceStage: 4 },
      { daysAgo: 14, score: 82, tugSeconds: 8.9, chairStands: 15, balanceStage: 4 },
      { daysAgo: 7, score: 86, tugSeconds: 8.8, chairStands: 15, balanceStage: 4 },
      { daysAgo: 2, score: 93, tugSeconds: 8.7, chairStands: 15, balanceStage: 4 }
    ]
  },
  alex: {
    id: "alex",
    name: "Alex, 72",
    description: "Very active, advanced program",
    profile: {
      ageBand: "70-74",
      mobilityAid: "none",
      supervisionPreference: "independent"
    },
    assessment: {
      tugSeconds: 6.9,
      chairStands: 22,
      balanceStage: 4,
      balanceSeconds: 30,
      gaitSpeed: 1.55,
      confidence: "high"
    },
    safety: {
      chestPain: false,
      newWeakness: false,
      sharpPain: false,
      unsafeSetup: false,
      needsAid: false
    },
    fallRisk: {
      fellYear: false,
      feelsUnsteady: false,
      worriesFall: false,
      medsDizzy: false
    },
    wearable: {
      steps: 11600,
      activeMinutes: 78,
      sedentaryHours: 4.8,
      walkingSpeed: 1.48,
      restingHeartRate: 56,
      heartRecovery: 35,
      sleepHours: 7.6,
      sleepRegularity: 91,
      source: "Synced wearable"
    },
    adherence: {
      completedThisWeek: 5,
      missedSessions: 0
    },
    history: [
      { daysAgo: 28, score: 88, tugSeconds: 7.2, chairStands: 21, balanceStage: 4 },
      { daysAgo: 20, score: 89, tugSeconds: 7.1, chairStands: 22, balanceStage: 4 },
      { daysAgo: 14, score: 91, tugSeconds: 7.0, chairStands: 22, balanceStage: 4 },
      { daysAgo: 7, score: 96, tugSeconds: 7.0, chairStands: 22, balanceStage: 4 },
      { daysAgo: 2, score: 100, tugSeconds: 6.9, chairStands: 22, balanceStage: 4 }
    ]
  }
};

export const workoutLibrary = {
  seated: {
    label: "Level A - seated/disability",
    support: "Chair required. Caregiver nearby if balance is uncertain.",
    exercises: [
      ["Seated marching", "2 sets of 30 seconds", "Keep posture tall and breathe normally."],
      ["Ankle pumps", "2 sets of 12 each side", "Move slowly through the full comfortable range."],
      ["Knee extensions", "2 sets of 8 each side", "Pause at the top without locking the knee."],
      ["Seated heel raises", "2 sets of 12", "Press through the balls of the feet."],
      ["Band or towel rows", "2 sets of 8", "Squeeze shoulder blades gently."],
      ["Supported sit-to-stand practice", "3 to 5 careful reps", "Use armrests and stop before fatigue."]
    ]
  },
  frail: {
    label: "Level B - frail",
    support: "Stable chair or counter required for standing work.",
    exercises: [
      ["Supported sit-to-stand", "2 sets of 5", "Use hands as needed and sit down with control."],
      ["Supported heel and toe raises", "2 sets of 8", "Hold the chair throughout."],
      ["Standing hip abduction", "2 sets of 6 each side", "Keep toes pointing forward."],
      ["Mini-marches", "2 sets of 20 seconds", "Lift knees only as high as comfortable."],
      ["Wall push-ups", "2 sets of 6", "Stand close enough to feel stable."],
      ["Short walking intervals", "3 rounds of 1 minute", "Use normal walking aid if prescribed."]
    ]
  },
  frailFallRisk: {
    label: "Level B+ - frail with fall-risk precautions",
    support: "Chair/counter support required. Caregiver supervision recommended.",
    exercises: [
      ["Supported sit-to-stand", "2 sets of 4", "Hands may stay on armrests."],
      ["Supported heel raises", "2 sets of 6", "Stop if balance feels uncertain."],
      ["Weight shifts", "2 sets of 20 seconds", "Keep both hands near support."],
      ["Standing hip taps", "2 sets of 5 each side", "Small controlled steps only."],
      ["Wall push-ups", "2 sets of 5", "Keep feet planted."],
      ["Hallway walk", "3 rounds of 45 seconds", "Walk with prescribed aid and supervision."]
    ]
  },
  prefrail: {
    label: "Level C - pre-frail",
    support: "Counter nearby for balance exercises.",
    exercises: [
      ["Chair squats", "2 sets of 8", "Hover above the chair before standing tall."],
      ["Calf raises", "2 sets of 10", "Use fingertip support."],
      ["Step taps", "2 sets of 8 each side", "Tap a low step or book."],
      ["Side steps", "2 sets of 8 each direction", "Keep knees soft."],
      ["Tandem stance near support", "3 holds of 10 seconds", "Touch support when needed."],
      ["Walking intervals", "5 rounds of 1 minute", "Stay at conversational intensity."]
    ]
  },
  robust: {
    label: "Level D - robust",
    support: "Support nearby for single-leg or step work.",
    exercises: [
      ["Squats to chair", "3 sets of 8", "Control the lowering phase."],
      ["Step-ups", "2 sets of 8 each side", "Use a low stable step."],
      ["Reverse lunge to support", "2 sets of 6 each side", "Hold support lightly."],
      ["Single-leg balance near support", "3 holds of 15 seconds", "Hover fingers over support."],
      ["Brisk walking intervals", "6 rounds of 90 seconds", "Recover until breathing settles."],
      ["Loaded carries", "3 rounds of 30 seconds", "Carry equal light weights if available."]
    ]
  },
  advanced: {
    label: "Level E - advanced robust",
    support: "Train with clear space and avoid pain-provoking ranges.",
    exercises: [
      ["Tempo squats", "3 sets of 10", "Lower for three seconds, stand smoothly."],
      ["Stair or step intervals", "6 rounds of 45 seconds", "Use handrail as needed."],
      ["Multi-directional balance taps", "3 sets of 6 each direction", "Move slowly and reset posture."],
      ["Fast walking intervals", "8 rounds of 1 minute", "Work hard but stay controlled."],
      ["Controlled power sit-to-stands", "3 sets of 6", "Stand quickly, sit slowly."],
      ["Loaded carries", "4 rounds of 40 seconds", "Keep shoulders level and ribs relaxed."]
    ]
  }
};
