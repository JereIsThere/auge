"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "@/components/lessons/lesson.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const GERMAN_FREQ: Record<string, number> = {
  A: 6.51, B: 1.89, C: 3.06, D: 5.08, E: 17.40, F: 1.66, G: 3.01, H: 4.76,
  I: 7.55, J: 0.27, K: 1.21, L: 3.44, M: 2.53, N: 9.78, O: 2.51, P: 0.79,
  Q: 0.02, R: 7.00, S: 7.27, T: 6.15, U: 4.35, V: 0.67, W: 1.89, X: 0.03,
  Y: 0.04, Z: 1.13,
};

function getFrequency(text: string): Record<string, number> {
  const counts: Record<string, number> = {};
  const letters = text.toUpperCase().replace(/[^A-Z]/g, "");
  const total = letters.length || 1;
  for (const char of letters) counts[char] = (counts[char] || 0) + 1;
  const freq: Record<string, number> = {};
  for (const l of ALPHABET) freq[l] = ((counts[l] || 0) / total) * 100;
  return freq;
}

export default function FrequencyAnalysis() {
  const [text, setText] = useState(
    "Die Häufigkeitsanalyse ist eine klassische Methode zur Entschlüsselung von Substitutionschiffren."
  );

  const freq = getFrequency(text);

  const chartData = {
    labels: ALPHABET,
    datasets: [
      {
        label: "Dein Text (%)",
        data: ALPHABET.map((l) => parseFloat(freq[l].toFixed(2))),
        backgroundColor: "rgba(59, 130, 246, 0.7)",
      },
      {
        label: "Deutsch typisch (%)",
        data: ALPHABET.map((l) => GERMAN_FREQ[l]),
        backgroundColor: "rgba(16, 185, 129, 0.4)",
        borderColor: "rgba(16, 185, 129, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Häufigkeit (%)" } },
    },
  };

  return (
    <div className="lesson-card">
      <h2>Häufigkeitsanalyse</h2>
      <p className="lesson-description">
        In natürlichen Sprachen kommen bestimmte Buchstaben viel häufiger vor als
        andere. Im Deutschen ist E der häufigste Buchstabe (~17%). Diese
        Eigenschaft kann genutzt werden, um einfache Substitutionschiffren zu
        knacken.
      </p>

      <div className="input-group">
        <label>Text analysieren</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Text eingeben..."
        />
      </div>

      <Bar data={chartData} options={options} />

      <div className="top-letters">
        <h3>Häufigste Buchstaben</h3>
        <div className="letter-badges">
          {[...ALPHABET]
            .sort((a, b) => freq[b] - freq[a])
            .slice(0, 5)
            .map((l) => (
              <span key={l} className="freq-badge">
                {l}: {freq[l].toFixed(1)}%
              </span>
            ))}
        </div>
      </div>

      <div className="info-box">
        <strong>Tipp:</strong> Verschlüssele einen Text mit dem Caesar-Cipher und
        füge ihn hier ein. Der häufigste Buchstabe entspricht wahrscheinlich dem
        E im Original!
      </div>
    </div>
  );
}
