# 🍅 AgroVision AI — Student Edition (HTML, CSS, JS & Python)

Built for **STEAM Exhibition 2026: Safe & Clean Agriculture**.

This folder contains a standalone, human-crafted web application using pure **HTML5**, **CSS3**, **Vanilla JavaScript**, and **Python 3**. It does not require Node.js, npm, or complex build bundlers, making it simple to run, present, and modify in any school computer lab.

---

## 📁 Project Structure

```text
student_project/
├── index.html        # Clean HTML5 page with English & Urdu bilingual layout
├── style.css         # Custom sage-green and cream styling with smooth animations
├── app.js            # JavaScript engine with 3D Three.js plant and disease scanner
├── server.py         # Lightweight Python web server for local presentation
└── README.md         # This easy-to-read guide
```

---

## 🚀 How to Run Locally

### Option 1: Using Python (Recommended for Presentation)
Open your terminal or command prompt inside this folder and run:

```bash
python3 server.py
# or on Windows:
python server.py
```

Then open your browser at:
👉 **`http://localhost:8000`**

### Option 2: Direct Double-Click
You can also directly double-click `index.html` to open it in Chrome, Edge, Firefox, or Safari.

---

## 🌟 Key Features Included

1. **Bilingual English & Urdu Toggle (`EN | اردو`)**:
   - Animated iOS-style toggle in the navigation bar.
   - Automatically switches layout to Right-to-Left (`dir="rtl"`) with authentic typography.

2. **Interactive 3D Tomato Plant (Three.js)**:
   - 360-degree drag rotation (mouse or touch).
   - **Click the ripe tomato fruit** to smoothly zoom in for a close-up inspection.
   - Switch between **Healthy Foliage** and **Simulate Blight** to show disease spread.

3. **AI Diagnostic Studio**:
   - Test field leaves: Early Blight, Late Blight, Septoria Leaf Spot, and Healthy foliage.
   - Upload your own leaf photos via the file picker.
   - Instant diagnostic readout with confidence score, visual symptoms, and organic treatment plans.
   - Subtle "Success" notification toast when analysis completes.

4. **Tribute to Agriculture in Pakistan**:
   - Celebrates farming as the economic backbone of Pakistan.
   - Focuses on practical solutions for smallholder farmers.

---

## 🌿 Notes for School Presentation
- All code is formatted cleanly with helpful Roman Urdu and English comments.
- You can explain how Computer Vision analyzes leaf pixels and chlorophyll distribution to detect early fungal rings before pathogens ruin the harvest.
