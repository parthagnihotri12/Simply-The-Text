import { useState, useEffect } from "react";
import myself from "./assets/learning.png";

function Text() {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [textColor, setTextColor] = useState("green");
  const [loading, setLoading] = useState(false);

  const changing = (e) => {
    setText(e.target.value);
  };

  useEffect(() => {
    if (text.length < 200 || text.length > 2500) {
      setTextColor("red");
    } else {
      setTextColor("green");
    }
  }, [text]);

  const clear = () => {
    setOutput("");
    setText("");
  };

  const summarizing = async () => {
    setLoading(true);
    try {
      if (text.length >= 200 && text.length <= 2500) {
        const response = await fetch(
          "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ inputs: text }),
          }
        );

        const result = await response.json();

        if (result.error) {
          setOutput("Error: " + result.error);
        } else {
          setOutput(result[0].summary_text);
        }

        setLoading(false);
      } else if (text.length < 200) {
        alert("Please enter at least 200 characters");
        setLoading(false);
      } else {
        alert("Maximum length exceeded");
        setLoading(false);
      }
    } catch (e) {
      console.log("Error:", e);
      setOutput("Something went wrong while summarizing.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-white to-orange-100 text-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-purple-700 shadow-lg">
        <h1 className="text-3xl sm:text-4xl text-white font-bold text-center py-6 tracking-wide">
          Simplify the Complex: A Summarizer's Hub
        </h1>
      </nav>

      {/* Description */}
      <div className="text-center mt-8 px-4">
        <p className="text-xl md:text-2xl">
          Paste your lengthy text below, and AI will simplify it for you.
        </p>
        <p className="text-lg mt-2 text-purple-800 font-semibold">
          Supports 200 to 2500 characters
        </p>
      </div>

      {/* Input + Output Section */}
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 mt-10 px-6 md:px-12">
        {/* Input Card */}
        <div className="w-full md:w-1/2 bg-white bg-opacity-80 backdrop-blur-sm border border-purple-300 rounded-xl shadow-md p-6 space-y-4">
          <textarea
            className="w-full h-64 p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            placeholder="Paste your text here..."
            onChange={changing}
            value={text}
          />
          <div className="flex justify-end text-sm font-semibold">
            <span className={`text-${textColor}-600`}>
              {text.length}/2500
            </span>
          </div>
        </div>

        {/* Output Card */}
        <div className="w-full md:w-1/2 bg-white bg-opacity-80 backdrop-blur-sm border border-orange-300 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2 text-orange-800">
            Summary:
          </h2>
          <p className="text-gray-700 text-md whitespace-pre-line">
            {output}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center mt-8 space-x-4">
        {!loading ? (
          <>
            <button
              onClick={summarizing}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow"
            >
              Summarize
            </button>
            <button
              onClick={clear}
              className="bg-purple-500 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow"
            >
              Clear
            </button>
          </>
        ) : (
          <p className="text-xl font-semibold text-orange-600 animate-pulse">
            Generating Summary...
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 bg-purple-50">
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 px-6">
          <div className="text-center">
            <p className="text-lg font-semibold">Let's get connected</p>
            <div className="flex justify-center mt-3 gap-4">
              <img
                src="https://cdn-icons-png.flaticon.com/128/15015/15015975.png"
                className="h-10 cursor-pointer hover:scale-110 transition-transform"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/parth-agnihotri-7462b8361/"
                  )
                }
              />
              <img
                src="https://cdn-icons-png.flaticon.com/128/3291/3291695.png"
                className="h-10 cursor-pointer hover:scale-110 transition-transform"
                onClick={() =>
                  window.open("https://github.com/parthagnihotri12")
                }
              />
            </div>
          </div>
          <img src={myself} className="h-48" />
        </div>
      </footer>
    </div>
  );
}

export default Text;
