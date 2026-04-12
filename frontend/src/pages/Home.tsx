import { ArrowRight, MoreHorizontal, Lightbulb, AlertTriangle, CheckCircle2, Play, ExternalLink, RefreshCw } from 'lucide-react';
import { ShinyText } from '../components/ShinyText';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Factual Stress Relief Articles imitating a fetched API
const FETCHED_ARTICLES = [
  {
    tag: "NEUROSCIENCE",
    source: "HARVARD MEDICAL SCHOOL",
    title: "The Science of Diaphragmatic Breathing",
    description: "Deep belly breathing stimulates the vagus nerve, immediately triggering the parasympathetic nervous system to lower heart rate and blood cortisol levels within minutes.",
    actionText: "Read Protocol on Harvard Health",
    url: "https://www.health.harvard.edu/mind-and-mood/relaxation-techniques-breath-control-helps-quell-errant-stress-response",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop"
  },
  {
    tag: "SOMATIC THERAPY",
    source: "NATIONAL INSTITUTES OF HEALTH",
    title: "Bilateral Stimulation for Anxiety",
    description: "Physical activities like walking or tapping that alternate sides of the body can help the brain process emotional distress by mirroring EMDR therapeutic mechanics.",
    actionText: "View NIH Research",
    url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3939750/",
    imageUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2000&auto=format&fit=crop"
  },
  {
    tag: "COGNITIVE BEHAVIORAL",
    source: "UR MEDICINE",
    title: "The 5-4-3-2-1 Grounding Method",
    description: "Activating all five senses forces the brain's computational focus to shift away from anxiety-inducing limbic loops directly back into the present physical environment.",
    actionText: "Start Grounding Protocol",
    url: "https://www.urmc.rochester.edu/behavioral-health-partners/bhp-blog/april-2018/5-4-3-2-1-coping-technique-for-anxiety.aspx",
    imageUrl: "https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=2000&auto=format&fit=crop"
  },
  {
    tag: "PHYSIOLOGY",
    source: "MEDICAL NEWS TODAY",
    title: "The 4-7-8 Natural Tranquilizer",
    description: "Inhaling for 4 seconds, holding for 7, and exhaling for 8 alters the oxygen-to-carbon dioxide ratio in the blood, acting as a natural tranquilizer for the nervous system.",
    actionText: "Try the 4-7-8 Technique",
    url: "https://www.medicalnewstoday.com/articles/324417",
    imageUrl: "https://images.unsplash.com/photo-1499808365111-e621183df566?q=80&w=2000&auto=format&fit=crop"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [articleIndex, setArticleIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const fetchNextArticle = () => {
    setIsFetching(true);
    // Simulate network delay for fetching
    setTimeout(() => {
      setArticleIndex((prev) => (prev + 1) % FETCHED_ARTICLES.length);
      setIsFetching(false);
    }, 600);
  };

  const currentArticle = FETCHED_ARTICLES[articleIndex];

  return (
    <div className="w-full bg-transparent flex flex-col font-sans min-h-screen">
      
      {/* Hero Section With Video Background */}
      <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black/20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
        >
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col h-full pt-32 pb-20 justify-between flex-1">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-10">
            <p className="text-white/70 text-sm md:text-base max-w-md">
              Advanced real-time human emotion and stress detection systems, designed to help organizations and individuals maintain optimal mental wellbeing securely.
            </p>
            <p className="text-white/70 text-sm md:text-base lg:text-right">
              Thousands monitored in real-time.
            </p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-start md:items-center text-left md:text-center mt-12 mb-32">
            <p className="text-white/70 text-xs md:text-sm uppercase tracking-widest mb-4 font-semibold">
              Protecting your wellbeing
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-medium tracking-tighter leading-[0.85] mb-12">
              <span className="block text-white">Understand</span>
              <span className="block mt-2">
                <ShinyText text="Your Mind." />
              </span>
            </h1>
            
            <Link to="/login" className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 md:px-8 md:py-4 transition-all shadow-lg shadow-blue-900/20 font-medium tracking-wide">
              <span>Connect to Dashboard</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* NEW FEATURE SECTION - Fully Blended Flat Dark Theme */}
      <div className="w-full pb-32 pt-20 px-4 -mt-32 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* Left Column: Recent Insights */}
          <div className="bg-[#0b0f17]/40 backdrop-blur-3xl border border-[#1a2235]/60 rounded-3xl p-6 lg:p-8 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">Recent Insights</h3>
              <button 
                 onClick={() => alert('Opening insight settings...')}
                 className="text-gray-500 hover:text-white transition-colors"
                 title="Manage Insights"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              <div 
                className="bg-[#121826]/40 rounded-2xl p-5 border border-[#1e293b]/60 flex gap-4 cursor-pointer hover:border-[#2dd4bf]/50 hover:bg-[#161f30]/60 transition-all group backdrop-blur-md"
                onClick={() => navigate(localStorage.getItem('role') ? '/dashboard' : '/login')}
              >
                <div className="w-10 h-10 shrink-0 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] mb-1">Pattern Detected</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">Elevated stress levels usually occur at 2 PM. Consider a 5-minute walk.</p>
                  <p className="text-blue-500 text-xs font-bold tracking-widest uppercase">2 Hours Ago</p>
                </div>
              </div>

              <div 
                className="bg-[#121826]/40 rounded-2xl p-5 border border-[#1e293b]/60 flex gap-4 cursor-pointer hover:border-red-500/50 hover:bg-[#161f30]/60 transition-all group backdrop-blur-md"
                onClick={() => navigate(localStorage.getItem('role') ? '/dashboard' : '/login')}
              >
                <div className="w-10 h-10 shrink-0 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:bg-red-500/20 transition-colors">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] mb-1">System Alert</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">External noise levels in your office are 15% higher than average today.</p>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">5 Hours Ago</p>
                </div>
              </div>

              <div 
                className="bg-[#121826]/40 rounded-2xl p-5 border border-[#1e293b]/60 flex gap-4 cursor-pointer hover:border-emerald-500/50 hover:bg-[#161f30]/60 transition-all group backdrop-blur-md"
                onClick={() => navigate(localStorage.getItem('role') ? '/dashboard' : '/login')}
              >
                <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-[15px] mb-1">Goal Achieved</h4>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">You maintained a 'Normal' stress state for 6 consecutive hours.</p>
                  <p className="text-gray-500 text-xs font-bold tracking-widest uppercase">Yesterday</p>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6">
              <button 
                onClick={() => navigate(localStorage.getItem('role') ? '/dashboard' : '/login')}
                className="w-full bg-[#121826] border border-[#1e293b] rounded-lg py-3 text-center text-blue-500 font-bold text-xs tracking-widest uppercase hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-sm"
              >
                View All Activities
              </button>
            </div>
          </div>

          {/* Right Column: Dynamic Fact-Based Fitness Articles */}
          <div className="lg:col-span-2 rounded-[2rem] relative bg-[#0b0f17]/40 backdrop-blur-3xl border border-[#1a2235]/60 flex flex-col justify-end min-h-[500px] shadow-2xl p-8 lg:p-14 overflow-hidden group">
             
             {/* Background Image exactly like the first requested mockup */}
             <div 
               className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105 opacity-80"
               style={{ backgroundImage: `url('${currentArticle.imageUrl}')` }}
             ></div>
             
             {/* Gradient overlay for text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-[#050505]/20 z-0"></div>

             {/* Content Block */}
             <div className={`relative z-10 transition-opacity duration-500 ${isFetching ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex justify-start items-center gap-4 mb-6">
                  <span className="inline-block bg-[#12213d] text-blue-400 border border-blue-500/20 text-[11px] font-bold tracking-widest uppercase px-4 py-2 rounded-full backdrop-blur-md">
                    {currentArticle.tag}
                  </span>
                  <span className="text-gray-300 text-[11px] font-bold tracking-widest uppercase bg-black/40 px-3 py-1.5 rounded-md backdrop-blur-md">
                    {currentArticle.source}
                  </span>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6 tracking-tight max-w-2xl drop-shadow-lg">
                  {currentArticle.title}
                </h2>
                
                <p className="text-[#cbd5e1] text-base md:text-lg font-medium max-w-xl mb-10 leading-relaxed drop-shadow-md">
                  {currentArticle.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.open(currentArticle.url, '_blank')}
                    className="bg-white hover:bg-gray-200 text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                  >
                    <ExternalLink className="w-5 h-5" /> {currentArticle.actionText}
                  </button>
                  <button 
                    onClick={fetchNextArticle}
                    disabled={isFetching}
                    className="bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-lg"
                  >
                    <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} /> Next Article
                  </button>
                </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Home;
