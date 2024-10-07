import React, { useState, useCallback } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Sun, Moon, Wifi, WifiOff, Battery, BatteryLow, BatteryMedium, BatteryFull, Settings, Volume2, Camera, Lightbulb, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const CustomSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  isDarkMode: boolean;
}> = ({ value, onChange, min, max, isDarkMode }) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  return (
    <div className="relative w-full h-9">
      <div
        className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 rounded"
        style={{
          background: `linear-gradient(to right, ${isDarkMode ? '#3B82F6' : '#2563EB'} 0%, ${isDarkMode ? '#3B82F6' : '#2563EB'} ${(value - min) / (max - min) * 100}%, ${isDarkMode ? '#4B5563' : '#D1D5DB'} ${(value - min) / (max - min) * 100}%, ${isDarkMode ? '#4B5563' : '#D1D5DB'} 100%)`
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-600 shadow-md"
        style={{ left: `calc(${(value - min) / (max - min) * 100}% - 10px)` }}
      >
        <div className="w-1 h-4 bg-white mx-auto mt-0.5" />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [speed, setSpeed] = useState(50)
  const [isConnected, setIsConnected] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(75)
  const [activeSection, setActiveSection] = useState('control')
  const [visibleToasts, setVisibleToasts] = useState(0)

  const toggleTheme = () => setIsDarkMode(!isDarkMode)

  const handleDirection = (direction: string) => {
    if (visibleToasts > 3) {
      toast.dismiss()
      setVisibleToasts(prev => prev - 1)
    }

    toast.success(`Moving ${direction}`, {
      icon: '🚗',
      style: {
        borderRadius: '10px',
        background: isDarkMode ? '#333' : '#fff',
        color: isDarkMode ? '#fff' : '#333',
      },
      duration: 2000,
      onClose: () => setVisibleToasts(prev => prev - 1),
    })

    setVisibleToasts(prev => prev + 1)
  }

  const getBatteryIcon = () => {
    if (batteryLevel > 75) return <BatteryFull />
    if (batteryLevel > 50) return <Battery />
    if (batteryLevel > 25) return <BatteryMedium />
    return <BatteryLow />
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'control':
        return (
          <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-sm mx-auto">
            <div />
            <button 
              className="p-6 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors" 
              onClick={() => handleDirection('forward')}
            >
              <ChevronUp className="w-12 h-12 mx-auto text-white" />
            </button>
            <div />
            <button 
              className="p-6 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors" 
              onClick={() => handleDirection('left')}
            >
              <ChevronLeft className="w-12 h-12 mx-auto text-white" />
            </button>
            <div />
            <button 
              className="p-6 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors" 
              onClick={() => handleDirection('right')}
            >
              <ChevronRight className="w-12 h-12 mx-auto text-white" />
            </button>
            <div />
            <button 
              className="p-6 bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition-colors" 
              onClick={() => handleDirection('backward')}
            >
              <ChevronDown className="w-12 h-12 mx-auto text-white" />
            </button>
            <div />
          </div>
        )
      case 'speed':
        return (
          <div className="mb-8 w-full max-w-xs mx-auto">
            <p className="text-center mb-2">Speed: {speed}%</p>
            <CustomSlider
              value={speed}
              onChange={setSpeed}
              min={0}
              max={100}
              isDarkMode={isDarkMode}
            />
          </div>
        )
      case 'functions':
        return (
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs mx-auto">
            <button className="p-4 bg-green-600 rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center text-white">
              <Volume2 className="w-6 h-6 mr-2" /> Horn
            </button>
            <button className="p-4 bg-yellow-600 rounded-lg shadow-lg hover:bg-yellow-700 transition-colors flex items-center justify-center text-white">
              <Lightbulb className="w-6 h-6 mr-2" /> Lights
            </button>
            <button className="p-4 bg-purple-600 rounded-lg shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-white">
              <Camera className="w-6 h-6 mr-2" /> Camera
            </button>
            <button className="p-4 bg-gray-600 rounded-lg shadow-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-white">
              <Settings className="w-6 h-6 mr-2" /> Settings
            </button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center">
        <button onClick={toggleTheme} className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} transition-colors`}>
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <div className="flex items-center space-x-4">
          {isConnected ? <Wifi className="w-6 h-6 text-green-500" /> : <WifiOff className="w-6 h-6 text-red-500" />}
          <div className="flex items-center">
            {getBatteryIcon()}
            <span className="ml-1">{batteryLevel}%</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="w-full">
          {renderSection()}
        </div>
      </main>

      <footer className="p-4">
        <nav className="flex justify-around">
          <button
            className={`p-2 rounded-lg ${activeSection === 'control' ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-blue-700 transition-colors text-white`}
            onClick={() => setActiveSection('control')}
          >
            Control
          </button>
          <button
            className={`p-2 rounded-lg ${activeSection === 'speed' ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-blue-700 transition-colors text-white`}
            onClick={() => setActiveSection('speed')}
          >
            Speed
          </button>
          <button
            className={`p-2 rounded-lg ${activeSection === 'functions' ? 'bg-blue-600' : isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} hover:bg-blue-700 transition-colors text-white`}
            onClick={() => setActiveSection('functions')}
          >
            Functions
          </button>
        </nav>
      </footer>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App