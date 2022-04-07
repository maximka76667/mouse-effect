let lastX = 0, lastY = 0, group;

const initCanvas = () => {
  const canvas = document.querySelector(".cursor--canvas");
  paper.setup(canvas);

  const lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  };

  const polygon = new paper.Path.RegularPolygon(new paper.Point(0, 0), 8, 15);

  polygon.strokeColor = "rgba(255, 0, 0, 0.5)";
  polygon.strokeWidth = 1;
  polygon.smooth();

  group = new paper.Group([polygon]);

  paper.view.onFrame = (e) => {
    lastX = lerp(lastX, clientX, 0.2);
    lastY = lerp(lastY, clientY, 0.2);
    group.position = new paper.Point(lastX, lastY);
  }
}

initCanvas();