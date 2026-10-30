<script setup>

/* responsibility */

// Shows the built-in
// confetti templates.


/* page */

definePageMeta({
  name: 'playground.effects',
});


/* seo */

useHead({
  title: 'Effects · Playground',
});

useSeoMeta({
  description: 'A template runs a built-in sequence. No template passes the object to canvas-confetti. amount overrides particles per burst.',
});


/* confetti */

function fireConfetti(args) {
  makeConfetti(args);
}

function handleConfettiParade() {
  fireConfetti({
    template: 'parade',
    duration: 1500,
    spread: 70,
    origin: {
      y: 0.6,
    },
  });
}

function handleConfettiOnTop() {
  fireConfetti({
    template: 'on-top',
  });
}

function handleConfettiOnLeft() {
  fireConfetti({
    template: 'on-left',
  });
}

function handleConfettiOnRight() {
  fireConfetti({
    template: 'on-right',
  });
}

function handleConfettiOnBottom() {
  fireConfetti({
    template: 'on-bottom',
  });
}

function handleConfettiOnFrame() {
  fireConfetti({
    template: 'on-frame',
  });
}

function handleConfettiSplitOnTop() {
  fireConfetti({
    template: 'split-on-top',
  });
}

function handleConfettiOnCurtain() {
  fireConfetti({
    template: 'on-curtain',
  });
}

function handleConfettiBurst() {
  fireConfetti({
    particleCount: 80,
    spread: 70,
    origin: {
      y: 0.65,
    },
  });
}

function handleConfettiHeavyCurtain() {
  fireConfetti({
    template: 'on-curtain',
    amount: 40,
  });
}

</script>


<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Effects
      </p>
      <p class="max-w-2xl text-pretty text-sm text-toned">
        A template runs a built-in sequence. No template passes the object to canvas-confetti. amount overrides particles per burst.
      </p>
    </div>

    <div class="relative overflow-hidden rounded-2xl ring ring-default">
      <div class="absolute inset-0 bg-gradient-to-b from-elevated via-default to-muted" />
      <div class="absolute start-1/2 top-0 size-40 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div class="relative flex min-h-44 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
        <u-icon
          name="lucide:sparkles"
          class="size-8 text-primary"
        />
        <p class="font-medium text-highlighted">
          Effects play on the viewport
        </p>
        <p class="text-sm text-muted">
          Choose a stream or a wave below
        </p>
      </div>
    </div>

    <un-card
      icon="lucide:party-popper"
      title="Streams"
      subtitle="Parade and edge cannons">
      <div class="flex flex-wrap gap-2">
        <u-button
          icon="lucide:party-popper"
          label="Parade"
          @click="handleConfettiParade()"
        />
        <u-button
          icon="lucide:arrow-down"
          label="On top"
          @click="handleConfettiOnTop()"
        />
        <u-button
          icon="lucide:arrow-right"
          label="On left"
          @click="handleConfettiOnLeft()"
        />
        <u-button
          icon="lucide:arrow-left"
          label="On right"
          @click="handleConfettiOnRight()"
        />
        <u-button
          icon="lucide:arrow-up"
          label="On bottom"
          @click="handleConfettiOnBottom()"
        />
        <u-button
          icon="lucide:sparkle"
          label="Raw burst"
          @click="handleConfettiBurst()"
        />
      </div>
    </un-card>

    <un-card
      icon="lucide:square-dashed"
      title="Waves"
      subtitle="Frame paths at a shared speed">
      <div class="flex flex-wrap gap-2">
        <u-button
          icon="lucide:square"
          label="On frame"
          @click="handleConfettiOnFrame()"
        />
        <u-button
          icon="lucide:split"
          label="Split on top"
          @click="handleConfettiSplitOnTop()"
        />
        <u-button
          icon="lucide:panels-top-left"
          label="On curtain"
          @click="handleConfettiOnCurtain()"
        />
        <u-button
          icon="lucide:flame"
          label="Heavy curtain"
          @click="handleConfettiHeavyCurtain()"
        />
      </div>
    </un-card>

  </div>
</template>
