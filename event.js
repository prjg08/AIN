"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const FestivalFinder = () => {
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("all");

  const fetchEvents = async () => {
    setLoading(true);
    setEvents([]);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/festivals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, interests, category }),
      });

      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      } else {
        console.error("Invalid response:", data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }

    setLoading(false);
  };

  const categories = ["all", "music", "food", "art", "tech", "sports"];

  // Mock data for illustrations
  const illustrations = {
    music: "🎵",
    food: "🍕",
    art: "🎨",
    tech: "💻",
    sports: "⚽",
    all: "🎉"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 pt-6"
        >
          <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3">Discover Amazing Events</div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">Festival Finder</h1>
          <p className="text-blue-600 max-w-xl mx-auto">Find the perfect events based on your preferences and location.</p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search Panel */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/3 bg-white rounded-2xl shadow-xl p-6 border border-blue-100 h-fit"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-blue-800">Search Filters</h2>
              <span className="text-2xl">🔍</span>
            </div>

            <div className="mb-5">
              <label className="block text-blue-700 font-medium mb-2">Your Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="City, State or Country..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 p-3 text-blue-800 rounded-lg bg-blue-50 border border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-blue-700 font-medium mb-2">Your Interests</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Music, Art, Food, Technology..."
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  className="w-full pl-10 p-3 text-blue-800 rounded-lg bg-blue-50 border border-blue-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-blue-700 font-medium mb-2">Event Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                      category === cat
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                  >
                    {illustrations[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={fetchEvents}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium px-4 py-3 rounded-lg transition duration-300 shadow-md flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching Events...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                  Discover Events
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:w-2/3"
          >
            {events.length > 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-blue-800">Upcoming Events</h3>
                  <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm font-medium">{events.length} events found</span>
                </div>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex items-center justify-center bg-blue-200 rounded-lg p-4 text-4xl md:w-16 md:h-16">
                          {event.category ? illustrations[event.category] : "🎉"}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <h4 className="text-lg font-bold text-blue-800">{event.name}</h4>
                            <div className="flex items-center mt-2 md:mt-0">
                              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">{event.date}</span>
                            </div>
                          </div>
                          <div className="mt-2 flex items-start">
                            <svg className="h-5 w-5 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-blue-700">{event.location}</span>
                          </div>
                          <p className="mt-2 text-blue-700">{event.description}</p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {event.tags && event.tags.map((tag, idx) => (
                              <span key={idx} className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                {tag}
                              </span>
                            ))}
                            {!event.tags && (
                              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                                {event.category || "Event"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-blue-100 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-blue-800 mb-2">Find Your Next Adventure</h3>
                <p className="text-blue-600 mb-6">Use the search filters to discover exciting events near you!</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {categories.map((cat) => (
                    <div key={cat} className="flex flex-col items-center">
                      <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2">
                        {illustrations[cat]}
                      </div>
                      <span className="text-blue-700 text-sm">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center text-blue-600"
        >
          <div className="mb-2 flex justify-center gap-4">
            <a href="#" className="text-blue-500 hover:text-blue-700 transition">About</a>
            <a href="#" className="text-blue-500 hover:text-blue-700 transition">Contact</a>
            <a href="#" className="text-blue-500 hover:text-blue-700 transition">Privacy</a>
            <a href="#" className="text-blue-500 hover:text-blue-700 transition">Terms</a>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Festival Finder • Find the perfect events for you</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default FestivalFinder;
