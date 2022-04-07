let lastX = 0, lastY = 0, group, isStuck = false, stuckX = 0, stuckY = 0;

const initCanvas = () => {
  const canvas = document.querySelector(".cursor--canvas");

  const shapeBounds = {
    width: 75,
    height: 75
  }

  paper.setup(canvas);

  const strokeColor = "rgba(255, 0, 0, 0.5)";
  const strokeWidth = 1;
  const segments = 8;
  const radius = 15;

  const noiseScale = 150; // speed
  const noiseRange = 4; // range of distortion

  const lerp = (a, b, n) => {
    return (1 - n) * a + n * b;
  };

  const polygon = new paper.Path.RegularPolygon(new paper.Point(0, 0), segments, radius);

  polygon.strokeColor = strokeColor;
  polygon.strokeWidth = strokeWidth;
  polygon.smooth();

  group = new paper.Group([polygon]);

  const noiseObjects = polygon.segments.map(() => new SimplexNoise());
  let isNoisy = false;
  let bigCoordinates = [];

  const map = (value, in_min, in_max, out_min, out_max) => {
    return (
      ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
    );
  };

  paper.view.onFrame = (event) => {
    if (isStuck) {
      lastX = lerp(lastX, stuckX, 0.2);
      lastY = lerp(lastY, stuckY, 0.2);
    } else {
      lastX = lerp(lastX, clientX, 0.2);
      lastY = lerp(lastY, clientY, 0.2);
    }
    group.position = new paper.Point(lastX, lastY);
    if (isStuck && polygon.bounds.width < shapeBounds.width) {
      polygon.scale(1.08);
    } else if (!isStuck && polygon.bounds.width > 30) {
      if (isNoisy) {
        polygon.segments.forEach((segment, i) => {
          segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
        });
        isNoisy = false;
        bigCoordinates = [];
      }
      polygon.scale(0.92);
    }

    if (isStuck && polygon.bounds.width >= shapeBounds.width) {
      isNoisy = true;

      if (bigCoordinates.length === 0) {
        polygon.segments.forEach((segment, i) => {
          bigCoordinates[i] = [segment.point.x, segment.point.y];
        });
      }

      polygon.segments.forEach((segment, i) => {

        // get new noise value
        // we divide event.count by noiseScale to get a very smooth value
        const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
        const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);

        // map the noise value to our defined range
        const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
        const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);

        // apply distortion to coordinates
        const newX = bigCoordinates[i][0] + distortionX;
        const newY = bigCoordinates[i][1] + distortionY;

        // set new (noisy) coodrindate of point
        segment.point.set(newX, newY);
      });
    }
  }
}

initCanvas();