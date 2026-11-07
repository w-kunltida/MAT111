// State Management
let activeTab = 'home';
let selectedImage = null;
let isAnalyzing = false;
let analysisResult = null;

// Mock Wildlife Data & Trash Category Database
const trashDatabase = {
  bottle: {
    name: 'ขวดพลาสติก / กระป๋อง',
    dangerLevel: 'สูง',
    impactedGroups: ['สัตว์ครึ่งบกครึ่งน้ำ (น้องนาก)', 'สัตว์ตัวเล็ก'],
    impactDetail: 'สัตว์ตัวเล็กมักซุกตัวเข้าไปหาเศษอาหารข้างใน แล้วติดขัดออกมาไม่ได้ หรือโดนขอบคมบาด',
    preventionTips: [
      'ล้างทำความสะอาดเศษอาหารข้างใน',
      'บีบขวดให้แบนเพื่อลดปริมาตร',
      'ปิดฝาขวดให้แน่นก่อนนำไปรีไซเคิล'
    ]
  },
  bag: {
    name: 'ถุงพลาสติก / ซองขนม',
    dangerLevel: 'วิกฤต',
    impactedGroups: ['สัตว์น้ำ / ปลา', 'นกทะเล'],
    impactDetail: 'ปลาและนกทะเลเข้าใจผิดคิดว่าเป็นอาหาร (แมงกะพรุน) เมื่อกินเข้าไปจะอุดตันในกระเพาะจนอาหารไม่ย่อย',
    preventionTips: [
      'ม้วนถุงพลาสติกเป็นปมแน่นๆ ก่อนทิ้ง',
      'ทิ้งในถุงขยะแยกเฉพาะเพื่อไม่ให้ปลิวลงน้ำ'
    ]
  },
  straw: {
    name: 'หลอดพลาสติก / ห่วงรัดฝา',
    dangerLevel: 'สูงมาก',
    impactedGroups: ['นกทะเล', 'สัตว์น้ำ / ปลา'],
    impactDetail: 'ห่วงพลาสติกอาจพันรัดปากหรือลำตัวของสัตว์ และปลายหลอดที่คมอาจทิ่มแทงอวัยวะภายใน',
    preventionTips: [
      'ใช้กรรไกรตัดห่วงพลาสติกให้ขาดออกจากกันก่อนทิ้ง',
      'ตัดหลอดพลาสติกเป็นชิ้นเล็กๆ'
    ]
  }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  renderContent();
  updateNavUI();
});

// Switch Active Tab
function switchTab(tabId) {
  activeTab = tabId;
  updateNavUI();
  renderContent();
}

// อัปเดตสีและสไตล์ของปุ่ม Bottom Nav
function updateNavUI() {
  const tabs = ['home', 'scan', 'wildlife', 'about'];
  
  tabs.forEach(tab => {
    const btn = document.getElementById(`nav-${tab}`);
    if (btn) {
      if (tab === activeTab) {
        // เมนูที่ถูกเลือก (Active) -> เปลี่ยนเป็นสีเขียว + ไฮไลต์พื้นหลังไอคอน
        btn.classList.add('text-[#355C41]', 'font-bold');
        btn.classList.remove('text-[#5C402E]/60');
        
        const iconWrapper = btn.querySelector('.icon-wrapper');
        if (iconWrapper) {
          iconWrapper.classList.add('bg-[#CDE8D1]');
          iconWrapper.classList.remove('bg-transparent');
        }
      } else {
        // เมนูที่ไม่ได้เลือก -> เปลี่ยนเป็นสีน้ำตาลปกติ
        btn.classList.add('text-[#5C402E]/60');
        btn.classList.remove('text-[#355C41]', 'font-bold');
        
        const iconWrapper = btn.querySelector('.icon-wrapper');
        if (iconWrapper) {
          iconWrapper.classList.add('bg-transparent');
          iconWrapper.classList.remove('bg-[#CDE8D1]');
        }
      }
    }
  });

  // อัปเดตไอคอน Lucide
  if (window.lucide) {
    lucide.createIcons();
  }
}

// Render Content dynamically based on activeTab
function renderContent() {
  const main = document.getElementById('main-content');
  
  if (activeTab === 'home') {
    main.innerHTML = getHomeHTML();
  } else if (activeTab === 'scan') {
    main.innerHTML = getScanHTML();
  } else if (activeTab === 'wildlife') {
    main.innerHTML = getWildlifeHTML();
  } else if (activeTab === 'about') {
    main.innerHTML = getAboutHTML();
  }

  lucide.createIcons();
}

// 1. Home Page HTML
function getHomeHTML() {
  return `
    <div class="space-y-4">
      <div class="bg-gradient-to-b from-[#CDE8D1]/60 to-[#FFF9ED] rounded-3xl p-5 border border-[#A8C8A0]/30 text-center relative overflow-hidden">
        <div class="w-24 h-24 mx-auto mb-2 text-6xl animate-bounce">🦦</div>
        <h2 class="font-['Mali'] font-bold text-xl text-[#355C41] mb-1">สวัสดีครับ! ผมนากโอลลี่</h2>
        <p class="text-xs text-[#5C402E]/80 mb-4 leading-relaxed">
          มาร่วมเรียนรู้วิธีจัดการขยะพลาสติก เพื่อไม่ให้ทำร้ายเพื่อนๆ สัตว์ป่ากันนะครับ!
        </p>
        <button onclick="switchTab('scan')" class="w-full bg-[#355C41] hover:bg-[#355C41]/90 text-[#FFF9ED] font-semibold py-3 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-sm">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          เริ่มสแกนขยะกันเลย
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-[#DCEEF7]/50 p-3.5 rounded-2xl border border-[#DCEEF7] flex flex-col justify-between">
          <div class="text-2xl mb-1">🌊</div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">ขยะทะเล</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-1">ขยะพลาสติกกว่า 80% ปลิวจากบกลงสู่สายน้ำ</p>
        </div>
        <div class="bg-[#F8DDD0]/50 p-3.5 rounded-2xl border border-[#F8DDD0] flex flex-col justify-between">
          <div class="text-2xl mb-1">🐦</div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">กระทบสัตว์ป่า</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-1">สัตว์ป่าหลายชนิดได้รับอันตรายจากการกินขยะ</p>
        </div>
      </div>
    </div>
  `;
}

// 2. Scan Page HTML
function getScanHTML() {
  if (analysisResult) {
    return getResultHTML();
  }

  return `
    <div class="space-y-4">
      <div class="text-center">
        <h2 class="font-['Mali'] font-bold text-lg text-[#355C41]">สแกนขยะพลาสติก 📸</h2>
        <p class="text-xs text-[#5C402E]/70">ถ่ายรูปหรือเลือกรูปขยะ เพื่อดูผลกระทบต่อสัตว์ป่า</p>
      </div>

      <!-- Upload Box -->
      <div class="border-2 border-dashed border-[#A8C8A0] bg-[#CDE8D1]/20 rounded-3xl p-6 text-center hover:bg-[#CDE8D1]/30 transition-all cursor-pointer relative">
        <input type="file" accept="image/*" onchange="handleImageSelect(event)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer">
        ${selectedImage ? `
          <img src="${selectedImage}" class="max-h-48 mx-auto rounded-2xl shadow-sm mb-3 object-cover">
          <p class="text-xs text-[#355C41] font-semibold">เปลี่ยนรูปภาพ</p>
        ` : `
          <div class="w-12 h-12 rounded-full bg-[#CDE8D1] text-[#355C41] flex items-center justify-center mx-auto mb-2">
            <i data-lucide="camera" class="w-6 h-6"></i>
          </div>
          <p class="text-xs font-semibold text-[#355C41]">แตะเพื่ออัปโหลดรูปภาพ</p>
          <p class="text-[10px] text-[#5C402E]/60 mt-1">รองรับ JPG, PNG</p>
        `}
      </div>

      <!-- Sample Image Options -->
      <div>
        <p class="text-xs font-semibold text-[#5C402E]/80 mb-2">หรือเลือกรูปตัวอย่างทดสอบ:</p>
        <div class="grid grid-cols-3 gap-2">
          <button onclick="selectSample('bottle')" class="bg-white p-2 rounded-xl border border-[#A8C8A0]/30 text-center hover:border-[#355C41]">
            <div class="text-xl">🍾</div>
            <span class="text-[10px] text-[#5C402E]">ขวดพลาสติก</span>
          </button>
          <button onclick="selectSample('bag')" class="bg-white p-2 rounded-xl border border-[#A8C8A0]/30 text-center hover:border-[#355C41]">
            <div class="text-xl">🛍️</div>
            <span class="text-[10px] text-[#5C402E]">ถุงพลาสติก</span>
          </button>
          <button onclick="selectSample('straw')" class="bg-white p-2 rounded-xl border border-[#A8C8A0]/30 text-center hover:border-[#355C41]">
            <div class="text-xl">🥤</div>
            <span class="text-[10px] text-[#5C402E]">หลอดพลาสติก</span>
          </button>
        </div>
      </div>

      ${selectedImage ? `
        <button onclick="runAnalysis()" class="w-full bg-[#355C41] text-[#FFF9ED] font-semibold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 text-sm">
          <i data-lucide="sparkles" class="w-4 h-4"></i>
          วิเคราะห์ผลกระทบด้วย AI
        </button>
      ` : ''}
    </div>
  `;
}

// 3. Analysis Results HTML
function getResultHTML() {
  const res = analysisResult;
  return `
    <div class="space-y-4">
      <div class="bg-white rounded-3xl p-4 border border-[#A8C8A0]/30 shadow-sm space-y-3">
        <div class="flex items-center gap-2 border-b border-gray-100 pb-2">
          <span class="text-2xl">⚠️</span>
          <div>
            <h3 class="font-['Mali'] font-bold text-sm text-[#355C41]">${res.name}</h3>
            <p class="text-[10px] text-rose-500 font-semibold">ระดับอันตราย: ${res.dangerLevel}</p>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-[#5C402E] mb-1">กลุ่มสัตว์ที่ได้รับผลกระทบหลัก:</h4>
          <div class="flex flex-wrap gap-1">
            ${res.impactedGroups.map(g => `<span class="bg-[#F8DDD0] text-[#5C402E] text-[10px] px-2 py-0.5 rounded-full font-medium">${g}</span>`).join('')}
          </div>
          <p class="text-xs text-[#5C402E]/80 mt-2 leading-relaxed">${res.impactDetail}</p>
        </div>

        <div class="bg-[#CDE8D1]/30 p-3 rounded-2xl">
          <h4 class="text-xs font-bold text-[#355C41] mb-1">วิธีจัดการก่อนทิ้งเพื่อความปลอดภัย:</h4>
          <ul class="text-xs text-[#5C402E]/80 space-y-1">
            ${res.preventionTips.map(tip => `<li class="flex items-center gap-1.5"><span class="text-[#355C41]">✓</span> ${tip}</li>`).join('')}
          </ul>
        </div>
      </div>

      <button onclick="resetAnalysis()" class="w-full bg-[#FFF9ED] border border-[#355C41] text-[#355C41] font-semibold py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> สแกนขยะชิ้นอื่น
      </button>
    </div>
  `;
}

// 4. Wildlife Gallery HTML
function getWildlifeHTML() {
  return `
    <div class="space-y-3">
      <h2 class="font-['Mali'] font-bold text-base text-[#355C41]">กลุ่มสัตว์ที่เสี่ยงจากขยะป่า 🐾</h2>
      
      <div class="bg-white p-3 rounded-2xl border border-[#A8C8A0]/30 flex gap-3 items-center">
        <div class="text-3xl">🦦</div>
        <div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">สัตว์ครึ่งบกครึ่งน้ำ (น้องนาก)</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-0.5">เสี่ยงถูกสายรัด ห่วงพลาสติก หรือเศษตาข่ายพันลำตัวขณะว่ายน้ำ</p>
        </div>
      </div>

      <div class="bg-white p-3 rounded-2xl border border-[#A8C8A0]/30 flex gap-3 items-center">
        <div class="text-3xl">🐦</div>
        <div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">กลุ่มนกทะเล</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-0.5">เข้าใจผิดคิดว่าเศษพลาสติกเล็กๆ เป็นอาหาร นำไปป้อนลูกนก</p>
        </div>
      </div>

      <div class="bg-white p-3 rounded-2xl border border-[#A8C8A0]/30 flex gap-3 items-center">
        <div class="text-3xl">🐟</div>
        <div>
          <h3 class="font-['Mali'] font-bold text-xs text-[#355C41]">สัตว์น้ำและกลุ่มปลา</h3>
          <p class="text-[10px] text-[#5C402E]/70 mt-0.5">กินซอยถุงพลาสติกที่เข้าใจว่าเป็นแมงกะพรุนอุดตันลำไส้</p>
        </div>
      </div>
    </div>
  `;
}

// 5. About HTML
function getAboutHTML() {
  return `
    <div class="space-y-4 text-center">
      <div class="w-16 h-16 bg-[#CDE8D1] rounded-full flex items-center justify-center text-3xl mx-auto">🌱</div>
      <div>
        <h2 class="font-['Mali'] font-bold text-lg text-[#355C41]">PAWLET</h2>
        <p class="text-xs text-[#5C402E]/70 mt-1">See the Trash, Save the Wildlife</p>
      </div>

      <div class="bg-white p-4 rounded-3xl border border-[#A8C8A0]/30 text-left space-y-2 text-xs text-[#5C402E]/80">
        <p><strong>วัตถุประสงค์:</strong> โครงสร้างสื่อเรียนรู้วิธีการทิ้งขยะที่ปลอดภัย เพื่อลดผลกระทบอันตรายต่อกลุ่มสัตว์ป่า</p>
        <p><strong>พัฒนาโดย:</strong> MDT(Media Technology) - KMUTT</p>
      </div>
    </div>
  `;
}

// Event Handlers
function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedImage = event.target.result;
      renderContent();
    };
    reader.readAsDataURL(file);
  }
}

function selectSample(type) {
  if (type === 'bottle') {
    selectedImage = 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&q=80&w=400';
    analysisResult = trashDatabase.bottle;
  } else if (type === 'bag') {
    selectedImage = 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=400';
    analysisResult = trashDatabase.bag;
  } else if (type === 'straw') {
    selectedImage = 'https://images.unsplash.com/photo-1574063413132-355dbfd83e07?auto=format&fit=crop&q=80&w=400';
    analysisResult = trashDatabase.straw;
  }
  renderContent();
}

function runAnalysis() {
  // Simulate AI Analysis logic
  if (!analysisResult) {
    analysisResult = trashDatabase.bottle;
  }
  renderContent();
}

function resetAnalysis() {
  selectedImage = null;
  analysisResult = null;
  renderContent();
}