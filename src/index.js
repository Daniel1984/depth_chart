const defaultProps = {
  color: '#000',
  backgroundColor: '#fff',
  responsive: true,
  containerBorderColor: '#E5EAF5',
  gridBorderColor: '#E5EAF5',
  withGrid: true,
  horLinesCount: 8,
};

function priceWall(element, props = {}) {
  if (!element) {
    throw new Error('must provide id or class name of graph container element');
  }

  if (!props.title) {
    throw new Error('title must be present in props');
  }

  props = { ...defaultProps, ...props };

  const root = document.querySelector(element);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const rootStyles = window.getComputedStyle(root);

  if (props.responsive) {
    window.addEventListener('resize', update);
  }

  function drawStage() {
    ctx.strokeStyle = props.gridBorderColor;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }

  function addGrid() {
    const vertGapSize = canvas.height / props.horLinesCount;
    const lineWidth = canvas.width;
    for (let i = 1; i < props.horLinesCount; i++) {
      const y = vertGapSize * i;
      ctx.strokeStyle = props.gridBorderColor;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(lineWidth, y);
      ctx.stroke();
    }
  }

  function addTitle() {
    const fontSize = 16;
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'center';
    ctx.font = `${fontSize}px Montserrat,sans-serif`;
    ctx.fillText(props.title, canvas.width / 2, (canvas.height / props.horLinesCount) - fontSize);
    ctx.restore();
  }

  function drawCurrentPrice() {
    const gapBetweenLines = canvas.height / props.horLinesCount;
    const x = canvas.width / 2;
    const y = canvas.height - gapBetweenLines;
    ctx.lineWidth = 0.5
    ctx.strokeStyle = '#909090';
    ctx.beginPath();
    ctx.moveTo(x, gapBetweenLines);
    ctx.lineTo(x, y);
    ctx.stroke();

    const text = 'Current Price';
    const fontSize = 11;
    const textMeasurements = ctx.measureText(text);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'center';
    ctx.font = `${fontSize}px Montserrat,sans-serif`;
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(text, -textMeasurements.width, canvas.width / 2 + fontSize);
    ctx.restore();
  }

  function resizeToFit() {
    canvas.style.backgroundColor = props.backgroundColor;
    canvas.width = parseFloat(rootStyles.width);
    canvas.height = Math.min(canvas.width / 2.03, 350);
    root.appendChild(canvas);
  }

  function remove() {
    window.removeEventListener('resize', update);
    root.removeChild(canvasEl);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function update(data) {
    clearCanvas();
    resizeToFit();
    drawStage();
    addGrid();
    addTitle();
    drawCurrentPrice();
  }

  return {
    remove,
    update,
  };
}

const graph = priceWall('#rokkex-root', { title: 'ETH-BTC Market Depth' });
graph.update();

export default priceWall;
