// Helper to generate crisp KiyuHub Logo Data URL for PDF and web UI
export function getKiyuHubLogoDataUrl(width = 400, height = 160): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw Dotted Sphere on left
  const centerX = 70;
  const centerY = 80;
  ctx.fillStyle = '#0f172a'; // Dark slate/black

  // Cluster of dots in spherical perspective
  const dots = [
    { x: -35, y: -20, r: 6 },
    { x: -20, y: -35, r: 7 },
    { x: 0, y: -45, r: 8 },
    { x: 20, y: -35, r: 7 },
    { x: 35, y: -20, r: 6 },
    { x: -45, y: 0, r: 7 },
    { x: -25, y: -10, r: 10 },
    { x: 0, y: -20, r: 12 },
    { x: 25, y: -10, r: 10 },
    { x: 45, y: 0, r: 7 },
    { x: -35, y: 20, r: 8 },
    { x: -15, y: 15, r: 12 },
    { x: 10, y: 10, r: 13 },
    { x: 35, y: 20, r: 8 },
    { x: -20, y: 40, r: 9 },
    { x: 5, y: 42, r: 10 },
    { x: 25, y: 38, r: 8 },
    { x: -5, y: 60, r: 8 },
  ];

  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(centerX + dot.x, centerY + dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Vertical Divider Bar
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(140, 25, 4, 110);

  // Text: "KIYU HUB"
  ctx.font = 'bold 38px "Times New Roman", Times, serif';
  ctx.fillText('KIYU HUB', 160, 72);

  // Text: "Empowering Breakthroughs"
  ctx.font = 'italic 20px "Times New Roman", Times, serif';
  ctx.fillStyle = '#1e293b';
  ctx.fillText('Empowering Breakthroughs', 160, 102);

  return canvas.toDataURL('image/png');
}

export function getKiyuHubSmallHeaderLogoDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 60;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, 300, 60);

  // Small sphere
  const centerX = 20;
  const centerY = 30;
  ctx.fillStyle = '#0f172a';

  const dots = [
    { x: -12, y: -8, r: 2.5 },
    { x: 0, y: -15, r: 3 },
    { x: 12, y: -8, r: 2.5 },
    { x: -15, y: 0, r: 3 },
    { x: -5, y: -3, r: 4 },
    { x: 5, y: -3, r: 4.5 },
    { x: 15, y: 0, r: 3 },
    { x: -10, y: 8, r: 3.5 },
    { x: 2, y: 6, r: 4.5 },
    { x: 12, y: 8, r: 3 },
    { x: -2, y: 16, r: 3 },
  ];

  dots.forEach(dot => {
    ctx.beginPath();
    ctx.arc(centerX + dot.x, centerY + dot.y, dot.r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Divider
  ctx.fillRect(44, 10, 2, 40);

  // Text
  ctx.font = 'bold 13px "Times New Roman", Times, serif';
  ctx.fillText('KIYUHUB', 52, 28);

  ctx.font = 'italic 10px "Times New Roman", Times, serif';
  ctx.fillStyle = '#475569';
  ctx.fillText('— Empowering Breakthroughs', 115, 28);

  return canvas.toDataURL('image/png');
}
