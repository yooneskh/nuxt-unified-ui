<script setup>

/* responsibility */

// Shows toast helpers
// and picker dialogs.


/* page */

definePageMeta({
  name: 'playground.feedback',
});


/* seo */

useHead({
  title: 'Feedback · Playground',
});

useSeoMeta({
  description: 'Color helpers fix icon and color. toast() takes a full Nuxt UI payload. Dialog work belongs in button onClick handlers.',
});


/* dialog */

async function handleOpenChoicePickerDialog() {
  await launchChoicePickerDialog({
    icon: 'lucide:package',
    title: 'Do you want to submit?',
    subtitle: 'Admission Process',
    text: 'Are you sure you want to submit your application?',
    startButtons: [
      {
        icon: 'lucide:check',
        label: 'Submit',
        onClick: async () => {

          await new Promise(resolve => setTimeout(resolve, 1000));

          toastSuccess({
            icon: 'lucide:check',
            title: 'Submission Completed',
            description: 'Your submission has been completed successfully.',
          });

        },
      },
    ],
  });
}

async function handleOpenConfirmDialog() {
  await launchChoicePickerDialog({
    icon: 'lucide:trash',
    title: 'Delete this draft?',
    text: 'This cannot be undone. The default Cancel button is added for you.',
    startButtons: [
      {
        color: 'error',
        icon: 'lucide:trash',
        label: 'Delete',
        onClick: () => {
          toastSuccess({
            title: 'Draft deleted',
          });
        },
      },
    ],
  });
}

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


/* toast */

function handleToastSuccess() {
  toastSuccess({
    title: 'Success',
    description: 'toastSuccess sets the check icon and success color.',
  });
}

function handleToastWarning() {
  toastWarning({
    title: 'Warning',
    description: 'toastWarning uses a triangle icon and warning color.',
  });
}

function handleToastInfo() {
  toastInfo({
    title: 'Info',
    description: 'toastInfo is the default informational helper.',
  });
}

function handleToastError() {
  toastError({
    title: 'Error',
    description: 'toastError uses a circle-alert icon and error color.',
  });
}

function handleToastCustom() {
  toast({
    icon: 'lucide:party-popper',
    color: 'secondary',
    title: 'Custom toast',
    description: 'Use toast() when you need a full Nuxt UI toast payload.',
  });
}

</script>


<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Feedback
      </p>
      <p class="max-w-2xl text-pretty text-sm text-toned">
        Color helpers fix icon and color. toast() takes a full Nuxt UI payload. Dialog work belongs in button onClick handlers.
      </p>
    </div>

    <un-card
      icon="lucide:message-circle"
      title="Toasts"
      text="The four typed helpers, plus a custom toast() payload.">
      <div class="flex flex-wrap gap-2">
        <u-button
          color="success"
          icon="lucide:check"
          label="Success"
          @click="handleToastSuccess()"
        />
        <u-button
          color="warning"
          icon="lucide:triangle-alert"
          label="Warning"
          @click="handleToastWarning()"
        />
        <u-button
          color="info"
          icon="lucide:info"
          label="Info"
          @click="handleToastInfo()"
        />
        <u-button
          color="error"
          icon="lucide:circle-alert"
          label="Error"
          @click="handleToastError()"
        />
        <u-button
          icon="lucide:party-popper"
          label="Custom toast()"
          @click="handleToastCustom()"
        />
      </div>
    </un-card>

    <un-card
      icon="lucide:app-window"
      title="Dialogs"
      text="Choice pickers add Cancel unless you pass endButtons.">
      <div class="flex flex-wrap gap-2">
        <u-button
          icon="lucide:package"
          label="Choice picker"
          @click="handleOpenChoicePickerDialog()"
        />
        <u-button
          color="error"
          icon="lucide:trash"
          label="Confirm delete"
          @click="handleOpenConfirmDialog()"
        />
        <u-button
          icon="lucide:text"
          label="Form picker"
          @click="handleOpenFormPickerDialog()"
        />
      </div>
    </un-card>

  </div>
</template>
