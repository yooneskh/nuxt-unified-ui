import confetti from 'canvas-confetti';


function makeEdgeBumps() {

  const bumpsPerFullEdge = 24;
  const bumpsPerHalfEdge = bumpsPerFullEdge / 2;


  return {
    left: [
      ...makeSectionBumps({
        from: {
          x: 0.5,
          y: 0,
        },
        to: {
          x: 0,
          y: 0,
        },
        angle: 270,
        count: bumpsPerHalfEdge,
      }),
      ...makeSectionBumps({
        from: {
          x: 0,
          y: 0,
        },
        to: {
          x: 0,
          y: 1,
        },
        angle: 0,
        count: bumpsPerFullEdge,
      }),
      ...makeSectionBumps({
        from: {
          x: 0,
          y: 1,
        },
        to: {
          x: 0.5,
          y: 1,
        },
        angle: 90,
        count: bumpsPerHalfEdge,
        includeEnd: true,
      }),
    ],
    right: [
      ...makeSectionBumps({
        from: {
          x: 0.5,
          y: 0,
        },
        to: {
          x: 1,
          y: 0,
        },
        angle: 270,
        count: bumpsPerHalfEdge,
      }),
      ...makeSectionBumps({
        from: {
          x: 1,
          y: 0,
        },
        to: {
          x: 1,
          y: 1,
        },
        angle: 180,
        count: bumpsPerFullEdge,
      }),
      ...makeSectionBumps({
        from: {
          x: 1,
          y: 1,
        },
        to: {
          x: 0.5,
          y: 1,
        },
        angle: 90,
        count: bumpsPerHalfEdge,
        includeEnd: true,
      }),
    ],
  };

}

function makeSectionBumps(options: { from: { x: number, y: number; }; to: { x: number; y: number; }; angle: number; count: number; includeEnd?: boolean; }) {
  return Array.from({ length: options.count }, (_, index) => {

    const progress = options.includeEnd
      ? index / Math.max(options.count - 1, 1)
      : index / options.count;

    return {
      x: options.from.x + ((options.to.x - options.from.x) * progress),
      y: options.from.y + ((options.to.y - options.from.y) * progress),
      angle: options.angle,
    };

  });
}


export function makeConfettiParade(duration = 1000, config: confetti.Options) {

  if (import.meta.server) {
    return Promise.resolve();
  }


  const end = Date.now() + duration;

  (function frame() {

    confetti(config);

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }

  }());


  return new Promise(resolve => setTimeout(resolve, duration));

}

export function makeConfettiOnTop(duration = 1000) {
  return makeConfettiParade(duration, {
    particleCount: 7,
    angle: 270,
    origin: {
      x: 0.5,
      y: 0,
    },
  });
}

export function makeConfettiOnEdges(duration = 2000) {

  if (import.meta.server) {
    return Promise.resolve();
  }


  const { left, right } = makeEdgeBumps();
  const delay = duration / left.length;


  for (const [index, leftBump] of left.entries()) {

    setTimeout(() => {

      for (const bump of [leftBump, right[index]!]) {
        confetti({
          particleCount: 24,
          angle: bump.angle,
          spread: 50,
          startVelocity: 22,
          scalar: 0.7,
          ticks: 160,
          origin: {
            x: bump.x,
            y: bump.y,
          },
        });
      }

    }, index * delay);

  }


  return new Promise(resolve => setTimeout(resolve, duration));

}
