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

// Export for use in other scripts
window.ConditioningX = {
  RecommendationEngine,
  WorkoutTimer
};
