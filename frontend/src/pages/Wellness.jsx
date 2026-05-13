import React, { useState } from 'react';
import { Heart, Smile, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Wellness = () => {
  const { token } = useAuthStore();
  const [moodScore, setMoodScore] = useState(5);
  const [emotion, setEmotion] = useState('neutral');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const emotions = ['happy', 'sad', 'anxious', 'stressed', 'motivated', 'tired', 'neutral'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/mood/log', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moodScore, emotion, notes })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Mood logged successfully!');
        setNotes('');
      } else {
        toast.error(data.message || 'Failed to log mood');
      }
    } catch (error) {
      toast.error('Error logging mood');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Wellness Check-in</h1>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Score Slider */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">How are you feeling today?</label>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>😢 Terrible (1)</span>
                <span className="text-center">Mood Score: <span className="font-bold text-indigo-600">{moodScore}/10</span></span>
                <span>😄 Amazing (10)</span>
              </div>
            </div>
          </div>

          {/* Emotion Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">Current Emotion</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
              {emotions.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmotion(e)}
                  className={`p-3 rounded-lg text-center transition capitalize font-semibold ${
                    emotion === e
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-4">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's on your mind? Share anything you'd like..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="5"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" />
            {loading ? 'Saving...' : 'Log Mood'}
          </button>
        </form>
      </div>

      {/* Wellness Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <Smile className="w-10 h-10 text-green-600 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Meditation</h3>
          <p className="text-gray-700 text-sm">Try a 10-minute guided meditation to calm your mind and reduce stress.</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
          <Smile className="w-10 h-10 text-blue-600 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Exercise</h3>
          <p className="text-gray-700 text-sm">A 20-minute walk or light exercise can boost your mood and energy levels.</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
          <Smile className="w-10 h-10 text-purple-600 mb-3" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">Sleep</h3>
          <p className="text-gray-700 text-sm">Maintain a consistent sleep schedule for better mental and physical health.</p>
        </div>
      </div>
    </div>
  );
};

export default Wellness;