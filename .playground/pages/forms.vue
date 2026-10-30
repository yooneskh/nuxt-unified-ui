<script setup>

/* responsibility */

// Shows a live schema form
// and its current values.


/* page */

definePageMeta({
  name: 'playground.forms',
});


/* seo */

useHead({
  title: 'Forms · Playground',
});

useSeoMeta({
  description: 'Identifiers: input, textarea, select, date, checkbox, series. Company name uses if. The test field is registerFormExtraElement.',
});


/* form */

const { form, formTag } = useForm({
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
        'Female',
        'Male',
      ],
    },
    {
      key: 'email',
      identifier: 'input',
      label: 'Email',
      type: 'email',
      hint: 'Work email preferred',
    },
    {
      key: 'password',
      identifier: 'input',
      label: 'Password',
      type: 'password',
    },
    {
      key: 'dateOfBirth',
      identifier: 'date',
      label: 'Date of Birth',
    },
    {
      key: 'notes',
      identifier: 'textarea',
      label: 'Notes',
      placeholder: 'Anything we should know?',
    },
    {
      key: 'newsletter',
      identifier: 'checkbox',
      label: 'Email me about updates',
      description: 'Optional newsletter',
    },
    {
      key: 'hasCompany',
      identifier: 'checkbox',
      label: 'Apply as a company',
    },
    {
      key: 'companyName',
      identifier: 'input',
      label: 'Company name',
      if: {
        hasCompany: true,
      },
    },
    {
      key: 'contacts',
      identifier: 'series',
      label: 'Contacts',
      seriesColumns: 1,
      itemBase: {
        name: '',
        email: '',
      },
      itemFields: [
        {
          key: 'name',
          identifier: 'input',
          label: 'Name',
          width: 6,
        },
        {
          key: 'email',
          identifier: 'input',
          label: 'Email',
          type: 'email',
          width: 6,
        },
      ],
    },
    {
      key: 'test',
      identifier: 'test',
      label: 'Registered extra element',
    },
  ],
});

</script>


<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Forms
      </p>
      <p class="max-w-2xl text-pretty text-sm text-toned">
        Identifiers: input, textarea, select, date, checkbox, series. Company name uses if. The test field is registerFormExtraElement.
      </p>
    </div>

    <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-5">

      <un-card
        icon="lucide:text"
        title="Admission form"
        subtitle="Live schema form"
        class="xl:col-span-3">
        <client-only>
          <form-tag />
        </client-only>
      </un-card>

      <div class="overflow-hidden rounded-lg ring ring-default xl:col-span-2">
        <div class="flex items-center gap-2 border-b border-default bg-elevated/70 px-3 py-2">
          <div class="size-2 rounded-full bg-error/60" />
          <div class="size-2 rounded-full bg-warning/60" />
          <div class="size-2 rounded-full bg-success/60" />
          <span class="ms-1 font-mono text-xs text-muted">
            form
          </span>
        </div>
        <pre class="max-h-[32rem] overflow-auto bg-muted p-4 font-mono text-xs leading-relaxed">{{ JSON.stringify(form, null, 2) }}</pre>
      </div>

    </div>

  </div>
</template>
