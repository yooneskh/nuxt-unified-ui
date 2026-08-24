import confetti from 'canvas-confetti';


type IMakeConfettiArgs = {
  template?: 'parade' | 'on-top' | 'on-left' | 'on-right' | 'on-bottom' | 'on-frame' | 'split-on-top' | 'on-curtain';
  duration?: number;
  amount?: number;
} & confetti.Options;

type IConfettiBump = {
  x: number;
  y: number;
  angle: number;
};


const bumpsPerFullEdge = 24;
const bumpsPerHalfEdge = bumpsPerFullEdge / 2;
const bumpsPerFullFrame = (bumpsPerHalfEdge * 2) + bumpsPerFullEdge;
const sequenceAmount = 6;
const sequenceDelay = 70;


function makeWaveBumps(options: { includeTop?: boolean; includeSides?: boolean; includeBottom?: boolean; }) {
  return {
    left: [
      ...(options.includeTop
        ? makeSectionBumps({
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
            includeEnd: !options.includeSides && !options.includeBottom,
          })
        : []),
      ...(options.includeSides
        ? makeSectionBumps({
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
            includeEnd: !options.includeBottom,
          })
        : []),
      ...(options.includeBottom
        ? makeSectionBumps({
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
          })
        : []),
    ],
    right: [
      ...(options.includeTop
        ? makeSectionBumps({
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
            includeEnd: !options.includeSides && !options.includeBottom,
          })
        : []),
      ...(options.includeSides
        ? makeSectionBumps({
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
            includeEnd: !options.includeBottom,
          })
        : []),
      ...(options.includeBottom
        ? makeSectionBumps({
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
          })
        : []),
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

function makeSequence(args: IMakeConfettiArgs, options: confetti.Options) {

  const duration = args.duration ?? 1000;
  const amount = args.amount ?? sequenceAmount;
  const end = Date.now() + duration;

  (function frame() {

    confetti({
      startVelocity: 22,
      scalar: 0.7,
      ...options,
      particleCount: amount,
    });

    if (Date.now() < end) {
      setTimeout(frame, sequenceDelay);
    }

  }());


  return new Promise(resolve => setTimeout(resolve, duration));

}

function makeParade(args: IMakeConfettiArgs) {
  return makeSequence(args, args);
}

function makeOnDirection(args: IMakeConfettiArgs, direction: { angle: number; x: number; y: number; }) {
  return makeSequence(args, {
    angle: direction.angle,
    origin: {
      x: direction.x,
      y: direction.y,
    },
  });
}

function makeWave(args: IMakeConfettiArgs, bumps: { left: IConfettiBump[]; right: IConfettiBump[]; }) {

  const duration = args.duration ?? 2000;
  const amount = args.amount ?? 24;
  const delay = duration / bumpsPerFullFrame;
  const elapsed = delay * bumps.left.length;


  for (const [index, leftBump] of bumps.left.entries()) {

    setTimeout(() => {

      for (const bump of [leftBump, bumps.right[index]!]) {
        confetti({
          particleCount: amount,
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


  return new Promise(resolve => setTimeout(resolve, elapsed));

}


export function makeConfetti(args: IMakeConfettiArgs) {

  if (import.meta.server) {
    return Promise.resolve();
  }


  if (args.template === 'parade') {
    return makeParade(args);
  }
  else if (args.template === 'on-top') {
    return makeOnDirection(args, {
      angle: 270,
      x: 0.5,
      y: 0,
    });
  }
  else if (args.template === 'on-left') {
    return makeOnDirection(args, {
      angle: 0,
      x: 0,
      y: 0.5,
    });
  }
  else if (args.template === 'on-right') {
    return makeOnDirection(args, {
      angle: 180,
      x: 1,
      y: 0.5,
    });
  }
  else if (args.template === 'on-bottom') {
    return makeOnDirection(args, {
      angle: 90,
      x: 0.5,
      y: 1,
    });
  }
  else if (args.template === 'on-frame') {
    return makeWave(args, makeWaveBumps({
      includeTop: true,
      includeSides: true,
      includeBottom: true,
    }));
  }
  else if (args.template === 'split-on-top') {
    return makeWave(args, makeWaveBumps({
      includeTop: true,
    }));
  }
  else if (args.template === 'on-curtain') {
    return makeWave(args, makeWaveBumps({
      includeTop: true,
      includeSides: true,
    }));
  }
  else {
    return confetti(args);
  }

}
