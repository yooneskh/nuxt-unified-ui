<script setup>

/* responsibility */

// Opens the playground
// and links each demo page.


/* page */

definePageMeta({
  name: 'playground.overview',
});


/* seo */

useHead({
  title: 'Overview · Playground',
});

useSeoMeta({
  description: 'Interactive demos for nuxt-unified-ui components, forms, tables, dialogs, and helpers.',
});


/* sections */

const workspaceSections = computed(() => {
  return playgroundSections.filter(item => item.name !== 'playground.overview');
});


/* toast */

function handleToastSuccess() {
  toastSuccess({
    title: 'Success',
    description: 'toastSuccess sets the check icon and success color.',
  });
}


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


/* dialog */

async function handleOpenFormPickerDialog() {
  await launchFormPickerDialog({
    icon: 'lucide:text',
    title: 'Admission Form',
    subtitle: 'Your Personal Information',
    text: 'Please fill out the form below to submit your application.',
    initialForm: {
      firstName: 'John',
    },
    fields: [
      {
        key: 'firstName',
        identifier: 'input',
        label: 'First Name',
        width: 6,
      },
      {
        key: 'lastName',
        identifier: 'input',
        label: 'Last Name',
        width: 6,
      },
      {
        key: 'gender',
        identifier: 'select',
        label: 'Gender',
        items: [
          {
            value: 'male',
            label: 'Male',
          },
          {
            value: 'female',
            label: 'Female',
          },
        ],
      },
      {
        key: 'email',
        identifier: 'input',
        label: 'Email',
        type: 'email',
      },
      {
        key: 'password',
        identifier: 'input',
        label: 'Password',
        type: 'password',
      },
      {
        key: 'profilePicture',
        identifier: 'input',
        label: 'Profile Picture',
        type: 'file',
        accept: 'image/*',
      },
      {
        key: 'dateOfBirth',
        identifier: 'date',
        label: 'Date of Birth',
      },
      {
        key: 'test',
        identifier: 'test',
        label: 'Test',
      },
    ],
    submitButton: {
      icon: 'lucide:send',
      label: 'Submit Application',
      onClick: async form => {

        await new Promise(resolve => setTimeout(resolve, 1000));

        toastSuccess({
          icon: 'lucide:check',
          title: 'Form Submitted',
          description: JSON.stringify(form, null, 2),
        });

      },
    },
  });
}

</script>


<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="relative overflow-hidden rounded-2xl ring ring-default">
      <div class="absolute inset-0 bg-gradient-to-br from-elevated via-default to-muted" />
      <div class="absolute -top-20 -end-12 size-72 rounded-full bg-primary/20 blur-3xl" />
      <div class="absolute -bottom-24 -start-16 size-64 rounded-full bg-info/15 blur-3xl" />
      <div class="relative space-y-5 p-6 sm:p-8 lg:p-10">

        <u-badge
          variant="subtle"
          icon="lucide:package"
          label="nuxt-unified-ui"
        />

        <h1 class="max-w-3xl text-pretty text-3xl font-bold tracking-tight text-highlighted sm:text-4xl lg:text-5xl">

          A playground that feels like the product

        </h1>

        <p class="max-w-2xl text-pretty text-base text-muted sm:text-lg">

          Same primitives a host app would use. Open a workspace, or try a helper from here.

        </p>

        <div class="flex flex-wrap gap-2">
          <u-button
            icon="lucide:check"
            label="Success toast"
            @click="handleToastSuccess()"
          />
          <u-button
            variant="subtle"
            icon="lucide:party-popper"
            label="Parade"
            @click="handleConfettiParade()"
          />
          <u-button
            variant="subtle"
            icon="lucide:text"
            label="Form picker"
            @click="handleOpenFormPickerDialog()"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <template v-for="item of workspaceSections" :key="item.name">
        <u-page-card
          variant="subtle"
          spotlight
          class="transition hover:ring-accented"
          :icon="item.icon"
          :title="item.label"
          :description="item.text"
          :to="{ name: item.name }"
        />
      </template>
    </div>

    <u-page-card
      variant="soft"
      icon="lucide:layers"
      title="Built on Nuxt, Vue, and Tailwind"
      description="The layer extends a Nuxt app, renders Vue, and styles with Tailwind through Nuxt UI.">
      <div class="flex flex-wrap gap-2">
        <u-button
          variant="subtle"
          icon="lucide:triangle"
          label="Nuxt"
          href="https://nuxt.com"
          target="_blank"
        />
        <u-button
          variant="subtle"
          icon="lucide:code"
          label="Vue"
          href="https://vuejs.org"
          target="_blank"
        />
        <u-button
          variant="subtle"
          icon="lucide:wind"
          label="Tailwind"
          href="https://tailwindcss.com"
          target="_blank"
        />
      </div>
    </u-page-card>

  </div>
</template>
