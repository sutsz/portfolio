// ── PopDaily 搜尋結果排序優化：APP / Web 轉換率折線圖 ──────────────
// 資料來源：作品集 mockup 內的轉換率表（Mar 29 – May 2, 2021）

const pdLabels = [
  '03/29–04/04', '04/05–04/11', '04/12–04/18', '04/19–04/25', '04/26–05/02'
];
const pdApp = [88.1, 87.2, 86.8, 86.7, 85.3];
const pdWeb = [65.9, 67.2, 62.4, 61.5, 61.5];

// 「結果排序優化」上線的週次索引
const pdMarkIndex = 2;

// 畫垂直標記線 + 標籤
const pdMarkerPlugin = {
  id: 'pdMarker',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea, scales: { x } } = chart;
    const px = x.getPixelForValue(pdMarkIndex);
    if (px == null) return;

    ctx.save();
    // 虛線
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(0,0,0,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(px, chartArea.top);
    ctx.lineTo(px, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([]);

    // 標籤氣泡
    const label = '結果排序優化';
    ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    const w = ctx.measureText(label).width + 20;
    const h = 24;
    const bx = Math.min(px - w / 2, chartArea.right - w);
    const by = chartArea.top + 6;
    ctx.fillStyle = '#2C2C2C';
    ctx.beginPath();
    ctx.roundRect(bx, by, w, h, 5);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(label, bx + 10, by + h / 2 + 4);
    ctx.restore();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('pdChart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: pdLabels,
      datasets: [
        {
          label: 'APP',
          data: pdApp,
          borderColor: '#E8694A',
          backgroundColor: '#E8694A',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3
        },
        {
          label: 'Mobile Web',
          data: pdWeb,
          borderColor: '#0F7388',
          backgroundColor: '#0F7388',
          borderWidth: 2,
          pointRadius: 3,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.2,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { boxWidth: 12, font: { size: 12 }, color: '#3A3A3A' }
        },
        tooltip: {
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 11 }, color: '#888' }
        },
        y: {
          min: 50,
          max: 95,
          grid: { color: 'rgba(0,0,0,0.05)' },
          ticks: { font: { size: 11 }, color: '#888', callback: v => v + '%' }
        }
      }
    },
    plugins: [pdMarkerPlugin]
  });
});
