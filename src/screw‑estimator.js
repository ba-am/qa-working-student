void (async () => {
  const ctx = webvis.getContext();
  const density = 7_500e3;
  const diaMap = {112: 'M4', 118: 'M4', 141: 'M6'};
  
  const assemblies = await ctx.getProperty(1, 'children');
  const allParts = (await Promise.all(assemblies.map(asm => ctx.getProperty(asm, 'children')))).flat();
  
  // Parallel fetch all labels and filter screws upfront
  const labels = await Promise.all(allParts.map(part => ctx.getProperty(part, 'label')));
  const screwIndices = labels.map((label, i) => (label || '').toUpperCase().includes('SCREW') ? i : -1)
                             .filter(i => i !== -1);
  
  if (screwIndices.length === 0) {
    console.log('No screws found');
    return;
  }

  const screwParts = screwIndices.map(i => allParts[i]);
  const screwLabels = screwIndices.map(i => labels[i].toUpperCase());
  
  // Parallel fetch all volumes
  const volumes = await Promise.all(screwParts.map(part => 
    ctx.requestBoxDescriptor([part]).then(desc => desc.descriptor.volume)
  ));
  
  // Process results
  const counts = {};
  const totalVolume = screwLabels.reduce((vol, label, i) => {
    const type = label.includes('FHSCS') ? 'FHSCS' : 'SHCS';
    const dia = diaMap[label.match(/A(\d{3})/)?.[1]] || 'Mx?';
    const key = `${type} ${dia}`;
    counts[key] = (counts[key] || 0) + 1;
    return vol + volumes[i];
  }, 0);

  console.group('Screw summary');
  Object.entries(counts).forEach(([k, n]) => console.log(`${k}: ${n} pcs`));
  console.log(`Total volume: ${totalVolume.toFixed(10)} m³`);
  console.log(`Total mass: ${(totalVolume * density).toFixed(6)} g`);
  console.groupEnd();
})();
