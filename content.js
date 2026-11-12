/* ALL PORTFOLIO CONTENT LIVES IN THIS FILE.
   Any text can be a plain string, or {en: '...', th: '...'} for both languages.
   Media per project: 1 to 3 items. Types:
     {type:'video', src:'media/forceps-demo.mp4', cap:'...', tab:'Recording'}   (tab: label for the switch when there are 2 or 3 items)
     {type:'image', src:'media/forceps-1.jpg', cap:'...'}
     {type:'html',  html:'...', cap:'...'}            (simple coded animation)
     {type:'anim',  name:'defocus', light:true, cap:'...'}   (scripted animation from anims.js)
   Optional framing for video/image: pos:'50% 50%' (which part stays in view), zoom:1.2, fit:true (show whole, no crop) */
var SANS = "font-family:'Source Sans 3','Sarabun',Arial,sans-serif";
window.PORTFOLIO = {
  ui: {
    en: { name: 'Varin Dejgambhir, MD', running: 'Portfolio for ophthalmology residency, 2026', problem: 'Problem', solution: 'Key solutions', fig: 'Figure', page: 'Page', of: 'of', prev: 'Previous page', next: 'Next page', foot: 'Dejgambhir V. Portfolio' },
    th: { name: '[ชื่อ-นามสกุล ภาษาไทย]', running: 'แฟ้มผลงานประกอบการสมัครแพทย์ประจำบ้าน สาขาจักษุวิทยา พ.ศ. 2569', problem: 'ปัญหา', solution: 'แนวทางแก้ไข', fig: 'รูปที่', page: 'หน้า', of: 'จาก', prev: 'หน้าก่อนหน้า', next: 'หน้าถัดไป', foot: 'Dejgambhir V. Portfolio' }
  },
  sections: [
    { id: 'pr', label: { en: 'Product innovation', th: 'นวัตกรรมผลิตภัณฑ์' } },
    { id: 'sw', label: { en: 'Software innovation', th: 'นวัตกรรมซอฟต์แวร์' } },
    { id: 're', label: { en: 'Research and Awards', th: 'งานวิจัยและรางวัล' } },
    { id: 'cv', label: { en: 'CV', th: 'ประวัติย่อ' } }
  ],
  pages: [
    { type: 'project', sec: 'pr',
      title: 'Laser flange forceps',
      sub: 'Custom forceps for laser-assisted flange creation',
      role: 'Surgical instrument | Role: [YOUR ROLE] | [YEAR]',
      problem: ['In Yamane scleral fixation, each flange is made with handheld cautery, so its size varies from one haptic to the next', 'A flange that is too small can slip back through the sclera'],
      bullets: ['[HOW THE FORCEPS HOLDS THE HAPTIC]', 'Endolaser forms the flange at a set power and duration', 'Benchtop study on PVDF haptics: [KEY RESULT]'],
      media: [{ type: 'html', cap: 'Animated demonstration (placeholder). The real recording goes here.',
        html: '<svg viewBox="0 0 360 200" width="432" height="240" aria-hidden="true"><path d="M20 100 H170" stroke="#ffffff" stroke-width="5" fill="none"></path><circle class="flB" cx="176" cy="100" r="18" fill="#ffffff"></circle><path class="flL" d="M200 100 H286" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 6" fill="none"></path><rect x="286" y="88" width="64" height="24" fill="#3d3d3d" stroke="#9a9a9a"></rect><text x="20" y="72" fill="#c9c9c9" font-family="Source Sans 3, Arial, sans-serif" font-size="14">IOL haptic</text><text x="286" y="72" fill="#c9c9c9" font-family="Source Sans 3, Arial, sans-serif" font-size="14">Endolaser</text></svg>' }]
    },
    { type: 'project', sec: 'pr',
      title: 'Automatic VA machine',
      sub: 'Voice-guided visual acuity test that runs without staff',
      role: 'Medical device prototype | Role: [YOUR ROLE] | 2026',
      problem: ['Visual acuity is measured on every eye patient, and each test needs a staff member to stand with the patient', 'In a busy clinic this becomes a queue before anyone sees a doctor'],
      bullets: ['Spoken instructions guide the patient through the test', 'Speech recognition on the device hears and grades each answer', 'Prints the result with no assistant needed'],
      media: [{ type: 'anim', name: 'vakiosk', light: true, bg: '#DDE2E6', cap: 'Redrawn from the kiosk application: the patient stands at 6 m, says "start", and reads each line aloud; the machine hears, grades and prints the result. Illustrative values.' }]
    },
    { type: 'project', sec: 'pr',
      title: 'Eye drop compliance tracker',
      sub: 'A bottle-mounted camera and motion sensor that confirms the drop reached the eye',
      role: 'Medical device, bench prototype | Role: Idea and device design | 2026 | Status: On permanent hold due to patent limitation in USA',
      problem: ['Smart bottles count attempts (motion, squeeze, cap opening), not drops that reached the eye', 'A drop on the lid or cheek is still recorded as taken'],
      bullets: ['Motion sensor wakes an infrared camera when the bottle is turned upside down', 'Each instillation is filmed, time-stamped and stored on the device', 'Clips train an on-device model, validated against fluorescein'],
      media: [{ type: 'anim', name: 'eyedrop', cap: 'To-scale 3D model of the bench prototype on a Vigamox bottle: XIAO ESP32-S3 Sense and battery in the base, OV2640 camera and infrared LED at the shoulder. Drag to turn; tap a part to explore it.' }]
    },
    { type: 'project', sec: 'sw',
      title: 'Hindsight',
      sub: 'Case video management with phase detection for rapid review',
      role: 'Desktop application | Role: Idea and application development | 2026',
      problem: ['Trainees record nearly every case, yet most footage is never watched again', 'Locating one step inside a full-length recording takes longer than the step itself', 'Feedback ends up being given from memory'],
      bullets: ['Automatic USB thumbdrive case sync', 'Automatic phase detection', 'Quick review, e.g. export the last 10 capsulorhexis you did'],
      media: [{ type: 'video', src: 'media/hindsight-demo.mp4', fit: true, tab: { en: 'Screen recording', th: 'วิดีโอหน้าจอ' }, cap: 'Screen recording of the application: phase timeline, structured debrief and ICO-OSCAR self-assessment. Patient details removed.' },
        { type: 'anim', name: 'hindsight', tab: { en: 'Animation', th: 'ภาพเคลื่อนไหว' }, cap: 'Redrawn from the application: a thumb drive syncs new cases, the ten phases of a phacoemulsification case are detected automatically, then the last 10 capsulorhexis are pulled up side by side for export. Illustrative cases.' }]
    },
    { type: 'project', sec: 'sw',
      title: 'Electronic CRF',
      sub: 'Case report form that checks each value as it is entered',
      role: 'Web application | Role: [YOUR ROLE] | 2026',
      problem: ['On paper and spreadsheet case report forms, any value can be written down', 'Out-of-range measurements and missing fields are found weeks later at data cleaning, after the participant has gone home'],
      bullets: ['Validation rules run at the moment of entry', 'Out-of-range and missing values are flagged before the visit ends', 'Optometrist, assistant and principal investigator each work on their own linked screen'],
      media: [{ type: 'anim', name: 'defocus', light: true, bg: 'transparent', cap: 'Measuring a defocus curve on three linked screens. Each mistyped value is flagged at once and re-measured. Illustrative values.' }]
    },
    { type: 'project', sec: 'sw',
      title: 'Globe tracker',
      sub: 'Measures how much the eye moves during cataract surgery, from the microscope video alone',
      role: '[TYPE OF SOFTWARE] | Role: [YOUR ROLE] | [YEAR]',
      problem: ['Eye movement during cataract surgery is not measured; stability is judged by eye and by feel', 'Without a number, it cannot be fed back to the surgeon, taught, or compared between surgeons, techniques or robotic systems'],
      bullets: ['Fits the limbus on every frame of an ordinary microscope recording, with no extra hardware', 'Reports globe pitch, yaw and torsion in degrees, plotted phase by phase across the whole case', 'First step towards live feedback, training metrics and a benchmark for robotic surgery'],
      media: [{ type: 'video', src: 'media/globe-tracker.mp4', fit: true, cap: 'Screen recording during capsulorhexis: the limbus is fitted on every frame of the surgical view (left), and the pitch, yaw and torsion of the globe are tracked in degrees on a 3D model of the eye (right).' }]
    },
    { type: 'research', sec: 're',
      title: 'Research and awards',
      left: { heading: 'Publications', items: [
        { sm: true, name: 'Development of a Camera-Based Refractive Error Image Simulation Dataset and Mobile Application: A Proof-of-Concept Study', meta: 'BMC Ophthalmology | Accepted, 2026' }
      ],
        sub: { heading: 'Awards', items: [
          { name: 'Winner, Cataract Surgery category', meta: 'APACRS Film Festival 2026', text: 'Laser-Assisted Precision Flange Creation' }
        ] } },
      media: [{ type: 'video', src: 'media/apacrs-film.mp4', ratio: '1 / 1' }],
      right: { heading: 'Research interest', items: [
        { name: 'Umbrella reviews', text: 'An umbrella review gathers the systematic reviews on one clinical question and compares their conclusions. It is most useful where several reviews exist and disagree.' }
      ], listLabel: 'Topics in progress', list: ['Management of non-infectious uveitis after anti-TNF failure (umbrella review)', 'Adoption of and barriers to immediate sequential bilateral cataract surgery (systematic review)'],
        sub: { heading: 'Current projects', items: [
          { name: 'STACATTO', meta: 'Role: [YOUR ROLE] | [SITE]', text: '[WHAT THE STUDY IS, AND WHAT YOU DO ON IT.]' },
          { name: 'SightSpire', meta: 'Role: Research assistant | Thai hospital sites', text: 'Phase 3b trial (NCT06847542) of the port delivery system with ranibizumab for neovascular AMD. [WHAT YOU DO ON IT.]' }
        ] } }
    },
    { type: 'cv', sec: 'cv',
      title: 'Curriculum vitae',
      photo: 'media/photo.jpg',
      statement: 'I am a physician who puts patients first and enjoys working as part of a team. I believe good care comes from people who support each other, so I try to be the colleague others can rely on and are glad to see. Whatever the day brings, I show up with a positive attitude and help the team find a way forward.',
      blocks: [
        { heading: 'Education', entries: [
          { t: 'Chulalongkorn University, International Medical Program (CU-MEDi) | 2021–2025', s: 'Doctor of Medicine, First-Class Honours', n: 'Observership, Department of Ophthalmology, with Dr. Thanapong Somkijrungroj (2 months)' },
          { t: 'University of Dundee, United Kingdom | 2024', s: 'Elective in Ophthalmology and Geriatrics (2 months)' },
          { t: 'Mahidol University, Thailand | 2018', s: 'Civil Engineering Course' },
          { t: 'Assumption University, Thailand | 2008–2011', s: 'Bachelor of Business Administration, International Business Management' },
          { t: 'Raffles Design Institute | 2009–2010', s: 'Product Design Course' }
        ] },
        { heading: 'Professional experience', cols: 2, entries: [
          { t: 'Queen Savang Vadhana Memorial Hospital | 2025–2026', s: 'Intern Physician', wide: true },
          { t: 'G.M.G. Thailand | 2012–Present', s: 'Partner and Manager' },
          { t: 'Assumption University | 2015–2016', s: 'English Teacher' },
          { t: 'Millward Brown Firefly Co., Ltd. | 2012', s: 'Research Associate' },
          { t: 'Wall Street English Thailand | 2011', s: 'English Personal Tutor' }
        ] }
      ]
    },
    { type: 'cv', sec: 'cv',
      title: 'Projects and presentations',
      blocks: [
        { list: [
          'Oral presentation, *Applying Laser-Assisted Flange Creation in Yamane’s Technique*, APVRS 2026, Gold Coast, Australia, August 2026',
          '**Winner, Cataract Research Video Competition**, Laser-Assisted Precision Flange Creation, 38th APACRS–55th RCOPT Joint Meeting, Pattaya, Thailand, June 2026',
          'Video competition entry, *Unseen Fear of the Unseeing Eye*, 37th APACRS Annual Meeting, Ahmedabad, India, 2025',
          'Organizing committee for Cataract Day and GOIW meeting, Bangkok, 2025',
          'Presenter, session *“Amazing Phaco!: My View, Your View, Our View for Our Patients”*, 51st RCOPT Meeting, Bangkok, June 2024',
          'Oral presentation, *Overcoming Barriers: A Physician’s Approach to Non-Compliance in Patients with Chronic Disease*, 58th MDCU Congress, Bangkok, Thailand, 2022',
          'President, CU-MEDi Class 1; CU-MEDi Representative, Student Union, Faculty of Medicine, Chulalongkorn University (SMCU), 2021'
        ] },
        { heading: 'Proficiency and certificates', list: [
          'Completed **EyeSi Cataract training course** A–C, total training time 15 hours 45 minutes, average **score 92%** (University of Dundee)',
          'IELTS: band **8 out of 9**',
          'TOEIC: **985 out of 990**',
          'Statistical analysis with SPSS; Excel with VBA coding; Adobe Creative Suite'
        ] },
        { heading: 'AI use capabilities', list: [
          'Advanced agentic AI workflows (Claude Code, custom skills, MCP integrations) for research synthesis and software development'
        ] }
      ]
    },
    { type: 'cv', sec: 'cv',
      title: 'Conferences and community',
      blocks: [
        { heading: 'Conferences attended', cols: 2, small: true, list: [
          'ESCRS 2026, London, United Kingdom',
          'APVRS 2026, Gold Coast, Australia',
          '38th APACRS–55th RCOPT Joint Meeting, Pattaya, June 2026',
          '37th APACRS Annual Meeting, Ahmedabad, India, August 2025',
          'FujiRetina, Tokyo, Japan, 2025',
          '36th APACRS–24th CSCRS Joint Meeting, Chengdu, China, 2024',
          '51st RCOPT Meeting, Bangkok, July 2024',
          '50th RCOPT Meeting, Pattaya, December 2023',
          '21st Specialty Day, Thammasat Eye Center, 2023',
          'CROST–RCOPT Meeting, How to Efficiently Improve the Optical Clinic, 2023',
          'Research Day, Chulalongkorn Eye Center, 2023',
          '11th Asian Neuro-Ophthalmology Society Meeting, Bangkok, 2022',
          '8th Asia Cornea Society Biennial Scientific Meeting, Bangkok, 2022',
          '48th RCOPT Meeting, Pattaya, December 2022'
        ] },
        { heading: 'Community contributions', list: [
          'Assisted at an ophthalmology screening event in Saraburi, June 2025',
          'Produced a public education video in collaboration with the Obstetrics and Gynecology department, Queen Savang Vadhana Memorial Hospital, Thai Red Cross Society',
          'Participated in Medi-Lingo, a local language proficiency initiative for healthcare workers at Queen Savang Vadhana Memorial Hospital, Thai Red Cross Society'
        ] },
        { heading: 'Contact information', list: ['Email: Varin.MD@outlook.com', 'Phone: 099-959-9259'] }
      ]
    },
    { type: 'gallery', sec: 'cv',
      title: 'Activities',
      hint: { en: 'Tap a photo to enlarge.', th: 'แตะรูปเพื่อขยาย' },
      items: [
        { src: 'media/cv-01.jpg', cap: "ESCRS 2026 with Dr. Thanapong and Dr. Sérgio Canabrava" },
        { src: 'media/cv-02.jpg', cap: "APVRS 2026, Gold Coast, Australia" },
        { src: 'media/cv-03.jpg', cap: "APACRS 2026 Video Competition Winner" },
        { src: 'media/cv-04.jpg', cap: "Global Ocular Inflammation Workshop Meeting, 2025" },
        { src: 'media/cv-05.jpg', cap: "Cataract Day, 2025" },
        { src: 'media/cv-06.jpg', cap: "APACRS 2025" },
        { src: 'media/cv-07.jpg', cap: "Ophthalmology screening, Saraburi, June 2025" },
        { src: 'media/cv-08.jpg', cap: "AIER Sichuan Eye Hospital visit, Chengdu, China" },
        { src: 'media/cv-09.jpg', cap: "22nd Specialty Day, TES" },
        { src: 'media/cv-10.jpg', cap: "EyeSi and wet lab" },
        { src: 'media/cv-11.jpg', cap: "Ophthalmology rotation, University of Dundee, NHS Tayside" },
        { src: 'media/cv-12.jpg', cap: "President of CU-MEDi student committee and SMCU representative" },
        { src: 'media/cv-13.jpg', cap: "Teaching at Assumption University" }
      ]
    }
  ]
};
