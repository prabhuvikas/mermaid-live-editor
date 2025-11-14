// Simple icon generator using canvas
// Run with: node scripts/generate-icons.js

import fs from 'fs';
import { createCanvas } from 'canvas';

const sizes = [192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(0, 0, size, size);

  // Scale factor
  const scale = size / 512;
  ctx.scale(scale, scale);

  // Draw flowchart-style icon
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 4;

  // Top box
  roundRect(ctx, 192, 148, 128, 60, 8);

  // Connector line
  ctx.beginPath();
  ctx.moveTo(256, 208);
  ctx.lineTo(256, 248);
  ctx.stroke();

  // Arrow
  ctx.beginPath();
  ctx.moveTo(248, 243);
  ctx.lineTo(256, 253);
  ctx.lineTo(264, 243);
  ctx.closePath();
  ctx.fill();

  // Bottom left box
  roundRect(ctx, 160, 268, 90, 60, 8);

  // Bottom right box
  roundRect(ctx, 262, 268, 90, 60, 8);

  // Connector lines
  ctx.beginPath();
  ctx.moveTo(205, 208);
  ctx.lineTo(205, 268);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(307, 208);
  ctx.lineTo(307, 268);
  ctx.stroke();

  // Bottom arrows
  ctx.beginPath();
  ctx.moveTo(201, 263);
  ctx.lineTo(205, 273);
  ctx.lineTo(209, 263);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(303, 263);
  ctx.lineTo(307, 273);
  ctx.lineTo(311, 263);
  ctx.closePath();
  ctx.fill();

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icon-${size}.png`, buffer);
  console.log(`Generated icon-${size}.png`);
});

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

console.log('Icon generation complete!');
