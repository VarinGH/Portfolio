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
    th: { name: 'นพ. วารินทร์ เดชคัมภีร์', running: 'แฟ้มผลงานประกอบการสมัครแพทย์ประจำบ้าน สาขาจักษุวิทยา พ.ศ. 2569', problem: 'ปัญหา', solution: 'แนวทางแก้ไข', fig: 'รูปที่', page: 'หน้า', of: 'จาก', prev: 'หน้าก่อนหน้า', next: 'หน้าถัดไป', foot: 'Dejgambhir V. Portfolio' }
  },
  sections: [
    { id: 'pr', label: { en: 'Product innovation', th: 'นวัตกรรมผลิตภัณฑ์' } },
    { id: 'sw', label: { en: 'Software innovation', th: 'นวัตกรรมซอฟต์แวร์' } },
    { id: 're', label: { en: 'Research and awards', th: 'งานวิจัยและรางวัล' } },
    { id: 'cv', label: { en: 'CV and photos', th: 'ประวัติย่อและภาพ' } }
  ],
  pages: [
    { type: 'project', sec: 'pr',
      title: 'Laser flange forceps',
      sub: 'Forceps for laser-assisted flange creation in Yamane fixation',
      role: 'Surgical instrument | Role: Inventor; design and prototyping | Status: Under development',
      problem: ['Our endolaser technique creates a precise flange in Yamane scleral fixation', 'Surgeon feedback: aligning the laser tip with the haptic by hand is difficult'],
      bullets: ['Forceps hold the laser tip and the haptic side by side', 'Alignment becomes stable and repeatable'],
      media: [{ type: 'video', src: 'media/forceps-assembly.mp4', fit: true, ratio: '16 / 9', bg: '#E9E9E6', cap: '3D model of the forceps in use (SolidWorks).' }]
    },
    { type: 'project', sec: 'pr',
      title: 'Automatic VA kiosk',
      sub: 'Voice-guided, self-service visual acuity test',
      role: 'Medical device prototype | Role: Concept, test algorithm, interaction design and prototype | Status: Adapting software for production; feasibility testing',
      problem: ['Every eye patient needs a visual acuity test, and each test occupies one staff member', 'At busy clinics this adds to waiting time'],
      bullets: ['Spoken instructions guide the patient through the test', 'On-device speech recognition grades each answer', 'The result prints automatically, freeing staff for other care'],
      media: [{ type: 'anim', name: 'vakiosk', light: true, bg: '#E9E9E6', cap: 'Animation redrawn from the kiosk software: the patient stands at 6 m and reads each line aloud; the kiosk grades the answers and prints the result. Illustrative values.' }]
    },
    { type: 'project', sec: 'pr',
      title: 'Eye drop compliance tracker',
      sub: 'Bottle-mounted camera and motion sensor that confirm the drop reached the eye',
      role: 'Research data logger; bench prototype | Role: Concept and device design | Status: On permanent hold (US patent barrier)',
      problem: ['Smart bottles count attempts (motion, squeeze, cap opening), not drops that reach the eye', 'A drop that lands on the lid or cheek is still recorded as taken'],
      bullets: ['A motion sensor wakes an infrared camera when the bottle is inverted', 'Each instillation is filmed, time-stamped and stored on the device', 'Planned: an on-device model trained on the clips, validated against fluorescein'],
      media: [{ type: 'anim', name: 'eyedrop', cap: 'To-scale 3D model of the bench prototype. Drag to turn; tap a part to explore it.' }]
    },
    { type: 'project', sec: 'sw',
      title: 'Hindsight: AI phase detection case manager',
      sub: 'Surgical video library with automatic phase detection',
      role: 'Desktop application | Role: Concept and development | Status: Under development',
      problem: ['Surgical cases are recorded routinely, but the footage is hard to revisit', 'Finding one step in a full-length recording takes longer than the step itself'],
      bullets: ['Cases sync automatically from a USB drive', 'Surgical phases are detected automatically', 'Any step can be reviewed across cases, e.g. the last 10 capsulorhexes'],
      media: [{ type: 'video', src: 'media/hindsight-demo.mp4', fit: true, tab: { en: 'Screen recording', th: 'วิดีโอหน้าจอ' }, cap: 'Screen recording: phase timeline, structured debrief and ICO-OSCAR self-assessment. Patient details removed.' },
        { type: 'anim', name: 'hindsight', tab: { en: 'Animation', th: 'ภาพเคลื่อนไหว' }, cap: 'Animation redrawn from the application: cases sync from a USB drive, phases are detected, and the last 10 capsulorhexes are lined up for export. Illustrative cases.' }]
    },
    { type: 'project', sec: 'sw',
      title: 'Electronic CRF with automatic error detection',
      sub: 'Case report form that checks each value as it is entered',
      role: 'Web application | Role: Application design to protocol and IRB requirements | Status: Pending mock data test',
      problem: ['Paper and spreadsheet forms accept any value', 'Errors and missing fields surface weeks later, after the participant has left'],
      bullets: ['Each value is validated as it is entered', 'Out-of-range and missing values are flagged before the visit ends', 'Optometrist, assistant and principal investigator work on linked screens'],
      media: [{ type: 'anim', name: 'defocus', light: true, bg: 'transparent', cap: 'Measuring a defocus curve on three linked screens: a mistyped value is flagged at once and re-measured. Illustrative values.' }]
    },
    { type: 'project', sec: 'sw',
      title: 'Globe tracker',
      sub: 'Measures eye movement during cataract surgery from the surgical video',
      role: 'Video analysis software | Role: Concept and algorithm development | Status: Under development',
      problem: ['Eye movement during cataract surgery is not routinely measured', 'Without a measurement, it is hard to teach or compare'],
      bullets: ['Fits the limbus on every frame of a standard surgical video', 'Reports globe pitch, yaw and torsion in degrees', 'A first step towards objective feedback, training and robotic-surgery metrics'],
      media: [{ type: 'video', src: 'media/globe-tracker.mp4', ratio: '1528 / 836', cap: 'Limbus fitted on the surgical view (left); globe pitch, yaw and torsion on a 3D model of the eye (right).' }]
    },
    { type: 'research', sec: 're',
      title: 'Research and awards',
      left: { heading: 'Publications', items: [
        { sm: true, name: 'Development of a camera-based refractive error image simulation dataset and mobile application: a proof-of-concept study', meta: 'BMC Ophthalmol. 2026; accepted.' },
        { sm: true, name: 'A randomized controlled trial comparing the incidence of surgical site infections in cesarean section with and without subcutaneous drain placement', meta: 'J Med Assoc Thai. 2026; accepted.' }
      ],
        sub: { heading: 'Awards', items: [
          { name: 'Winner, APACRS Film Festival', meta: '2026 | Cataract/Implant Surgery | with Dr. Thanapong Somkijrungroj', text: 'Laser Assisted Precision Flange Creation' }
        ] } },
      media: [{ type: 'video', src: 'media/apacrs-film.mp4', ratio: '1 / 1' }],
      right: { heading: 'Research interests', list: [
          'Surgical training and objective skill assessment',
          'Clinical trials in ophthalmology',
          'Product and software innovation',
          'Applied AI and foundation models',
          'Patient education and communication',
          'Population screening and primary prevention',
          'Umbrella reviews'
        ],
        sub: { heading: 'Current projects', items: [
          { name: 'STACCATO', meta: 'Role: Trial coordinator (international and local); budgeting', text: 'NIH-funded randomised trials of antiviral treatment and long-term suppression in CMV anterior uveitis.' },
          { name: 'SightSpire', meta: 'Role: Research assistant', text: 'Phase 3b trial (NCT06847542) of the port delivery system with ranibizumab for neovascular AMD, at Thai sites.' }
        ] } }
    },
    { type: 'cv', sec: 'cv',
      title: 'Curriculum vitae',
      photo: 'media/photo.jpg',
      statement: 'I am a physician who puts patients first and values teamwork. I aim to be a dependable, positive colleague who is eager to learn, and I enjoy building tools that make care and training a little easier.',
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
      title: 'Presentations and leadership',
      blocks: [
        { tint: 'blue', list: [
          'Oral presentation, *Applying Laser-Assisted Flange Creation in Yamane’s Technique*, APVRS, Gold Coast, Australia, 2026',
          '**Winner, Cataract/Implant Surgery, APACRS Film Festival**, *Laser Assisted Precision Flange Creation* (with Dr. Thanapong Somkijrungroj), 38th APACRS–55th RCOPT Joint Meeting, Pattaya, 2026',
          'Film Festival entry, *Unseen Fear of the Unseeing Eye*, 37th APACRS Annual Meeting, Ahmedabad, India, 2025',
          'Organising committee, Cataract Day and Global Ocular Inflammation Workshop (GOIW), Bangkok, 2025',
          'Presenter, *Amazing Phaco!: My View, Your View, Our View for Our Patients*, 51st RCOPT Meeting, Bangkok, 2024',
          'Oral presentation, *Overcoming Barriers: A Physician’s Approach to Non-Compliance in Patients with Chronic Disease*, 58th MDCU Congress, Bangkok, 2022',
          'President, CU-MEDi Class 1; CU-MEDi representative, Student Union, Faculty of Medicine, Chulalongkorn University (SMCU), 2021'
        ] },
        { heading: 'Skills and certificates', list: [
          '**Eyesi cataract courses** A–C: 15 h 45 min of training, average **score 92%** (University of Dundee)',
          'IELTS **8.0** / 9; TOEIC **985** / 990',
          'SPSS; Excel with VBA; Adobe Creative Suite',
          'AI-assisted workflows (Claude Code) for software development and literature review'
        ] }
      ]
    },
    { type: 'cv', sec: 'cv',
      title: 'Conferences and community',
      blocks: [
        { heading: 'Conferences attended', cols: 2, small: true, list: [
          'ESCRS Congress, London, United Kingdom, 2026',
          'APVRS Congress, Gold Coast, Australia, 2026',
          '38th APACRS–55th RCOPT Joint Meeting, Pattaya, 2026',
          '37th APACRS Annual Meeting, Ahmedabad, India, 2025',
          'FujiRetina, Tokyo, Japan, 2025',
          '36th APACRS–24th CSCRS Joint Meeting, Chengdu, China, 2024',
          '51st RCOPT Meeting, Bangkok, 2024',
          '50th RCOPT Meeting, Pattaya, 2023',
          '22nd Specialty Day, Thammasat Eye Center, 2023',
          'CROST–RCOPT Meeting, How to Efficiently Improve the Optical Clinic, 2023',
          'Research Day, Chulalongkorn Eye Center, 2023',
          '11th Asian Neuro-Ophthalmology Society Meeting, Bangkok, 2022',
          '8th Asia Cornea Society Biennial Scientific Meeting, Bangkok, 2022',
          '48th RCOPT Meeting, Pattaya, 2022'
        ] },
        { heading: 'Community contributions', list: [
          'Assisted at an ophthalmology screening event, Saraburi, 2025',
          'Produced a public education video with the Department of Obstetrics and Gynaecology, Queen Savang Vadhana Memorial Hospital',
          'Took part in Medi-Lingo, a local-language initiative for healthcare workers, Queen Savang Vadhana Memorial Hospital'
        ] },
        { heading: 'Contact information', list: ['Email: Varin.MD@outlook.com', 'Phone: 099-959-9259'] }
      ]
    },
    { type: 'gallery', sec: 'cv',
      title: 'Activities',
      hint: { en: 'Tap a photo to enlarge.', th: 'แตะที่รูปเพื่อขยายดูภาพใหญ่ได้ครับ' },
      items: [
        { src: 'media/cv-01.jpg', cap: "ESCRS 2026 with Dr. Thanapong and Dr. Sérgio Canabrava" },
        { src: 'media/cv-02.jpg', pos: '50% 6%', cap: "Oral presentation, APVRS 2026, Gold Coast" },
        { src: 'media/cv-03.jpg', cap: "APACRS Film Festival 2026, winning film" },
        { src: 'media/cv-04.jpg', cap: "Global Ocular Inflammation Workshop (GOIW), 2025" },
        { src: 'media/cv-05.jpg', cap: "Cataract Day, 2025" },
        { src: 'media/cv-06.jpg', cap: "37th APACRS Annual Meeting, Ahmedabad, 2025" },
        { src: 'media/cv-07.jpg', cap: "Ophthalmology screening, Saraburi, 2025" },
        { src: 'media/cv-08.jpg', cap: "AIER Sichuan Eye Hospital visit, Chengdu, China" },
        { src: 'media/cv-09.jpg', cap: "22nd Specialty Day, Thammasat Eye Center" },
        { src: 'media/cv-10.jpg', cap: "Eyesi simulator and wet lab" },
        { src: 'media/cv-11.jpg', cap: "Ophthalmology elective, University of Dundee" },
        { src: 'media/cv-12.jpg', cap: "President, CU-MEDi Class 1, and SMCU representative" },
        { src: 'media/cv-13.jpg', cap: "Teaching at Assumption University" }
      ]
    }
  ]
};
