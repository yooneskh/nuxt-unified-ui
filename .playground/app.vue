<script setup>

/* page */

useHead({
  title: 'Playground · Unified Nuxt UI',
});


const section = ref('overview');


const sections = [
  {
    id: 'overview',
    icon: 'lucide:layout-dashboard',
    label: 'Overview',
    text: 'What this layer gives you',
  },
  {
    id: 'components',
    icon: 'lucide:component',
    label: 'Components',
    text: 'un-card, typography, spinner',
  },
  {
    id: 'feedback',
    icon: 'lucide:message-circle',
    label: 'Feedback',
    text: 'Toasts and dialogs',
  },
  {
    id: 'forms',
    icon: 'lucide:text',
    label: 'Forms',
    text: 'Schema fields and extras',
  },
  {
    id: 'effects',
    icon: 'lucide:sparkles',
    label: 'Effects',
    text: 'makeConfetti templates',
  },
  {
    id: 'utils',
    icon: 'lucide:wrench',
    label: 'Utils',
    text: 'Radashi, dates, match, set',
  },
];


const sectionTitle = computed(() => {
  return sections.find(it => it.id === section.value)?.label ?? 'Overview';
});

const workspaceSections = computed(() => {
  return sections.slice(1);
});

const navItems = computed(() => {
  return [
    sections.map(item => {
      return {
        icon: item.icon,
        label: item.label,
        active: section.value === item.id,
        onSelect: () => openSection(item.id),
      };
    }),
  ];
});


function openSection(id) {
  section.value = id;
}


/* nuxt ui */

const counter = ref(0);


function handleCounterIncrement() {
  counter.value++;
}

function handleCounterReset() {
  counter.value = 0;
}


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


/* dialog */

async function openChoicePickerDialog() {
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

async function openConfirmDialog() {
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


/* radashi */

const radashiSample = ref('a simple text');


const radashiRows = computed(() => {
  return [
    {
      name: 'radCamel',
      value: radCamel(radashiSample.value),
    },
    {
      name: 'radDash',
      value: radDash(radashiSample.value),
    },
    {
      name: 'radSnake',
      value: radSnake(radashiSample.value),
    },
    {
      name: 'radPascal',
      value: radPascal(radashiSample.value),
    },
    {
      name: 'radTitle',
      value: radTitle(radashiSample.value),
    },
  ];
});


function handleRadashiToast() {
  toast({
    title: `Camel case of '${radashiSample.value}' is ${radCamel(radashiSample.value)}`,
  });
}


/* dates */

const dateNow = ref(Date.now());
const dateSample = '2026/08/24 17:00';


const formattedNow = computed(() => {
  return formatDate(dateNow.value);
});

const parsedSample = computed(() => {
  return parseDate(dateSample, 'YYYY/MM/DD HH:mm');
});

const formattedParsed = computed(() => {
  return formatDate(parsedSample.value);
});


function handleRefreshDate() {
  dateNow.value = Date.now();
}


/* match + set */

const matchTarget = {
  role: 'admin',
  count: 3,
};

const nestTarget = ref({});


const matchRows = computed(() => {
  return [
    {
      label: 'Truthy',
      detail: 'smartMatch(true, target)',
      result: smartMatch(true, matchTarget),
    },
    {
      label: 'Function',
      detail: 'it => it.count > 2',
      result: smartMatch(it => it.count > 2, matchTarget),
    },
    {
      label: 'Mongo match',
      detail: '{ role: \'admin\' }',
      result: smartMatch({
        role: 'admin',
      }, matchTarget),
    },
    {
      label: 'Mongo miss',
      detail: '{ role: \'user\' }',
      result: smartMatch({
        role: 'user',
      }, matchTarget),
    },
  ];
});


function handleUnsetPath() {
  unSet(nestTarget.value, 'cards[0].value', Math.round(Math.random() * 9) + 1);
}

function handleUnsetReset() {
  nestTarget.value = {};
}

</script>


<template>
  <u-app>
    <u-dashboard-group>
      <u-dashboard-sidebar
        collapsible
        :default-size="12"
        :ui="{
          header: 'h-12 px-2.5',
          body: 'gap-1 px-2 py-1.5',
        }">

        <template #header="{ collapsed }">
          <template v-if="collapsed">
            <div class="mx-auto flex size-6 items-center justify-center rounded-md bg-elevated ring ring-default">
              <u-icon
                name="lucide:package"
                class="size-3.5"
              />
            </div>
          </template>
          <template v-else>
            <div class="flex min-w-0 items-center gap-2">
              <div class="flex size-6 shrink-0 items-center justify-center rounded-md bg-elevated ring ring-default">
                <u-icon
                  name="lucide:package"
                  class="size-3.5"
                />
              </div>
              <p class="truncate text-sm font-semibold text-highlighted">
                Unified UI
              </p>
            </div>
          </template>
        </template>

        <template #default="{ collapsed }">
          <u-navigation-menu
            size="xs"
            orientation="vertical"
            :collapsed="collapsed"
            :items="navItems"
          />
        </template>

      </u-dashboard-sidebar>

      <u-dashboard-panel>
        <template #header>
          <u-dashboard-navbar :title="sectionTitle">
            <template #leading>
              <u-dashboard-sidebar-collapse />
            </template>
            <template #right>
              <u-badge
                variant="subtle"
                icon="lucide:sparkles"
                label="Layer demo"
              />
              <u-button
                variant="subtle"
                size="xs"
                icon="lucide:book-open"
                label="Nuxt UI"
                href="https://ui.nuxt.com"
                target="_blank"
              />
            </template>
          </u-dashboard-navbar>
        </template>

        <template #body>

          <template v-if="section === 'overview'">
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
                      @click="handleToastSuccess"
                    />
                    <u-button
                      variant="subtle"
                      icon="lucide:party-popper"
                      label="Parade"
                      @click="handleConfettiParade"
                    />
                    <u-button
                      variant="subtle"
                      icon="lucide:text"
                      label="Form picker"
                      @click="openFormPickerDialog"
                    />
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <template v-for="item of workspaceSections" :key="item.id">
                  <u-page-card
                    variant="subtle"
                    spotlight
                    class="cursor-pointer transition hover:ring-accented"
                    :icon="item.icon"
                    :title="item.label"
                    :description="item.text"
                    @click="openSection(item.id)"
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

          <template v-else-if="section === 'components'">
            <div class="mx-auto w-full max-w-6xl space-y-8">

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {{ sectionTitle }}
                </p>
                <p class="max-w-2xl text-pretty text-sm text-toned">
                  un-card composes u-card with typography and action rows. The append slot is free-form. subtitleActions and appendActions cover header overflow.
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

            </div>
          </template>

          <template v-else-if="section === 'feedback'">
            <div class="mx-auto w-full max-w-6xl space-y-8">

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {{ sectionTitle }}
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
                    @click="handleToastSuccess"
                  />
                  <u-button
                    color="warning"
                    icon="lucide:triangle-alert"
                    label="Warning"
                    @click="handleToastWarning"
                  />
                  <u-button
                    color="info"
                    icon="lucide:info"
                    label="Info"
                    @click="handleToastInfo"
                  />
                  <u-button
                    color="error"
                    icon="lucide:circle-alert"
                    label="Error"
                    @click="handleToastError"
                  />
                  <u-button
                    icon="lucide:party-popper"
                    label="Custom toast()"
                    @click="handleToastCustom"
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
                    @click="openChoicePickerDialog"
                  />
                  <u-button
                    color="error"
                    icon="lucide:trash"
                    label="Confirm delete"
                    @click="openConfirmDialog"
                  />
                  <u-button
                    icon="lucide:text"
                    label="Form picker"
                    @click="openFormPickerDialog"
                  />
                </div>
              </un-card>

            </div>
          </template>

          <template v-else-if="section === 'forms'">
            <div class="mx-auto w-full max-w-6xl space-y-8">

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {{ sectionTitle }}
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
                  <form-tag />
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

          <template v-else-if="section === 'effects'">
            <div class="mx-auto w-full max-w-6xl space-y-8">

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {{ sectionTitle }}
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
                    @click="handleConfettiParade"
                  />
                  <u-button
                    icon="lucide:arrow-down"
                    label="On top"
                    @click="handleConfettiOnTop"
                  />
                  <u-button
                    icon="lucide:arrow-right"
                    label="On left"
                    @click="handleConfettiOnLeft"
                  />
                  <u-button
                    icon="lucide:arrow-left"
                    label="On right"
                    @click="handleConfettiOnRight"
                  />
                  <u-button
                    icon="lucide:arrow-up"
                    label="On bottom"
                    @click="handleConfettiOnBottom"
                  />
                  <u-button
                    icon="lucide:sparkle"
                    label="Raw burst"
                    @click="handleConfettiBurst"
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
                    @click="handleConfettiOnFrame"
                  />
                  <u-button
                    icon="lucide:split"
                    label="Split on top"
                    @click="handleConfettiSplitOnTop"
                  />
                  <u-button
                    icon="lucide:panels-top-left"
                    label="On curtain"
                    @click="handleConfettiOnCurtain"
                  />
                  <u-button
                    icon="lucide:flame"
                    label="Heavy curtain"
                    @click="handleConfettiHeavyCurtain"
                  />
                </div>
              </un-card>

            </div>
          </template>

          <template v-else>
            <div class="mx-auto w-full max-w-6xl space-y-8">

              <div class="space-y-1">
                <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
                  {{ sectionTitle }}
                </p>
                <p class="max-w-2xl text-pretty text-sm text-toned">
                  Radashi is auto-imported as radXxx. Dates wrap @formkit/tempo. smartMatch accepts a boolean, function, or mongo filter. unSet writes nested paths.
                </p>
              </div>

              <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">

                <un-card
                  icon="lucide:wrench"
                  title="Radashi"
                  subtitle="radXxx auto-imports"
                  :actions="[
                    {
                      label: 'Toast camel case',
                      onClick: handleRadashiToast,
                    },
                  ]">
                  <u-input
                    placeholder="a simple text"
                    v-model="radashiSample"
                  />
                  <dl class="mt-3 divide-y divide-default overflow-hidden rounded-lg ring ring-default">
                    <template v-for="row of radashiRows" :key="row.name">
                      <div class="flex items-baseline justify-between gap-3 bg-elevated/40 px-3 py-2 text-sm">
                        <dt class="font-mono text-xs text-muted">
                          {{ row.name }}
                        </dt>
                        <dd class="font-mono text-highlighted">
                          {{ row.value }}
                        </dd>
                      </div>
                    </template>
                  </dl>
                </un-card>

                <un-card
                  icon="lucide:calendar"
                  title="Dates"
                  subtitle="formatDate and parseDate"
                  :actions="[
                    {
                      icon: 'lucide:refresh-ccw',
                      label: 'Refresh now',
                      onClick: handleRefreshDate,
                    },
                  ]">
                  <dl class="space-y-2 text-sm">
                    <div>
                      <dt class="text-xs text-muted">
                        formatDate(Date.now())
                      </dt>
                      <dd class="font-mono">
                        {{ formattedNow }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-muted">
                        parseDate('{{ dateSample }}')
                      </dt>
                      <dd class="font-mono">
                        {{ parsedSample }}
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-muted">
                        formatDate(parsed)
                      </dt>
                      <dd class="font-mono">
                        {{ formattedParsed }}
                      </dd>
                    </div>
                  </dl>
                </un-card>

                <un-card
                  icon="lucide:filter"
                  title="smartMatch"
                  subtitle="Target is { role: 'admin', count: 3 }">
                  <div class="divide-y divide-default overflow-hidden rounded-lg ring ring-default">
                    <template v-for="row of matchRows" :key="row.label">
                      <div class="flex items-center justify-between gap-3 bg-elevated/40 px-3 py-2.5">
                        <div>
                          <p class="text-sm">
                            {{ row.label }}
                          </p>
                          <p class="font-mono text-xs text-muted">
                            {{ row.detail }}
                          </p>
                        </div>
                        <template v-if="row.result">
                          <u-badge
                            variant="subtle"
                            color="success"
                            icon="lucide:check"
                            label="true"
                          />
                        </template>
                        <template v-else>
                          <u-badge
                            variant="subtle"
                            color="error"
                            icon="lucide:x"
                            label="false"
                          />
                        </template>
                      </div>
                    </template>
                  </div>
                </un-card>

                <un-card
                  icon="lucide:folder-tree"
                  title="unSet"
                  subtitle="Nested path writes"
                  :actions="[
                    {
                      icon: 'lucide:plus',
                      label: 'Set cards[0].value',
                      onClick: handleUnsetPath,
                    },
                    {
                      label: 'Reset',
                      onClick: handleUnsetReset,
                    },
                  ]">
                  <pre class="max-h-48 overflow-auto rounded-lg bg-muted p-4 font-mono text-xs leading-relaxed ring ring-default">{{ JSON.stringify(nestTarget, null, 2) }}</pre>
                </un-card>

              </div>

            </div>
          </template>

        </template>
      </u-dashboard-panel>

    </u-dashboard-group>
  </u-app>
</template>
