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

  // Comprehensive Workout Database - Covers all location/time/experience combinations
  workouts: [
    // ============================================
    // SILENT BODYWEIGHT (Equipment 0) - For restricted spaces
    // Covers: apartment-small, hotel, office, dorm
    // ============================================

    // 5-10 min Silent Workouts
    { id: 1, title: 'Silent Morning Stretch', modality: 'bodyweight', duration: 7, intensity: 'low', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], silent: true, description: 'Gentle full-body stretching to start your day without disturbing neighbors' },
    { id: 2, title: 'Micro Core Blast', modality: 'bodyweight', duration: 8, intensity: 'high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['beginner', 'intermediate'], silent: true, description: 'Quick ab-focused routine with planks and crunches' },
    { id: 3, title: 'Advanced Isometric Hold', modality: 'bodyweight', duration: 10, intensity: 'very-high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['advanced'], silent: true, description: 'Challenging static holds for maximum muscle engagement' },

    // 15-20 min Silent Workouts
    { id: 4, title: 'Apartment-Friendly HIIT', modality: 'bodyweight', duration: 20, intensity: 'high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'dorm', 'hotel', 'house'], experience: ['beginner', 'intermediate'], silent: true, description: 'No-jumping, neighbor-friendly high-intensity intervals' },
    { id: 5, title: 'Silent Strength Circuit', modality: 'bodyweight', duration: 18, intensity: 'moderate-high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['intermediate', 'advanced'], silent: true, description: 'Push-ups, squats, and lunges with controlled movements' },
    { id: 6, title: 'Office Desk Workout', modality: 'bodyweight', duration: 15, intensity: 'moderate', equipment: 0, locations: ['office', 'hotel', 'apartment-small', 'dorm'], experience: ['beginner', 'intermediate', 'advanced'], silent: true, description: 'Chair-assisted exercises for the workplace' },

    // 25-35 min Silent Workouts
    { id: 7, title: 'Silent Yoga Flow', modality: 'yoga', duration: 30, intensity: 'moderate', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['beginner', 'intermediate'], silent: true, description: 'Flowing yoga sequence perfect for small spaces' },
    { id: 8, title: 'Low-Impact HIIT', modality: 'bodyweight', duration: 28, intensity: 'moderate-high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], silent: true, description: 'High-intensity intervals without any jumping' },
    { id: 9, title: 'Advanced Calisthenics Basics', modality: 'bodyweight', duration: 35, intensity: 'high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['advanced'], silent: true, description: 'Pike push-ups, pistol squats, and advanced progressions' },

    // 40-50 min Silent Workouts
    { id: 10, title: 'Full Body Slow Burn', modality: 'bodyweight', duration: 45, intensity: 'moderate', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['beginner', 'intermediate'], silent: true, description: 'Extended workout with slow, controlled movements' },
    { id: 11, title: 'Pilates Core Session', modality: 'pilates', duration: 50, intensity: 'moderate', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], silent: true, description: 'Classical Pilates mat exercises for core strength' },
    { id: 12, title: 'Advanced Mobility Flow', modality: 'mobility', duration: 45, intensity: 'moderate', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['advanced'], silent: true, description: 'Deep stretching and joint mobility work' },

    // 60+ min Silent Workouts
    { id: 13, title: 'Gentle Yoga Journey', modality: 'yoga', duration: 60, intensity: 'low', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['beginner', 'intermediate'], silent: true, description: 'Extended restorative yoga practice' },
    { id: 14, title: 'Power Yoga Extended', modality: 'yoga', duration: 75, intensity: 'moderate-high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['intermediate', 'advanced'], silent: true, description: 'Challenging vinyasa flow for strength and flexibility' },
    { id: 15, title: 'Bodyweight Endurance', modality: 'bodyweight', duration: 65, intensity: 'moderate', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['advanced'], silent: true, description: 'High-rep bodyweight training for muscular endurance' },

    // 90+ min Silent Workouts
    { id: 16, title: 'Yin Yoga Deep Stretch', modality: 'yoga', duration: 90, intensity: 'low', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], silent: true, description: 'Long-hold stretches for deep tissue release' },
    { id: 17, title: 'Movement Practice', modality: 'mobility', duration: 95, intensity: 'low-moderate', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['intermediate', 'advanced'], silent: true, description: 'Exploratory movement combining yoga, mobility, and bodyweight' },

    // ============================================
    // FULL BODYWEIGHT (Equipment 0) - For spaces with more freedom
    // Covers: house, gym-commercial, gym-crossfit, outdoor locations
    // ============================================

    // 5-10 min Bodyweight
    { id: 18, title: 'Tabata Bodyweight Blast', modality: 'bodyweight', duration: 8, intensity: 'very-high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park', 'beach', 'city-streets'], experience: ['intermediate', 'advanced'], silent: false, description: '4-minute Tabata with burpees and jump squats' },
    { id: 19, title: 'Quick Cardio Burst', modality: 'bodyweight', duration: 10, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park', 'city-streets', 'trail'], experience: ['beginner', 'intermediate'], silent: false, description: 'Jumping jacks, high knees, and mountain climbers' },

    // 15-20 min Bodyweight
    { id: 20, title: 'EMOM Bodyweight Challenge', modality: 'bodyweight', duration: 20, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], silent: false, description: 'Every Minute On the Minute full-body exercises' },
    { id: 21, title: 'Beginner Cardio Circuit', modality: 'bodyweight', duration: 18, intensity: 'moderate', equipment: 0, locations: ['house', 'gym-commercial', 'park', 'city-streets'], experience: ['beginner'], silent: false, description: 'Simple movements to build cardio base' },

    // 25-35 min Bodyweight
    { id: 22, title: 'CrossFit Baseline', modality: 'bodyweight', duration: 30, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], silent: false, description: 'Classic CrossFit bodyweight benchmark workout' },
    { id: 23, title: 'Beach Body Workout', modality: 'bodyweight', duration: 30, intensity: 'moderate-high', equipment: 0, locations: ['beach', 'park', 'house'], experience: ['beginner', 'intermediate', 'advanced'], silent: false, description: 'Sand-friendly exercises for a full-body burn' },

    // 40-50 min Bodyweight
    { id: 24, title: 'Calisthenics Fundamentals', modality: 'bodyweight', duration: 45, intensity: 'moderate-high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['beginner', 'intermediate'], silent: false, description: 'Push, pull, squat patterns for strength' },
    { id: 25, title: 'Advanced Calisthenics', modality: 'bodyweight', duration: 50, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['advanced'], silent: false, description: 'Muscle-ups, handstands, and planche progressions' },

    // 60+ min Bodyweight
    { id: 26, title: 'Bodyweight Strength Builder', modality: 'bodyweight', duration: 60, intensity: 'moderate', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['beginner', 'intermediate'], silent: false, description: 'Extended strength session with proper rest periods' },
    { id: 27, title: 'Calisthenics Mastery', modality: 'bodyweight', duration: 70, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['advanced'], silent: false, description: 'Advanced skills and strength progressions' },

    // 90+ min Bodyweight
    { id: 28, title: 'Outdoor Bootcamp', modality: 'bodyweight', duration: 90, intensity: 'moderate', equipment: 0, locations: ['park', 'beach', 'house', 'gym-crossfit'], experience: ['beginner', 'intermediate', 'advanced'], silent: false, description: 'Extended outdoor training session' },

    // ============================================
    // RUNNING (Equipment 0) - Outdoor focused
    // Covers: city-streets, park, trail, track, beach
    // ============================================

    // 5-10 min Running
    { id: 29, title: 'Sprint Intervals', modality: 'running', duration: 10, intensity: 'very-high', equipment: 0, locations: ['track', 'park', 'city-streets'], experience: ['intermediate', 'advanced'], description: 'Short all-out sprints with rest periods' },
    { id: 30, title: 'Quick Jog Warm-up', modality: 'running', duration: 8, intensity: 'low', equipment: 0, locations: ['city-streets', 'park', 'trail', 'track', 'beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Easy jogging to get the blood flowing' },

    // 15-20 min Running
    { id: 31, title: 'Beginner Run/Walk', modality: 'running', duration: 20, intensity: 'moderate', equipment: 0, locations: ['city-streets', 'park', 'track', 'trail'], experience: ['beginner'], description: 'Alternating 2 min run, 1 min walk' },
    { id: 32, title: 'Fartlek Fun Run', modality: 'running', duration: 18, intensity: 'moderate-high', equipment: 0, locations: ['city-streets', 'park', 'trail'], experience: ['intermediate', 'advanced'], description: 'Playful speed variations throughout your run' },
    { id: 33, title: 'Beach Sprint Session', modality: 'running', duration: 15, intensity: 'high', equipment: 0, locations: ['beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Sand sprints for explosive power' },

    // 25-35 min Running
    { id: 34, title: 'Easy Base Run', modality: 'running', duration: 30, intensity: 'moderate', equipment: 0, locations: ['city-streets', 'park', 'trail', 'track'], experience: ['beginner', 'intermediate'], description: 'Conversational pace to build aerobic base' },
    { id: 35, title: 'Tempo Run', modality: 'running', duration: 35, intensity: 'moderate-high', equipment: 0, locations: ['city-streets', 'park', 'track'], experience: ['intermediate', 'advanced'], description: 'Sustained comfortably hard pace' },
    { id: 36, title: 'Trail Discovery Run', modality: 'running', duration: 30, intensity: 'moderate', equipment: 0, locations: ['trail', 'park'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Explore nature trails at an easy pace' },

    // 40-50 min Running
    { id: 37, title: 'Progression Run', modality: 'running', duration: 45, intensity: 'moderate-high', equipment: 0, locations: ['city-streets', 'park', 'track', 'trail'], experience: ['intermediate', 'advanced'], description: 'Start easy, finish fast progression' },
    { id: 38, title: 'Beginner Long Run', modality: 'running', duration: 40, intensity: 'low-moderate', equipment: 0, locations: ['city-streets', 'park', 'trail'], experience: ['beginner'], description: 'Extended easy running to build endurance' },
    { id: 39, title: 'Track Intervals', modality: 'running', duration: 45, intensity: 'high', equipment: 0, locations: ['track'], experience: ['intermediate', 'advanced'], description: '400m and 800m repeats with recovery jogs' },

    // 60+ min Running
    { id: 40, title: 'Long Slow Distance', modality: 'running', duration: 60, intensity: 'low-moderate', equipment: 0, locations: ['city-streets', 'park', 'trail', 'track', 'beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended easy running for endurance base' },
    { id: 41, title: 'Trail Long Run', modality: 'running', duration: 75, intensity: 'moderate', equipment: 0, locations: ['trail', 'park'], experience: ['intermediate', 'advanced'], description: 'Extended trail running with elevation' },

    // 90+ min Running
    { id: 42, title: 'Marathon Training Run', modality: 'running', duration: 90, intensity: 'low-moderate', equipment: 0, locations: ['city-streets', 'park', 'trail'], experience: ['intermediate', 'advanced'], description: 'Long run for marathon preparation' },
    { id: 43, title: 'Ultra Training Run', modality: 'running', duration: 120, intensity: 'low', equipment: 0, locations: ['trail', 'park', 'city-streets'], experience: ['advanced'], description: 'Extended time on feet for ultra preparation' },
    { id: 44, title: 'Beginner Distance Builder', modality: 'running', duration: 90, intensity: 'low', equipment: 0, locations: ['city-streets', 'park', 'trail'], experience: ['beginner'], description: 'Run/walk intervals for building endurance' },

    // ============================================
    // MINIMAL EQUIPMENT (Equipment 1) - Bands, jump rope, mat
    // ============================================

    // 5-10 min Minimal
    { id: 45, title: 'Jump Rope Sprint', modality: 'jump-rope', duration: 8, intensity: 'very-high', equipment: 1, locations: ['house', 'gym-commercial', 'park', 'apartment-large'], experience: ['intermediate', 'advanced'], description: 'High-speed jump rope intervals' },
    { id: 46, title: 'Band Activation', modality: 'resistance-bands', duration: 10, intensity: 'moderate', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Resistance band warm-up and activation' },

    // 15-20 min Minimal
    { id: 47, title: 'Jump Rope HIIT', modality: 'jump-rope', duration: 15, intensity: 'high', equipment: 1, locations: ['house', 'gym-commercial', 'park', 'apartment-large'], experience: ['beginner', 'intermediate'], description: '30 seconds on, 30 seconds rest intervals' },
    { id: 48, title: 'Band Total Body', modality: 'resistance-bands', duration: 20, intensity: 'moderate', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Full body workout with resistance bands only' },
    { id: 49, title: 'Advanced Jump Rope Skills', modality: 'jump-rope', duration: 18, intensity: 'high', equipment: 1, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['advanced'], description: 'Double unders and complex footwork patterns' },

    // 25-35 min Minimal
    { id: 50, title: 'Band Strength Circuit', modality: 'resistance-bands', duration: 30, intensity: 'moderate-high', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house', 'office'], experience: ['beginner', 'intermediate'], description: 'Resistance band strength training circuit' },
    { id: 51, title: 'Jump Rope Cardio Flow', modality: 'jump-rope', duration: 25, intensity: 'moderate-high', equipment: 1, locations: ['house', 'gym-commercial', 'park'], experience: ['intermediate', 'advanced'], description: 'Extended jump rope session with variety' },
    { id: 52, title: 'Advanced Band Training', modality: 'resistance-bands', duration: 35, intensity: 'high', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house', 'gym-commercial'], experience: ['advanced'], description: 'Heavy band resistance training' },

    // 40-50 min Minimal
    { id: 53, title: 'Mat Pilates Flow', modality: 'pilates', duration: 45, intensity: 'moderate', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house', 'gym-commercial'], experience: ['beginner', 'intermediate'], description: 'Classical Pilates with resistance bands' },
    { id: 54, title: 'Band & Body Combo', modality: 'resistance-bands', duration: 50, intensity: 'moderate-high', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['intermediate', 'advanced'], description: 'Combining bands with bodyweight movements' },

    // 60+ min Minimal
    { id: 55, title: 'Full Body Band Workout', modality: 'resistance-bands', duration: 60, intensity: 'moderate', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended band training session' },
    { id: 56, title: 'Jump Rope Endurance', modality: 'jump-rope', duration: 60, intensity: 'moderate', equipment: 1, locations: ['house', 'gym-commercial', 'park'], experience: ['advanced'], description: 'Long jump rope session for cardio endurance' },

    // 90+ min Minimal
    { id: 57, title: 'Complete Band Workout', modality: 'resistance-bands', duration: 90, intensity: 'moderate', equipment: 1, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm', 'house'], experience: ['intermediate', 'advanced'], description: 'Comprehensive resistance band training' },

    // ============================================
    // HOME BASICS (Equipment 2) - Dumbbells, kettlebells, pull-up bar
    // ============================================

    // 5-10 min Home Basics
    { id: 58, title: 'Kettlebell Quick Burn', modality: 'kettlebell', duration: 10, intensity: 'high', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], description: 'Fast-paced kettlebell swings and snatches' },
    { id: 59, title: 'Dumbbell Warm-up', modality: 'dumbbell', duration: 8, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial', 'apartment-large'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Light dumbbell movements to prepare for workout' },

    // 15-20 min Home Basics
    { id: 60, title: 'Kettlebell HIIT', modality: 'kettlebell', duration: 20, intensity: 'high', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], description: 'High-intensity kettlebell intervals' },
    { id: 61, title: 'Dumbbell Full Body', modality: 'dumbbell', duration: 18, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial', 'apartment-large'], experience: ['beginner', 'intermediate'], description: 'Complete dumbbell workout for all muscle groups' },
    { id: 62, title: 'Beginner Kettlebell Basics', modality: 'kettlebell', duration: 15, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['beginner'], description: 'Learn fundamental kettlebell movements' },

    // 25-35 min Home Basics
    { id: 63, title: 'Kettlebell Flow', modality: 'kettlebell', duration: 25, intensity: 'moderate-high', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], description: 'Swings, cleans, snatches circuit' },
    { id: 64, title: 'Dumbbell Strength', modality: 'dumbbell', duration: 30, intensity: 'moderate-high', equipment: 2, locations: ['house', 'gym-commercial', 'apartment-large'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Traditional dumbbell strength training' },
    { id: 65, title: 'Pull-up Progressions', modality: 'bodyweight', duration: 35, intensity: 'high', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Build your pull-up strength step by step' },

    // 40-50 min Home Basics
    { id: 66, title: 'Kettlebell Strength', modality: 'kettlebell', duration: 45, intensity: 'moderate-high', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], description: 'Heavy kettlebell training for strength' },
    { id: 67, title: 'Dumbbell Hypertrophy', modality: 'dumbbell', duration: 50, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial', 'apartment-large'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Muscle-building dumbbell workout' },
    { id: 68, title: 'Beginner Dumbbell Program', modality: 'dumbbell', duration: 40, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial', 'apartment-large'], experience: ['beginner'], description: 'Introduction to dumbbell training' },

    // 60+ min Home Basics
    { id: 69, title: 'Complete Kettlebell Workout', modality: 'kettlebell', duration: 60, intensity: 'moderate-high', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['intermediate', 'advanced'], description: 'Comprehensive kettlebell training session' },
    { id: 70, title: 'Dumbbell Total Body', modality: 'dumbbell', duration: 70, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended dumbbell workout hitting all muscles' },

    // 90+ min Home Basics
    { id: 71, title: 'Kettlebell Marathon', modality: 'kettlebell', duration: 90, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial', 'gym-crossfit', 'park'], experience: ['advanced'], description: 'Extended kettlebell endurance session' },
    { id: 72, title: 'Dumbbell Full Program', modality: 'dumbbell', duration: 90, intensity: 'moderate', equipment: 2, locations: ['house', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Complete dumbbell training program' },
    { id: 73, title: 'Beginner Extended Weights', modality: 'dumbbell', duration: 90, intensity: 'low-moderate', equipment: 2, locations: ['house', 'gym-commercial'], experience: ['beginner'], description: 'Long but easy introduction to weight training' },

    // ============================================
    // HOME GYM (Equipment 3) - Full weights, cardio machines
    // ============================================

    // 5-10 min Home Gym
    { id: 74, title: 'Quick Bike Intervals', modality: 'cycling', duration: 10, intensity: 'very-high', equipment: 3, locations: ['house', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Short all-out stationary bike sprints' },
    { id: 75, title: 'Rowing Warm-up', modality: 'rowing', duration: 8, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Easy rowing to warm up the body' },

    // 15-20 min Home Gym
    { id: 76, title: 'Stationary Bike HIIT', modality: 'cycling', duration: 20, intensity: 'high', equipment: 3, locations: ['house', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'High-intensity bike intervals' },
    { id: 77, title: 'Rowing Machine Intervals', modality: 'rowing', duration: 18, intensity: 'high', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: '500m repeats with rest periods' },
    { id: 78, title: 'Beginner Row Technique', modality: 'rowing', duration: 15, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['beginner'], description: 'Learn proper rowing form and technique' },

    // 25-35 min Home Gym
    { id: 79, title: 'Bike Tempo Ride', modality: 'cycling', duration: 30, intensity: 'moderate-high', equipment: 3, locations: ['house', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Sustained effort on stationary bike' },
    { id: 80, title: 'Rowing Endurance', modality: 'rowing', duration: 25, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['beginner', 'intermediate'], description: 'Steady-state rowing for cardio base' },
    { id: 81, title: 'Barbell Basics', modality: 'barbell', duration: 35, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['beginner', 'intermediate'], description: 'Fundamental barbell movements' },
    { id: 82, title: 'Advanced Barbell', modality: 'barbell', duration: 30, intensity: 'high', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['advanced'], description: 'Olympic lifting and power movements' },

    // 40-50 min Home Gym
    { id: 83, title: 'Stationary Bike Endurance', modality: 'cycling', duration: 45, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended stationary bike session' },
    { id: 84, title: 'Rowing Power Session', modality: 'rowing', duration: 40, intensity: 'moderate-high', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Power-focused rowing intervals' },
    { id: 85, title: 'Full Strength Training', modality: 'barbell', duration: 50, intensity: 'moderate-high', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Complete barbell strength session' },
    { id: 86, title: 'Beginner Barbell Program', modality: 'barbell', duration: 45, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['beginner'], description: 'Introduction to barbell training' },

    // 60+ min Home Gym
    { id: 87, title: 'Long Bike Ride', modality: 'cycling', duration: 60, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended indoor cycling session' },
    { id: 88, title: 'Rowing Marathon', modality: 'rowing', duration: 60, intensity: 'low-moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Long-distance rowing for endurance' },
    { id: 89, title: 'Complete Gym Workout', modality: 'barbell', duration: 75, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Full gym session with all equipment' },

    // 90+ min Home Gym
    { id: 90, title: 'Extended Bike Session', modality: 'cycling', duration: 90, intensity: 'low-moderate', equipment: 3, locations: ['house', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Long endurance cycling session' },
    { id: 91, title: 'Ultimate Rowing Session', modality: 'rowing', duration: 90, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['advanced'], description: 'Extended rowing endurance training' },
    { id: 92, title: 'Full Gym Day', modality: 'barbell', duration: 120, intensity: 'moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Complete training day with all movements' },
    { id: 93, title: 'Beginner Gym Marathon', modality: 'barbell', duration: 90, intensity: 'low-moderate', equipment: 3, locations: ['house', 'gym-commercial', 'gym-crossfit'], experience: ['beginner'], description: 'Extended beginner-friendly gym session' },

    // ============================================
    // FULL GYM (Equipment 4) - Pool, track, all equipment
    // ============================================

    // 5-10 min Full Gym
    { id: 94, title: 'Sprint Technique Drills', modality: 'running', duration: 10, intensity: 'moderate-high', equipment: 4, locations: ['track', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Running form drills on the track' },
    { id: 95, title: 'Pool Sprint Set', modality: 'swimming', duration: 10, intensity: 'very-high', equipment: 4, locations: ['pool'], experience: ['intermediate', 'advanced'], description: 'Short all-out swim sprints' },
    { id: 96, title: 'Quick Pool Laps', modality: 'swimming', duration: 8, intensity: 'moderate', equipment: 4, locations: ['pool'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Easy swimming warm-up' },

    // 15-20 min Full Gym
    { id: 97, title: 'Track Interval Session', modality: 'running', duration: 20, intensity: 'high', equipment: 4, locations: ['track'], experience: ['intermediate', 'advanced'], description: '200m and 400m repeats on the track' },
    { id: 98, title: 'Beginner Swim Lesson', modality: 'swimming', duration: 20, intensity: 'low-moderate', equipment: 4, locations: ['pool'], experience: ['beginner'], description: 'Basic stroke technique practice' },
    { id: 99, title: 'Swim Intervals', modality: 'swimming', duration: 18, intensity: 'high', equipment: 4, locations: ['pool'], experience: ['intermediate', 'advanced'], description: '100m repeats with short rest' },

    // 25-35 min Full Gym
    { id: 100, title: 'Track Tempo', modality: 'running', duration: 30, intensity: 'moderate-high', equipment: 4, locations: ['track'], experience: ['intermediate', 'advanced'], description: 'Sustained fast running on the track' },
    { id: 101, title: 'Beginner Lap Swim', modality: 'swimming', duration: 30, intensity: 'moderate', equipment: 4, locations: ['pool'], experience: ['beginner', 'intermediate'], description: 'Mixed stroke, rest as needed' },
    { id: 102, title: 'Advanced Swim Drills', modality: 'swimming', duration: 35, intensity: 'moderate-high', equipment: 4, locations: ['pool'], experience: ['advanced'], description: 'Technical drills for stroke improvement' },
    { id: 103, title: 'Track Beginner', modality: 'running', duration: 25, intensity: 'moderate', equipment: 4, locations: ['track'], experience: ['beginner'], description: 'Easy laps on the track for beginners' },

    // 40-50 min Full Gym
    { id: 104, title: 'Track Workout', modality: 'running', duration: 45, intensity: 'high', equipment: 4, locations: ['track'], experience: ['intermediate', 'advanced'], description: 'Complete track interval session' },
    { id: 105, title: 'Swim Endurance', modality: 'swimming', duration: 45, intensity: 'moderate', equipment: 4, locations: ['pool'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended lap swimming session' },
    { id: 106, title: 'Pool HIIT', modality: 'swimming', duration: 40, intensity: 'high', equipment: 4, locations: ['pool'], experience: ['intermediate', 'advanced'], description: 'High-intensity pool intervals' },

    // 60+ min Full Gym
    { id: 107, title: 'Distance Swim', modality: 'swimming', duration: 60, intensity: 'moderate', equipment: 4, locations: ['pool'], experience: ['intermediate', 'advanced'], description: 'Long-distance continuous swimming' },
    { id: 108, title: 'Track Distance Session', modality: 'running', duration: 60, intensity: 'moderate', equipment: 4, locations: ['track'], experience: ['intermediate', 'advanced'], description: 'Extended track running session' },
    { id: 109, title: 'Beginner Pool Hour', modality: 'swimming', duration: 60, intensity: 'low-moderate', equipment: 4, locations: ['pool'], experience: ['beginner'], description: 'Extended easy swimming practice' },
    { id: 110, title: 'Track Beginner Long', modality: 'running', duration: 60, intensity: 'low-moderate', equipment: 4, locations: ['track'], experience: ['beginner'], description: 'Long easy laps for beginners' },

    // 90+ min Full Gym
    { id: 111, title: 'Open Water Prep Swim', modality: 'swimming', duration: 90, intensity: 'moderate', equipment: 4, locations: ['pool'], experience: ['intermediate', 'advanced'], description: 'Long swim for open water preparation' },
    { id: 112, title: 'Track Marathon Prep', modality: 'running', duration: 90, intensity: 'moderate', equipment: 4, locations: ['track'], experience: ['intermediate', 'advanced'], description: 'Extended track running for race prep' },
    { id: 113, title: 'Beginner Swim Journey', modality: 'swimming', duration: 90, intensity: 'low', equipment: 4, locations: ['pool'], experience: ['beginner'], description: 'Long, easy pool session with plenty of rest' },

    // ============================================
    // DANCE & SPECIALTY (Equipment 0-1)
    // ============================================

    // Dance workouts for various spaces
    { id: 114, title: 'Quick Dance Break', modality: 'dance', duration: 10, intensity: 'moderate-high', equipment: 0, locations: ['house', 'apartment-large', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Short fun dance cardio burst' },
    { id: 115, title: 'Dance Cardio Party', modality: 'dance', duration: 30, intensity: 'moderate', equipment: 0, locations: ['house', 'apartment-large', 'gym-commercial'], experience: ['beginner', 'intermediate'], description: 'Fun, rhythm-based cardio movements' },
    { id: 116, title: 'Advanced Dance Fitness', modality: 'dance', duration: 45, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Complex choreography and high energy' },
    { id: 117, title: 'Dance Workout Extended', modality: 'dance', duration: 60, intensity: 'moderate', equipment: 0, locations: ['house', 'gym-commercial'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Full hour of dance-based cardio' },

    // Additional outdoor workouts
    { id: 118, title: 'Park Workout', modality: 'bodyweight', duration: 30, intensity: 'moderate-high', equipment: 0, locations: ['park', 'beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Using park benches and open space' },
    { id: 119, title: 'Beach Sand Training', modality: 'bodyweight', duration: 45, intensity: 'high', equipment: 0, locations: ['beach'], experience: ['intermediate', 'advanced'], description: 'Challenging sand-based exercises' },
    { id: 120, title: 'Trail Fitness Hike', modality: 'hiking', duration: 60, intensity: 'moderate', equipment: 0, locations: ['trail'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Fitness-focused hiking workout' },
    { id: 121, title: 'Extended Trail Adventure', modality: 'hiking', duration: 90, intensity: 'moderate', equipment: 0, locations: ['trail'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Long trail hiking session' },
    { id: 122, title: 'Beach Sunrise Workout', modality: 'bodyweight', duration: 20, intensity: 'moderate', equipment: 0, locations: ['beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Refreshing beach workout any time of day' },

    // CrossFit style workouts
    { id: 123, title: 'CrossFit WOD Short', modality: 'crossfit', duration: 15, intensity: 'very-high', equipment: 2, locations: ['gym-crossfit', 'gym-commercial', 'house'], experience: ['intermediate', 'advanced'], description: 'Short high-intensity CrossFit workout' },
    { id: 124, title: 'CrossFit Benchmark', modality: 'crossfit', duration: 25, intensity: 'high', equipment: 2, locations: ['gym-crossfit', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Classic CrossFit benchmark workout' },
    { id: 125, title: 'CrossFit Full Class', modality: 'crossfit', duration: 60, intensity: 'high', equipment: 3, locations: ['gym-crossfit', 'gym-commercial'], experience: ['intermediate', 'advanced'], description: 'Complete CrossFit class format' },
    { id: 126, title: 'CrossFit Beginner', modality: 'crossfit', duration: 30, intensity: 'moderate', equipment: 2, locations: ['gym-crossfit', 'gym-commercial'], experience: ['beginner'], description: 'Scaled CrossFit workout for beginners' },

    // Additional coverage for specific gaps
    { id: 127, title: 'City Street Intervals', modality: 'running', duration: 45, intensity: 'high', equipment: 0, locations: ['city-streets'], experience: ['intermediate', 'advanced'], description: 'Urban interval training using city blocks' },
    { id: 128, title: 'Office Stretch Break', modality: 'mobility', duration: 10, intensity: 'low', equipment: 0, locations: ['office', 'apartment-small', 'hotel', 'dorm'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Quick stretching routine for desk workers' },
    { id: 129, title: 'Dorm Room Cardio', modality: 'bodyweight', duration: 15, intensity: 'moderate-high', equipment: 0, locations: ['dorm', 'apartment-small', 'hotel'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Quiet cardio workout for shared spaces' },
    { id: 130, title: 'Hotel Fitness', modality: 'bodyweight', duration: 25, intensity: 'moderate', equipment: 0, locations: ['hotel', 'apartment-small', 'dorm'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Travel-friendly hotel room workout' },

    // More beach and trail workouts
    { id: 131, title: 'Beach Yoga', modality: 'yoga', duration: 45, intensity: 'low-moderate', equipment: 0, locations: ['beach', 'park'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Calming yoga practice by the water' },
    { id: 132, title: 'Trail Run Short', modality: 'running', duration: 20, intensity: 'moderate-high', equipment: 0, locations: ['trail', 'park'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Quick trail running session' },
    { id: 133, title: 'Beach HIIT', modality: 'bodyweight', duration: 25, intensity: 'high', equipment: 0, locations: ['beach'], experience: ['intermediate', 'advanced'], description: 'High-intensity beach workout' },
    { id: 134, title: 'Trail Power Hike', modality: 'hiking', duration: 75, intensity: 'moderate-high', equipment: 0, locations: ['trail'], experience: ['intermediate', 'advanced'], description: 'Challenging uphill hiking workout' },

    // Additional gym coverage
    { id: 135, title: 'Gym Machine Circuit', modality: 'machine', duration: 40, intensity: 'moderate', equipment: 3, locations: ['gym-commercial'], experience: ['beginner', 'intermediate'], description: 'Full circuit using gym machines' },
    { id: 136, title: 'Gym Express', modality: 'barbell', duration: 25, intensity: 'high', equipment: 3, locations: ['gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Quick but intense gym session' },
    { id: 137, title: 'CrossFit Box WOD', modality: 'crossfit', duration: 45, intensity: 'high', equipment: 3, locations: ['gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Classic CrossFit box workout' },
    { id: 138, title: 'Gym Beginner Intro', modality: 'machine', duration: 30, intensity: 'low-moderate', equipment: 3, locations: ['gym-commercial'], experience: ['beginner'], description: 'Gentle introduction to gym equipment' },

    // More time-specific coverage
    { id: 139, title: 'Quick Morning Mobility', modality: 'mobility', duration: 5, intensity: 'low', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'office', 'dorm', 'house'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Ultra-quick morning mobility routine' },
    { id: 140, title: 'Power 5', modality: 'bodyweight', duration: 5, intensity: 'high', equipment: 0, locations: ['house', 'gym-commercial', 'park', 'city-streets'], experience: ['intermediate', 'advanced'], description: '5-minute maximum effort workout' },
    { id: 141, title: 'Micro HIIT', modality: 'bodyweight', duration: 7, intensity: 'very-high', equipment: 0, locations: ['house', 'apartment-large', 'gym-commercial', 'park'], experience: ['intermediate', 'advanced'], description: 'Ultra-short high-intensity session' },
    { id: 142, title: 'Easy Walk', modality: 'walking', duration: 90, intensity: 'low', equipment: 0, locations: ['city-streets', 'park', 'trail', 'beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Long easy walking for active recovery' },

    // Silent apartment advanced
    { id: 143, title: 'Silent HIIT Advanced', modality: 'bodyweight', duration: 20, intensity: 'very-high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'hotel', 'dorm'], experience: ['advanced'], silent: true, description: 'Maximum intensity without jumping' },
    { id: 144, title: 'Apartment Athlete', modality: 'bodyweight', duration: 40, intensity: 'high', equipment: 0, locations: ['apartment-small', 'apartment-large', 'dorm', 'hotel'], experience: ['advanced'], silent: true, description: 'Advanced apartment-friendly training' },

    // Additional office workouts
    { id: 145, title: 'Lunch Break Fitness', modality: 'bodyweight', duration: 20, intensity: 'moderate', equipment: 0, locations: ['office', 'apartment-small', 'hotel'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Quick workout during lunch break' },
    { id: 146, title: 'Desk Worker Mobility', modality: 'mobility', duration: 30, intensity: 'low', equipment: 0, locations: ['office', 'apartment-small', 'hotel', 'dorm'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Counteract sitting with targeted stretches' },

    // Long outdoor sessions
    { id: 147, title: 'Urban Explorer', modality: 'walking', duration: 120, intensity: 'low-moderate', equipment: 0, locations: ['city-streets', 'park'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Extended city walking workout' },
    { id: 148, title: 'Beach Day Workout', modality: 'bodyweight', duration: 60, intensity: 'moderate', equipment: 0, locations: ['beach'], experience: ['beginner', 'intermediate', 'advanced'], description: 'Full beach workout with swimming breaks' },
    { id: 149, title: 'Trail Running Long', modality: 'running', duration: 120, intensity: 'moderate', equipment: 0, locations: ['trail'], experience: ['advanced'], description: 'Extended trail running adventure' },

    // Additional CrossFit/Gym coverage
    { id: 150, title: 'CrossFit Beginner WOD', modality: 'crossfit', duration: 20, intensity: 'moderate', equipment: 1, locations: ['gym-crossfit', 'gym-commercial', 'house'], experience: ['beginner'], description: 'Scaled CrossFit for newcomers' },
    { id: 151, title: 'CrossFit Competition', modality: 'crossfit', duration: 90, intensity: 'very-high', equipment: 3, locations: ['gym-crossfit'], experience: ['advanced'], description: 'Competition-style CrossFit training' },
    { id: 152, title: 'Gym Full Day', modality: 'barbell', duration: 90, intensity: 'moderate-high', equipment: 4, locations: ['gym-commercial', 'gym-crossfit'], experience: ['intermediate', 'advanced'], description: 'Complete gym training day' }
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
              <div class="workout-details mt-sm">
                <small class="text-gray">
                  ${w.silent ? '🔇 Silent workout • ' : ''}
                  ${w.experience.map(e => capitalize(e)).join(', ')} level
                </small>
              </div>
              <a href="/workouts/${getModalitySlug(w.modality)}/" class="btn btn-primary btn-sm mt-sm">Browse ${capitalize(w.modality)} Workouts</a>
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
    'rowing': '🚣',
    'yoga': '🧘',
    'pilates': '🤸',
    'mobility': '🔄',
    'resistance-bands': '💪',
    'dumbbell': '🏋️',
    'barbell': '🏋️',
    'hiking': '🥾',
    'walking': '🚶',
    'crossfit': '🔥',
    'machine': '⚙️'
  };
  return icons[modality] || '💪';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).replace('-', ' ');
}

function getModalitySlug(modality) {
  // Map modalities to existing workout category pages
  const slugMap = {
    'bodyweight': 'bodyweight',
    'running': 'running',
    'cycling': 'cycling',
    'swimming': 'swimming',
    'jump-rope': 'jump-rope',
    'kettlebell': 'kettlebell',
    'dance': 'dance',
    'rowing': 'rowing',
    'yoga': 'yoga',
    'pilates': 'yoga',
    'mobility': 'bodyweight',
    'resistance-bands': 'bodyweight',
    'dumbbell': 'kettlebell',
    'barbell': 'kettlebell',
    'hiking': 'running',
    'walking': 'running',
    'crossfit': 'hiit',
    'machine': 'cycling'
  };
  return slugMap[modality] || 'bodyweight';
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

// ============================================
// COMPREHENSIVE WORKOUT DATABASE
// ============================================

const WorkoutDatabase = {
  workouts: [
    // ============================================
    // RUNNING WORKOUTS (20 workouts)
    // ============================================
    {
      id: 'run-001',
      title: 'Beginner Run/Walk Intervals',
      modality: 'running',
      duration: 25,
      level: 'beginner',
      equipment: 'none',
      description: 'Alternating 2 min run, 1 min walk. Perfect for building your cardio base.',
      link: '/workouts/running/beginner-run-walk.html'
    },
    {
      id: 'run-002',
      title: 'Easy 20-Minute Jog',
      modality: 'running',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Conversational pace jog to build aerobic foundation.',
      link: '/workouts/running/easy-jog.html'
    },
    {
      id: 'run-003',
      title: 'Couch to 5K Week 1',
      modality: 'running',
      duration: 30,
      level: 'beginner',
      equipment: 'none',
      description: 'Classic beginner program: 60 sec run, 90 sec walk intervals.',
      link: '/workouts/running/c25k-week1.html'
    },
    {
      id: 'run-004',
      title: '5K Tempo Run',
      modality: 'running',
      duration: 35,
      level: 'intermediate',
      equipment: 'none',
      description: 'Sustained comfortably hard pace to improve lactate threshold.',
      link: '/workouts/running/5k-tempo.html'
    },
    {
      id: 'run-005',
      title: '400m Track Intervals',
      modality: 'running',
      duration: 40,
      level: 'intermediate',
      equipment: 'none',
      description: '8x400m at 5K pace with 200m recovery jogs.',
      link: '/workouts/running/400m-intervals.html'
    },
    {
      id: 'run-006',
      title: 'Fartlek Fun Run',
      modality: 'running',
      duration: 35,
      level: 'intermediate',
      equipment: 'none',
      description: 'Unstructured speed play mixing fast and easy segments.',
      link: '/workouts/running/fartlek.html'
    },
    {
      id: 'run-007',
      title: 'Hill Repeats',
      modality: 'running',
      duration: 45,
      level: 'intermediate',
      equipment: 'none',
      description: '6-8 hill sprints with jog-down recovery for power.',
      link: '/workouts/running/hill-repeats.html'
    },
    {
      id: 'run-008',
      title: 'Progression Run',
      modality: 'running',
      duration: 45,
      level: 'intermediate',
      equipment: 'none',
      description: 'Start easy, finish fast. Build to tempo pace over distance.',
      link: '/workouts/running/progression.html'
    },
    {
      id: 'run-009',
      title: 'Long Slow Distance',
      modality: 'running',
      duration: 60,
      level: 'intermediate',
      equipment: 'none',
      description: '60-minute easy run building endurance and fat burning.',
      link: '/workouts/running/lsd-60.html'
    },
    {
      id: 'run-010',
      title: '800m Repeats',
      modality: 'running',
      duration: 50,
      level: 'advanced',
      equipment: 'none',
      description: '6x800m at 10K pace with 400m recovery.',
      link: '/workouts/running/800m-repeats.html'
    },
    {
      id: 'run-011',
      title: 'Mile Repeats',
      modality: 'running',
      duration: 55,
      level: 'advanced',
      equipment: 'none',
      description: '4x1 mile at threshold pace with 3 min recovery.',
      link: '/workouts/running/mile-repeats.html'
    },
    {
      id: 'run-012',
      title: 'Yasso 800s',
      modality: 'running',
      duration: 60,
      level: 'advanced',
      equipment: 'none',
      description: 'Marathon predictor workout: 10x800m.',
      link: '/workouts/running/yasso-800s.html'
    },
    {
      id: 'run-013',
      title: '90-Minute Long Run',
      modality: 'running',
      duration: 90,
      level: 'advanced',
      equipment: 'none',
      description: 'Extended endurance run for marathon training.',
      link: '/workouts/running/long-run-90.html'
    },
    {
      id: 'run-014',
      title: 'Sprint Intervals',
      modality: 'running',
      duration: 20,
      level: 'advanced',
      equipment: 'none',
      description: '10x100m sprints with full recovery for speed.',
      link: '/workouts/running/sprints.html'
    },
    {
      id: 'run-015',
      title: 'Treadmill HIIT',
      modality: 'running',
      duration: 25,
      level: 'intermediate',
      equipment: 'home',
      description: '1 min fast, 1 min slow intervals on the treadmill.',
      link: '/workouts/running/treadmill-hiit.html'
    },
    {
      id: 'run-016',
      title: 'Incline Treadmill Walk',
      modality: 'running',
      duration: 30,
      level: 'beginner',
      equipment: 'home',
      description: '12-15% incline walking for low-impact cardio.',
      link: '/workouts/running/incline-walk.html'
    },
    {
      id: 'run-017',
      title: 'Trail Run Adventure',
      modality: 'running',
      duration: 50,
      level: 'intermediate',
      equipment: 'none',
      description: 'Mixed terrain run through trails and paths.',
      link: '/workouts/running/trail-run.html'
    },
    {
      id: 'run-018',
      title: 'Recovery Jog',
      modality: 'running',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Very easy pace for active recovery.',
      link: '/workouts/running/recovery-jog.html'
    },
    {
      id: 'run-019',
      title: 'Stair Running',
      modality: 'running',
      duration: 20,
      level: 'intermediate',
      equipment: 'none',
      description: 'Stadium or building stairs for power and cardio.',
      link: '/workouts/running/stair-running.html'
    },
    {
      id: 'run-020',
      title: '2-Hour Marathon Prep',
      modality: 'running',
      duration: 120,
      level: 'advanced',
      equipment: 'none',
      description: 'Long run with race-pace miles mixed in.',
      link: '/workouts/running/marathon-prep.html'
    },

    // ============================================
    // CYCLING WORKOUTS (15 workouts)
    // ============================================
    {
      id: 'cycle-001',
      title: 'Beginner Spin',
      modality: 'cycling',
      duration: 20,
      level: 'beginner',
      equipment: 'home',
      description: 'Easy-paced stationary bike ride for beginners.',
      link: '/workouts/cycling/beginner-spin.html'
    },
    {
      id: 'cycle-002',
      title: 'Indoor Cycling HIIT',
      modality: 'cycling',
      duration: 30,
      level: 'intermediate',
      equipment: 'home',
      description: 'Alternating resistance sprints and recovery.',
      link: '/workouts/cycling/indoor-hiit.html'
    },
    {
      id: 'cycle-003',
      title: 'Tabata Bike Sprints',
      modality: 'cycling',
      duration: 15,
      level: 'intermediate',
      equipment: 'home',
      description: '20 sec all-out, 10 sec rest, 8 rounds.',
      link: '/workouts/cycling/tabata-bike.html'
    },
    {
      id: 'cycle-004',
      title: 'Endurance Ride',
      modality: 'cycling',
      duration: 60,
      level: 'intermediate',
      equipment: 'none',
      description: 'Steady Zone 2 outdoor ride for base building.',
      link: '/workouts/cycling/endurance-ride.html'
    },
    {
      id: 'cycle-005',
      title: 'Hill Climb Simulation',
      modality: 'cycling',
      duration: 45,
      level: 'intermediate',
      equipment: 'home',
      description: 'Progressive resistance increases simulating climbs.',
      link: '/workouts/cycling/hill-simulation.html'
    },
    {
      id: 'cycle-006',
      title: 'Power Intervals',
      modality: 'cycling',
      duration: 40,
      level: 'advanced',
      equipment: 'home',
      description: '4x4 minute threshold intervals with 3 min rest.',
      link: '/workouts/cycling/power-intervals.html'
    },
    {
      id: 'cycle-007',
      title: 'Recovery Spin',
      modality: 'cycling',
      duration: 25,
      level: 'beginner',
      equipment: 'home',
      description: 'Low resistance, easy cadence for recovery.',
      link: '/workouts/cycling/recovery-spin.html'
    },
    {
      id: 'cycle-008',
      title: '90-Minute Century Prep',
      modality: 'cycling',
      duration: 90,
      level: 'advanced',
      equipment: 'none',
      description: 'Long ride with varied intensity for event training.',
      link: '/workouts/cycling/century-prep.html'
    },
    {
      id: 'cycle-009',
      title: 'Sweet Spot Training',
      modality: 'cycling',
      duration: 50,
      level: 'advanced',
      equipment: 'home',
      description: '2x20 min at 88-93% FTP.',
      link: '/workouts/cycling/sweet-spot.html'
    },
    {
      id: 'cycle-010',
      title: 'Sprint Intervals',
      modality: 'cycling',
      duration: 30,
      level: 'advanced',
      equipment: 'home',
      description: '10x30 sec max sprints with 2 min recovery.',
      link: '/workouts/cycling/sprint-intervals.html'
    },
    {
      id: 'cycle-011',
      title: 'Outdoor Hill Repeats',
      modality: 'cycling',
      duration: 60,
      level: 'advanced',
      equipment: 'none',
      description: 'Find a hill, climb it 6-8 times with recovery descents.',
      link: '/workouts/cycling/outdoor-hills.html'
    },
    {
      id: 'cycle-012',
      title: 'Cadence Drills',
      modality: 'cycling',
      duration: 35,
      level: 'intermediate',
      equipment: 'home',
      description: 'High RPM intervals to improve pedaling efficiency.',
      link: '/workouts/cycling/cadence-drills.html'
    },
    {
      id: 'cycle-013',
      title: 'FTP Test',
      modality: 'cycling',
      duration: 45,
      level: 'intermediate',
      equipment: 'home',
      description: '20-minute all-out effort to establish training zones.',
      link: '/workouts/cycling/ftp-test.html'
    },
    {
      id: 'cycle-014',
      title: 'Easy Commute Simulation',
      modality: 'cycling',
      duration: 30,
      level: 'beginner',
      equipment: 'home',
      description: 'Moderate pace with occasional bursts.',
      link: '/workouts/cycling/commute-sim.html'
    },
    {
      id: 'cycle-015',
      title: '2-Hour Endurance',
      modality: 'cycling',
      duration: 120,
      level: 'advanced',
      equipment: 'none',
      description: 'Long outdoor ride for serious endurance training.',
      link: '/workouts/cycling/endurance-long.html'
    },

    // ============================================
    // SWIMMING WORKOUTS (12 workouts)
    // ============================================
    {
      id: 'swim-001',
      title: 'Beginner Lap Swim',
      modality: 'swimming',
      duration: 30,
      level: 'beginner',
      equipment: 'full',
      description: 'Mixed stroke, rest as needed, technique focus.',
      link: '/workouts/swimming/beginner-laps.html'
    },
    {
      id: 'swim-002',
      title: 'Learn to Swim',
      modality: 'swimming',
      duration: 20,
      level: 'beginner',
      equipment: 'full',
      description: 'Basic drills and comfort in the water.',
      link: '/workouts/swimming/learn-swim.html'
    },
    {
      id: 'swim-003',
      title: '1000m Freestyle',
      modality: 'swimming',
      duration: 25,
      level: 'intermediate',
      equipment: 'full',
      description: 'Continuous freestyle for endurance.',
      link: '/workouts/swimming/1000m-free.html'
    },
    {
      id: 'swim-004',
      title: 'Swim Intervals',
      modality: 'swimming',
      duration: 40,
      level: 'intermediate',
      equipment: 'full',
      description: '8x100m with 20 sec rest between sets.',
      link: '/workouts/swimming/intervals.html'
    },
    {
      id: 'swim-005',
      title: 'Kick Set Focus',
      modality: 'swimming',
      duration: 30,
      level: 'beginner',
      equipment: 'full',
      description: 'Kickboard drills to build leg strength.',
      link: '/workouts/swimming/kick-set.html'
    },
    {
      id: 'swim-006',
      title: 'Pull Buoy Endurance',
      modality: 'swimming',
      duration: 35,
      level: 'intermediate',
      equipment: 'full',
      description: 'Upper body focus with pull buoy.',
      link: '/workouts/swimming/pull-buoy.html'
    },
    {
      id: 'swim-007',
      title: 'Sprint Set',
      modality: 'swimming',
      duration: 30,
      level: 'advanced',
      equipment: 'full',
      description: '12x50m all-out sprints with full recovery.',
      link: '/workouts/swimming/sprints.html'
    },
    {
      id: 'swim-008',
      title: 'IM Training',
      modality: 'swimming',
      duration: 45,
      level: 'advanced',
      equipment: 'full',
      description: 'Individual medley: all 4 strokes practice.',
      link: '/workouts/swimming/im-training.html'
    },
    {
      id: 'swim-009',
      title: 'Open Water Prep',
      modality: 'swimming',
      duration: 50,
      level: 'advanced',
      equipment: 'full',
      description: 'Sighting drills and continuous swimming.',
      link: '/workouts/swimming/open-water.html'
    },
    {
      id: 'swim-010',
      title: 'Triathlon Brick',
      modality: 'swimming',
      duration: 60,
      level: 'advanced',
      equipment: 'full',
      description: '1500m swim followed by quick transition practice.',
      link: '/workouts/swimming/triathlon-brick.html'
    },
    {
      id: 'swim-011',
      title: 'Technique Tuesday',
      modality: 'swimming',
      duration: 35,
      level: 'intermediate',
      equipment: 'full',
      description: 'Drill-focused session for stroke improvement.',
      link: '/workouts/swimming/technique.html'
    },
    {
      id: 'swim-012',
      title: 'Distance Challenge',
      modality: 'swimming',
      duration: 75,
      level: 'advanced',
      equipment: 'full',
      description: '3000m continuous swim for endurance.',
      link: '/workouts/swimming/distance.html'
    },

    // ============================================
    // HIIT WORKOUTS (20 workouts)
    // ============================================
    {
      id: 'hiit-001',
      title: '4-Minute Tabata',
      modality: 'hiit',
      duration: 10,
      level: 'intermediate',
      equipment: 'none',
      description: '20 sec on, 10 sec off for 8 rounds.',
      link: '/workouts/hiit/tabata-4min.html'
    },
    {
      id: 'hiit-002',
      title: '7-Minute Workout',
      modality: 'hiit',
      duration: 7,
      level: 'beginner',
      equipment: 'none',
      description: 'Science-backed quick full-body circuit.',
      link: '/workouts/hiit/7-minute.html'
    },
    {
      id: 'hiit-003',
      title: 'EMOM 15',
      modality: 'hiit',
      duration: 15,
      level: 'intermediate',
      equipment: 'none',
      description: 'Every Minute on the Minute for 15 rounds.',
      link: '/workouts/hiit/emom-15.html'
    },
    {
      id: 'hiit-004',
      title: 'AMRAP 20',
      modality: 'hiit',
      duration: 20,
      level: 'intermediate',
      equipment: 'none',
      description: 'As Many Rounds As Possible in 20 minutes.',
      link: '/workouts/hiit/amrap-20.html'
    },
    {
      id: 'hiit-005',
      title: 'Burpee Challenge',
      modality: 'hiit',
      duration: 15,
      level: 'advanced',
      equipment: 'none',
      description: '100 burpees for time.',
      link: '/workouts/hiit/burpee-challenge.html'
    },
    {
      id: 'hiit-006',
      title: 'Death by 10 Meters',
      modality: 'hiit',
      duration: 20,
      level: 'advanced',
      equipment: 'none',
      description: 'Add 10m sprint each minute until failure.',
      link: '/workouts/hiit/death-by-10m.html'
    },
    {
      id: 'hiit-007',
      title: 'Core HIIT Blast',
      modality: 'hiit',
      duration: 15,
      level: 'intermediate',
      equipment: 'none',
      description: 'High-intensity core-focused intervals.',
      link: '/workouts/hiit/core-hiit.html'
    },
    {
      id: 'hiit-008',
      title: 'Lower Body Burn',
      modality: 'hiit',
      duration: 20,
      level: 'intermediate',
      equipment: 'none',
      description: 'Squats, lunges, jumps in HIIT format.',
      link: '/workouts/hiit/lower-body.html'
    },
    {
      id: 'hiit-009',
      title: 'Upper Body Power',
      modality: 'hiit',
      duration: 20,
      level: 'intermediate',
      equipment: 'none',
      description: 'Push-ups, dips, planks in intervals.',
      link: '/workouts/hiit/upper-body.html'
    },
    {
      id: 'hiit-010',
      title: 'Full Body Fury',
      modality: 'hiit',
      duration: 30,
      level: 'advanced',
      equipment: 'none',
      description: 'Complete body destruction workout.',
      link: '/workouts/hiit/full-body-fury.html'
    },
    {
      id: 'hiit-011',
      title: 'Beginner HIIT Intro',
      modality: 'hiit',
      duration: 15,
      level: 'beginner',
      equipment: 'none',
      description: 'Gentle introduction to high-intensity training.',
      link: '/workouts/hiit/beginner-intro.html'
    },
    {
      id: 'hiit-012',
      title: 'No Jump HIIT',
      modality: 'hiit',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Low-impact high-intensity for joint protection.',
      link: '/workouts/hiit/no-jump.html'
    },
    {
      id: 'hiit-013',
      title: 'Dumbbell HIIT',
      modality: 'hiit',
      duration: 25,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Add dumbbells to classic HIIT moves.',
      link: '/workouts/hiit/dumbbell-hiit.html'
    },
    {
      id: 'hiit-014',
      title: 'Resistance Band HIIT',
      modality: 'hiit',
      duration: 20,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Band-assisted HIIT for added resistance.',
      link: '/workouts/hiit/band-hiit.html'
    },
    {
      id: 'hiit-015',
      title: 'Metabolic Finisher',
      modality: 'hiit',
      duration: 10,
      level: 'advanced',
      equipment: 'none',
      description: 'Quick end-of-workout metabolic boost.',
      link: '/workouts/hiit/metabolic-finisher.html'
    },
    {
      id: 'hiit-016',
      title: '30-30-30 Intervals',
      modality: 'hiit',
      duration: 20,
      level: 'intermediate',
      equipment: 'none',
      description: '30 sec work, 30 sec active, 30 sec rest.',
      link: '/workouts/hiit/30-30-30.html'
    },
    {
      id: 'hiit-017',
      title: 'Pyramid HIIT',
      modality: 'hiit',
      duration: 25,
      level: 'advanced',
      equipment: 'none',
      description: 'Work periods increase then decrease.',
      link: '/workouts/hiit/pyramid.html'
    },
    {
      id: 'hiit-018',
      title: 'Cardio Kickboxing HIIT',
      modality: 'hiit',
      duration: 30,
      level: 'intermediate',
      equipment: 'none',
      description: 'Punches and kicks in HIIT format.',
      link: '/workouts/hiit/kickboxing.html'
    },
    {
      id: 'hiit-019',
      title: 'Gym Machine HIIT',
      modality: 'hiit',
      duration: 30,
      level: 'intermediate',
      equipment: 'full',
      description: 'Rotating through gym cardio machines.',
      link: '/workouts/hiit/gym-machine.html'
    },
    {
      id: 'hiit-020',
      title: 'Competition WOD',
      modality: 'hiit',
      duration: 35,
      level: 'advanced',
      equipment: 'full',
      description: 'CrossFit-style workout of the day.',
      link: '/workouts/hiit/competition-wod.html'
    },

    // ============================================
    // BODYWEIGHT WORKOUTS (18 workouts)
    // ============================================
    {
      id: 'bw-001',
      title: 'Apartment-Friendly HIIT',
      modality: 'bodyweight',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'No-jumping, neighbor-friendly high-intensity intervals.',
      link: '/workouts/bodyweight/apartment-hiit.html'
    },
    {
      id: 'bw-002',
      title: 'Morning Wake-Up Flow',
      modality: 'bodyweight',
      duration: 10,
      level: 'beginner',
      equipment: 'none',
      description: 'Gentle movement to start your day.',
      link: '/workouts/bodyweight/morning-flow.html'
    },
    {
      id: 'bw-003',
      title: 'Bodyweight Basics',
      modality: 'bodyweight',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Push-ups, squats, lunges fundamentals.',
      link: '/workouts/bodyweight/basics.html'
    },
    {
      id: 'bw-004',
      title: 'Core Crusher',
      modality: 'bodyweight',
      duration: 15,
      level: 'intermediate',
      equipment: 'none',
      description: 'Focused abdominal and core workout.',
      link: '/workouts/bodyweight/core-crusher.html'
    },
    {
      id: 'bw-005',
      title: 'Push-Up Progression',
      modality: 'bodyweight',
      duration: 20,
      level: 'intermediate',
      equipment: 'none',
      description: 'Various push-up variations challenge.',
      link: '/workouts/bodyweight/pushup-progression.html'
    },
    {
      id: 'bw-006',
      title: 'Squat Variations',
      modality: 'bodyweight',
      duration: 25,
      level: 'intermediate',
      equipment: 'none',
      description: 'Every squat type in one workout.',
      link: '/workouts/bodyweight/squat-variations.html'
    },
    {
      id: 'bw-007',
      title: 'Hotel Room Express',
      modality: 'bodyweight',
      duration: 15,
      level: 'intermediate',
      equipment: 'none',
      description: 'Travel-friendly workout in minimal space.',
      link: '/workouts/bodyweight/hotel-express.html'
    },
    {
      id: 'bw-008',
      title: 'Dorm Room Cardio',
      modality: 'bodyweight',
      duration: 15,
      level: 'beginner',
      equipment: 'none',
      description: 'College-friendly low-noise workout.',
      link: '/workouts/bodyweight/dorm-cardio.html'
    },
    {
      id: 'bw-009',
      title: 'Office Desk Break',
      modality: 'bodyweight',
      duration: 10,
      level: 'beginner',
      equipment: 'none',
      description: 'Quick movement break at work.',
      link: '/workouts/bodyweight/office-break.html'
    },
    {
      id: 'bw-010',
      title: 'Plank Challenge',
      modality: 'bodyweight',
      duration: 15,
      level: 'intermediate',
      equipment: 'none',
      description: 'Plank variations for core strength.',
      link: '/workouts/bodyweight/plank-challenge.html'
    },
    {
      id: 'bw-011',
      title: 'Animal Flow',
      modality: 'bodyweight',
      duration: 30,
      level: 'intermediate',
      equipment: 'none',
      description: 'Ground-based movement patterns.',
      link: '/workouts/bodyweight/animal-flow.html'
    },
    {
      id: 'bw-012',
      title: 'Plyometric Power',
      modality: 'bodyweight',
      duration: 25,
      level: 'advanced',
      equipment: 'none',
      description: 'Explosive jumping movements.',
      link: '/workouts/bodyweight/plyo-power.html'
    },
    {
      id: 'bw-013',
      title: 'Calisthenics Skills',
      modality: 'bodyweight',
      duration: 40,
      level: 'advanced',
      equipment: 'none',
      description: 'Pull-ups, dips, muscle-up progressions.',
      link: '/workouts/bodyweight/calisthenics.html'
    },
    {
      id: 'bw-014',
      title: 'Glute Activation',
      modality: 'bodyweight',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Target and strengthen glutes.',
      link: '/workouts/bodyweight/glute-activation.html'
    },
    {
      id: 'bw-015',
      title: 'Full Body Circuit',
      modality: 'bodyweight',
      duration: 30,
      level: 'intermediate',
      equipment: 'none',
      description: 'Complete body workout in circuit format.',
      link: '/workouts/bodyweight/full-circuit.html'
    },
    {
      id: 'bw-016',
      title: 'Strength Endurance',
      modality: 'bodyweight',
      duration: 45,
      level: 'advanced',
      equipment: 'none',
      description: 'High rep bodyweight for muscular endurance.',
      link: '/workouts/bodyweight/strength-endurance.html'
    },
    {
      id: 'bw-017',
      title: 'Low Impact Cardio',
      modality: 'bodyweight',
      duration: 25,
      level: 'beginner',
      equipment: 'none',
      description: 'Joint-friendly cardiovascular workout.',
      link: '/workouts/bodyweight/low-impact.html'
    },
    {
      id: 'bw-018',
      title: 'Mobility & Movement',
      modality: 'bodyweight',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Flexibility with light cardio elements.',
      link: '/workouts/bodyweight/mobility.html'
    },

    // ============================================
    // JUMP ROPE WORKOUTS (10 workouts)
    // ============================================
    {
      id: 'rope-001',
      title: 'Jump Rope Basics',
      modality: 'jump-rope',
      duration: 15,
      level: 'beginner',
      equipment: 'minimal',
      description: 'Learn proper form and timing.',
      link: '/workouts/jump-rope/basics.html'
    },
    {
      id: 'rope-002',
      title: 'Jump Rope HIIT',
      modality: 'jump-rope',
      duration: 15,
      level: 'intermediate',
      equipment: 'minimal',
      description: '30 sec on, 30 sec rest intervals.',
      link: '/workouts/jump-rope/hiit-intervals.html'
    },
    {
      id: 'rope-003',
      title: 'Double Unders Practice',
      modality: 'jump-rope',
      duration: 20,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Learn and drill double under technique.',
      link: '/workouts/jump-rope/double-unders.html'
    },
    {
      id: 'rope-004',
      title: 'Boxer Skip',
      modality: 'jump-rope',
      duration: 20,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Boxing-style footwork patterns.',
      link: '/workouts/jump-rope/boxer-skip.html'
    },
    {
      id: 'rope-005',
      title: '1000 Skip Challenge',
      modality: 'jump-rope',
      duration: 15,
      level: 'intermediate',
      equipment: 'minimal',
      description: '1000 skips for time.',
      link: '/workouts/jump-rope/1000-challenge.html'
    },
    {
      id: 'rope-006',
      title: 'Jump Rope Endurance',
      modality: 'jump-rope',
      duration: 30,
      level: 'advanced',
      equipment: 'minimal',
      description: '30 minutes of continuous jumping.',
      link: '/workouts/jump-rope/endurance.html'
    },
    {
      id: 'rope-007',
      title: 'Trick Combinations',
      modality: 'jump-rope',
      duration: 25,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Cross-overs, side swings, tricks.',
      link: '/workouts/jump-rope/tricks.html'
    },
    {
      id: 'rope-008',
      title: 'Speed Rope Sprint',
      modality: 'jump-rope',
      duration: 10,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Maximum speed jumping intervals.',
      link: '/workouts/jump-rope/speed-sprint.html'
    },
    {
      id: 'rope-009',
      title: 'Weighted Rope',
      modality: 'jump-rope',
      duration: 20,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Heavy rope for shoulder conditioning.',
      link: '/workouts/jump-rope/weighted.html'
    },
    {
      id: 'rope-010',
      title: 'Jump Rope & Bodyweight',
      modality: 'jump-rope',
      duration: 25,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Alternating rope and calisthenics.',
      link: '/workouts/jump-rope/combo.html'
    },

    // ============================================
    // DANCE WORKOUTS (10 workouts)
    // ============================================
    {
      id: 'dance-001',
      title: 'Beginner Dance Cardio',
      modality: 'dance',
      duration: 20,
      level: 'beginner',
      equipment: 'none',
      description: 'Simple moves, big fun, easy to follow.',
      link: '/workouts/dance/beginner-cardio.html'
    },
    {
      id: 'dance-002',
      title: 'Dance Cardio Party',
      modality: 'dance',
      duration: 30,
      level: 'beginner',
      equipment: 'none',
      description: 'Fun, rhythm-based cardio movements.',
      link: '/workouts/dance/cardio-party.html'
    },
    {
      id: 'dance-003',
      title: 'Hip Hop Cardio',
      modality: 'dance',
      duration: 30,
      level: 'intermediate',
      equipment: 'none',
      description: 'Urban dance-inspired workout.',
      link: '/workouts/dance/hip-hop.html'
    },
    {
      id: 'dance-004',
      title: 'Latin Dance Fitness',
      modality: 'dance',
      duration: 35,
      level: 'intermediate',
      equipment: 'none',
      description: 'Salsa, merengue, reggaeton rhythms.',
      link: '/workouts/dance/latin.html'
    },
    {
      id: 'dance-005',
      title: 'Afrobeat Cardio',
      modality: 'dance',
      duration: 30,
      level: 'intermediate',
      equipment: 'none',
      description: 'West African dance-inspired movement.',
      link: '/workouts/dance/afrobeat.html'
    },
    {
      id: 'dance-006',
      title: 'K-Pop Dance Workout',
      modality: 'dance',
      duration: 25,
      level: 'intermediate',
      equipment: 'none',
      description: 'Korean pop choreography fitness.',
      link: '/workouts/dance/kpop.html'
    },
    {
      id: 'dance-007',
      title: 'Bollywood Burn',
      modality: 'dance',
      duration: 35,
      level: 'intermediate',
      equipment: 'none',
      description: 'Indian dance-inspired cardio.',
      link: '/workouts/dance/bollywood.html'
    },
    {
      id: 'dance-008',
      title: 'Barre & Ballet Cardio',
      modality: 'dance',
      duration: 45,
      level: 'intermediate',
      equipment: 'none',
      description: 'Ballet-inspired toning and cardio.',
      link: '/workouts/dance/barre.html'
    },
    {
      id: 'dance-009',
      title: 'Dance HIIT Fusion',
      modality: 'dance',
      duration: 25,
      level: 'advanced',
      equipment: 'none',
      description: 'High-intensity dance intervals.',
      link: '/workouts/dance/hiit-fusion.html'
    },
    {
      id: 'dance-010',
      title: '80s Aerobics Revival',
      modality: 'dance',
      duration: 40,
      level: 'beginner',
      equipment: 'none',
      description: 'Classic aerobics moves, modern music.',
      link: '/workouts/dance/80s-aerobics.html'
    },

    // ============================================
    // ROWING WORKOUTS (10 workouts)
    // ============================================
    {
      id: 'row-001',
      title: 'Rowing Basics',
      modality: 'rowing',
      duration: 15,
      level: 'beginner',
      equipment: 'home',
      description: 'Learn proper rowing technique.',
      link: '/workouts/rowing/basics.html'
    },
    {
      id: 'row-002',
      title: 'Rowing Machine Endurance',
      modality: 'rowing',
      duration: 20,
      level: 'beginner',
      equipment: 'home',
      description: 'Steady-state rowing for cardiovascular base.',
      link: '/workouts/rowing/endurance-20.html'
    },
    {
      id: 'row-003',
      title: '2K Row',
      modality: 'rowing',
      duration: 10,
      level: 'intermediate',
      equipment: 'home',
      description: 'Classic 2000m rowing test.',
      link: '/workouts/rowing/2k-row.html'
    },
    {
      id: 'row-004',
      title: '500m Intervals',
      modality: 'rowing',
      duration: 25,
      level: 'intermediate',
      equipment: 'home',
      description: '5x500m with 2 min rest.',
      link: '/workouts/rowing/500m-intervals.html'
    },
    {
      id: 'row-005',
      title: 'Rowing Pyramids',
      modality: 'rowing',
      duration: 30,
      level: 'intermediate',
      equipment: 'home',
      description: '250m, 500m, 750m, 500m, 250m pattern.',
      link: '/workouts/rowing/pyramids.html'
    },
    {
      id: 'row-006',
      title: '5K Row',
      modality: 'rowing',
      duration: 25,
      level: 'intermediate',
      equipment: 'home',
      description: 'Distance row for endurance.',
      link: '/workouts/rowing/5k-row.html'
    },
    {
      id: 'row-007',
      title: 'Rowing Tabata',
      modality: 'rowing',
      duration: 15,
      level: 'advanced',
      equipment: 'home',
      description: '8 rounds of 20 sec max effort.',
      link: '/workouts/rowing/tabata.html'
    },
    {
      id: 'row-008',
      title: '10K Row Challenge',
      modality: 'rowing',
      duration: 45,
      level: 'advanced',
      equipment: 'home',
      description: 'Long distance rowing test.',
      link: '/workouts/rowing/10k-challenge.html'
    },
    {
      id: 'row-009',
      title: 'Power Strokes',
      modality: 'rowing',
      duration: 20,
      level: 'advanced',
      equipment: 'home',
      description: 'Low stroke rate, maximum power.',
      link: '/workouts/rowing/power-strokes.html'
    },
    {
      id: 'row-010',
      title: 'Row & Burpees',
      modality: 'rowing',
      duration: 30,
      level: 'advanced',
      equipment: 'home',
      description: 'Alternating rowing and burpees.',
      link: '/workouts/rowing/row-burpees.html'
    },

    // ============================================
    // KETTLEBELL WORKOUTS (10 workouts)
    // ============================================
    {
      id: 'kb-001',
      title: 'Kettlebell Basics',
      modality: 'kettlebell',
      duration: 20,
      level: 'beginner',
      equipment: 'minimal',
      description: 'Learn deadlift, swing, goblet squat.',
      link: '/workouts/kettlebell/basics.html'
    },
    {
      id: 'kb-002',
      title: 'Swing 100',
      modality: 'kettlebell',
      duration: 15,
      level: 'intermediate',
      equipment: 'minimal',
      description: '100 kettlebell swings in sets of 10-20.',
      link: '/workouts/kettlebell/swing-100.html'
    },
    {
      id: 'kb-003',
      title: 'Kettlebell Flow',
      modality: 'kettlebell',
      duration: 25,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Swings, cleans, snatches circuit.',
      link: '/workouts/kettlebell/flow.html'
    },
    {
      id: 'kb-004',
      title: 'Turkish Get-Up Practice',
      modality: 'kettlebell',
      duration: 20,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Focused TGU technique work.',
      link: '/workouts/kettlebell/tgu.html'
    },
    {
      id: 'kb-005',
      title: 'Simple & Sinister',
      modality: 'kettlebell',
      duration: 30,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'Pavel\'s classic: 100 swings + 10 TGUs.',
      link: '/workouts/kettlebell/simple-sinister.html'
    },
    {
      id: 'kb-006',
      title: 'KB HIIT Complex',
      modality: 'kettlebell',
      duration: 25,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Multi-movement complexes for conditioning.',
      link: '/workouts/kettlebell/hiit-complex.html'
    },
    {
      id: 'kb-007',
      title: 'Double KB Challenge',
      modality: 'kettlebell',
      duration: 30,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Two kettlebell advanced workout.',
      link: '/workouts/kettlebell/double-kb.html'
    },
    {
      id: 'kb-008',
      title: 'Snatch Test Prep',
      modality: 'kettlebell',
      duration: 20,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Train for the 100 snatch in 5 min test.',
      link: '/workouts/kettlebell/snatch-test.html'
    },
    {
      id: 'kb-009',
      title: 'KB Cardio Blast',
      modality: 'kettlebell',
      duration: 20,
      level: 'intermediate',
      equipment: 'minimal',
      description: 'High-rep kettlebell for cardio.',
      link: '/workouts/kettlebell/cardio-blast.html'
    },
    {
      id: 'kb-010',
      title: 'Long Cycle',
      modality: 'kettlebell',
      duration: 35,
      level: 'advanced',
      equipment: 'minimal',
      description: 'Clean and jerk endurance sets.',
      link: '/workouts/kettlebell/long-cycle.html'
    }
  ],

  // Filter workouts based on criteria
  filter(criteria) {
    let results = [...this.workouts];

    // Time filter
    if (criteria.time) {
      const timeRanges = {
        '5-10': { min: 5, max: 10 },
        '15-20': { min: 15, max: 20 },
        '25-35': { min: 25, max: 35 },
        '40-50': { min: 40, max: 50 },
        '60+': { min: 60, max: 999 }
      };
      const range = timeRanges[criteria.time];
      if (range) {
        results = results.filter(w => w.duration >= range.min && w.duration <= range.max);
      }
    }

    // Modality filter
    if (criteria.modality) {
      results = results.filter(w => w.modality === criteria.modality);
    }

    // Level filter
    if (criteria.level) {
      results = results.filter(w => w.level === criteria.level);
    }

    // Equipment filter
    if (criteria.equipment) {
      const equipmentHierarchy = ['none', 'minimal', 'home', 'full'];
      const maxLevel = equipmentHierarchy.indexOf(criteria.equipment);
      results = results.filter(w => {
        const workoutLevel = equipmentHierarchy.indexOf(w.equipment);
        return workoutLevel <= maxLevel;
      });
    }

    return results;
  },

  // Get all unique values for a field
  getUniqueValues(field) {
    return [...new Set(this.workouts.map(w => w[field]))];
  }
};

// ============================================
// WORKOUT FILTER FUNCTIONALITY
// ============================================

function initWorkoutFilters() {
  const filterTime = document.getElementById('filter-time');
  const filterModality = document.getElementById('filter-modality');
  const filterLevel = document.getElementById('filter-level');
  const filterEquipment = document.getElementById('filter-equipment');
  const resultsContainer = document.getElementById('workout-results');
  const resultsCount = document.getElementById('results-count');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const showAllBtn = document.getElementById('show-all-workouts');

  if (!filterTime || !filterModality || !filterLevel || !filterEquipment) return;

  // Current filter state
  const filters = {
    time: '',
    modality: '',
    level: '',
    equipment: ''
  };

  // Apply filters and update display
  function applyFilters() {
    // Update filter state
    filters.time = filterTime.value;
    filters.modality = filterModality.value;
    filters.level = filterLevel.value;
    filters.equipment = filterEquipment.value;

    // Check if any filter is active
    const hasActiveFilter = Object.values(filters).some(v => v !== '');

    if (!hasActiveFilter) {
      // Hide results, show browse sections
      if (resultsContainer) {
        resultsContainer.style.display = 'none';
      }
      document.querySelectorAll('.browse-section').forEach(s => s.style.display = 'block');
      if (resultsCount) resultsCount.textContent = '';
      return;
    }

    // Get filtered workouts
    const criteria = {};
    if (filters.time) criteria.time = filters.time;
    if (filters.modality) criteria.modality = filters.modality;
    if (filters.level) criteria.level = filters.level;
    if (filters.equipment) criteria.equipment = filters.equipment;

    const results = WorkoutDatabase.filter(criteria);

    // Show results, hide browse sections
    if (resultsContainer) {
      resultsContainer.style.display = 'block';
      renderResults(results);
    }
    document.querySelectorAll('.browse-section').forEach(s => s.style.display = 'none');

    // Update count
    if (resultsCount) {
      resultsCount.textContent = `${results.length} workout${results.length !== 1 ? 's' : ''} found`;
    }
  }

  // Render workout results
  function renderResults(workouts) {
    if (!resultsContainer) return;

    const resultsGrid = resultsContainer.querySelector('.results-grid');
    if (!resultsGrid) return;

    if (workouts.length === 0) {
      resultsGrid.innerHTML = `
        <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>No workouts found</h3>
          <p class="text-gray">Try adjusting your filters for more results.</p>
          <button class="btn btn-primary mt-md" id="reset-filters-btn">Reset Filters</button>
        </div>
      `;

      // Add reset button listener
      const resetBtn = resultsGrid.querySelector('#reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', clearAllFilters);
      }
      return;
    }

    resultsGrid.innerHTML = workouts.map(w => `
      <div class="card workout-card" data-id="${w.id}">
        <div class="card-img" style="background: linear-gradient(135deg, ${getModalityColor(w.modality)} 0%, ${getModalityColorDark(w.modality)} 100%); display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 2.5rem;">${getModalityIcon(w.modality)}</span>
        </div>
        <span class="workout-badge">${w.duration} min</span>
        <div class="card-body">
          <h4 class="card-title">${w.title}</h4>
          <div class="workout-meta">
            <span>${capitalizeWord(w.modality)}</span>
            <span>${capitalizeWord(w.level)}</span>
          </div>
          <p class="card-text">${w.description}</p>
          <a href="${w.link}" class="btn btn-sm btn-primary">Start Workout</a>
        </div>
      </div>
    `).join('');
  }

  // Clear all filters
  function clearAllFilters() {
    filterTime.value = '';
    filterModality.value = '';
    filterLevel.value = '';
    filterEquipment.value = '';
    applyFilters();
  }

  // Add event listeners
  filterTime.addEventListener('change', applyFilters);
  filterModality.addEventListener('change', applyFilters);
  filterLevel.addEventListener('change', applyFilters);
  filterEquipment.addEventListener('change', applyFilters);

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', clearAllFilters);
  }

  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      // Clear other filters and show all
      filterTime.value = '';
      filterModality.value = '';
      filterLevel.value = '';
      filterEquipment.value = '';

      // Show all workouts
      if (resultsContainer) {
        resultsContainer.style.display = 'block';
        renderResults(WorkoutDatabase.workouts);
      }
      document.querySelectorAll('.browse-section').forEach(s => s.style.display = 'none');
      if (resultsCount) {
        resultsCount.textContent = `${WorkoutDatabase.workouts.length} workouts`;
      }
    });
  }

  // Check URL params for initial filters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('time')) filterTime.value = urlParams.get('time');
  if (urlParams.has('modality')) filterModality.value = urlParams.get('modality');
  if (urlParams.has('level')) filterLevel.value = urlParams.get('level');
  if (urlParams.has('equipment')) filterEquipment.value = urlParams.get('equipment');

  // Apply initial filters if any
  if (urlParams.toString()) {
    applyFilters();
  }
}

// Helper functions for filter display
function getModalityColor(modality) {
  const colors = {
    'running': '#2563eb',
    'cycling': '#059669',
    'swimming': '#0891b2',
    'hiit': '#dc2626',
    'bodyweight': '#f59e0b',
    'jump-rope': '#7c3aed',
    'dance': '#ec4899',
    'rowing': '#0d9488',
    'kettlebell': '#ea580c'
  };
  return colors[modality] || '#6b7280';
}

function getModalityColorDark(modality) {
  const colors = {
    'running': '#1d4ed8',
    'cycling': '#047857',
    'swimming': '#0e7490',
    'hiit': '#b91c1c',
    'bodyweight': '#d97706',
    'jump-rope': '#6d28d9',
    'dance': '#db2777',
    'rowing': '#0f766e',
    'kettlebell': '#c2410c'
  };
  return colors[modality] || '#4b5563';
}

function capitalizeWord(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');
}

// Initialize filters on page load
document.addEventListener('DOMContentLoaded', function() {
  initWorkoutFilters();
});

// Export for use in other scripts
window.ConditioningX = {
  RecommendationEngine,
  WorkoutTimer,
  WorkoutDatabase
};
