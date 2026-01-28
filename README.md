# Airway-Mapper
An interactive map visualizing flight routes operated by American, Delta, and United Airlines. Explore major hub networks, search specific airport connections, and analyze US air transportation patterns through real route data. Built with Leaflet.js, GeoJSON, and vanilla JavaScript.

------------------------------------------------------------------------------------------------------------------------------

# Source
This project is a modified version of [OriginalProject](https://github.com/saumiknarayanan/originalproject) by Saumik Narayanan.

I have modified the interface and added new features, while retaining the original core logic.

-------------------------------------------------------------------------------------------------------------------------------

##  Project Structure
├── data/                     
│   ├── all/
│   ├── american/
│   ├── delta/
│   ├── old/
│   ├── united/
│   ├── airpot-codes.csv      
│   ├── data_analysis.ipynb   
│   └── routes.dat            
├── leaflet/                 
│   ├── leaflet.ipynb
│   ├── map.css
│   └── map.js
├── python/                   
│   └── ipyleaflet.ipynb
├── LICENSE                  
├── README.md                
└── index.html                

--------------------------------------------------------------------------------------------------------------------------------

## Features

# Interactive Visualization

Real-time Route Display: Color-coded routes for each airline

Airline Toggle: Switch between American (red), Delta (blue), and United (yellow)

Airport Interaction: Click airports to see all connecting routes

Day/Night Mode: Optimize viewing for different lighting conditions

# Search & Analysis
Airport Search: Find routes by airport codes

Route Highlighting: Selected routes stand out with custom styling

Network Analysis: Visualize hub-and-spoke systems

Connection Mapping: See airport interconnections

# Customization
Aircraft Filtering: Narrow Body vs Wide Body routes

Visual Themes: Day and Night viewing modes

--------------------------------------------------------------------------------------------------------------------------------
