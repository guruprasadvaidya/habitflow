// src/App.jsx
import React, { useState, useEffect } from 'react';

const MOTIVATIONAL_MESSAGES = [
  "Progress > Perfection. 💡",
  "You vs. Yesterday. 🏆",
  "Discipline over motivation.⚡ ",
  "Growth happens now.🌟",
  "Show up. Win. Repeat. 🔄"
];

function App() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;

    const habit = {
      id: Date.now(),
      name: newHabit,
      streak: 0,
      lastCompleted: null,
      completedDays: 0
    };

    setHabits([...habits, habit]);
    setNewHabit('');
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const completeHabit = (id) => {
    const today = new Date().toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        if (habit.lastCompleted === today) {
          setMessage("Mission accomplished! Return stronger tomorrow! 💪");
          return habit;
        }

        const newCompletedDays = habit.completedDays + 1;
        const newStreak = newCompletedDays % 7 === 0 ? habit.streak + 1 : habit.streak;

        const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
        setMessage(randomMessage);

        return {
          ...habit,
          lastCompleted: today,
          completedDays: newCompletedDays,
          streak: newStreak
        };
      }
      return habit;
    }));

    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-start w-screen h-screen min-h-screen bg-gray-900 text-gray-300 p-4">
      <h1 className="text-xl font-bold text-gray-100 mb-4">HabitFlow 🔄</h1>
      <h2 className="text-sm mb-4 text-gray-400 italic text-center "> Your habits make your stories.🚀</h2>

      <form onSubmit={addHabit} className="w-full max-w-xs mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter new habit..."
            className="flex-1 p-2 rounded-md bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {message && (
        <div className="fixed top-4 right-4 bg-gray-800 text-gray-300 px-4 py-2 rounded-md shadow-lg">
          {message}
        </div>
      )}

      <div className="w-full max-w-xs space-y-3">
        {habits.map(habit => (
          <div
            key={habit.id}
            className="p-3 bg-gray-800 rounded-md shadow-sm border border-gray-700 hover:shadow-md transition-shadow "
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-200">{habit.name}</h3>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-red-400 hover:text-red-500 font-bold"
              >
                ×
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-400">
                  Progress: {habit.completedDays} days
                </span>
                {habit.streak > 0 && (
                  <span className="ml-2 text-sm text-yellow-400">
                    🔥 Streak: {habit.streak}
                  </span>
                )}
              </div>
              
              <button
                onClick={() => completeHabit(habit.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  habit.lastCompleted === new Date().toDateString()
                    ? 'bg-green-700 text-green-200'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {habit.lastCompleted === new Date().toDateString()
                  ? 'Done ✓'
                  : 'Complete!'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
