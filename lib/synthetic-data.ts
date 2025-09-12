export interface GroundwaterStation {
  id: string
  name: string
  lat: number
  lon: number
  waterLevel: number
  status: "safe" | "warning" | "critical"
  trend: "rising" | "falling" | "stable"
  riskScore: number
}

export interface GroundwaterReading {
  timestamp: string
  stationId: string
  waterLevel: number
  temperature?: number
  rainfall?: number
  soilMoisture?: number
}

// 200 stations across India with realistic coordinates and rainfall-based low groundwater areas
const STATION_METADATA = [
  { id: "DEL001", name: "Delhi Central", lat: 28.61, lon: 77.23, baseline: 25, rainfall: 650 },
  { id: "MUM001", name: "Mumbai Coastal", lat: 19.07, lon: 72.87, baseline: 8, rainfall: 2400 },
  { id: "CHE001", name: "Chennai Port", lat: 13.08, lon: 80.27, baseline: 12, rainfall: 1400 },
  { id: "KOL001", name: "Kolkata East", lat: 22.57, lon: 88.36, baseline: 15, rainfall: 1600 },
  { id: "HYD001", name: "Hyderabad Tech", lat: 17.38, lon: 78.48, baseline: 18, rainfall: 800 },
  { id: "JAI001", name: "Jaipur Desert", lat: 26.91, lon: 75.79, baseline: 2, rainfall: 550 }, // CRITICAL
  { id: "JOD001", name: "Jodhpur Thar", lat: 26.29, lon: 73.02, baseline: 1.5, rainfall: 360 }, // CRITICAL
  { id: "BIK001", name: "Bikaner Arid", lat: 28.02, lon: 73.31, baseline: 1, rainfall: 280 }, // CRITICAL
  { id: "BAR001", name: "Barmer Desert", lat: 25.75, lon: 71.39, baseline: 0.8, rainfall: 250 }, // CRITICAL
  { id: "AMD001", name: "Ahmedabad Industrial", lat: 23.03, lon: 72.58, baseline: 2.2, rainfall: 800 }, // CRITICAL
  { id: "SUR001", name: "Surat Textile Hub", lat: 21.17, lon: 72.83, baseline: 1.8, rainfall: 1200 }, // CRITICAL
  { id: "RAJ001", name: "Rajkot Cotton Belt", lat: 22.31, lon: 70.8, baseline: 1.5, rainfall: 650 }, // CRITICAL
  { id: "MAD001", name: "Madurai Drought Zone", lat: 9.92, lon: 78.12, baseline: 2.1, rainfall: 850 }, // CRITICAL
  { id: "TIR001", name: "Tirunelveli Arid", lat: 8.73, lon: 77.69, baseline: 1.9, rainfall: 650 }, // CRITICAL
  { id: "VEL001", name: "Vellore Leather Hub", lat: 12.92, lon: 79.13, baseline: 2.3, rainfall: 900 }, // CRITICAL
  { id: "LKO001", name: "Lucknow Plains", lat: 26.84, lon: 80.94, baseline: 22, rainfall: 1000 },
  { id: "KAN001", name: "Kanpur Industrial", lat: 26.45, lon: 80.33, baseline: 18, rainfall: 800 },
  { id: "AGR001", name: "Agra Heritage", lat: 27.18, lon: 78.02, baseline: 20, rainfall: 650 },
  { id: "ALL001", name: "Allahabad Confluence", lat: 25.43, lon: 81.85, baseline: 16, rainfall: 1000 },
  { id: "VAR001", name: "Varanasi Ghats", lat: 25.32, lon: 82.97, baseline: 14, rainfall: 1100 },
  { id: "BHO001", name: "Bhopal Central", lat: 23.26, lon: 77.4, baseline: 28, rainfall: 1200 },
  { id: "IND001", name: "Indore Commercial", lat: 22.72, lon: 75.86, baseline: 25, rainfall: 950 },
  { id: "GWA001", name: "Gwalior Fort", lat: 26.22, lon: 78.18, baseline: 22, rainfall: 800 },
  { id: "JAB001", name: "Jabalpur Marble", lat: 23.16, lon: 79.95, baseline: 24, rainfall: 1350 },
  { id: "PUN001", name: "Pune IT Hub", lat: 18.52, lon: 73.85, baseline: 20, rainfall: 700 },
  { id: "NAG001", name: "Nagpur Orange City", lat: 21.15, lon: 79.09, baseline: 26, rainfall: 1200 },
  { id: "NAS001", name: "Nashik Wine Country", lat: 19.99, lon: 73.79, baseline: 18, rainfall: 550 },
  { id: "AUR001", name: "Aurangabad Caves", lat: 19.88, lon: 75.32, baseline: 22, rainfall: 750 },
  { id: "SOL001", name: "Solapur Cotton", lat: 17.68, lon: 75.91, baseline: 16, rainfall: 500 },
  { id: "BAN001", name: "Bangalore Silicon Valley", lat: 12.97, lon: 77.59, baseline: 35, rainfall: 970 },
  { id: "MYS001", name: "Mysore Palace", lat: 12.3, lon: 76.65, baseline: 28, rainfall: 800 },
  { id: "HUB001", name: "Hubli Cotton", lat: 15.36, lon: 75.12, baseline: 24, rainfall: 750 },
  { id: "MAN001", name: "Mangalore Port", lat: 12.91, lon: 74.86, baseline: 8, rainfall: 3200 },
  { id: "BEL001", name: "Belgaum Border", lat: 15.85, lon: 74.5, baseline: 20, rainfall: 1050 },
  { id: "VIJ001", name: "Vijayawada Delta", lat: 16.52, lon: 80.63, baseline: 12, rainfall: 1000 },
  { id: "VIS001", name: "Visakhapatnam Steel", lat: 17.69, lon: 83.21, baseline: 15, rainfall: 1100 },
  { id: "TIR002", name: "Tirupati Hills", lat: 13.63, lon: 79.42, baseline: 18, rainfall: 1200 },
  { id: "WAR001", name: "Warangal Textiles", lat: 17.97, lon: 79.59, baseline: 22, rainfall: 950 },
  { id: "KUR001", name: "Kurnool Cement", lat: 15.83, lon: 78.04, baseline: 19, rainfall: 550 },
  { id: "KOCH001", name: "Kochi Backwaters", lat: 9.93, lon: 76.26, baseline: 3, rainfall: 3000 },
  { id: "TRV001", name: "Thiruvananthapuram", lat: 8.52, lon: 76.94, baseline: 5, rainfall: 1800 },
  { id: "KOZ001", name: "Kozhikode Spice Coast", lat: 11.25, lon: 75.78, baseline: 4, rainfall: 2900 },
  { id: "THR001", name: "Thrissur Cultural", lat: 10.53, lon: 76.21, baseline: 6, rainfall: 2800 },
  { id: "KOT001", name: "Kottayam Rubber", lat: 9.59, lon: 76.52, baseline: 7, rainfall: 2600 },
  { id: "DUR001", name: "Durgapur Steel", lat: 23.55, lon: 87.32, baseline: 18, rainfall: 1400 },
  { id: "ASA001", name: "Asansol Coal", lat: 23.68, lon: 86.98, baseline: 16, rainfall: 1300 },
  { id: "SIL001", name: "Siliguri Corridor", lat: 26.72, lon: 88.43, baseline: 12, rainfall: 2500 },
  { id: "HAL001", name: "Haldia Petrochemical", lat: 22.06, lon: 88.06, baseline: 8, rainfall: 1600 },
  { id: "BHU001", name: "Bhubaneswar Temple", lat: 20.27, lon: 85.84, baseline: 20, rainfall: 1500 },
  { id: "CUT001", name: "Cuttack Silver City", lat: 20.46, lon: 85.88, baseline: 18, rainfall: 1450 },
  { id: "ROU001", name: "Rourkela Steel", lat: 22.26, lon: 84.85, baseline: 22, rainfall: 1600 },
  { id: "PUR001", name: "Puri Jagannath", lat: 19.8, lon: 85.83, baseline: 6, rainfall: 1400 },
  { id: "PAT001", name: "Patna Ganges", lat: 25.61, lon: 85.14, baseline: 12, rainfall: 1200 },
  { id: "GAY001", name: "Gaya Buddhist", lat: 24.75, lon: 85.0, baseline: 15, rainfall: 1100 },
  { id: "RAN001", name: "Ranchi Plateau", lat: 23.35, lon: 85.33, baseline: 25, rainfall: 1400 },
  { id: "JAM001", name: "Jamshedpur Steel", lat: 22.8, lon: 86.18, baseline: 20, rainfall: 1300 },
  { id: "DHN001", name: "Dhanbad Coal", lat: 23.8, lon: 86.43, baseline: 18, rainfall: 1250 },
  { id: "GOR001", name: "Gorakhpur Sugar", lat: 26.76, lon: 83.37, baseline: 16, rainfall: 1100 },
  { id: "BAR002", name: "Bareilly Furniture", lat: 28.36, lon: 79.43, baseline: 20, rainfall: 900 },
  { id: "ALI001", name: "Aligarh Locks", lat: 27.88, lon: 78.08, baseline: 18, rainfall: 750 },
  { id: "MEE001", name: "Meerut Sports", lat: 28.98, lon: 77.7, baseline: 22, rainfall: 700 },
  { id: "MOR001", name: "Moradabad Brass", lat: 28.84, lon: 78.78, baseline: 19, rainfall: 800 },
  { id: "AMR001", name: "Amritsar Golden Temple", lat: 31.63, lon: 74.87, baseline: 30, rainfall: 650 },
  { id: "LUD001", name: "Ludhiana Textiles", lat: 30.9, lon: 75.85, baseline: 28, rainfall: 700 },
  { id: "JAL001", name: "Jalandhar Sports", lat: 31.33, lon: 75.57, baseline: 26, rainfall: 750 },
  { id: "CHA001", name: "Chandigarh Planned", lat: 30.74, lon: 76.79, baseline: 32, rainfall: 800 },
  { id: "GUR001", name: "Gurgaon Millennium", lat: 28.46, lon: 77.03, baseline: 24, rainfall: 650 },
  { id: "FAR001", name: "Faridabad Industrial", lat: 28.41, lon: 77.31, baseline: 22, rainfall: 600 },
  { id: "HIR001", name: "Hisar Cotton", lat: 29.16, lon: 75.72, baseline: 26, rainfall: 450 },
  { id: "ROH001", name: "Rohtak Jat Land", lat: 28.89, lon: 76.61, baseline: 24, rainfall: 500 },
  { id: "SHI001", name: "Shimla Hill Station", lat: 31.1, lon: 77.17, baseline: 45, rainfall: 1500 },
  { id: "DHA001", name: "Dharamshala Dalai Lama", lat: 32.22, lon: 76.32, baseline: 50, rainfall: 2500 },
  { id: "DEH001", name: "Dehradun Valley", lat: 30.32, lon: 78.03, baseline: 40, rainfall: 2100 },
  { id: "HAR002", name: "Haridwar Ganges", lat: 29.95, lon: 78.16, baseline: 35, rainfall: 1100 },
  { id: "RIS001", name: "Rishikesh Yoga", lat: 30.09, lon: 78.27, baseline: 38, rainfall: 1200 },
  { id: "SRI001", name: "Srinagar Dal Lake", lat: 34.08, lon: 74.8, baseline: 55, rainfall: 650 },
  { id: "JAM002", name: "Jammu Tawi", lat: 32.73, lon: 74.87, baseline: 42, rainfall: 1100 },
  { id: "LEH001", name: "Leh Ladakh", lat: 34.15, lon: 77.58, baseline: 65, rainfall: 100 },
  { id: "GUW001", name: "Guwahati Brahmaputra", lat: 26.14, lon: 91.73, baseline: 8, rainfall: 1800 },
  { id: "IMP001", name: "Imphal Manipur", lat: 24.82, lon: 93.95, baseline: 12, rainfall: 1500 },
  { id: "AGA001", name: "Agartala Tripura", lat: 23.84, lon: 91.28, baseline: 10, rainfall: 2100 },
  { id: "SHI002", name: "Shillong Meghalaya", lat: 25.57, lon: 91.88, baseline: 15, rainfall: 2800 },
  { id: "AIZ001", name: "Aizawl Mizoram", lat: 23.73, lon: 92.72, baseline: 18, rainfall: 2500 },
  { id: "KOH001", name: "Kohima Nagaland", lat: 25.67, lon: 94.11, baseline: 20, rainfall: 1900 },
  { id: "ITA001", name: "Itanagar Arunachal", lat: 27.1, lon: 93.62, baseline: 25, rainfall: 2300 },
  { id: "PAN001", name: "Panaji Mandovi", lat: 15.5, lon: 73.83, baseline: 5, rainfall: 3000 },
  { id: "VAG001", name: "Vasco da Gama Port", lat: 15.4, lon: 73.81, baseline: 4, rainfall: 2800 },
  { id: "PUD001", name: "Puducherry French", lat: 11.91, lon: 79.81, baseline: 8, rainfall: 1200 },
  { id: "AND001", name: "Port Blair Andaman", lat: 11.67, lon: 92.75, baseline: 3, rainfall: 3200 },
  { id: "DAD001", name: "Daman Coastal", lat: 20.39, lon: 72.83, baseline: 6, rainfall: 2000 },
  { id: "BET001", name: "Betul Satpura", lat: 21.9, lon: 77.9, baseline: 28, rainfall: 1100 },
  { id: "SEO001", name: "Seonhar Chhattisgarh", lat: 22.09, lon: 82.15, baseline: 24, rainfall: 1300 },
  { id: "RAI001", name: "Raipur Steel", lat: 21.25, lon: 81.63, baseline: 26, rainfall: 1200 },
  { id: "BIL001", name: "Bilaspur Coal", lat: 22.08, lon: 82.15, baseline: 22, rainfall: 1250 },
  { id: "DUR002", name: "Durg Industrial", lat: 21.19, lon: 81.28, baseline: 20, rainfall: 1150 },
  { id: "KOR001", name: "Korba Power", lat: 22.35, lon: 82.75, baseline: 25, rainfall: 1300 },
  { id: "JAG001", name: "Jagdalpur Tribal", lat: 19.08, lon: 82.03, baseline: 18, rainfall: 1400 },
  { id: "RAJ002", name: "Rajnandgaon Rice", lat: 21.1, lon: 81.03, baseline: 23, rainfall: 1200 },
  { id: "KAN002", name: "Kanker Forest", lat: 20.27, lon: 81.49, baseline: 21, rainfall: 1350 },
  { id: "BAL001", name: "Balaghat Tiger", lat: 21.8, lon: 80.18, baseline: 27, rainfall: 1250 },
  { id: "UDA001", name: "Udaipur Lakes", lat: 24.57, lon: 73.69, baseline: 15, rainfall: 650 },
  { id: "AJM001", name: "Ajmer Dargah", lat: 26.45, lon: 74.64, baseline: 12, rainfall: 550 },
  { id: "KOT002", name: "Kota Education", lat: 25.21, lon: 75.83, baseline: 18, rainfall: 650 },
  { id: "BHA001", name: "Bharatpur Birds", lat: 27.22, lon: 77.49, baseline: 20, rainfall: 700 },
  { id: "ALW001", name: "Alwar Hills", lat: 27.56, lon: 76.63, baseline: 22, rainfall: 600 },
  { id: "SIK001", name: "Sikar Shekhawati", lat: 27.61, lon: 75.14, baseline: 8, rainfall: 450 },
  { id: "CHU001", name: "Churu Desert", lat: 28.3, lon: 74.97, baseline: 6, rainfall: 400 },
  { id: "HAN001", name: "Hanumangarh Border", lat: 29.58, lon: 74.32, baseline: 10, rainfall: 350 },
  { id: "GAN001", name: "Ganganagar Canal", lat: 29.92, lon: 73.88, baseline: 14, rainfall: 300 },
  { id: "JHA001", name: "Jhalawar Plateau", lat: 24.6, lon: 76.17, baseline: 16, rainfall: 800 },
  { id: "VAD001", name: "Vadodara Chemicals", lat: 22.31, lon: 73.19, baseline: 16, rainfall: 900 },
  { id: "BHA002", name: "Bharuch Narmada", lat: 21.7, lon: 72.99, baseline: 12, rainfall: 1000 },
  { id: "JUN001", name: "Junagadh Gir", lat: 21.52, lon: 70.46, baseline: 14, rainfall: 800 },
  { id: "BHA003", name: "Bhavnagar Salt", lat: 21.76, lon: 72.15, baseline: 8, rainfall: 600 },
  { id: "JAM003", name: "Jamnagar Refinery", lat: 22.47, lon: 70.07, baseline: 10, rainfall: 400 },
  { id: "MOR002", name: "Morbi Ceramics", lat: 22.82, lon: 70.84, baseline: 6, rainfall: 350 },
  { id: "GAN002", name: "Gandhinagar Capital", lat: 23.22, lon: 72.69, baseline: 18, rainfall: 800 },
  { id: "MET001", name: "Mehsana Dairy", lat: 23.59, lon: 72.38, baseline: 20, rainfall: 750 },
  { id: "PAT002", name: "Patan Heritage", lat: 23.85, lon: 72.13, baseline: 15, rainfall: 650 },
  { id: "BAN002", name: "Banaskantha Milk", lat: 24.17, lon: 72.44, baseline: 22, rainfall: 600 },
  { id: "COI001", name: "Coimbatore Textiles", lat: 11.02, lon: 76.97, baseline: 25, rainfall: 700 },
  { id: "SAL001", name: "Salem Steel", lat: 11.66, lon: 78.15, baseline: 20, rainfall: 900 },
  { id: "TIR003", name: "Tiruchirappalli Rock", lat: 10.79, lon: 78.7, baseline: 18, rainfall: 850 },
  { id: "ERO001", name: "Erode Turmeric", lat: 11.34, lon: 77.72, baseline: 22, rainfall: 750 },
  { id: "DIN001", name: "Dindigul Locks", lat: 10.36, lon: 77.98, baseline: 16, rainfall: 900 },
  { id: "THA001", name: "Thanjavur Rice Bowl", lat: 10.79, lon: 79.14, baseline: 12, rainfall: 950 },
  { id: "KUM001", name: "Kumbakonam Temples", lat: 10.96, lon: 79.38, baseline: 14, rainfall: 1000 },
  { id: "NAG002", name: "Nagapattinam Coast", lat: 10.77, lon: 79.84, baseline: 6, rainfall: 1100 },
  { id: "KAR001", name: "Karur Textiles", lat: 10.96, lon: 78.08, baseline: 18, rainfall: 800 },
  { id: "NAM001", name: "Namakkal Poultry", lat: 11.22, lon: 78.17, baseline: 20, rainfall: 850 },
  { id: "GUL001", name: "Gulbarga Cotton", lat: 17.33, lon: 76.83, baseline: 22, rainfall: 750 },
  { id: "BIJ001", name: "Bijapur Heritage", lat: 16.83, lon: 75.71, baseline: 20, rainfall: 650 },
  { id: "BAG001", name: "Bagalkot Cement", lat: 16.18, lon: 75.7, baseline: 18, rainfall: 600 },
  { id: "BID001", name: "Bidar Fort", lat: 17.91, lon: 77.52, baseline: 24, rainfall: 900 },
  { id: "RAI002", name: "Raichur Thermal", lat: 16.21, lon: 77.36, baseline: 16, rainfall: 550 },
  { id: "KOP001", name: "Koppal Mining", lat: 15.35, lon: 76.15, baseline: 14, rainfall: 500 },
  { id: "GAD001", name: "Gadag Textiles", lat: 15.43, lon: 75.63, baseline: 16, rainfall: 650 },
  { id: "HAV001", name: "Haveri Cardamom", lat: 14.8, lon: 75.4, baseline: 18, rainfall: 1200 },
  { id: "UDU001", name: "Udupi Temples", lat: 13.34, lon: 74.75, baseline: 8, rainfall: 4000 },
  { id: "CHI001", name: "Chikmagalur Coffee", lat: 13.32, lon: 75.77, baseline: 30, rainfall: 1800 },
  { id: "GUN001", name: "Guntur Chilli", lat: 16.31, lon: 80.45, baseline: 14, rainfall: 900 },
  { id: "NEL001", name: "Nellore Mica", lat: 14.44, lon: 79.99, baseline: 12, rainfall: 1000 },
  { id: "KAD001", name: "Kadapa Cement", lat: 14.47, lon: 78.82, baseline: 16, rainfall: 650 },
  { id: "ANT001", name: "Anantapur Groundnut", lat: 14.68, lon: 77.6, baseline: 8, rainfall: 550 },
  { id: "CHI002", name: "Chittoor Mango", lat: 13.22, lon: 79.1, baseline: 18, rainfall: 900 },
  { id: "ELU001", name: "Eluru Aqua", lat: 16.71, lon: 81.1, baseline: 10, rainfall: 1100 },
  { id: "KAK001", name: "Kakinada Port", lat: 16.96, lon: 82.24, baseline: 8, rainfall: 1200 },
  { id: "RAJ003", name: "Rajahmundry Godavari", lat: 17.0, lon: 81.78, baseline: 12, rainfall: 1150 },
  { id: "MAH001", name: "Mahbubnagar Cotton", lat: 16.74, lon: 77.99, baseline: 20, rainfall: 700 },
  { id: "MED001", name: "Medak Rice", lat: 18.05, lon: 78.27, baseline: 22, rainfall: 800 },
  { id: "KOL002", name: "Kolhapur Sugar", lat: 16.7, lon: 74.22, baseline: 18, rainfall: 1000 },
  { id: "SAN001", name: "Sangli Turmeric", lat: 16.85, lon: 74.56, baseline: 16, rainfall: 600 },
  { id: "SAT001", name: "Satara Strawberry", lat: 17.69, lon: 74.02, baseline: 20, rainfall: 1200 },
  { id: "AHM001", name: "Ahmednagar Sugar", lat: 19.09, lon: 74.74, baseline: 22, rainfall: 750 },
  { id: "OSM001", name: "Osmanabad Cotton", lat: 18.19, lon: 76.04, baseline: 18, rainfall: 650 },
  { id: "LAT001", name: "Latur Soybean", lat: 18.4, lon: 76.58, baseline: 20, rainfall: 750 },
  { id: "BEE001", name: "Beed Sugarcane", lat: 18.99, lon: 75.76, baseline: 16, rainfall: 700 },
  { id: "PAR001", name: "Parbhani Cotton", lat: 19.27, lon: 76.77, baseline: 24, rainfall: 900 },
  { id: "HIN001", name: "Hingoli Agriculture", lat: 19.72, lon: 77.11, baseline: 22, rainfall: 850 },
  { id: "WAR002", name: "Wardha Orange", lat: 20.74, lon: 78.6, baseline: 26, rainfall: 1100 },
  { id: "FAI001", name: "Faizabad Ayodhya", lat: 26.78, lon: 82.15, baseline: 18, rainfall: 1000 },
  { id: "BAH001", name: "Bahraich Border", lat: 27.57, lon: 81.59, baseline: 16, rainfall: 1100 },
  { id: "GON001", name: "Gonda Sugar", lat: 27.13, lon: 81.96, baseline: 14, rainfall: 1050 },
  { id: "BAL002", name: "Ballia Eastern", lat: 25.78, lon: 84.15, baseline: 12, rainfall: 1200 },
  { id: "DEO001", name: "Deoria Rice", lat: 26.5, lon: 83.78, baseline: 15, rainfall: 1150 },
  { id: "KUS001", name: "Kushinagar Buddhist", lat: 26.74, lon: 83.89, baseline: 13, rainfall: 1100 },
  { id: "MAH002", name: "Maharajganj Border", lat: 27.14, lon: 83.56, baseline: 17, rainfall: 1200 },
  { id: "SID001", name: "Siddharthnagar Buddha", lat: 27.25, lon: 83.1, baseline: 16, rainfall: 1150 },
  { id: "BAS001", name: "Basti Textile", lat: 26.8, lon: 82.3, baseline: 14, rainfall: 1050 },
  { id: "SAN002", name: "Sant Kabir Nagar", lat: 26.77, lon: 83.03, baseline: 15, rainfall: 1100 },
  { id: "AMB001", name: "Ambala Cantonment", lat: 30.38, lon: 76.78, baseline: 28, rainfall: 750 },
  { id: "KAR002", name: "Karnal Rice Bowl", lat: 29.69, lon: 76.99, baseline: 26, rainfall: 700 },
  { id: "PAN002", name: "Panipat Refinery", lat: 29.39, lon: 76.97, baseline: 24, rainfall: 650 },
  { id: "SON001", name: "Sonipat Industrial", lat: 28.99, lon: 77.02, baseline: 22, rainfall: 600 },
  { id: "JHA002", name: "Jhajjar Rural", lat: 28.61, lon: 76.66, baseline: 20, rainfall: 550 },
  { id: "REW001", name: "Rewari Heritage", lat: 28.19, lon: 76.62, baseline: 18, rainfall: 500 },
  { id: "MAH003", name: "Mahendragarh Border", lat: 28.28, lon: 76.14, baseline: 16, rainfall: 450 },
  { id: "NUH001", name: "Nuh Mewat", lat: 28.1, lon: 77.0, baseline: 14, rainfall: 400 },
  { id: "PAL001", name: "Palwal Junction", lat: 28.14, lon: 77.33, baseline: 12, rainfall: 350 },
  { id: "FAR002", name: "Faridabad Extension", lat: 28.38, lon: 77.28, baseline: 10, rainfall: 300 },
]

function generateSeasonalPattern(dayOfYear: number): number {
  const monsoonPeak = 180 // Around June-July
  const seasonal = 8 * Math.sin((2 * Math.PI * (dayOfYear - monsoonPeak)) / 365)
  return seasonal
}

function generateWaterLevel(station: (typeof STATION_METADATA)[0], daysAgo: number): number {
  const now = new Date()
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))

  const baseLevel = station.baseline

  const rainfallFactor = station.rainfall < 600 ? -0.5 : station.rainfall < 1000 ? 0 : 0.2

  const seasonal = generateSeasonalPattern(dayOfYear) * (station.rainfall / 1000)

  const declineRate = station.rainfall < 600 ? -0.005 : station.rainfall < 1000 ? -0.003 : -0.001
  const decline = declineRate * daysAgo

  const noise = (Math.random() - 0.5) * 1.5

  const droughtStress = station.rainfall < 600 ? -2 : station.rainfall < 800 ? -1 : 0

  const waterLevel = Math.max(0.1, baseLevel + seasonal + decline + noise + rainfallFactor + droughtStress)
  return Math.round(waterLevel * 100) / 100
}

export function generateStations(): GroundwaterStation[] {
  return STATION_METADATA.map((station) => {
    const currentLevel = generateWaterLevel(station, 0)
    const previousLevel = generateWaterLevel(station, 7)

    let status: "safe" | "warning" | "critical"
    if (currentLevel > 15) status = "safe"
    else if (currentLevel > 5) status = "warning"
    else status = "critical"

    let trend: "rising" | "falling" | "stable"
    const change = currentLevel - previousLevel
    if (change > 0.3) trend = "rising"
    else if (change < -0.3) trend = "falling"
    else trend = "stable"

    const riskScore = Math.max(
      0,
      Math.min(
        100,
        (1 - currentLevel / 25) * 100 +
          (trend === "falling" ? 25 : 0) +
          (station.rainfall < 600 ? 30 : station.rainfall < 1000 ? 15 : 0),
      ),
    )

    return {
      id: station.id,
      name: station.name,
      lat: station.lat,
      lon: station.lon,
      waterLevel: currentLevel,
      status,
      trend,
      riskScore: Math.round(riskScore),
    }
  })
}

export function generateHistoricalData(stationId: string, days = 365): GroundwaterReading[] {
  const station = STATION_METADATA.find((s) => s.id === stationId)
  if (!station) return []

  const readings: GroundwaterReading[] = []

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    readings.push({
      timestamp: date.toISOString(),
      stationId,
      waterLevel: generateWaterLevel(station, i),
      temperature: 20 + Math.random() * 15 + 5 * Math.sin((2 * Math.PI * i) / 365),
      rainfall: Math.max(0, Math.random() * 50 * (Math.sin((2 * Math.PI * (i - 180)) / 365) + 1)),
      soilMoisture: 30 + Math.random() * 40,
    })
  }

  return readings
}

export function generateForecast(stationId: string, days = 30): GroundwaterReading[] {
  const station = STATION_METADATA.find((s) => s.id === stationId)
  if (!station) return []

  const currentLevel = generateWaterLevel(station, 0)
  const readings: GroundwaterReading[] = []

  for (let i = 1; i <= days; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)

    const trendFactor = -0.01 * i
    const uncertainty = (Math.random() - 0.5) * 2 * Math.sqrt(i)
    const seasonal = generateSeasonalPattern(date.getDate()) * (station.rainfall / 1000)

    const forecastLevel = Math.max(0.1, currentLevel + trendFactor + uncertainty + seasonal * 0.3)

    readings.push({
      timestamp: date.toISOString(),
      stationId,
      waterLevel: Math.round(forecastLevel * 100) / 100,
      temperature: 20 + Math.random() * 15,
      rainfall: Math.max(0, Math.random() * 30),
      soilMoisture: 25 + Math.random() * 50,
    })
  }

  return readings
}

export function generateRiskAnalysis() {
  const stations = generateStations()
  const criticalStations = stations.filter((s) => s.status === "critical").length
  const warningStations = stations.filter((s) => s.status === "warning").length
  const safeStations = stations.filter((s) => s.status === "safe").length

  return {
    totalStations: stations.length,
    criticalStations,
    warningStations,
    safeStations,
    overallRisk: Math.round((criticalStations * 100 + warningStations * 50) / stations.length),
    recommendations: [
      criticalStations > 3 ? "Immediate water conservation measures needed in critical zones" : null,
      warningStations > 5 ? "Monitor warning zones closely for potential depletion" : null,
      "Implement rainwater harvesting in high-risk areas",
      "Reduce groundwater extraction during dry seasons",
    ].filter(Boolean),
  }
}

export function getResolutionSuggestions(stationId: string): string[] {
  const station = STATION_METADATA.find((s) => s.id === stationId)
  if (!station) return []

  const suggestions = []

  if (station.rainfall < 600) {
    suggestions.push("Implement rainwater harvesting systems immediately")
    suggestions.push("Construct check dams and percolation tanks")
    suggestions.push("Promote drip irrigation and water-efficient crops")
    suggestions.push("Restrict groundwater extraction during dry seasons")
  }

  if (station.rainfall < 400) {
    suggestions.push("Emergency water supply through tankers")
    suggestions.push("Desalination plants for coastal areas")
    suggestions.push("Inter-basin water transfer projects")
  }

  if (station.name.includes("Industrial") || station.name.includes("Textile") || station.name.includes("Steel")) {
    suggestions.push("Mandatory water recycling in industries")
    suggestions.push("Treat and reuse industrial wastewater")
    suggestions.push("Implement zero liquid discharge systems")
  }

  if (station.name.includes("Desert") || station.name.includes("Arid")) {
    suggestions.push("Solar-powered groundwater recharge systems")
    suggestions.push("Drought-resistant crop varieties")
    suggestions.push("Community water conservation programs")
  }

  if (station.baseline < 3) {
    suggestions.push("Immediate moratorium on new bore wells")
    suggestions.push("Artificial groundwater recharge projects")
    suggestions.push("Water-efficient urban planning")
    suggestions.push("Public awareness campaigns on water conservation")
  }

  return suggestions.slice(0, 5)
}
