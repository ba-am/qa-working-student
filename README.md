# Screw Volume & Mass Estimator
This repository contains my solution for the Threedy QA Working Student assessment task. The solution analyzes a 3D CAD model to calculate the total volume and mass of all screws present in the assembly.

---

## TL;DR
1. Open [**Instant3Dhub**](https://hubdemo.threedy.io).
2. Load the [model](https://data-public.threedy.io/testdata/nist/NIST-MTC-Assembly-NX/nist_box.jt).
3. Paste [`src/screw-estimator.js`](src/screw‑estimator.js) into the browser console + Enter ↵.
4. Read the console summary.

**Output:**
```
▼ Screw summary
│  SHCS M4: 14 pcs
│  SHCS M6: 4 pcs
│  FHSCS M4: 4 pcs
│  Total volume: 0.0000289983 m³ 
│  Total mass: 217.487210 g 
```

---

## How it works
1. **Discover parts** – recursively collect children of the root assemblies.
2. **Filter screws** – label contains the term `*SCREW*`.
3. **Fetch volume** – request **axis-aligned bounding-box** descriptor for each screw *in parallel*.
4. **Aggregate** – group by screw type/diameter, sum volume, multiply by density (7500 kg/m³).

> ⚠️ **Note on accuracy:** ⚠️  
> This solution calculates bounding box volumes, not true geometric volumes.  
> **API Constraint:** The instant3Dhub WebVis API only provides `requestBoxDescriptor()` for volume data. True geometric volume calculation would require mesh tessellation capabilities not exposed by the API.

---

## Author
Abdelali Maddane - Threedy QA Working Student Application

*This solution was developed with assistance from AI tools for optimization and documentation.*

---

## License
MIT – use it as you like.
