import React, { useState } from 'react';

const policies = [
  "Access to Education",
  "Language Instruction",
  "Teacher Training",
  "Curriculum Adaptation",
  "Psychosocial Support",
  "Financial Support",
  "Certification/Accreditation"
];

const options = [
  { label: "Option 1", cost: 1 },
  { label: "Option 2", cost: 2 },
  { label: "Option 3", cost: 3 },
];

const descriptions = [
  [
    "Limit access to education for refugees, allowing only a small percentage to enroll in mainstream schools. - Advantage: Prioritizes resources on citizens, easing infrastructure pressure. - Disadvantage: Excludes many refugee children, hindering their prospects.",
    "Establish separate schools or learning centers specifically for refugee education. - Advantage: Dedicated education addressing refugee needs. - Disadvantage: May foster segregation and limit integration opportunities.",
    "Provide equal access to education for all, integrating refugee students into mainstream schools. - Advantage: Promotes integration and social cohesion. - Disadvantage: Requires additional resources and support systems."
  ],
  [
    "Maintain the current policy of teaching only Teanish. - Advantage: Preserves linguistic unity. - Disadvantage: Hinders refugee integration and leads to disparities.",
    "Provide basic Teanish language courses. - Advantage: Enables basic communication. - Disadvantage: Limits academic progress due to inadequate skills.",
    "Implement comprehensive bilingual programs. - Advantage: Promotes inclusion and cultural identity. - Disadvantage: Resource-intensive and complex to implement."
  ],
  [
    "Provide minimal or no specific training for teachers. - Advantage: Saves resources. - Disadvantage: Limits teachers’ ability to support refugee students.",
    "Offer basic training sessions for teachers. - Advantage: Builds foundational awareness. - Disadvantage: Might not be comprehensive enough.",
    "Implement ongoing comprehensive training. - Advantage: Equips teachers for diverse needs. - Disadvantage: Requires substantial investment."
  ],
  [
    "Maintain the national curriculum without changes. - Advantage: Preserves continuity. - Disadvantage: Ignores refugee experiences and diversity.",
    "Add supplementary refugee-related materials. - Advantage: Encourages empathy and awareness. - Disadvantage: Limited representation and impact.",
    "Adapt curriculum for diverse perspectives. - Advantage: Promotes understanding and inclusivity. - Disadvantage: Logistically challenging and resource-demanding."
  ],
  [
    "Provide limited or no psychosocial support. - Advantage: Low financial burden. - Disadvantage: Harms mental health and integration.",
    "Establish basic support services like counseling. - Advantage: Provides some needed support. - Disadvantage: Requires trained personnel and resources.",
    "Develop comprehensive psychosocial programs. - Advantage: Aids successful integration. - Disadvantage: Resource and investment heavy."
  ],
  [
    "Allocate minimal funds for refugee education. - Advantage: Eases government budget. - Disadvantage: Reduces quality and access.",
    "Increase financial support but still limited. - Advantage: Improves support. - Disadvantage: May not cover all needs.",
    "Allocate significant financial resources. - Advantage: Enables high-quality education and support. - Disadvantage: Requires reallocating budget."
  ],
  [
    "Only recognize qualifications from Republic of Bean. - Advantage: Standardized accreditation. - Disadvantage: Disregards prior education and skills.",
    "Use universal standards to evaluate prior education. - Advantage: Respects migrant education. - Disadvantage: Requires resources and time.",
    "Combine recognition with additional training. - Advantage: Tailored and inclusive. - Disadvantage: Complex implementation."
  ]
];

function getRandomChoices() {
  let total = 0;
  let choices = [];
  while (true) {
    total = 0;
    choices = [];
    for (let i = 0; i < 7; i++) {
      const option = Math.floor(Math.random() * 3);
      choices.push(option);
      total += options[option].cost;
    }
    if (total <= 14) break;
  }
  return choices;
}

function findBestConsensusFromAll(player, bots) {
  const allChoices = [player, ...bots];
  let best = null;
  let bestScore = -Infinity;

  function backtrack(index, total, path, score) {
    if (index === 7) {
      if (total === 14 && score > bestScore) {
        bestScore = score;
        best = [...path];
      }
      return;
    }

    for (let opt = 0; opt < 3; opt++) {
      const cost = options[opt].cost;
      const support = allChoices.map(c => c[index]).filter(c => c === opt).length;
      const weight = (opt === 2 ? 3 : opt === 1 ? 2 : 1);
      const newScore = score + support * weight;
      path.push(opt);
      backtrack(index + 1, total + cost, path, newScore);
      path.pop();
    }
  }

  backtrack(0, 0, [], 0);
  return best;
}

export default function App() {
  const [page, setPage] = useState(0);
  const [playerChoices, setPlayerChoices] = useState(Array(7).fill(null));
  const [botChoices, setBotChoices] = useState([]);
  const [consensus, setConsensus] = useState(Array(7).fill(null));

  React.useEffect(() => {
    if (page === 5 && consensus.every(c => c === null)) {
      const best = findBestConsensusFromAll(playerChoices, botChoices);
      if (best) setConsensus(best);
    }
  }, [page]);

  const totalPoints = playerChoices.reduce((sum, choice) => choice !== null ? sum + options[choice].cost : sum, 0);
  const isComplete = playerChoices.every(choice => choice !== null) && totalPoints <= 14;
  const handleOptionSelect = (policyIndex, optionIndex) => {
    const updatedChoices = [...playerChoices];
    updatedChoices[policyIndex] = optionIndex;
    setPlayerChoices(updatedChoices);
  };
  const startBots = () => {
    const bots = [getRandomChoices(), getRandomChoices(), getRandomChoices()];
    setBotChoices(bots);
    setPage(4);
  };

  return (
    <div className="min-h-screen w-full p-6 font-sans dark:bg-gray-900 dark:text-white">
      {page === 0 && (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-6"> Welcome to the Refugee Policy Game </h1>
          <p className="text-lg mb-8">You are a policymaker in the Republic of Bean. Make decisions to balance integration, cost, and fairness.</p>
          <button onClick={() => setPage(1)} className="px-6 py-3 bg-blue-500 text-white rounded text-lg hover:bg-blue-600">
            Let’s Go!
          </button>
        </div>
      )}

      {page === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-4"> Policy Cards Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {descriptions.map((policyDescriptions, i) => (
              <div key={i} className={`p-4 rounded shadow-md ${i % 3 === 0 ? 'bg-blue-100 dark:bg-blue-800' : i % 3 === 1 ? 'bg-green-100 dark:bg-green-800' : 'bg-purple-100 dark:bg-purple-800'}`}>
                <h3 className="text-lg font-semibold mb-2">{policies[i]}</h3>
                <ul className="list-disc list-inside space-y-1">
                  {policyDescriptions.map((desc, j) => (
                    <li key={j}><strong>{options[j].label}:</strong> {desc}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={() => setPage(2)} className="px-4 py-2 bg-blue-500 text-white rounded">
              Next: See Rules
            </button>
          </div>
        </div>
      )}

      {page === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-4"> Game Rules</h2>
          <ul className="list-disc list-inside space-y-3 text-base">
            <li>You must choose one option per policy card.</li>
            <li>Each option has a cost: Option 1 = 1pt, Option 2 = 2pt, Option 3 = 3pt.</li>
            <li>Your total budget must not exceed 14 points.</li>
            <li>After your choices, 3 bots will also make their own choices.</li>
            <li>Finally, all players must agree on a consensus selection for each card with a combined total of exactly 14 points.</li>
          </ul>
          <div className="mt-6">
            <button onClick={() => setPage(3)} className="px-4 py-2 bg-green-500 text-white rounded">
              Start the Game
            </button>
          </div>
        </div>
      )}

      {page === 3 && (
        <div>
          <h1 className="text-3xl font-bold mb-4"> Your Turn to Choose</h1>
          <p className="mb-4">Select one option per card. Don’t exceed 14 points!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map((policy, index) => (
              <div key={index} className="border rounded-lg p-4 shadow-md">
                <h2 className="font-semibold mb-2">{policy}</h2>
                <div className="flex gap-2">
                  {options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(index, optIdx)}
                      title={descriptions[index][optIdx]}
                      className={`px-3 py-1 rounded border ${playerChoices[index] === optIdx ? 'bg-blue-500 text-white' : 'bg-gray-800'}`}
                    >
                      {opt.label} ({opt.cost} pt)
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p>Total Points: {totalPoints} / 14</p>
            {totalPoints > 14 && <p className="text-red-500 mt-2">⚠️ Your total exceeds 14 points. Adjust your selections.</p>}
            {playerChoices.some(choice => choice === null) && <p className="text-yellow-600 mt-1">⚠️ Please make a selection for each card.</p>}
            <button
              onClick={() => {
                if (!isComplete) {
                  alert("⚠️ Please complete all selections and ensure your total is 14 points or less.");
                  return;
                }
                startBots();
              }}
              className={`mt-4 px-4 py-2 rounded text-white ${isComplete ? 'bg-green-500' : 'bg-gray-700'}`}
            >
              Confirm & See Bots
            </button>
          </div>
        </div>
      )}

      {page === 4 && (
        <div>
          <h2 className="text-2xl font-bold mb-4"> Bot Choices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["You", "Bot 1", "Bot 2", "Bot 3"].map((name, idx) => (
              <div key={idx} className="border p-4 rounded shadow">
                <h3 className="font-semibold mb-2">{name}</h3>
                <ul>
                  {(idx === 0 ? playerChoices : botChoices[idx - 1]).map((optIdx, pIndex) => (
                    <li key={pIndex}>
                      <strong>{policies[pIndex]}:</strong> {options[optIdx].label} ({options[optIdx].cost} pt)
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button onClick={() => setPage(5)} className="px-4 py-2 bg-blue-500 text-white rounded">
              Negotiate & Finalize
            </button>
          </div>
        </div>
      )}

      {page === 5 && (
        <div>
          <h2 className="text-2xl font-bold mb-4"> Final Consensus</h2>
          <div className="grid gap-4">
            {policies.map((policy, index) => (
              <div key={index} className="border p-4 rounded shadow">
                <h3 className="font-semibold mb-2">{policy}</h3>
                <div className="flex gap-2">
                  {options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => {
                        const updated = [...consensus];
                        updated[index] = optIdx;
                        setConsensus(updated);
                      }}
                      title={descriptions[index][optIdx]}
                      className={`px-3 py-1 rounded border ${consensus[index] === optIdx ? 'bg-green-500 text-white' : 'bg-gray-800'}`}
                    >
                      {opt.label} ({opt.cost} pt)
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <p>Total Consensus Budget: {consensus.reduce((sum, val) => val !== null ? sum + options[val].cost : sum, 0)} / 14</p>
            <button onClick={() => setPage(6)} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">
              Why This Plan?
            </button>
          </div>
        </div>
      )}

      {page === 6 && (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold mb-6"> Why This Plan?</h2>
          <p className="text-lg mb-6">We analyzed all players' choices and selected the best budget plan:</p>
          <div className="text-left max-w-xl mx-auto text-base space-y-4">
            <ul className="list-disc list-inside">
              <li><strong>High agreement:</strong> We prioritized options supported by multiple players.</li>
              <li><strong>Balanced cost:</strong> The plan uses exactly 14 points — your allowed budget.</li>
              <li><strong>Inclusive decisions:</strong> Preference was given to Option 2 and Option 3 when supported.</li>
            </ul>
            <p>This strategy ensures fairness, feasibility, and alignment with the group’s intentions.</p>
          </div>
          <button
            onClick={() => {
              setPage(0);
              setPlayerChoices(Array(7).fill(null));
              setConsensus(Array(7).fill(null));
              setBotChoices([]);
            }}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded text-lg"
          >
            🔁 Restart Game
          </button>
        </div>
      )}
    </div>
  );
}