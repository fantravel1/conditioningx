/**
 * ConditioningX Main JavaScript
 * Dynamic Recommendation Engine + Site Interactions
 */

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Initialize tabs
  initTabs();

  // Initialize recommendation engine if present
  if (document.querySelector('.recommender')) {
    initRecommender();
  }

  // Initialize heart rate calculator if present
  if (document.querySelector('#hr-calculator')) {
    initHRCalculator();
  }
});

// Tab System
function initTabs() {
  const tabGroups = document.querySelectorAll('[data-tabs]');

  tabGroups.forEach(group => {
    const tabs = group.querySelectorAll('.tab');
    const contents = group.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.target;

        // Update tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update content
        contents.forEach(c => {
          c.classList.remove('active');
          if (c.id === target) {
            c.classList.add('active');
          }
        });
      });
    });
  });
}

// ============================================
// DYNAMIC RECOMMENDATION ENGINE
// ============================================

const RecommendationEngine = {
  state: {
    step: 1,
    totalSteps: 5,
    selections: {
      time: null,
      equipment: null,
      location: null,
      experience: null,
      goal: null
    }
  },

  // Time options from README
  timeOptions: [
    { value: '5-10', label: '5-10 min', type: 'Micro Burst', intensity: 'Very High' },
    { value: '15-20', label: '15-20 min', type: 'Quick Hit', intensity: 'High' },
    { value: '25-35', label: '25-35 min', type: 'Standard', intensity: 'Moderate-High' },
    { value: '40-50', label: '40-50 min', type: 'Full Session', intensity: 'Moderate' },
    { value: '60', label: '60+ min', type: 'Endurance', intensity: 'Low-Moderate' },
    { value: '90', label: '90+ min', type: 'Long Steady', intensity: 'Low' }
  ],

  // Equipment levels from README
  equipmentLevels: [
    { value: 0, label: 'None', desc: 'Bodyweight only, no equipment' },
    { value: 1, label: 'Minimal', desc: 'Jump rope, bands, mat' },
    { value: 2, label: 'Home Basics', desc: 'Dumbbells, kettlebell, pull-up bar' },
    { value: 3, label: 'Home Gym', desc: 'Full weights, cardio machine' },
    { value: 4, label: 'Full Gym', desc: 'All equipment, pool, track' }
  ],

  // Location options from README
  locationOptions: {
    indoor: [
      { value: 'apartment-small', label: 'Small Apartment', constraints: 'Silent, <100 sq ft' },
      { value: 'apartment-large', label: 'Large Apartment', constraints: 'Some noise OK' },
      { value: 'house', label: 'House', constraints: 'Full noise OK' },
      { value: 'hotel', label: 'Hotel Room', constraints: 'Minimal space' },
      { value: 'office', label: 'Office', constraints: 'Limited time, privacy' },
      { value: 'dorm', label: 'Dorm Room', constraints: 'Shared space' },
      { value: 'gym-commercial', label: 'Commercial Gym', constraints: 'Full equipment' },
      { value: 'gym-crossfit', label: 'CrossFit Box', constraints: 'Full equipment' }
    ],
    outdoor: [
      { value: 'city-streets', label: 'City Streets', constraints: 'Sidewalks, stairs' },
      { value: 'park', label: 'Park', constraints: 'Open space, benches' },
      { value: 'beach', label: 'Beach', constraints: 'Sand, water' },
      { value: 'trail', label: 'Trail/Forest', constraints: 'Varied terrain' },
      { value: 'track', label: 'Track', constraints: 'Measured, flat' },
      { value: 'pool', label: 'Pool', constraints: 'Water access' }
    ]
  },

  // Experience levels from README
  experienceLevels: [
    { value: 'beginner', label: 'Beginner', desc: '0-6 months, building habits' },
    { value: 'intermediate', label: 'Intermediate', desc: '6-24 months, progressing' },
    { value: 'advanced', label: 'Advanced', desc: '24+ months, optimizing' }
  ],

  // Goals from README
  goals: [
    { value: 'health', label: 'General Health', desc: 'Well-rounded, sustainable' },
    { value: 'sport', label: 'Sport-Specific', desc: 'Targeted training' },
    { value: 'mental', label: 'Mental Health', desc: 'Mood boost, stress relief' },
    { value: 'social', label: 'Social Connection', desc: 'Partner/group workouts' }
  ],

  // Workout database (sample - would be expanded)
  workouts: [
    // Bodyweight HIIT
    {
      id: 1,
      title: 'Apartment-Friendly HIIT',
      modality: 'bodyweight',
      duration: 20,
      intensity: 'high',
      equipment: 0,
      locations: ['apartment-small', 'apartment-large', 'dorm', 'hotel'],
      experience: ['beginner', 'intermediate'],
      silent: true,
      description: 'No-jumping, neighbor-friendly high-intensity intervals'
    },
    {
      id: 2,
      title: 'Tabata Bodyweight Blast',
      modality: 'bodyweight',
      duration: 15,
      intensity: 'very-high',
      equipment: 0,
      locations: ['house', 'gym-commercial', 'park'],
      experience: ['intermediate', 'advanced'],
      silent: false,
      description: '4-minute Tabata cycles with full-body movements'
    },
    // Running
    {
      id: 3,
      title: 'Beginner Run/Walk Intervals',
      modality: 'running',
      duration: 25,
      intensity: 'moderate',
      equipment: 0,
      locations: ['city-streets', 'park', 'track', 'trail'],
      experience: ['beginner'],
      description: 'Alternating 2 min run, 1 min walk'
    },
    {
      id: 4,
      title: 'Tempo Run',
      modality: 'running',
      duration: 35,
      intensity: 'moderate-high',
      equipment: 0,
      locations: ['city-streets', 'park', 'track'],
      experience: ['intermediate', 'advanced'],
      description: 'Sustained comfortably hard pace'
    },
    // Jump Rope
    {
      id: 5,
      title: 'Jump Rope HIIT',
      modality: 'jump-rope',
      duration: 15,
      intensity: 'high',
      equipment: 1,
      locations: ['house', 'gym-commercial', 'park', 'dorm'],
      experience: ['beginner', 'intermediate'],
      description: '30 seconds on, 30 seconds rest intervals'
    },
    // Swimming
    {
      id: 6,
      title: 'Beginner Lap Swim',
      modality: 'swimming',
      duration: 30,
      intensity: 'moderate',
      equipment: 4,
      locations: ['pool'],
      experience: ['beginner', 'intermediate'],
      description: 'Mixed stroke, rest as needed'
    },
    // Kettlebell
    {
      id: 7,
      title: 'Kettlebell Flow',
      modality: 'kettlebell',
      duration: 25,
      intensity: 'moderate-high',
      equipment: 2,
      locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'],
      experience: ['intermediate', 'advanced'],
      description: 'Swings, cleans, snatches circuit'
    },
    // Dance
    {
      id: 8,
      title: 'Dance Cardio Party',
      modality: 'dance',
      duration: 30,
      intensity: 'moderate',
      equipment: 0,
      locations: ['house', 'apartment-large', 'gym-commercial'],
      experience: ['beginner', 'intermediate'],
      description: 'Fun, rhythm-based cardio movements'
    },
    // Cycling
    {
      id: 9,
      title: 'Stationary Bike Intervals',
      modality: 'cycling',
      duration: 30,
      intensity: 'high',
      equipment: 3,
      locations: ['house', 'gym-commercial'],
      experience: ['beginner', 'intermediate', 'advanced'],
      description: 'Alternating resistance sprints and recovery'
    },
    // Rowing
    {
      id: 10,
      title: 'Rowing Machine Endurance',
      modality: 'rowing',
      duration: 20,
      intensity: 'moderate',
      equipment: 3,
      locations: ['house', 'gym-commercial', 'gym-crossfit'],
      experience: ['beginner', 'intermediate'],
      description: 'Steady-state rowing for cardiovascular base'
    }
  ],

  getRecommendations() {
    const { time, equipment, location, experience, goal } = this.state.selections;

    // Parse time range
    let minTime = 0, maxTime = 999;
    if (time) {
      if (time === '90') {
        minTime = 90;
      } else if (time === '60') {
        minTime = 60;
        maxTime = 89;
      } else {
        const parts = time.split('-');
        minTime = parseInt(parts[0]);
        maxTime = parseInt(parts[1]) || minTime + 15;
      }
    }

    // Filter workouts
    let filtered = this.workouts.filter(w => {
      // Time filter
      if (time && (w.duration < minTime - 5 || w.duration > maxTime + 10)) {
        return false;
      }

      // Equipment filter
      if (equipment !== null && w.equipment > equipment) {
        return false;
      }

      // Location filter
      if (location && !w.locations.includes(location)) {
        return false;
      }

      // Experience filter
      if (experience && !w.experience.includes(experience)) {
        return false;
      }

      return true;
    });

    // Sort by relevance
    filtered.sort((a, b) => {
      // Prefer exact time matches
      const aTimeDiff = Math.abs(a.duration - minTime);
      const bTimeDiff = Math.abs(b.duration - minTime);
      return aTimeDiff - bTimeDiff;
    });

    return filtered.slice(0, 3);
  }
};

function initRecommender() {
  const recommender = document.querySelector('.recommender');
  if (!recommender) return;

  // Option card selection
  recommender.addEventListener('click', (e) => {
    const card = e.target.closest('.option-card');
    if (!card) return;

    const group = card.closest('.option-grid');
    const step = card.closest('.recommender-step');
    const selectionType = group.dataset.selection;

    // Deselect others in group
    group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    // Store selection
    RecommendationEngine.state.selections[selectionType] = card.dataset.value;
  });

  // Next/Prev buttons
  recommender.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;

      if (action === 'next') {
        if (RecommendationEngine.state.step < RecommendationEngine.state.totalSteps) {
          RecommendationEngine.state.step++;
          updateRecommenderUI();
        } else {
          showResults();
        }
      } else if (action === 'prev') {
        if (RecommendationEngine.state.step > 1) {
          RecommendationEngine.state.step--;
          updateRecommenderUI();
        }
      } else if (action === 'restart') {
        RecommendationEngine.state.step = 1;
        RecommendationEngine.state.selections = {
          time: null,
          equipment: null,
          location: null,
          experience: null,
          goal: null
        };
        updateRecommenderUI();
      }
    });
  });
}

function updateRecommenderUI() {
  const step = RecommendationEngine.state.step;

  // Update steps visibility
  document.querySelectorAll('.recommender-step').forEach((s, i) => {
    s.classList.toggle('active', i + 1 === step);
  });

  // Update progress dots
  document.querySelectorAll('.recommender-progress-dot').forEach((dot, i) => {
    dot.classList.remove('active', 'completed');
    if (i + 1 === step) {
      dot.classList.add('active');
    } else if (i + 1 < step) {
      dot.classList.add('completed');
    }
  });
}

function showResults() {
  const results = RecommendationEngine.getRecommendations();
  const resultsContainer = document.querySelector('.recommender-results');

  if (!resultsContainer) return;

  // Hide steps, show results
  document.querySelectorAll('.recommender-step').forEach(s => s.classList.remove('active'));
  resultsContainer.classList.add('active');

  // Render results
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="text-center py-lg">
        <h3>No exact matches found</h3>
        <p class="text-gray">Try adjusting your criteria for more options.</p>
        <button class="btn btn-primary mt-md" data-action="restart">Start Over</button>
      </div>
    `;
  } else {
    resultsContainer.innerHTML = `
      <h3 class="mb-lg">Your Personalized Workouts</h3>
      <div class="grid grid-3">
        ${results.map(w => `
          <div class="card workout-card">
            <div class="card-img" style="background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
              ${getModalityIcon(w.modality)}
            </div>
            <span class="workout-badge">${w.duration} min</span>
            <div class="card-body">
              <h4 class="card-title">${w.title}</h4>
              <div class="workout-meta">
                <span>${capitalize(w.modality)}</span>
                <span>${capitalize(w.intensity)}</span>
              </div>
              <p class="card-text">${w.description}</p>
              <a href="/workouts/${w.modality}/${w.id}.html" class="btn btn-primary btn-sm">Start Workout</a>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="text-center mt-xl">
        <button class="btn btn-outline" data-action="restart">Find Another Workout</button>
      </div>
    `;
  }

  // Re-attach event listeners
  resultsContainer.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.action === 'restart') {
        resultsContainer.classList.remove('active');
        RecommendationEngine.state.step = 1;
        RecommendationEngine.state.selections = {
          time: null,
          equipment: null,
          location: null,
          experience: null,
          goal: null
        };
        updateRecommenderUI();
      }
    });
  });
}

function getModalityIcon(modality) {
  const icons = {
    'bodyweight': '🏋️',
    'running': '🏃',
    'cycling': '🚴',
    'swimming': '🏊',
    'jump-rope': '⚡',
    'kettlebell': '🔔',
    'dance': '💃',
    'rowing': '🚣'
  };
  return icons[modality] || '💪';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

// ============================================
// HEART RATE CALCULATOR
// ============================================

function initHRCalculator() {
  const form = document.querySelector('#hr-calculator');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const age = parseInt(document.querySelector('#hr-age').value);
    const restingHR = parseInt(document.querySelector('#hr-resting').value) || null;

    if (!age || age < 10 || age > 100) {
      alert('Please enter a valid age between 10 and 100');
      return;
    }

    // Calculate max HR (Tanaka formula: 208 - 0.7 * age)
    const maxHR = Math.round(208 - (0.7 * age));

    // Calculate zones
    let zones;
    if (restingHR) {
      // Karvonen method (heart rate reserve)
      const hrr = maxHR - restingHR;
      zones = [
        { zone: 1, name: 'Recovery', min: Math.round(restingHR + hrr * 0.5), max: Math.round(restingHR + hrr * 0.6) },
        { zone: 2, name: 'Aerobic Base', min: Math.round(restingHR + hrr * 0.6), max: Math.round(restingHR + hrr * 0.7) },
        { zone: 3, name: 'Tempo', min: Math.round(restingHR + hrr * 0.7), max: Math.round(restingHR + hrr * 0.8) },
        { zone: 4, name: 'Threshold', min: Math.round(restingHR + hrr * 0.8), max: Math.round(restingHR + hrr * 0.9) },
        { zone: 5, name: 'Max Effort', min: Math.round(restingHR + hrr * 0.9), max: maxHR }
      ];
    } else {
      // Simple percentage method
      zones = [
        { zone: 1, name: 'Recovery', min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6) },
        { zone: 2, name: 'Aerobic Base', min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7) },
        { zone: 3, name: 'Tempo', min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8) },
        { zone: 4, name: 'Threshold', min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9) },
        { zone: 5, name: 'Max Effort', min: Math.round(maxHR * 0.9), max: maxHR }
      ];
    }

    // Display results
    const resultsDiv = document.querySelector('#hr-results');
    resultsDiv.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h3>Your Heart Rate Zones</h3>
          <p class="text-gray mb-lg">Estimated Max HR: <strong>${maxHR} bpm</strong></p>
          <div class="hr-zones">
            ${zones.map(z => `
              <div class="hr-zone hr-zone-${z.zone}">
                <span class="hr-zone-label">Zone ${z.zone}</span>
                <span class="hr-zone-name">${z.name}</span>
                <span class="hr-zone-range">${z.min} - ${z.max} bpm</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    resultsDiv.classList.remove('hidden');
  });
}

// ============================================
// WORKOUT TIMER
// ============================================

const WorkoutTimer = {
  intervals: [],
  currentInterval: 0,
  timeRemaining: 0,
  isRunning: false,
  timerInterval: null,

  init(intervals) {
    this.intervals = intervals;
    this.currentInterval = 0;
    this.timeRemaining = intervals[0]?.duration || 0;
    this.updateDisplay();
  },

  start() {
    if (this.isRunning) return;
    this.isRunning = true;

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;

      if (this.timeRemaining <= 0) {
        this.nextInterval();
      }

      this.updateDisplay();
    }, 1000);
  },

  pause() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
  },

  nextInterval() {
    this.currentInterval++;

    if (this.currentInterval >= this.intervals.length) {
      this.complete();
      return;
    }

    this.timeRemaining = this.intervals[this.currentInterval].duration;

    // Play sound or vibrate
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  },

  complete() {
    this.pause();
    // Show completion message
    const display = document.querySelector('.timer-display');
    if (display) {
      display.innerHTML = '<div class="timer-complete">Workout Complete!</div>';
    }
  },

  updateDisplay() {
    const display = document.querySelector('.timer-display');
    if (!display) return;

    const interval = this.intervals[this.currentInterval];
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;

    display.innerHTML = `
      <div class="timer-interval-name">${interval?.name || 'Ready'}</div>
      <div class="timer-time">${minutes}:${seconds.toString().padStart(2, '0')}</div>
      <div class="timer-progress">
        ${this.currentInterval + 1} / ${this.intervals.length}
      </div>
    `;
  }
};

// Export for use in other scripts
window.ConditioningX = {
  RecommendationEngine,
  WorkoutTimer
};
