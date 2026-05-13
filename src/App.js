import { useState, useEffect, useRef } from "react";

const BG = "#F2EBDF";
const DARK = "#1c1917";
const MUTED = "#78716c";
const C = {
  card: { background: "rgba(255,255,255,0.42)", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 2, padding: "14px 18px", marginBottom: 10 },
  mono: { fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", color: MUTED },
  serif: { fontFamily: "Georgia,serif" },
  italic: { fontFamily: "Georgia,serif", fontStyle: "italic", color: MUTED },
  page: { maxWidth: 860, margin: "0 auto", padding: "36px 18px 80px" },
};

// ── DATA ──────────────────────────────────────────────────────────────────────

const MAP_DAYS = [
  { n:1, t:"Arrival", color:"#7C4D2F", places:[
    {name:"Bukchon Hanok Village",lat:37.5814,lng:126.9849,note:"Walk the hanok lanes"},
    {name:"Insadong",lat:37.5714,lng:126.9854,note:"Teahouses + craft mall"},
    {name:"Cheonggyecheon Stream",lat:37.5696,lng:126.9784,note:"Evening stream walk"},
  ]},
  { n:2, t:"Palaces", color:"#2E7D32", places:[
    {name:"Gyeongbokgung",lat:37.5796,lng:126.977,note:"Hanbok = free entry"},
    {name:"Cheongwadae",lat:37.5852,lng:126.9754,note:"Former Blue House, free"},
    {name:"Changdeokgung",lat:37.5794,lng:126.991,note:"UNESCO + Secret Garden"},
  ]},
  { n:3, t:"Gangnam", color:"#1565C0", places:[
    {name:"Bongeunsa Temple",lat:37.5148,lng:127.0573,note:"Ancient temple by COEX"},
    {name:"Garosu-gil",lat:37.5218,lng:127.0199,note:"Boutiques + NUDAKE"},
    {name:"Sushi Matsumoto",lat:37.5244,lng:127.0467,note:"RESERVED 6PM"},
  ]},
  { n:4, t:"DMZ", color:"#6A1B9A", places:[
    {name:"DMZ Tour",lat:37.8902,lng:126.7432,note:"Full day. Passport required."},
    {name:"Gwangjang Market",lat:37.57,lng:126.9996,note:"Evening street food"},
  ]},
  { n:5, t:"Eunpyeong", color:"#E65100", places:[
    {name:"Eunpyeong Hanok Village",lat:37.6374,lng:126.9207,note:"Quiet hanok + Bukhansan"},
    {name:"Jingwansa Temple",lat:37.6452,lng:126.9178,note:"Buddhist temple"},
    {name:"Deoksugung Palace",lat:37.5658,lng:126.9749,note:"Stone wall walk"},
    {name:"Gangnam Hotel",lat:37.5255,lng:127.0289,note:"Hotel move tonight"},
  ]},
  { n:6, t:"Hongdae", color:"#AD1457", places:[
    {name:"Ewha University",lat:37.5626,lng:126.9467,note:"Striking campus"},
    {name:"Yeonnam-dong",lat:37.5593,lng:126.9261,note:"Best indie cafe street"},
    {name:"Hongdae Street",lat:37.5563,lng:126.9238,note:"Buskers + Gentle Monster"},
    {name:"Rihoon Mansion",lat:37.5636,lng:126.9235,note:"Must: journals. Closed Mon/Tue"},
  ]},
  { n:7, t:"Seongsu", color:"#00695C", places:[
    {name:"Seoul Forest",lat:37.5443,lng:127.0374,note:"Morning stroll + bikes"},
    {name:"Seongsu Cafes",lat:37.5445,lng:127.0568,note:"Cafe Onion, Haus Nowhere"},
    {name:"Yongwangsan Skywalk",lat:37.5312,lng:126.8712,note:"OPTIONAL: Han River views"},
    {name:"Banpo Hangang Park",lat:37.5106,lng:126.9959,note:"Rainbow Fountain 19:30"},
  ]},
  { n:8, t:"Ikseon", color:"#4527A0", places:[
    {name:"Ikseon-dong",lat:37.5741,lng:126.9998,note:"Hidden hanok alleys"},
    {name:"N Seoul Tower",lat:37.5512,lng:126.9882,note:"Cable car. Sunset ~19:45"},
  ]},
  { n:9, t:"Departure", color:"#37474F", places:[
    {name:"Born and Bred",lat:37.5444,lng:127.0446,note:"RESERVED 12PM"},
    {name:"Seoul Station to ICN",lat:37.5547,lng:126.9706,note:"AREX Express 43 min"},
  ]},
];

const HOTELS = [
  {name:"Four Seasons Seoul",lat:37.5707,lng:126.9754},
  {name:"AMID Hotel",lat:37.5725,lng:126.9841},
  {name:"Josun Palace",lat:37.5029,lng:127.0413},
  {name:"Andaz Gangnam",lat:37.5255,lng:127.0289},
];

const SHOPS = [
  {n:"Haus Nowhere",lat:37.538,lng:127.0589,m:false},{n:"Osoi",lat:37.5456,lng:127.051,m:false},{n:"Khiho",lat:37.5434,lng:127.0581,m:false},{n:"29cm",lat:37.5451,lng:127.0525,m:false},{n:"Marylebone",lat:37.542,lng:127.0558,m:false},{n:"Point of View",lat:37.5434,lng:127.0514,m:false},{n:"Taag",lat:37.5438,lng:127.0512,m:false},
  {n:"Monorow",lat:37.5208,lng:127.022,m:false},{n:"Kary Market",lat:37.5234,lng:127.0227,m:false},{n:"Ella Boutique",lat:37.5218,lng:127.0225,m:false},{n:"Indibrand",lat:37.5224,lng:127.0229,m:false},{n:"Low Classic",lat:37.5215,lng:127.0237,m:false},{n:"Numbering Lab",lat:37.5217,lng:127.022,m:false},{n:"Tamburins",lat:37.5253,lng:127.0357,m:false},
  {n:"Recto",lat:37.5422,lng:127.0033,m:false},{n:"Nothing Written",lat:37.5425,lng:127.0037,m:false},{n:"Cueren",lat:37.536,lng:127.0,m:false},{n:"Rough Side",lat:37.5365,lng:127.0009,m:false},{n:"Arcade",lat:37.5372,lng:127.0019,m:false},{n:"Monoha",lat:37.5316,lng:127.0077,m:false},{n:"Mango Many Please",lat:37.5334,lng:127.0023,m:false},
  {n:"Theilma",lat:37.5793,lng:126.9725,m:false},{n:"Parlour",lat:37.5793,lng:126.9728,m:false},{n:"Iluai",lat:37.5793,lng:126.9735,m:false},
  {n:"Rihoon Mansion",lat:37.5636,lng:126.9235,m:true},{n:"Blue Elephant",lat:37.5515,lng:126.9211,m:false},{n:"Gentle Monster",lat:37.55,lng:126.9201,m:false},
  {n:"Nyunyu",lat:37.5626,lng:126.9837,m:false},{n:"On The Spot",lat:37.5619,lng:126.9854,m:false},
  {n:"Object",lat:37.5794,lng:126.9846,m:true},{n:"Mimiline",lat:37.5677,lng:127.0132,m:false},
];

const RESTS = [
  {n:"Wangbijip",lat:37.5635,lng:126.983,r:false},{n:"Tosokchon",lat:37.5784,lng:126.9689,r:false},{n:"Hadongkwan",lat:37.5628,lng:126.9842,r:false},{n:"Myeongdong Kyoja",lat:37.563,lng:126.9838,r:false},
  {n:"Mapo Jeong Daepo",lat:37.5489,lng:126.9121,r:false},{n:"Mongtan",lat:37.539,lng:126.972,r:false},{n:"Daedo Sikdang",lat:37.5444,lng:127.0398,r:false},
  {n:"Born and Bred",lat:37.5444,lng:127.0446,r:true},{n:"Sushi Matsumoto",lat:37.5244,lng:127.0467,r:true},
  {n:"Cafe Onion",lat:37.5445,lng:127.0568,r:false},{n:"NUDAKE",lat:37.5253,lng:127.0357,r:false},{n:"London Bagel Museum",lat:37.581,lng:126.984,r:false},
  {n:"Gwangjang Market",lat:37.57,lng:126.9996,r:false},{n:"Kkanbu Chicken",lat:37.5545,lng:126.9225,r:false},{n:"Mingles",lat:37.5265,lng:127.0315,r:false},{n:"Jungsik",lat:37.5205,lng:127.022,r:false},
];

const DAYS_DATA = [
  {n:1,title:"Arrival",theme:"Land, settle, ease in.",
    sched:[{t:"2PM",p:"Bukchon Hanok Village",note:"Best photo: Bukchon-ro 11-gil"},{t:"4PM",p:"Insadong",note:"Teahouses, calligraphy, Ssamziegil"},{t:"6:30",p:"Cheonggyecheon Stream",note:"Flat 45-min illuminated stream walk"},{t:"8PM",p:"Wangbijip Myeongdong",note:"Korean BBQ, staff grills for you"}],
    eats:[{n:"Wangbijip",t:"Korean BBQ",note:"Tourist-friendly, genuinely good. Staff grills for you."}],
    tip:"Get a T-money card at 7-Eleven (load 20-30k won). Download Naver Map + KakaoMap."},
  {n:2,title:"Palace District",theme:"Three royal sites in one neighbourhood.",
    sched:[{t:"9AM",p:"Gyeongbokgung + Geunjeongmun Gate",note:"Rent hanbok for free entry. Guard change 10:00 and 14:00"},{t:"11:30",p:"Cheongwadae Sarangchae",note:"Former Blue House, free, 10 min walk"},{t:"1:30",p:"Lunch",note:"Tosokchon (ginseng chicken) near the palace",opt:true},{t:"3PM",p:"Changdeokgung + Secret Garden",note:"Book timed ticket online in advance"}],
    eats:[{n:"Tosokchon Samgyetang",t:"Ginseng chicken",note:"50-year institution, 5 min from palace."}],
    tip:"Secret Garden tickets sell out. Book the moment you confirm dates."},
  {n:3,title:"Gangnam + Omakase",theme:"South of the river, omakase evening.",
    sched:[{t:"11AM",p:"Bongeunsa Temple",note:"Free entry, open 5am-10pm"},{t:"1PM",p:"COEX + Garosu-gil",note:"Starfield Library lunch, then boutiques + NUDAKE"},{t:"6PM",p:"Sushi Matsumoto",note:"MANDATORY. Catch Table reservation confirmed.",res:true}],
    eats:[{n:"Sushi Matsumoto",t:"Omakase, 6PM RESERVED",note:"Edomae omakase. Arrive 5 min early. Wear something nice."}],
    tip:"No clinic today. Keep it light and enjoy the full evening."},
  {n:4,title:"DMZ + Gwangjang",theme:"Border tour by day, market by night.",
    sched:[{t:"7AM",p:"Hotel pickup, DMZ tour",note:"MANDATORY. Bring passport.",res:true},{t:"9-4",p:"DMZ circuit",note:"Imjingak, 3rd Tunnel, Dora Observatory"},{t:"6PM",p:"Gwangjang Market",note:"Bindaetteok, yukhoe, makgeolli"}],
    eats:[{n:"Gwangjang Market",t:"Street food",note:"Graze 4-5 vendors. Makgeolli at the tables."}],
    tip:"Book DMZ 2-4 weeks ahead. JSA tours sell out first. No tours on Mondays."},
  {n:5,title:"Eunpyeong + Move Day",theme:"Quiet hanok morning, hotel move afternoon.",
    sched:[{t:"10:30",p:"Eunpyeong Hanok Village",note:"Line 3 to Gupabal, then Bus 7723"},{t:"1PM",p:"Jingwansa Temple",note:"Serene mountain temple, walkable"},{t:"3:30",p:"Deoksugung Palace",note:"Stone wall walk + guard ceremony"},{t:"6PM",p:"Check into Gangnam hotel",note:"Hotel move day"}],
    eats:[{n:"1in1jan Cafe",t:"Hanok cafe",note:"6-storey cafe with panoramic Bukhansan views."}],
    tip:"Eunpyeong replaces Suwon. Same spirit, 30 min instead of 60."},
  {n:6,title:"Yeonnam + Hongdae",theme:"Cafes, street culture, BBQ night.",
    sched:[{t:"12PM",p:"Ewha Womans University",note:"Striking campus architecture"},{t:"2PM",p:"Yeonnam-dong cafe hopping",note:"Best indie cafe street. 3-4 cafes over 1.5 hrs."},{t:"4PM",p:"Hongdae + Rihoon Mansion",note:"Buskers, Gentle Monster, stationery shop"},{t:"7PM",p:"Mapo Jeong Daepo",note:"Bourdain-pick charcoal BBQ"}],
    eats:[{n:"Mapo Jeong Daepo",t:"Korean BBQ",note:"Family-run charcoal grill. Egg-rim trick at the end."}],
    tip:"Yeonnam and Hongdae flow into each other on foot. Enter Yeonnam from the park end."},
  {n:7,title:"Seongsu + Han River",theme:"Brooklyn of Seoul + sunset on the river.",
    sched:[{t:"10AM",p:"Seoul Forest Park",note:"Deer enclosure, bike rental"},{t:"12PM",p:"Seongsu cafes + shopping",note:"Cafe Onion, Haus Nowhere, Osoi, 29cm"},{t:"5:30",p:"Yongwangsan Skywalk",note:"OPTIONAL, free, Han River views",opt:true},{t:"7PM",p:"Banpo Hangang Park",note:"Rainbow Fountain 19:30-21:00"}],
    eats:[{n:"Cafe Onion Seongsu",t:"Bakery",note:"Pandoro sugar bread. Best before 11AM."},{n:"Mongtan",t:"Straw-grilled beef",note:"No reservations. Go at 4PM or wait."}],
    tip:"Chimaek delivery apps work in English at Banpo Park."},
  {n:8,title:"Ikseon-dong + N Seoul Tower",theme:"Hidden alleys, golden hour, last sunset.",
    sched:[{t:"12PM",p:"Ikseon-dong",note:"Hidden hanok alleys, cafes, vintage"},{t:"3PM",p:"Olive Young Myeongdong",note:"Skincare run, open till 10:30PM"},{t:"5PM",p:"Seoul Sky, Lotte World Tower",note:"OPTIONAL, 29k won/person",opt:true},{t:"6:30",p:"N Seoul Tower",note:"OPTIONAL, cable car + sunset ~19:45",opt:true}],
    eats:[{n:"Daedo Sikdang",t:"Hanwoo BBQ",note:"Reserve via hotel. Kimchi fried rice at the end."}],
    tip:"Lotte Tower visible from Banpo (Day 7) and N Seoul Tower either way."},
  {n:9,title:"Born and Bred + Takeoff",theme:"Hanwoo lunch, fly home.",
    sched:[{t:"11AM",p:"Hotel checkout + bag drop",note:"Pick up bags before Seoul Station"},{t:"12PM",p:"Born and Bred",note:"MANDATORY. Catch Table reservation confirmed.",res:true},{t:"3PM",p:"AREX to ICN Airport",note:"43 min. Be at ICN 2.5-3 hrs early."}],
    eats:[{n:"Born and Bred",t:"Hanwoo course, 12PM RESERVED",note:"The closing splurge. Slow-grilled premium hanwoo."}],
    tip:"Check if Etihad supports bag drop at Seoul Station AREX terminal."},
];

const STAYS = [
  {label:"Stay One",nights:"4 nights, Sun 24 - Thu 28 May",area:"Jongno / Gwanghwamun",hangul:"종로",note:"Old Seoul. Palace, Bukchon, Insadong, Gwangjang all walkable.",picks:[
    {name:"Four Seasons Seoul",tier:"Luxury",price:"$550-800",rating:"4.6",why:"Best service in Seoul. Pool and spa exceptional.",forWho:"When you want a base that elevates the whole trip."},
    {name:"AMID Hotel Seoul",tier:"Mid-range",price:"$120-180",rating:"4.2",why:"Excellent reviews. Right in Insadong.",forWho:"Best value in a prime location."},
  ]},
  {label:"Stay Two",nights:"4 nights, Thu 28 May - Mon 1 Jun",area:"Gangnam / Apgujeong",hangul:"강남",note:"Modern Seoul. Clinics walkable. Best restaurants for second half all nearby.",picks:[
    {name:"Josun Palace",tier:"Luxury",price:"$500-900",rating:"4.6",why:"Marriott Luxury Collection. Best service in Seoul.",forWho:"The full luxury Seoul experience."},
    {name:"Andaz Seoul Gangnam",tier:"Design",price:"$300-450",rating:"4.4",why:"Hyatt design brand. Right above metro. Walkable to clinics.",forWho:"Modern aesthetic without the Josun price tag."},
  ]},
];

const RESTAURANTS = [
  {cat:"Korean BBQ",hangul:"고기",items:[
    {n:"Wangbijip",area:"Myeongdong",price:"$$",sig:"Premium hanwoo set",why:"Tourist-friendly entry. Staff grills for you."},
    {n:"Mapo Jeong Daepo",area:"Mapo",price:"$$",sig:"Pork rib + egg-rim",why:"Bourdain pick. Charcoal, family-run."},
    {n:"Mongtan",area:"Yongsan",price:"$$$",sig:"Straw-grilled beef",why:"Hay-fire smoke. No reservations."},
    {n:"Daedo Sikdang",area:"Seongdong",price:"$$$$",sig:"Hanwoo + kimchi fried rice",why:"Institution. Reserve via hotel."},
    {n:"Born and Bred",area:"Seongdong",price:"$$$$",sig:"Hanwoo course",why:"The splurge. Reserved for Day 9."},
  ]},
  {cat:"Classics",hangul:"한식",items:[
    {n:"Tosokchon Samgyetang",area:"Jongno",price:"$$",sig:"Ginseng chicken",why:"50-year institution near palace."},
    {n:"Hadongkwan",area:"Myeongdong",price:"$$",sig:"Gomtang oxbone soup",why:"Michelin Bib. Closes 4PM."},
    {n:"Myeongdong Kyoja",area:"Myeongdong",price:"$",sig:"Kalguksu + dumplings",why:"Most famous noodle soup."},
  ]},
  {cat:"Cafes",hangul:"카페",items:[
    {n:"Cafe Onion Seongsu",area:"Seongsu",price:"$$",sig:"Pandoro sugar bread",why:"Best before 11AM."},
    {n:"NUDAKE Haus Dosan",area:"Apgujeong",price:"$$",sig:"Matcha croissant",why:"Gentle Monster pastry concept."},
    {n:"London Bagel Museum",area:"Anguk",price:"$$",sig:"Cheese honey bagel",why:"Arrive before 9AM."},
  ]},
  {cat:"Splurges",hangul:"미슐랭",items:[
    {n:"Sushi Matsumoto",area:"Cheongdam",price:"$$$$",sig:"Edomae omakase",why:"RESERVED Day 3, 6PM."},
    {n:"Mingles",area:"Apgujeong",price:"$$$$",sig:"Modern Korean tasting",why:"3 Michelin stars. Closed Sun+Mon."},
    {n:"Jungsik Seoul",area:"Gangnam",price:"$$$$",sig:"New Korean tasting",why:"2 Michelin stars. Lunch is best value."},
  ]},
  {cat:"Markets",hangul:"시장",items:[
    {n:"Gwangjang Market",area:"Jongno",price:"$",sig:"Bindaetteok, yukhoe, gimbap",why:"Most famous street food market."},
    {n:"Tongin Market",area:"Near palace",price:"$",sig:"Coin-tray dosirak",why:"Buy coins, exchange at vendors."},
  ]},
];

const TREATMENTS = [
  {type:"Skin Boosters",hangul:"주사",items:[
    {n:"Rejuran Healer",what:"Salmon DNA, repair + hydration",dt:"1-2 days",cost:"300-500k won"},
    {n:"Juvelook / Lenisna",what:"PLLA for collagen",dt:"1-3 days",cost:"400-600k won"},
    {n:"Profhilo",what:"Pure HA, plump finish",dt:"~1 day",cost:"350-500k won"},
  ]},
  {type:"Lasers",hangul:"레이저",items:[
    {n:"Pico Laser Toning",what:"Brightens, fades melasma",dt:"None",cost:"100-200k won"},
    {n:"V-Beam",what:"Redness + rosacea",dt:"Mild 1 day",cost:"200-400k won"},
    {n:"Fraxel / CO2",what:"Resurfacing, scars",dt:"3-7 days",cost:"400-800k won"},
  ]},
  {type:"Lifting",hangul:"리프팅",items:[
    {n:"Ultherapy",what:"HIFU, gold standard",dt:"None to mild",cost:"1.5-3M won"},
    {n:"Thermage FLX",what:"RF tightening",dt:"None",cost:"1.5-3M won"},
    {n:"Shurink Universe",what:"Korean HIFU alternative",dt:"None",cost:"300-800k won"},
  ]},
];

const CLINICS = [
  {n:"Lienjang",area:"Gangnam Station",tier:"All-rounder",why:"English-speaking consultants. Most beginner-friendly.",r:"4.6"},
  {n:"Banobagi",area:"Gangnam",tier:"Lifting specialist",why:"Long-established. Strong on Ultherapy + Rejuran.",r:"4.9"},
  {n:"Circle Clinic",area:"Cheongdam",tier:"Booster specialist",why:"Estelle (English) widely cited.",r:"4.8"},
  {n:"Renewme",area:"Seocho",tier:"Targeted care",why:"Excellent English translator. Personalized.",r:"4.3"},
];

const HOODS = [
  {area:"Seongsu",hangul:"성수",day:"Day 7",color:"#00695C",note:"All walkable. Build into the afternoon.",stores:[
    {n:"Haus Nowhere",type:"Eyewear/concept",hrs:"11-9PM",note:"Gentle Monster HQ. Tamburins + NUDAKE inside.",m:false},
    {n:"Osoi",type:"Bags",hrs:"11:30-8PM",note:"4.9 stars. Beautiful local leather bags.",m:false},
    {n:"Khiho",type:"Shoes",hrs:"11-8PM",note:"5.0 stars. Comfy Korean shoe brand.",m:false},
    {n:"Point of View",type:"Stationery",hrs:"12-8PM",note:"Three floors of curated stationery.",m:false},
    {n:"Taag",type:"Accessories",hrs:"Check ahead",note:"Customisable bag tags.",m:false},
    {n:"Marylebone",type:"Lifestyle gifts",hrs:"12-8PM",note:"Cute ceramics, mugs, keychains.",m:false},
    {n:"29cm",type:"Multi-brand",hrs:"11-8PM (no Mon)",note:"Korean multi-brand concept store.",m:false},
  ]},
  {area:"Garosu-gil",hangul:"가로수길",day:"Day 3",color:"#1565C0",note:"Day 3 afternoon. Easy before Sushi Matsumoto.",stores:[
    {n:"Monorow",type:"Clothing",hrs:"11:30-8:30PM",note:"Clean minimalist designs.",m:false},
    {n:"Kary Market",type:"Concept store",hrs:"10-9PM",note:"Multi-floor, toys, gifts, cafe.",m:false},
    {n:"Ella Boutique",type:"Preloved luxury",hrs:"12-7PM",note:"5.0 stars. Preloved Chanel, Celine, Dior.",m:false},
    {n:"Indibrand",type:"Multi-brand",hrs:"11:30-8:30PM",note:"Korean indie brands.",m:false},
    {n:"Low Classic",type:"Womens fashion",hrs:"12-8PM",note:"Elevated Korean basics.",m:false},
    {n:"Numbering Lab",type:"Jewellery",hrs:"11-8PM",note:"4.9 stars. English staff. Tax refund.",m:false},
    {n:"Tamburins",type:"Beauty",hrs:"11-9PM",note:"Gentle Monster beauty brand.",m:false},
  ]},
  {area:"Hannam / Itaewon",hangul:"한남",day:"Day 5 or 8",color:"#E65100",note:"Day 5 passes through on the way back.",stores:[
    {n:"Recto",type:"Womens designer",hrs:"11-8PM",note:"Sophisticated Korean basics.",m:false},
    {n:"Nothing Written",type:"Bags",hrs:"11-8PM (no Mon)",note:"Artisan bags and accessories.",m:false},
    {n:"Cueren",type:"Shoes",hrs:"11-9PM",note:"5.0 stars. Gorgeous leather shoes.",m:false},
    {n:"Rough Side",type:"Clothing",hrs:"12-8PM",note:"Warning: very low ceiling on entry!",m:false},
    {n:"Arcade",type:"Clothing",hrs:"Check ahead",note:"5.0 stars. Unique Korean-made designs.",m:false},
    {n:"Monoha",type:"Ceramics/clothing",hrs:"11-7:30PM",note:"Gallery + concept store.",m:false},
    {n:"Mango Many Please",type:"Womens clothing",hrs:"12-8PM",note:"Pretty store with garden.",m:false},
  ]},
  {area:"Seochon",hangul:"서촌",day:"Day 2",color:"#2E7D32",note:"5 min walk from Gyeongbokgung.",stores:[
    {n:"Theilma",type:"Clothing/shoes",hrs:"11-7:30PM",note:"5.0 stars. Elevated basics.",m:false},
    {n:"Parlour",type:"Heritage footwear",hrs:"11-8PM (no Sun)",note:"Best dress shoe store in Seoul.",m:false},
    {n:"Iluai",type:"Womens clothing",hrs:"11-8PM",note:"Beautiful clothes and garden.",m:false},
  ]},
  {area:"Hongdae",hangul:"홍대",day:"Day 6",color:"#AD1457",note:"Rihoon Mansion is the must. Closed Mon + Tue.",stores:[
    {n:"Rihoon Mansion",type:"Journals/stationery",hrs:"Wed-Sun 12-8PM",note:"Must visit. 5.0 stars. Day 6 is Friday.",m:true},
    {n:"Blue Elephant",type:"Eyewear",hrs:"11-11PM",note:"3 floors, trendy frames.",m:false},
    {n:"Gentle Monster",type:"Eyewear/art",hrs:"12-10PM",note:"Art installations + eyewear.",m:false},
  ]},
  {area:"Myeongdong",hangul:"명동",day:"Day 1",color:"#7C4D2F",note:"Hit on the first evening.",stores:[
    {n:"Nyunyu",type:"Accessories/bags",hrs:"9AM-11PM",note:"4-storey store. Bags, jewellery, snacks.",m:false},
    {n:"On The Spot",type:"Streetwear",hrs:"11-9PM",note:"Rare Nike/Adidas. Tax refund.",m:false},
  ]},
  {area:"Anguk",hangul:"안국",day:"Day 1 or 2",color:"#4527A0",note:"Steps from Bukchon and Gyeongbokgung.",stores:[
    {n:"Object",type:"Korean lifestyle",hrs:"11-8PM",note:"Must if in area. Korean souvenirs, tableware, diaries.",m:true},
  ]},
  {area:"Dongdaemun",hangul:"동대문",day:"Any evening",color:"#37474F",note:"Open till 5AM.",stores:[
    {n:"Mimiline",type:"Accessories/clothes",hrs:"11AM-5AM",note:"3 floors. Immediate tax refund.",m:false},
  ]},
];

const CHECKLIST = [
  {t:"Sushi Matsumoto, Tue May 26, 6PM (Catch Table confirmed)",u:false},
  {t:"Born and Bred, Mon Jun 1, 12PM (Catch Table confirmed)",u:false},
  {t:"Book DMZ tour (2-4 weeks ahead, JSA sells out fastest)",u:true},
  {t:"Book both hotels: Stay 1 Jongno + Stay 2 Gangnam",u:true},
  {t:"Book Changdeokgung Secret Garden timed ticket online",u:true},
  {t:"Book skincare clinic (Lienjang / Banobagi / Circle / Renewme)",u:true},
  {t:"Download Naver Map + KakaoMap",u:false},
  {t:"Get T-money card + load ~30k won cash",u:false},
  {t:"Pre-book Seoul Sky tickets online for discount",u:false},
  {t:"Schedule boosters/lasers early, save no-downtime facials for last day",u:false},
  {t:"Check passport expiry (6+ months from June 1)",u:false},
];

// ── MAP TAB ───────────────────────────────────────────────────────────────────
function MapTab() {
  const [day, setDay] = useState(1);
  const [layers, setLayers] = useState({h:false,s:false,r:false});
  const [ready, setReady] = useState(false);
  const ref = useRef(null);
  const map = useRef(null);
  const pins = useRef([]);
  const d = MAP_DAYS.find(x => x.n === day);

  useEffect(() => {
    const check = () => { if (window.L) { setReady(true); } else { setTimeout(check, 100); } };
    check();
  }, []);

  useEffect(() => {
    if (!ready || !ref.current || map.current) return;
    map.current = window.L.map(ref.current).setView([37.566, 126.978], 12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution:"© OSM"}).addTo(map.current);
    draw();
  }, [ready]);

  useEffect(() => { if (map.current) draw(); }, [day, layers]);

  function mkIcon(color, lbl, sm) {
    const w=sm?18:24, h=sm?24:32, fs=sm?7:10;
    return window.L.divIcon({className:"",iconSize:[w,h],iconAnchor:[w/2,h],popupAnchor:[0,-h],
      html:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 24 32"><path fill="${color}" stroke="white" stroke-width="1.5" d="M12 1C6 1 1 6 1 12c0 9 11 19 11 19S23 21 23 12C23 6 18 1 12 1z"/><text x="12" y="16" font-size="${fs}" text-anchor="middle" fill="white" font-family="sans-serif" font-weight="bold">${lbl}</text></svg>`});
  }

  function draw() {
    const L = window.L, m = map.current;
    if (!m || !L) return;
    pins.current.forEach(p => m.removeLayer(p)); pins.current = [];
    const bnds = [];
    d.places.forEach((p,i) => {
      const mk = L.marker([p.lat,p.lng],{icon:mkIcon(d.color,i+1,false)}).addTo(m).bindPopup(`<b>${p.name}</b><br><small>${p.note}</small>`);
      pins.current.push(mk); bnds.push([p.lat,p.lng]);
    });
    if (layers.h) HOTELS.forEach(h => { pins.current.push(L.marker([h.lat,h.lng],{icon:mkIcon("#B8860B","H",true)}).addTo(m).bindPopup(`<b>${h.name}</b>`)); });
    if (layers.s) SHOPS.forEach(s => { pins.current.push(L.marker([s.lat,s.lng],{icon:mkIcon(s.m?"#7B1FA2":"#E91E8C","S",true)}).addTo(m).bindPopup(`<b>${s.n}</b>`)); });
    if (layers.r) RESTS.forEach(r => { pins.current.push(L.marker([r.lat,r.lng],{icon:mkIcon(r.r?"#C62828":"#EF6C00","R",true)}).addTo(m).bindPopup(`<b>${r.n}</b>`)); });
    if (bnds.length) try { m.fitBounds(bnds,{padding:[50,50],maxZoom:14}); } catch(e) {}
  }

  const tog = k => setLayers(l => ({...l,[k]:!l[k]}));
  const TBtn = ({k,color,lbl}) => (
    <button onClick={() => tog(k)} style={{padding:"5px 10px",borderRadius:2,border:`1px solid ${layers[k]?color:"rgba(0,0,0,0.15)"}`,background:layers[k]?color:"transparent",color:layers[k]?"#fff":MUTED,fontFamily:"monospace",fontSize:10,cursor:"pointer"}}>
      {lbl}
    </button>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 44px)"}}>
      <div style={{background:BG,borderBottom:"1px solid rgba(0,0,0,0.1)",display:"flex",gap:2,padding:"5px 6px",overflowX:"auto",flexShrink:0}}>
        {MAP_DAYS.map(x => (
          <button key={x.n} onClick={() => setDay(x.n)} style={{flexShrink:0,padding:"4px 8px",border:`1px solid ${day===x.n?x.color:"rgba(0,0,0,0.12)"}`,background:day===x.n?x.color:"transparent",color:day===x.n?"#fff":DARK,cursor:"pointer",borderRadius:2,fontFamily:"monospace",fontSize:9,textTransform:"uppercase"}}>
            D{x.n}
          </button>
        ))}
        <div style={{display:"flex",gap:3,alignItems:"center",marginLeft:6,paddingLeft:6,borderLeft:"1px solid rgba(0,0,0,0.1)",flexShrink:0}}>
          <TBtn k="h" color="#B8860B" lbl="Hotels"/>
          <TBtn k="s" color="#E91E8C" lbl="Shops"/>
          <TBtn k="r" color="#EF6C00" lbl="Restaurants"/>
        </div>
      </div>
      {!ready && <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",fontStyle:"italic",color:MUTED}}>Loading map...</div>}
      <div ref={ref} style={{flex:1,display:ready?"block":"none"}}/>
      <div style={{background:BG,borderTop:"1px solid rgba(0,0,0,0.1)",display:"flex",gap:6,padding:"7px 8px",overflowX:"auto",flexShrink:0}}>
        {d.places.map((p,i) => (
          <div key={i} style={{flexShrink:0,minWidth:150,padding:8,border:"1px solid rgba(0,0,0,0.1)",background:"rgba(255,255,255,0.5)",borderRadius:2}}>
            <div style={{display:"flex",gap:6}}>
              <div style={{flexShrink:0,width:18,height:18,borderRadius:"50%",background:d.color,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:"bold"}}>{i+1}</div>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:12,lineHeight:1.3}}>{p.name}</div>
                <div style={{fontSize:10,color:MUTED,marginTop:2,lineHeight:1.3}}>{p.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ITINERARY TAB ─────────────────────────────────────────────────────────────
const ROMANS = ["I","II","III","IV","V","VI","VII","VIII","IX"];

function ItineraryTab() {
  const [day, setDay] = useState(1);
  const d = DAYS_DATA.find(x => x.n === day);
  return (
    <div style={C.page}>
      <div style={{fontFamily:"Georgia,serif",fontSize:"clamp(28px,5vw,48px)",letterSpacing:"-0.01em",marginBottom:24}}>
        Seoul. <span style={{fontStyle:"italic",color:MUTED,fontSize:"clamp(16px,2.5vw,24px)"}}>nine days</span>
      </div>
      <div style={{display:"flex",gap:2,overflowX:"auto",marginBottom:24,paddingBottom:4}}>
        {DAYS_DATA.map(x => (
          <button key={x.n} onClick={() => setDay(x.n)} style={{flexShrink:0,padding:"6px 10px",border:`1px solid ${day===x.n?"#1c1917":"rgba(0,0,0,0.15)"}`,background:day===x.n?"#1c1917":"transparent",color:day===x.n?BG:DARK,cursor:"pointer",borderRadius:2,fontFamily:"monospace",fontSize:9,textTransform:"uppercase"}}>
            D{x.n}
          </button>
        ))}
      </div>
      {d && (
        <div key={d.n}>
          <div style={{display:"flex",gap:12,marginBottom:20,paddingBottom:20,borderBottom:"1px solid rgba(0,0,0,0.1)"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:64,fontStyle:"italic",color:"#d6d3d1",lineHeight:0.9,flexShrink:0}}>{ROMANS[d.n-1]}</span>
            <div style={{paddingTop:4}}>
              <div style={{...C.mono}}>Day {d.n}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:26,marginTop:4,letterSpacing:"-0.01em"}}>{d.title}</div>
              <div style={{...C.italic,fontSize:14,marginTop:4}}>{d.theme}</div>
            </div>
          </div>
          <div style={{...C.mono,marginBottom:10}}>Schedule</div>
          {d.sched.map((s,i) => (
            <div key={i} style={{display:"grid",gridTemplateColumns:"60px 1fr",gap:12,padding:"12px 10px",borderBottom:i<d.sched.length-1?"1px solid rgba(0,0,0,0.07)":"none",background:s.opt?"rgba(184,134,11,0.05)":s.res?"rgba(0,0,0,0.02)":"transparent",borderLeft:s.opt?"3px solid #B8860B":s.res?"3px solid #1c1917":"none"}}>
              <div style={{...C.mono,fontSize:9,paddingTop:2}}>{s.t}</div>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                  <span style={{fontFamily:"Georgia,serif",fontSize:16}}>{s.p}</span>
                  {s.res && <span style={{fontFamily:"monospace",fontSize:8,background:DARK,color:"#fff",padding:"1px 5px",borderRadius:2}}>Reserved</span>}
                  {s.opt && <span style={{fontFamily:"monospace",fontSize:8,background:"#B8860B",color:"#fff",padding:"1px 5px",borderRadius:2}}>Optional</span>}
                </div>
                <div style={{fontSize:13,color:MUTED,marginTop:3,lineHeight:1.5}}>{s.note}</div>
              </div>
            </div>
          ))}
          <div style={{...C.mono,marginTop:24,marginBottom:10}}>Where to eat</div>
          {d.eats.map((e,i) => (
            <div key={i} style={{background:DARK,color:BG,padding:"12px 16px",marginBottom:8,borderRadius:2}}>
              <div style={{fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.14em",color:"#a8a29e"}}>{e.t}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:18,marginTop:4}}>{e.n}</div>
              <div style={{fontSize:12,color:"#a8a29e",marginTop:5,lineHeight:1.5}}>{e.note}</div>
            </div>
          ))}
          <div style={{marginTop:20,paddingLeft:14,borderLeft:"2px solid rgba(0,0,0,0.15)"}}>
            <div style={{...C.mono,marginBottom:6}}>Pro tip</div>
            <div style={{...C.italic,fontSize:14,lineHeight:1.6}}>{d.tip}</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:36,paddingTop:16,borderTop:"1px solid rgba(0,0,0,0.1)"}}>
            <button onClick={() => setDay(v => Math.max(1,v-1))} disabled={day===1} style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",background:"none",border:"none",cursor:"pointer",color:day===1?"#d6d3d1":MUTED}}>Prev</button>
            <span style={{...C.mono}}>{day} / 9</span>
            <button onClick={() => setDay(v => Math.min(9,v+1))} disabled={day===9} style={{fontFamily:"monospace",fontSize:10,textTransform:"uppercase",background:"none",border:"none",cursor:"pointer",color:day===9?"#d6d3d1":MUTED}}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── HOTELS TAB ────────────────────────────────────────────────────────────────
function HotelsTab() {
  return (
    <div style={C.page}>
      <div style={{fontFamily:"Georgia,serif",fontSize:36,letterSpacing:"-0.01em",marginBottom:8}}>Where to stay</div>
      <div style={{...C.italic,marginBottom:24}}>Two hotels, two halves. Old Seoul first, modern Seoul second.</div>
      <div style={{padding:"12px 16px",borderLeft:"2px solid #1c1917",background:"rgba(255,255,255,0.4)",marginBottom:32,borderRadius:2}}>
        <div style={C.mono}>Move day: Thu 28 May</div>
        <p style={{fontSize:13,color:MUTED,margin:"6px 0 0",lineHeight:1.6}}>Check out of Stay One, drop bags at Stay Two en route to Eunpyeong, check in that evening.</p>
      </div>
      {STAYS.map((s,si) => (
        <div key={si} style={{marginBottom:40}}>
          <div style={{display:"flex",gap:16,paddingBottom:16,borderBottom:"1px solid rgba(0,0,0,0.1)",marginBottom:14,alignItems:"flex-end"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:56,color:"#e7e5e4",lineHeight:1}}>{s.hangul}</span>
            <div>
              <div style={C.mono}>{s.label}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:26,marginTop:4,letterSpacing:"-0.01em"}}>{s.area}</div>
              <div style={{...C.mono,fontSize:9,marginTop:4}}>{s.nights}</div>
              <div style={{...C.italic,fontSize:13,marginTop:6}}>{s.note}</div>
            </div>
          </div>
          {s.picks.map((h,i) => (
            <div key={i} style={C.card}>
              <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={C.mono}>{h.tier}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:20,marginTop:4}}>{h.name}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:18}}>{h.price}</div>
                  <div style={{fontSize:11,color:MUTED,marginTop:2}}>★ {h.rating}</div>
                </div>
              </div>
              <p style={{fontSize:13,color:MUTED,marginTop:10,marginBottom:4,lineHeight:1.6}}>{h.why}</p>
              <div style={C.italic}>{h.forWho}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── FOOD TAB ──────────────────────────────────────────────────────────────────
function FoodTab() {
  return (
    <div style={C.page}>
      <div style={{fontFamily:"Georgia,serif",fontSize:36,letterSpacing:"-0.01em",marginBottom:8}}>Restaurants</div>
      <div style={{...C.italic,marginBottom:40}}>Every price point covered.</div>
      {RESTAURANTS.map((c,ci) => (
        <div key={ci} style={{marginBottom:40}}>
          <div style={{display:"flex",gap:14,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,0.1)",marginBottom:10,alignItems:"flex-end"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:44,color:"#e7e5e4",lineHeight:1}}>{c.hangul}</span>
            <span style={{fontFamily:"Georgia,serif",fontSize:24,letterSpacing:"-0.01em"}}>{c.cat}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:1,background:"rgba(0,0,0,0.08)"}}>
            {c.items.map((r,i) => (
              <div key={i} style={{background:BG,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={C.mono}>0{i+1}</span>
                  <span style={{fontFamily:"monospace",fontSize:11,color:DARK}}>{r.price}</span>
                </div>
                <div style={{fontFamily:"Georgia,serif",fontSize:16,lineHeight:1.2}}>{r.n}</div>
                <div style={{...C.mono,fontSize:8,marginTop:4}}>{r.area}</div>
                <div style={{borderTop:"1px solid rgba(0,0,0,0.07)",marginTop:8,paddingTop:8}}>
                  <div style={{...C.italic,fontSize:13,color:DARK}}>{r.sig}</div>
                  <p style={{fontSize:12,color:MUTED,marginTop:4,lineHeight:1.5,margin:"4px 0 0"}}>{r.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── SKINCARE TAB ──────────────────────────────────────────────────────────────
function SkincareTab() {
  return (
    <div style={C.page}>
      <div style={{fontFamily:"Georgia,serif",fontSize:36,letterSpacing:"-0.01em",marginBottom:8}}>Skincare</div>
      <div style={{padding:"12px 16px",borderLeft:"2px solid #1c1917",background:"rgba(255,255,255,0.4)",marginBottom:32,borderRadius:2}}>
        <div style={C.mono}>Read first</div>
        <p style={{fontSize:13,color:MUTED,margin:"6px 0 0",lineHeight:1.6}}>Book invasive treatments at the start of the trip. Avoid alcohol and sun for 24-72 hrs after most treatments.</p>
      </div>
      {TREATMENTS.map((cat,ci) => (
        <div key={ci} style={{marginBottom:32}}>
          <div style={{display:"flex",gap:12,paddingBottom:10,borderBottom:"1px solid rgba(0,0,0,0.1)",marginBottom:10,alignItems:"flex-end"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:40,color:"#e7e5e4",lineHeight:1}}>{cat.hangul}</span>
            <span style={{fontFamily:"Georgia,serif",fontSize:22}}>{cat.type}</span>
          </div>
          {cat.items.map((t,i) => (
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 90px",gap:10,padding:"10px 12px",borderBottom:i<cat.items.length-1?"1px solid rgba(0,0,0,0.07)":"none",border:"1px solid rgba(0,0,0,0.08)",borderTop:i===0?"1px solid rgba(0,0,0,0.08)":"none",background:"rgba(255,255,255,0.3)"}}>
              <span style={{fontFamily:"Georgia,serif",fontSize:15}}>{t.n}</span>
              <div>
                <div style={C.italic}>{t.what}</div>
                <div style={{...C.mono,fontSize:8,marginTop:3}}>Downtime: {t.dt}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{...C.mono,fontSize:8}}>per session</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:13}}>{t.cost}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <div style={{fontFamily:"Georgia,serif",fontSize:26,margin:"40px 0 16px",letterSpacing:"-0.01em"}}>Four trusted clinics</div>
      {CLINICS.map((c,i) => (
        <div key={i} style={C.card}>
          <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
            <div>
              <div style={C.mono}>{c.tier}</div>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,marginTop:4}}>{c.n}</div>
              <div style={{...C.mono,fontSize:8,marginTop:3}}>{c.area}</div>
            </div>
            <span style={{fontFamily:"Georgia,serif",fontSize:18}}>★ {c.r}</span>
          </div>
          <p style={{fontSize:13,color:MUTED,marginTop:8,marginBottom:0,lineHeight:1.6}}>{c.why}</p>
        </div>
      ))}
    </div>
  );
}

// ── SHOPPING TAB ──────────────────────────────────────────────────────────────
function ShoppingTab() {
  return (
    <div style={C.page}>
      <div style={{fontFamily:"Georgia,serif",fontSize:36,letterSpacing:"-0.01em",marginBottom:8}}>Shopping</div>
      <div style={{...C.italic,marginBottom:24}}>33 stores across 8 neighbourhoods.</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:36}}>
        {HOODS.map(h => (
          <span key={h.area} onClick={() => document.getElementById("h"+h.area.replace(/\W/g,"")).scrollIntoView({behavior:"smooth"})}
            style={{...C.mono,fontSize:9,padding:"4px 9px",border:`1px solid ${h.color}`,color:h.color,cursor:"pointer",borderRadius:2}}>{h.area}</span>
        ))}
      </div>
      {HOODS.map(hood => (
        <div key={hood.area} id={"h"+hood.area.replace(/\W/g,"")} style={{marginBottom:44}}>
          <div style={{display:"flex",gap:12,paddingBottom:12,borderBottom:`2px solid ${hood.color}`,marginBottom:12,alignItems:"flex-end"}}>
            <span style={{fontFamily:"Georgia,serif",fontSize:44,color:"#e7e5e4",lineHeight:1}}>{hood.hangul}</span>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontFamily:"Georgia,serif",fontSize:22,letterSpacing:"-0.01em"}}>{hood.area}</span>
                <span style={{...C.mono,fontSize:8,background:hood.color,color:"#fff",padding:"2px 7px",borderRadius:2}}>{hood.day}</span>
              </div>
              <div style={{...C.italic,fontSize:13,marginTop:3}}>{hood.note}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:1,background:"rgba(0,0,0,0.08)"}}>
            {hood.stores.map((s,i) => (
              <div key={i} style={{background:s.m?"#1c1917":BG,padding:12}}>
                {s.m && <div style={{fontFamily:"monospace",fontSize:8,textTransform:"uppercase",letterSpacing:"0.2em",color:"#a8a29e",marginBottom:5}}>Must if in area</div>}
                <div style={{display:"flex",justifyContent:"space-between",gap:6}}>
                  <span style={{fontFamily:"Georgia,serif",fontSize:15,lineHeight:1.2,color:s.m?"#F2EBDF":DARK}}>{s.n}</span>
                  <span style={{fontFamily:"monospace",fontSize:8,color:s.m?"#a8a29e":MUTED,textAlign:"right",flexShrink:0}}>{s.hrs}</span>
                </div>
                <div style={{fontFamily:"monospace",fontSize:8,textTransform:"uppercase",letterSpacing:"0.12em",color:hood.color,marginTop:4}}>{s.type}</div>
                <p style={{fontSize:12,color:s.m?"#d6d3d1":MUTED,marginTop:6,lineHeight:1.5,margin:"6px 0 0"}}>{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── CHECKLIST TAB ─────────────────────────────────────────────────────────────
function ChecklistTab() {
  return (
    <div style={C.page}>
      <div style={{fontFamily:"Georgia,serif",fontSize:36,letterSpacing:"-0.01em",marginBottom:32}}>Checklist</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:8}}>
        {CHECKLIST.map((c,i) => (
          <div key={i} style={{padding:14,border:`1px solid ${c.u?"#1c1917":"rgba(0,0,0,0.1)"}`,background:c.u?"rgba(0,0,0,0.04)":"rgba(255,255,255,0.3)",borderRadius:2}}>
            <div style={{display:"flex",gap:10}}>
              <span style={{fontSize:16,flexShrink:0,marginTop:1}}>{c.u?"◉":"○"}</span>
              <div>
                {c.u && <div style={{...C.mono,fontSize:8,marginBottom:3,color:DARK}}>Do first</div>}
                <p style={{fontSize:13,lineHeight:1.5,margin:0}}>{c.t}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center",marginTop:60,paddingTop:32,borderTop:"1px solid rgba(0,0,0,0.08)"}}>
        <div style={{fontFamily:"Georgia,serif",fontStyle:"italic",fontSize:"clamp(14px,2vw,20px)",color:MUTED,lineHeight:1.7}}>
          "Eat where the line is, sleep where the windows open, walk until your feet ache."
        </div>
        <div style={{fontFamily:"monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.3em",color:"#a8a29e",marginTop:20}}>Built for Adis — Seoul May-June 2026</div>
        <div style={{fontFamily:"Georgia,serif",fontSize:24,color:"#d6d3d1",marginTop:8}}>서울</div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
const TABS = [
  {id:"map",    label:"Map"},
  {id:"days",   label:"Days"},
  {id:"hotels", label:"Hotels"},
  {id:"food",   label:"Food"},
  {id:"skin",   label:"Skin"},
  {id:"shop",   label:"Shop"},
  {id:"check",  label:"Check"},
];
const VIEWS = {map:MapTab, days:ItineraryTab, hotels:HotelsTab, food:FoodTab, skin:SkincareTab, shop:ShoppingTab, check:ChecklistTab};

export default function App() {
  const [tab, setTab] = useState("map");
  const View = VIEWS[tab];
  return (
    <div style={{minHeight:"100vh",background:BG,color:DARK,fontFamily:"system-ui,-apple-system,sans-serif"}}>
      <style>{`*{box-sizing:border-box;}::-webkit-scrollbar{display:none;}*{scrollbar-width:none;}`}</style>
      <nav style={{position:"sticky",top:0,zIndex:30,background:"rgba(242,235,223,0.96)",borderBottom:"1px solid rgba(0,0,0,0.1)",backdropFilter:"blur(8px)",display:"flex",overflowX:"auto"}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{flexShrink:0,padding:"12px 14px",background:"none",border:"none",borderBottom:`2px solid ${tab===t.id?"#1c1917":"transparent"}`,color:tab===t.id?"#1c1917":MUTED,fontFamily:"monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.12em",fontWeight:tab===t.id?700:400,cursor:"pointer",whiteSpace:"nowrap"}}>
            {t.label}
          </button>
        ))}
      </nav>
      <View />
    </div>
  );
}
