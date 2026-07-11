import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { BsArrowRight } from 'react-icons/bs'

function Step2Interview({ interviewData, onFinish }) {
  if (!interviewData?.questions?.length) {
    return null;
  }

  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const isMicOnRef = useRef(isMicOn);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const isAIPlayingRef = useRef(isAIPlaying);

  // keep refs in sync with state so handlers have fresh values
  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);
  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [isNextClicked, setIsNextClicked] = useState(false);


  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.error("Error canceling speech:", e);
      }

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      const cleanupAndResolve = () => {
        try {
          setSubtitle("");
        } catch (e) {
          console.error("Error clearing subtitle:", e);
        }
        resolve();
      };

      utterance.onstart = () => {
        try {
          setIsAIPlaying(true);
      isAIPlayingRef.current = true;
          videoRef.current?.play();
        } catch (e) {
          console.error("Error in utterance.onstart:", e);
        }
      };

      utterance.onend = () => {
        try {
          videoRef.current?.pause();
          videoRef.current.currentTime = 0;
          setIsAIPlaying(false);

          if (isMicOn) {
            startMic();
          }
          setTimeout(() => {
            cleanupAndResolve();
          }, 300);
        } catch (e) {
          console.error("Error in utterance.onend:", e);
          cleanupAndResolve();
        }
      };

      utterance.onerror = (error) => {
        console.error("Speech synthesis error:", error);
        cleanupAndResolve();
      };

      setSubtitle(text);

      try {
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error("Error speaking text:", e);
        cleanupAndResolve();
      }
    });
  };


  useEffect(() => {
    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        // If last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()


  }, [selectedVoice, isIntroPhase, currentIndex])



  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1

      })
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex])

  useEffect(() => {
  if (!isIntroPhase && currentQuestion) {
    setTimeLeft(currentQuestion.timeLimit || 60);
  }
}, [currentIndex]);


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onend = () => {
      // some browsers auto-stop recognition after a pause; restart if mic should be on
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
      // automatically restart on recoverable errors
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;

  }, []);


  const startMic = () => {
    if (recognitionRef.current && !isAIPlayingRef.current) {
      try {
        recognitionRef.current.start();
      } catch { }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (isMicOnRef.current) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(prev => {
      const newVal = !prev;
      isMicOnRef.current = newVal;
      return newVal;
    });
  };

  const submitAnswer = async () => {
    if (isSubmitting) return;
    
    try {
      stopMic();
      setIsSubmitting(true);

      const normalizedAnswer = answer.trim();

      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer: normalizedAnswer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true }
      );

      // Ensure we have feedback to display
      const feedbackText = result.data.feedback || "Great! Let's move on to the next question.";
      setFeedback(feedbackText);
      
      // Speak the feedback
      try {
        await speakText(feedbackText);
      } catch (speechError) {
        console.error("Speech error in submitAnswer:", speechError);
        // Don't fail if speech fails, just continue
      }
    } catch (error) {
      console.error("submitAnswer error", error);
      const errorMsg = "Error submitting answer. Please try again.";
      setFeedback(errorMsg);
      
      try {
        await speakText(errorMsg);
      } catch (speechError) {
        console.error("Speech error in submitAnswer error handler:", speechError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // allow user to explicitly skip a question; records a zero score
  const skipQuestion = async () => {
    if (isSubmitting) return;
    
    try {
      stopMic();
      setIsSubmitting(true);

      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer: "",
          timeTaken: 0,
          skipped: true,
        },
        { withCredentials: true }
      );

      const msg = result.data.feedback || "Question skipped. Moving to the next one.";
      setFeedback(msg);
      
      try {
        await speakText(msg);
      } catch (speechError) {
        console.error("Speech error in skipQuestion:", speechError);
        // Don't fail if speech fails
      }
    } catch (err) {
      console.error("skipQuestion error", err);
      const errorMsg = "Error skipping question. Please try again.";
      setFeedback(errorMsg);
      
      try {
        await speakText(errorMsg);
      } catch (speechError) {
        console.error("Speech error in skipQuestion error handler:", speechError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    // Prevent multiple clicks
    if (isNextClicked || isSubmitting) return;
    setIsNextClicked(true);

    try {
      if (currentIndex + 1 >= questions.length) {
        // Clear states before finishing
        setAnswer("");
        setFeedback("");
        await finishInterview();
        return;
      }

      // Play transition message
      await speakText("Alright, let's move to the next question.");

      // Clear states after speaking
      setAnswer("");
      setFeedback("");
      
      // Move to next question
      setCurrentIndex((idx) => idx + 1);
      
      // Reset the click guard for next question
      setTimeout(() => {
        setIsNextClicked(false);
        if (isMicOn) startMic();
      }, 500);
    } catch (error) {
      console.error("handleNext error", error);
      setFeedback("Error moving to next question. Please try again.");
      setIsNextClicked(false);
    }
  }

  const finishInterview = async () => {
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


   useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;

    if (timeLeft === 0 && !feedback) {
      // auto submit when timer expires (only if no answer submitted yet)
      submitAnswer();
    }
  }, [timeLeft, isIntroPhase, currentQuestion, isSubmitting, feedback]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);







  return (
    <div className='min-h-screen bg-(--bg-primary) text-(--text-primary) flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] card flex flex-col lg:flex-row overflow-hidden'>

        {/* video section */}
        <div className='w-full lg:w-[35%] bg-(--bg-secondary) flex flex-col items-center p-6 space-y-6 border-r border-(--border)'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* subtitle */}
          {subtitle && (
            <div className='w-full max-w-md card rounded-xl p-4 shadow-sm'>
              <p className='text-(--text-secondary) text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}


          {/* timer Area */}
          <div className='w-full max-w-md card rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-(--text-secondary)'>
                Interview Status
              </span>
              {isAIPlaying && <span className='text-sm font-semibold text-(--accent-green)'>
                {isAIPlaying ? "AI Speaking" : ""}
              </span>}
            </div>

            <div className="h-px bg-(--border)"></div>

            <div className='flex justify-center'>

              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>

            <div className="h-px bg-(--border)"></div>

            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-bold text-(--accent-green)'>{currentIndex + 1}</span>
                <span className='text-xs text-(--text-secondary)'>Current Questions</span>
              </div>

              <div>
                <span className='text-2xl font-bold text-(--accent-green)'>{questions.length}</span>
                <span className='text-xs text-(--text-secondary)'>Total Questions</span>
              </div>
            </div>


          </div>
        </div>

        {/* Text section */}

        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-(--accent-green) mb-6'>
            AI Smart Interview
          </h2>


          {!isIntroPhase && (<div className='relative mb-6 card p-4 sm:p-6 rounded-2xl shadow-sm'>
            <p className='text-xs sm:text-sm text-(--text-secondary) mb-2'>
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className='text-base sm:text-lg font-semibold text-(--text-primary) leading-relaxed '>{currentQuestion?.question}</div>
          </div>)
          }
          <textarea
            placeholder="Type your answer here..."
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            className="flex-1 bg-(--bg-card) p-4 sm:p-6 rounded-2xl resize-none outline-none border border-(--border) focus:ring-2 focus:ring-(--accent-green) transition text-(--text-primary)" />


         {!isIntroPhase && !feedback ? ( <div className='flex items-center gap-3 mt-6'>
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.9 }}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-(--accent-green) text-black shadow-lg'>
              {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20}/>}
            </motion.button>

            <motion.button
            onClick={submitAnswer}
            disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
              className='flex-1 bg-(--accent-green) text-black py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-(--border)'>
              {isSubmitting?"Submitting...":"Submit Answer"}
            </motion.button>

            <motion.button
              onClick={skipQuestion}
              disabled={isSubmitting}
              whileTap={{ scale: 0.95 }}
              className='px-4 sm:px-6 bg-(--bg-secondary) text-(--text-primary) py-3 sm:py-4 rounded-2xl border border-(--border) hover:opacity-90 transition font-semibold disabled:opacity-60'>
              Skip
            </motion.button>

          </div>) : (!isIntroPhase ? (
            <motion.div 
             initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            className='mt-6 card p-5 rounded-2xl shadow-sm'>
              <p className='text-(--text-primary) font-medium mb-4'>{feedback}</p>

              <button
              onClick={handleNext}
              disabled={isNextClicked || isSubmitting}
               className='w-full bg-(--accent-green) text-black py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed'>
                {isNextClicked ? "Loading..." : "Next Question"} {!isNextClicked && <BsArrowRight size={18}/>}
              </button>

            </motion.div>
          ) : null)}
        </div>
      </div>

    </div>
  )
}

export default Step2Interview
