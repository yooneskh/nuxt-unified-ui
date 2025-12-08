<script setup>

/* base */

const counter = ref(0);


/* form */

const { form, formTag } = useForm({
  fields: [
    {
      key: 'firstName', identifier: 'text', label: 'First Name', width: 6,
    },
    {
      key: 'lastName', identifier: 'text', label: 'Last Name', width: 6,
    },
    {
      key: 'email', identifier: 'text', label: 'Email',
      type: 'email',
    },
    {
      key: 'password', identifier: 'text', label: 'Password',
      type: 'password',
    },
  ]
});


/* dialog */

async function openChoicePickerDialog() {
  await launchChoicePickerDialog({
    icon: 'lucide:package',
    title: 'Do you want to submit?',
    subtitle: 'Adminssion Process',
    text: 'Are you sure you want to submit your application?',
    startButtons: [
      {
        color: 'primary',
        icon: 'lucide:check',
        label: 'Submit',
        onClick: async () => {

          await new Promise(resolve => setTimeout(resolve, 1000));

          toastSuccess({
            icon: 'lucide:check',
            title: 'Submission Completed',
            description: 'Your submission has been completed successfully.',
          });

        }
      },
    ],
  })
}

async function openFormPickerDialog() {
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
        key: 'firstName', identifier: 'text', label: 'First Name', width: 6,
      },
      {
        key: 'lastName', identifier: 'text', label: 'Last Name', width: 6,
      },
      {
        key: 'email', identifier: 'text', label: 'Email',
        type: 'email',
      },
      {
        key: 'password', identifier: 'text', label: 'Password',
        type: 'password',
      },
    ],
    submitButton: {
      icon: 'lucide:send',
      color: 'primary',
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
  <u-app
    :tooltip="{
      delayDuration: 0,
    }">

    <un-typography
      icon="lucide:package"
      title="Unified Nuxt UI"
      subtitle="A Complete Package"
      text="A reuseable Nuxt layer which integrates Nuxt UI and some other useful libraries into your Nuxt application."
      class="text-2xl max-w-7xl mx-auto mb-6 mt-12 p-3"
    />

    <div class="grid grid-cols-3 gap-3 p-3 max-w-7xl mx-auto items-start">

      <un-card
        icon="lucide:component"
        title="Nuxt UI"
        subtitle="Component Library"
        text="Nuxt UI is a component library that provides a set of styled components for your application."
        :actions="[
          {
            label: `Counter: ${counter}`,
            onClick: () => counter++,
          },
        ]">

        <template #append>
          <div class="flex flex-col items-end gap-1">
            <div class="flex gap-1 items-center">
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
            <div class="flex gap-1 items-center">
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
        icon="lucide:message-circle"
        title="Unified Toast"
        subtitle="Toast Notifications"
        text="Toast notifications are a simple way to display messages to the user."
        :actions="[
          {
            label: 'Launch Success Toast',
            onClick: () => toastSuccess({ title: 'Success' }),
          },
          {
            actionType: 'spacer',
          },
          {
            label: 'Launch Error Toast',
            onClick: () => toastError({ title: 'Error' }),
          },
        ]"
      />

      <un-card
        icon="lucide:wrench"
        title="Radashi"
        subtitle="Utility Functions"
        text="Radashi is a library of utility functions for working with arrays, objects, and strings."
        :actions="[
          {
            label: 'See Change Case',
            onClick: () => toast({ title: `Camel case of 'a simple text' is ${radCamel('a simple text')}` }),
          },
        ]"
      />

      <un-card
        icon="lucide:text"
        title="Form"
        subtitle="Form Component"
        text="Form is a component that provides a set of styled form elements for your application.">
        <form-tag />
        <pre class="text-xs font-mono mt-3">{{ form }}</pre>
      </un-card>

      <un-card
        icon="lucide:package"
        title="Dialogs"
        subtitle="Modal Dialogs"
        text="Dialogs are a way to display modal content to the user."
        vertical-actions
        :actions="[
          {
            label: 'Launch Choice Picker Dialog',
            onClick: () => openChoicePickerDialog(),
          },
          {
            actionType: 'spacer',
          },
          {
            label: 'Launch Form Picker Dialog',
            onClick: () => openFormPickerDialog(),
          },
        ]"
      />

      <div />

      <un-card
        icon="lucide:star"
        title="Tailwinds"
        subtitle="Utility Classes"
      />

      <un-card
        icon="lucide:star"
        title="Nuxt"
        subtitle="Meta Framework"
      />

      <un-card
        icon="lucide:star"
        title="Vue"
        subtitle="Framework"
      />

    </div>
  </u-app>
</template>


<style>
  body {
    background-color: #FAFAFA;
  }
</style>
