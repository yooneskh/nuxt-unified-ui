<script setup>

/* responsibility */

// Shows card, typography,
// and spinner demos.


/* page */

definePageMeta({
  name: 'playground.components',
});


/* seo */

useHead({
  title: 'Components · Playground',
});

useSeoMeta({
  description: 'un-card composes u-card with typography and action rows. The append slot is free-form. subtitleActions and appendActions cover header overflow. subActions is a divided row between the header and the body. The ui prop merges classes onto header, body, and footer.',
});


/* counter */

const counter = ref(0);


function handleCounterIncrement() {
  counter.value++;
}

function handleCounterReset() {
  counter.value = 0;
}


/* actions */

function handleSubtitleAction(label) {
  toastInfo({
    title: label,
    description: 'Subtitle actions sit in the card header when the footer would overflow.',
  });
}

async function handleSlowAction() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  toastSuccess({
    title: 'Finished',
    description: 'loading-auto waited for the click handler to resolve.',
  });
}

</script>


<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Components
      </p>
      <p class="max-w-2xl text-pretty text-sm text-toned">
        un-card composes u-card with typography and action rows. The append slot is free-form. subtitleActions and appendActions cover header overflow. subActions is a divided row between the header and the body. The ui prop merges classes onto header, body, and footer.
      </p>
    </div>

    <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">

      <un-card
        icon="lucide:component"
        title="Nuxt UI"
        subtitle="Component library"
        text="Footer actions and a custom append slot. The counter is the original interactive demo."
        :actions="[
          {
            icon: 'lucide:plus',
            label: `Counter: ${counter}`,
            onClick: handleCounterIncrement,
          },
          {
            label: 'Reset',
            onClick: handleCounterReset,
          },
        ]">
        <template #append>
          <div class="flex flex-col items-end gap-1">
            <div class="flex items-center gap-1">
              <u-tooltip text="Base of the project">
                <u-button
                  variant="subtle"
                  icon="lucide:star"
                />
              </u-tooltip>
              <u-tooltip text="The underlying component library">
                <u-button
                  variant="subtle"
                  icon="lucide:info"
                />
              </u-tooltip>
              <u-button
                variant="subtle"
                icon="lucide:link"
                href="https://ui.nuxt.com"
                target="_blank"
              />
            </div>
            <div class="flex items-center gap-1">
              <u-tooltip text="Meta Framework">
                <u-button
                  variant="subtle"
                  icon="lucide:text"
                  label="Nuxt"
                  href="https://nuxt.com"
                  target="_blank"
                />
              </u-tooltip>
            </div>
          </div>
        </template>
      </un-card>

      <un-card
        icon="lucide:panel-top"
        title="Subtitle actions"
        text="Use these when the footer would overflow. Tooltips still work on each item."
        :subtitle-actions="[
          {
            label: 'Launch 1',
            tooltip: 'First header action',
            onClick: () => handleSubtitleAction('Launch 1'),
          },
          {
            label: 'Launch 2',
            onClick: () => handleSubtitleAction('Launch 2'),
          },
          {
            label: 'Launch 3',
            tooltip: 'This is the third action',
            onClick: () => handleSubtitleAction('Launch 3'),
          },
          {
            label: 'Launch 4',
            onClick: () => handleSubtitleAction('Launch 4'),
          },
          {
            label: 'Launch 5',
            onClick: () => handleSubtitleAction('Launch 5'),
          },
        ]"
      />

      <un-card
        icon="lucide:rows-3"
        title="Sub-actions"
        text="This row sits between the header and the body. Dividers show on both sides, with the same padding as the header and body."
        :sub-actions="[
          {
            variant: 'subtle',
            icon: 'lucide:pencil',
            label: 'Edit',
            tooltip: 'subActions render in the row under the header',
          },
          {
            actionType: 'spacer',
          },
          {
            variant: 'subtle',
            icon: 'lucide:copy',
            label: 'Duplicate',
          },
        ]"
      />

      <un-card
        icon="lucide:between-horizontal-start"
        title="Sub-actions slot"
        text="Pass #sub-actions when the row needs custom content instead of button props.">
        <template #sub-actions>
          <u-badge
            variant="subtle"
            icon="lucide:tag"
            label="Draft"
          />
          <span class="text-sm text-muted">
            Custom row content
          </span>
        </template>
      </un-card>

      <un-card
        icon="lucide:loader-circle"
        title="Typography and spinner"
        subtitle="Heading levels and a loader"
        text="un-typography is the header primitive. un-spinner is a spinning Lucide icon. Footer buttons can use loading-auto."
        :append-actions="[
          {
            variant: 'subtle',
            icon: 'lucide:info',
            tooltip: 'appendActions land in the typography append row',
          },
        ]"
        :actions="[
          {
            icon: 'lucide:timer',
            label: 'Slow action',
            onClick: handleSlowAction,
          },
        ]">
        <div class="flex items-center gap-2 text-sm">
          <un-spinner />
          <span>
            Waiting on something?
          </span>
        </div>
      </un-card>

    </div>

    <un-card
      icon="lucide:palette"
      title="Custom ui"
      subtitle="Slot classes merge with the defaults"
      text="header, body, and footer come from the ui prop. Body padding replaces p-3. The action row stays a row and picks up justify-end."
      :ui="{
        header: 'bg-elevated',
        body: 'p-6',
        footer: 'justify-end',
      }"
      :actions="[
        {
          icon: 'lucide:check',
          label: 'Save',
        },
        {
          variant: 'ghost',
          label: 'Cancel',
        },
      ]"
    />

  </div>
</template>
