'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './VoiceAssistant.module.css';

const VoiceAssistant = () => {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');

  const SpeechRecognition = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Speak back using SpeechSynthesis
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (!recognition) {
      const message = 'Speech recognition is not supported in this browser. Please use Chrome or Edge.';
      setFeedback(message);
      speak(message);
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);

      if (event.results[current].isFinal) {
        processCommand(transcript.toLowerCase());
      }
    };

    recognition.onerror = (event) => {
      const message = `Error occurred in recognition: ${event.error}`;
      setFeedback(message);
      speak(message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      recognition?.stop();
    };
  }, [recognition]);

  const processCommand = (command) => {
    const speakAndSetFeedback = (text) => {
      setFeedback(text);
      speak(text);
    };

    speakAndSetFeedback(`Processing: "${command}"`);

    const routeMap = {
      'home': '/',
      'about': '/about',
      'dashboard': '/dashboard',
      'profile': '/profile',
      'scoreboard': '/scoreboard',
      'playlist': '/playlist',
      'privacy policy': '/privacy-policy',
      'settings': '/settings',
      'personal library': '/personal-library',
      'team activity': '/team-activity',
    };

    if (command.includes('open') || command.includes('go to') || command.includes('navigate to')) {
      for (const [key, route] of Object.entries(routeMap)) {
        if (command.includes(key)) {
          speakAndSetFeedback(`Navigating to ${key} page`);
          router.push(route);
          return;
        }
      }
      speakAndSetFeedback('Route not found. Try saying "open about," "open dashboard," or "open profile."');
      return;
    }

    if (command.includes('click')) {
      const match = command.match(/click\s+(.+)/);
      if (match) {
        const targetText = match[1].trim();
        const elements = document.querySelectorAll('button, a');
        let found = false;

        elements.forEach((element) => {
          const text = element.textContent?.toLowerCase().trim();
          const ariaLabel = element.getAttribute('aria-label')?.toLowerCase().trim();
          if (text === targetText || ariaLabel === targetText) {
            element.click();
            speakAndSetFeedback(`Clicked "${targetText}"`);
            found = true;
          }
        });

        if (!found) {
          speakAndSetFeedback(`No button or link found with text "${targetText}". Try saying the category name, e.g., "click leadership".`);
        }
        return;
      }
    }

    if (command.includes('fill') || command.includes('enter')) {
      const fillMatch = command.match(/(?:fill|enter)\s+(\w+)\s+(?:with|as)\s+(.+)/);
      if (fillMatch) {
        const [_, fieldName, value] = fillMatch;
        const input = document.querySelector(
          `input[name="${fieldName}"], input[id="${fieldName}"], input[placeholder*="${fieldName}"]`
        );

        if (input) {
          input.value = value;
          input.dispatchEvent(new Event('input', { bubbles: true }));
          speakAndSetFeedback(`Filled "${fieldName}" with "${value}"`);
        } else {
          speakAndSetFeedback(`No input field found for "${fieldName}".`);
        }
        return;
      }
    }

    speakAndSetFeedback('Command not recognized. Try "open dashboard", "click leadership", or "fill username with john".');
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      const message = 'Listening...';
      setFeedback(message);
      speak(message);
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className={styles.assistant}>
      <button
        onClick={toggleListening}
        className={`${styles.button} ${isListening ? styles.listening : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? 'Stop' : 'Speak'}
      </button>
      <p className={styles.feedback}>{feedback}</p>
      {transcript && <p className={styles.transcript}>Heard: "{transcript}"</p>}
    </div>
  );
};

export default VoiceAssistant;
