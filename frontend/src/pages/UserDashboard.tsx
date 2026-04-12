import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Wifi, Activity } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const UserDashboard = () => {
  const [stressLevel, setStressLevel] = useState(50);
  const [heartRate, setHeartRate] = useState(0);
  const [spo2, setSpo2] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });
  const [connectedIp, setConnectedIp] = useState<string | null>(localStorage.getItem('wearable_ip'));
  const [btStatus, setBtStatus] = useState<string>('Disconnected');
  const [isSimulated, setIsSimulated] = useState<boolean>(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');
  
  const socketRef = useRef<Socket | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Connect to websocket backend
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');
    
    socketRef.current.on('emotions-update', (users) => {
      // Completely severed backend simulation injection.
      // The graph and numbers will now exclusively run strictly natively off physical Bluetooth data below!
    });

    return () => {
      socketRef.current?.disconnect();
    }
  }, []);

  const handleConnectWearable = async () => {
    // UNPAIR LOGIC
    if (connectedIp) {
      setConnectedIp(null);
      localStorage.removeItem('wearable_ip');
      setIsSimulated(true);
      setBtStatus('Disconnected cleanly by user.');
      setStressLevel(0); setHeartRate(0); setSpo2(0);
      setMotion({ x: 0, y: 0, z: 0 });
      return;
    }

    // PAIR LOGIC
    try {
      const ip = window.prompt("Enter the ESP32 WiFi IP Address printed on the Serial Monitor:", "192.168.");
      if (!ip) {
        setBtStatus('Connection Cancelled.');
        return;
      }

      setBtStatus(`Connecting precisely to http://${ip}/data...`);
      
      // Ping check before saving
      const res = await fetch(`http://${ip}/data`);
      if (!res.ok) throw new Error("Hardware rejected HTTP connection");
      
      // Hardware ping successful! Save it forever until manual unpair
      localStorage.setItem('wearable_ip', ip);
      setConnectedIp(ip);
      
    } catch (error: any) {
      console.error(error);
      setBtStatus('Disconnected: ' + error.message);
      setIsSimulated(true);
    }
  };

  // Dedicated Auto-Polling Engine (Triggers instantly if localstorage holds an IP!)
  useEffect(() => {
    if (!connectedIp) {
       if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
       return;
    }

    setIsSimulated(false); // Hardware is confirmed! Bring the UI online.
    
    // Reset simulated dashboard trace memory mathematically to zero upon a new connection boot
    setStressLevel(0); setHeartRate(0); setSpo2(0); setHistory([]); setLabels([]); setMotion({ x: 0, y: 0, z: 0 });
    
    setBtStatus(`🟢 Connected & Streaming over Local WiFi Server (${connectedIp})`);

    // Destroy any ghost polling engines running
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const fetchRes = await fetch(`http://${connectedIp}/data`);
        const data = await fetchRes.json();
        
        let currentHR = parseFloat(data.hr) || 0;
        let currentSpo2 = parseFloat(data.spo2) || 0;
        let currentReading = parseFloat(data.stress) || 0;
        let pX = parseFloat(data.x) || 0;
        let pY = parseFloat(data.y) || 0;
        let pZ = parseFloat(data.z) || 0;
        
        setMotion({ x: pX, y: pY, z: pZ });
        
        // If no finger is detected (HR is 0), strictly force Stress down to absolute 0
        if (currentHR === 0) {
           currentReading = 0;
        }
        
        setStressLevel(currentReading);

        // Force the physical stream to smoothly draw the live graph exactly!
        const timeStr = new Date().toLocaleTimeString();
        setLabels(prev => [...prev.slice(-59), timeStr]);
        setHistory(prev => [...prev.slice(-59), currentReading]);

        if (currentHR > 0) setHeartRate(currentHR);
        if (currentSpo2 > 0) setSpo2(currentSpo2);
        
        // Relay hardware data safely to backend Database and Admin
        if (socketRef.current) {
          const currentUserId = localStorage.getItem('userId') || '1';
          socketRef.current.emit('wearable-update', {
             userId: currentUserId, 
             stressLevel: currentReading
          });
        }
      } catch (innerErr) {
        console.error("Local polling drop:", innerErr);
      }
    }, 1000); // Poll exactly 1 time per second

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [connectedIp]);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Stress Level',
        data: history,
        borderColor: 'rgba(59, 130, 246, 1)', 
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
      }
    ]
  };

  const lineChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } };

  // Dynamic Pattern Generator based strictly on your active live history mathematical loops!
  const buildBlocks = (numBlocks: number, sliceSize: number) => {
    let result = Array(numBlocks).fill(0);
    if (!history || history.length === 0) return result;
    const source = history.slice(-(numBlocks * sliceSize));
    for (let i = 0; i < numBlocks; i++) {
       const slice = source.slice(i * sliceSize, (i + 1) * sliceSize);
       if (slice.length > 0) result[i] = slice.reduce((a,b)=>a+b,0) / slice.length;
    }
    return result;
  };

  const sevenDayLabels = ['-30s', '-25s', '-20s', '-15s', '-10s', '-5s', 'NOW'];
  const sevenDayValues = buildBlocks(7, 5); // 7 blocks dynamically averaging the latest 5 seconds each
  
  const twelveMonthLabels = ['-55s', '-50s', '-45s', '-40s', '-35s', '-30s', '-25s', '-20s', '-15s', '-10s', '-5s', 'NOW'];
  const twelveMonthValues = buildBlocks(12, 5);

  const isWeek = timeRange === 'week';
  const displayLabels = isWeek ? sevenDayLabels : twelveMonthLabels;
  const displayValues = isWeek ? sevenDayValues : twelveMonthValues;
  
  const patternChartData = {
    labels: displayLabels,
    datasets: [
      {
         label: 'Average Stress Block',
         data: displayValues,
         backgroundColor: displayLabels.map((_, idx) => {
             // Let the visual aesthetic react beautifully to the ESP32!
             if (displayValues[idx] >= 80) return 'rgba(239, 68, 68, 0.8)'; // Blood Red for Danger Spikes
             if (displayValues[idx] >= 60) return 'rgba(234, 179, 8, 0.5)'; // Yellow warning
             return 'rgba(37, 99, 235, 1)'; // Deep solid blue for safe loops
         }),
         borderRadius: 8,
         borderSkipped: false,
         barPercentage: isWeek ? 0.6 : 0.8,
      }
    ]
  };

  const patternChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { display: false, min: 0, max: 100 }, // Hide Y-Axis like the image
      x: { 
         grid: { display: false }, 
         ticks: { color: '#6b7280', font: { weight: 'bold' } },
         border: { display: false }
      }
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-transparent relative overflow-hidden">
      {/* Animated Motion Background Network */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-900/10 blur-[150px] animate-[pulse_12s_ease-in-out_infinite]"></div>
         <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-red-900/5 blur-[100px] animate-[pulse_15s_ease-in-out_infinite]"></div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <h1 className="text-3xl font-medium text-white mb-8">Personal Dashboard</h1>
        
        {/* Bluetooth Pairing Module */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-medium text-blue-400 flex items-center gap-2">
              <Wifi className="w-5 h-5" /> Local Network Hub Module
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Connect your EmoSync smart wearable directly over your WiFi network router to stream numbers safely.
            </p>
            <p className="text-sm text-blue-300 font-medium mt-2">Status: {btStatus} {isSimulated ? '(Fallback Simulation Engine Active)' : ''}</p>
          </div>
          <button 
            onClick={handleConnectWearable}
            className={`shrink-0 text-white font-medium px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all ${connectedIp ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
             <Activity className="w-4 h-4" /> {connectedIp ? 'Unpair Device' : 'Connect via WiFi'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Stress Level Card */}
          <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl text-gray-400 mb-6">Current Stress</h3>
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-4 border-gray-800">
              <div 
                className={`absolute inset-0 rounded-full border-4 opacity-50 transition-all duration-300 ${stressLevel > 80 ? 'border-red-500' : 'border-blue-500'}`}
                style={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${isSimulated ? 100 : 100 - stressLevel}%, 0 ${isSimulated ? 100 : 100 - stressLevel}%)` }}
              ></div>
              <span className="text-5xl font-bold text-white z-10">{isSimulated ? '--' : stressLevel}<span className={`${isSimulated ? 'hidden' : ''}`}>%</span></span>
            </div>
            <p className="mt-6 text-sm text-center text-gray-400">
              {isSimulated ? 'Awaiting Data...' : stressLevel === 0 ? 'Place Finger to Scan.' : stressLevel > 80 ? 'Critical Stress Detected.' : 'Normal Levels.'}
            </p>
          </div>

          {/* Heart Rate Card */}
          <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl text-gray-400 mb-6">Heart Rate</h3>
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-4 border-gray-800 overflow-hidden">
               <div className={`absolute bottom-0 w-full bg-red-500/20 transition-all duration-500 ${heartRate > 100 ? 'bg-red-500/40' : ''}`} style={{ height: `${(heartRate / 180) * 100}%` }}></div>
               <h2 className="text-4xl font-bold text-white z-10">{isSimulated ? '--' : (heartRate === 0 ? '0.00' : heartRate.toFixed(2))} <span className="text-lg text-gray-400">BPM</span></h2>
            </div>
            <p className="mt-6 text-sm text-center text-gray-400">
              {isSimulated ? 'Awaiting Data...' : heartRate === 0 ? 'Place Finger to Scan.' : heartRate > 100 ? 'Elevated Heart Rate' : 'Resting Heart Rate'}
            </p>
          </div>

          {/* SpO2 Card */}
          <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-xl text-gray-400 mb-6">Blood Oxygen (SpO2)</h3>
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-4 border-gray-800">
               <div className="absolute inset-0 rounded-full border-4 border-emerald-500 opacity-50" style={{ clipPath: `polygon(0 100%, 100% 100%, 100% ${100 - spo2}%, 0 ${100 - spo2}%)` }}></div>
               <h2 className="text-4xl font-bold text-white z-10">{isSimulated ? '--' : (spo2 === 0 ? '0.00' : spo2.toFixed(2))} <span className="text-lg text-gray-400">%</span></h2>
            </div>
            <p className="mt-6 text-sm text-center text-gray-400">
              {isSimulated ? 'Awaiting Data...' : spo2 === 0 ? 'Place Finger to Scan.' : spo2 >= 95 ? 'Healthy Saturation' : 'Low Saturation Warning'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trend Graph Card */}
          <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-xl p-6 min-h-[300px] flex flex-col">
            <h3 className="text-xl text-gray-400 mb-4">Historical Activity (Real-Time Stream)</h3>
            <div className="flex-1 w-full min-h-[16rem]">
               <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* 3D Spatial Tracking Engine Component */}
          <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-xl p-6 min-h-[300px] flex flex-col">
            <h3 className="text-xl text-gray-400 mb-4">Spatial Alignment (Accelerometer 3D Tracker)</h3>
            <div className="flex-1 w-full flex items-center justify-center bg-gray-950/80 rounded-lg border border-gray-800 overflow-hidden relative" style={{ perspective: '800px' }}>
              
              {/* The 3D Hovering Reticle/Object */}
              <div 
                 className={`w-36 h-36 bg-blue-600/10 backdrop-blur-md border-2 ${isSimulated ? 'border-gray-600/30' : 'border-blue-400'} rounded-3xl flex items-center justify-center transition-transform duration-[600ms] ease-out`}
                 style={{ 
                   transform: `rotateX(${isSimulated ? 15 : motion.y * -90}deg) rotateY(${isSimulated ? -15 : motion.x * 90}deg) translateZ(30px)`,
                   boxShadow: isSimulated ? 'none' : '0 10px 40px -10px rgba(59,130,246,0.5), inset 0 0 20px rgba(59,130,246,0.2)'
                 }}
              >
                {/* Target Inner Dot */}
                <div className={`w-12 h-12 rounded-full border border-dashed ${isSimulated ? 'border-gray-600' : 'border-blue-300'} flex items-center justify-center`}>
                   <div className={`w-3 h-3 rounded-full ${isSimulated ? 'bg-gray-600' : 'bg-blue-300 animate-pulse shadow-[0_0_15px_#93c5fd]'}`}></div>
                </div>
              </div>
              
              {/* Static Background Crosshairs strictly for visual depth referencing */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                 <div className="w-full h-px bg-blue-400 absolute"></div>
                 <div className="h-full w-px bg-blue-400 absolute"></div>
              </div>

              {/* Readout Output Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-sm font-mono text-gray-400 bg-gray-900/60 py-1.5 px-4 rounded-full border border-gray-700/50 backdrop-blur-sm shadow-md">
                 <span>X: {isSimulated ? '--' : motion.x.toFixed(2)}</span>
                 <span>Y: {isSimulated ? '--' : motion.y.toFixed(2)}</span>
                 <span>Z: {isSimulated ? '--' : motion.z.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Pattern Layout Block mimicking the screenshot */}
        <div className="bg-gray-900/40 backdrop-blur-3xl border border-gray-800/50 rounded-xl p-8 relative flex flex-col justify-between">
            <div className="flex justify-between items-center mb-10">
               <h2 className="text-2xl font-bold text-white">{isWeek ? 'Real-Time Stress Loops (35s Window)' : 'Real-Time Stress Loops (60s Window)'}</h2>
               <div className="flex bg-black/40 rounded-full p-1 border border-gray-800 relative z-20">
                 <button 
                   onClick={() => setTimeRange('week')}
                   className={`px-5 py-1.5 rounded-full font-semibold text-sm shadow-md transition-colors ${isWeek ? 'bg-blue-600 text-white' : 'text-gray-400 font-medium hover:text-white'}`}
                 >35-Sec</button>
                 <button 
                   onClick={() => setTimeRange('month')}
                   className={`px-5 py-1.5 rounded-full font-semibold text-sm shadow-md transition-colors ${!isWeek ? 'bg-blue-600 text-white' : 'text-gray-400 font-medium hover:text-white'}`}
                 >60-Sec</button>
               </div>
            </div>

            <div className="relative h-64 w-full">
               {/* Extremely faint horizontal grid lines simulating the light gray lines in design */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 px-8">
                  <div className="border-t border-gray-800 w-full mb-auto mt-4"></div>
                  <div className="border-t border-gray-800 w-full mb-auto mt-24"></div>
               </div>
               
               {/* The active chart layered on top */}
               <div className="relative z-10 h-full w-full">
                 <Bar data={patternChartData} options={patternChartOptions} />
               </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
