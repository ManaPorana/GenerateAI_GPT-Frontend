import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formValues, setFormValues] = useState({
    occupation: '',
    causeOfDeath: '',
    placeOfDeath: '',
    deceasedAge: ''
  });
  const [result, setResult] = useState('');
  const [typingEffect, setTypingEffect] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (result) {
      let currentText = '';
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < result.length) {
          currentText += result[currentIndex];
          setTypingEffect(currentText);
          currentIndex++;
        } else {
          clearInterval(interval);
          setTypingComplete(true);
        }
      }, 100);
    } else {
      setTypingEffect('');
      setTypingComplete(false);
    }
  }, [result]);

  const handleSaveToFile = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "ghost_story.txt";
    document.body.appendChild(element);
    element.click();
  };

  const handleSpeakResult = () => {
    const utterance = new SpeechSynthesisUtterance(typingEffect);
    utterance.lang = 'th-TH';
    speechSynthesis.speak(utterance);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // ส่งข้อมูลไปยัง Backend API
      const response = await fetch('http://localhost:5000/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formValues)
      });
      const data = await response.json();
      setResult(data.result);  // แสดงผลลัพธ์ที่ได้จาก backend
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>GenerateAI for TC/TS </h1>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label htmlFor="occupation">Select Topic:</label>
          <select
            id="occupation"
            name="occupation"
            value={formValues.occupation}
            onChange={handleInputChange}
          >
            <option value="Test case">Test case</option>
            <option value="Test script">Test script</option>
            <option value="นักเรียน">นักเรียน</option>
            <option value="นักการเมือง">นักการเมือง</option>
            <option value="วิศวกร">วิศวกร</option>
            <option value="โปรแกรมเมอร์">เดฟ</option>
            <option value="โปรเกม่อนเทรนเนอร์">โปรเกม่อนเทรนเนอร์</option>
          </select>
          <br />

          <label htmlFor="causeOfDeath">Test ID:</label>
          <select
            id="causeOfDeath"
            name="causeOfDeath"
            value={formValues.causeOfDeath}
            onChange={handleInputChange}
          >
            <option value="001">001</option>
            <option value="002">002</option>
            <option value="โดนยิง">โดนยิง</option>
            <option value="เขียนโค้ด">เขียนโค้ด</option>
            <option value="แก้บัค">แก้บัค</option>
            <option value="อัดยูทูป">อัดยูทูป</option>
            <option value="หมากัด">หมากัด</option>
            <option value="รถชน">รถชน</option>
          </select>
          <br />

          <label htmlFor="placeOfDeath">Description</label>
          <input
            type="text"
            id="placeOfDeath"
            name="placeOfDeath"
            value={formValues.placeOfDeath}
            onChange={handleInputChange}
          />
          <br />

          <label htmlFor="deceasedAge">เป็นผีตั้งแต่อายุเท่าไหร่:</label>
          <input
            type="number"
            id="deceasedAge"
            name="deceasedAge"
            value={formValues.deceasedAge}
            onChange={handleInputChange}
          />
          <br />

          <input type="submit" value="Summit" />
        </form>
      </div>

      {typingEffect && <div id="result">{typingEffect}</div>}
      {typingComplete && result && (
        <div className="button-save-speak">
          <button onClick={handleSaveToFile}>โหลดเนื้อเรื่อง</button>
          <button onClick={handleSpeakResult}>เล่าให้ฟัง</button>
        </div>
      )}
    </div>
  );
}

export default App;
