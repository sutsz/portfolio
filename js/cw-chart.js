// ── CoolWallet 服務使用率折線圖 ──────────────────────────────
// 資料從 Figma 截圖還原，X 軸月份，Y 軸使用率 (%)

const labels = [
  '2022-08','2022-09','2022-10','2022-11','2022-12',
  '2023-01','2023-02','2023-03','2023-04','2023-05',
  '2023-06','2023-07','2023-08','2023-09','2023-10',
  '2023-11','2023-12','2024-01','2024-02','2024-03',
  '2024-04','2024-05','2024-06','2024-07','2024-08'
];

const data = [
  5.5, 5.0, 4.8, 4.5, 4.2,
  4.5, 5.0, 5.5, 6.2, 5.3,
  6.0, 7.0, 6.8, 7.0, 6.7,
  7.8, 8.0, 8.3, 8.5, 8.8,
  10.0, 9.0, 8.8, 8.5, 7.5
];

// 標注點：索引、標籤、對齊方式
const annotations = [
  { index: 3,  label: '資料建置',   align: 'right'  },
  { index: 12, label: '受眾推播系統', align: 'center' },
  { index: 24, label: '穩定幣質押',  align: 'left'   }
];

// ── 自訂 Plugin：繪製標注氣泡 ────────────────────────────────
const bubblePlugin = {
  id: 'annotationBubbles',
  afterDatasetsDraw(chart) {
    const { ctx, scales: { x, y } } = chart;
    const meta = chart.getDatasetMeta(0);

    annotations.forEach(({ index, label, align }) => {
      const point = meta.data[index];
      if (!point) return;

      const px = point.x;
      const py = point.y;

      ctx.save();
      ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      const textW = ctx.measureText(label).width;
      const padX = 10, padY = 6;
      const bW = textW + padX * 2;
      const bH = 24;
      const radius = 5;
      const offsetY = -36;        // 氣泡在點上方
      const tailH = 8;

      // 氣泡 X 位置
      let bX;
      if (align === 'left')       bX = px - bW + 16;
      else if (align === 'right') bX = px - 16;
      else                        bX = px - bW / 2;

      const bY = py + offsetY - bH / 2;

      // 背景（暗色）
      ctx.fillStyle = '#2C2C2C';
      ctx.beginPath();
      ctx.moveTo(bX + radius, bY);
      ctx.lineTo(bX + bW - radius, bY);
      ctx.quadraticCurveTo(bX + bW, bY, bX + bW, bY + radius);
      ctx.lineTo(bX + bW, bY + bH - radius);
      ctx.quadraticCurveTo(bX + bW, bY + bH, bX + bW - radius, bY + bH);
      // 小尾巴
      ctx.lineTo(px + 5, bY + bH);
      ctx.lineTo(px, bY + bH + tailH);
      ctx.lineTo(px - 5, bY + bH);
      ctx.lineTo(bX + radius, bY + bH);
      ctx.quadraticCurveTo(bX, bY + bH, bX, bY + bH - radius);
      ctx.lineTo(bX, bY + radius);
      ctx.quadraticCurveTo(bX, bY, bX + radius, bY);
      ctx.closePath();
      ctx.fill();

      // 文字
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(label, bX + padX, bY + bH / 2 + 4);
      ctx.restore();
    });
  }
};

// ── 建立圖表 ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('usageChart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor: '#E8694A',
        backgroundColor: 'rgba(232,105,74,0.08)',
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#E8694A',
        pointHoverRadius: 5,
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.4,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.parsed.y.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font: { size: 11 },
            color: '#888',
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 8
          }
        },
        y: {
          min: 0,
          max: 12,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: {
            font: { size: 11 },
            color: '#888',
            callback: v => v + '%'
          }
        }
      }
    },
    plugins: [bubblePlugin]
  });
});
