const defaultProps = {
  color: '#000',
  backgroundColor: '#fff',
  responsive: true,
  containerBorderColor: '#E5EAF5',
  gridBorderColor: '#E5EAF5',
  withGrid: true,
};

function priceWall(element, props = {}) {
  if (!element) {
    throw new Error('must provide id or class name of graph container element');
  }

  props = { ...defaultProps, ...props };

  const root = document.querySelector(element);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const rootStyles = window.getComputedStyle(root);

  if (props.responsive) {
    window.addEventListener('resize', resizeToFit);
  }

  resizeToFit();

  function addBorder() {
    ctx.strokeStyle = props.gridBorderColor;
    ctx.strokeRect(0, 0, canvas.width - 8, canvas.height);
  }

  function addGrid() {
    const vertGapSize = canvas.height / 6;
    const lineWidth = canvas.width;
    for (let i = 1; i < 6; i++) {
      const y = vertGapSize * i;
      ctx.strokeStyle = props.gridBorderColor;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(lineWidth, y);
      ctx.stroke();
    }
  }

  function drawCurrentPrice() {
    const x = canvas.width / 2;
    ctx.strokeStyle = '#969696';
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();

    const text = 'Current Price';
    const textMeasurements = ctx.measureText(text);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = '11px Verdana';
    ctx.save();
    ctx.translate(textMeasurements.width / 2, textMeasurements.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Current Price', -textMeasurements.width + 15, canvas.width / 2);
    ctx.restore();
  }

  function resizeToFit() {
    canvas.style.backgroundColor = props.backgroundColor;
    canvas.width = parseFloat(rootStyles.width);
    canvas.height = Math.min(canvas.width / 2.03, 350);
    root.appendChild(canvas);
    update();
  }

  function remove() {
    window.removeEventListener('resize', resizeToFit);
    root.removeChild(canvasEl);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function update(data) {
    clearCanvas();
    addGrid();
    drawCurrentPrice();
    addBorder();
  }

  return {
    remove,
    update,
  };
}

const graph = priceWall('#rokkex-root');
graph.update();

export default priceWall;
