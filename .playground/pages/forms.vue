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
  description: 'Identifiers: input, textarea, select, date, checkbox, series. Company name uses if. The test field is registerFormExtraElement. Series examples cover an empty list, existing collapsed items, columns, and a nested series.',
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


/* series examples */

const contactItemFields = [
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
];

const { form: emptySeries, formTag: emptySeriesTag } = useForm({
  fields: [
    {
      key: 'contacts',
      identifier: 'series',
      label: 'Empty contacts',
      itemBase: {
        name: '',
        email: '',
      },
      itemFields: contactItemFields,
    },
  ],
});

const { form: filledSeries, formTag: filledSeriesTag } = useForm({
  target: {
    contacts: [
      {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
      },
      {
        name: 'Grace Hopper',
        email: 'grace@example.com',
      },
      {
        name: 'Linus Torvalds',
        email: 'linus@example.com',
      },
    ],
  },
  fields: [
    {
      key: 'contacts',
      identifier: 'series',
      label: 'Saved contacts',
      itemBase: {
        name: '',
        email: '',
      },
      itemFields: contactItemFields,
    },
  ],
});

const { form: columnsSeries, formTag: columnsSeriesTag } = useForm({
  target: {
    addresses: [
      {
        city: 'London',
        street: '1 King Street',
      },
      {
        city: 'Berlin',
        street: '2 Markt',
      },
      {
        city: 'Tehran',
        street: '3 Valiasr',
      },
      {
        city: 'Paris',
        street: '4 Rue de Rivoli',
      },
    ],
  },
  fields: [
    {
      key: 'addresses',
      identifier: 'series',
      label: 'Addresses',
      seriesColumns: 2,
      itemBase: {
        city: '',
        street: '',
      },
      itemFields: [
        {
          key: 'city',
          identifier: 'input',
          label: 'City',
          width: 6,
        },
        {
          key: 'street',
          identifier: 'input',
          label: 'Street',
          width: 6,
        },
      ],
    },
  ],
});

const { form: nestedSeries, formTag: nestedSeriesTag } = useForm({
  target: {
    teams: [
      {
        name: 'Design',
        members: [
          {
            name: 'Ada',
            role: 'Lead',
          },
          {
            name: 'Grace',
            role: 'Engineer',
          },
        ],
      },
      {
        name: 'Engineering',
        members: [
          {
            name: 'Linus',
            role: 'Maintainer',
          },
        ],
      },
    ],
  },
  fields: [
    {
      key: 'teams',
      identifier: 'series',
      label: 'Teams',
      itemBase: {
        name: '',
        members: [],
      },
      itemFields: [
        {
          key: 'name',
          identifier: 'input',
          label: 'Team',
        },
        {
          key: 'members',
          identifier: 'series',
          label: 'Members',
          itemBase: {
            name: '',
            role: '',
          },
          itemFields: [
            {
              key: 'name',
              identifier: 'input',
              label: 'Name',
              width: 6,
            },
            {
              key: 'role',
              identifier: 'select',
              label: 'Role',
              items: [
                'Lead',
                'Engineer',
                'Maintainer',
              ],
              width: 6,
            },
          ],
        },
      ],
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
        Identifiers: input, textarea, select, date, checkbox, series. Company name uses if. The test field is registerFormExtraElement. Series examples cover an empty list, existing collapsed items, columns, and a nested series.
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

    <div class="space-y-3">

      <div class="space-y-1">
        <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Series
        </p>
        <p class="max-w-2xl text-pretty text-sm text-toned">
          Items already in the value start collapsed. New Item and Duplicate open the new row, and the actions sit on the item header.
        </p>
      </div>

      <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">

        <un-card
          icon="lucide:list-plus"
          title="Empty list"
          subtitle="Nothing is stored yet. New Item opens the new row.">
          <client-only>
            <empty-series-tag />
          </client-only>
          <pre class="mt-3 max-h-48 overflow-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">{{ JSON.stringify(emptySeries, null, 2) }}</pre>
        </un-card>

        <un-card
          icon="lucide:list"
          title="Existing items"
          subtitle="Three contacts are already stored, so they start collapsed.">
          <client-only>
            <filled-series-tag />
          </client-only>
          <pre class="mt-3 max-h-48 overflow-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">{{ JSON.stringify(filledSeries, null, 2) }}</pre>
        </un-card>

        <un-card
          icon="lucide:layout-grid"
          title="Two columns"
          subtitle="seriesColumns is 2. The four addresses start collapsed.">
          <client-only>
            <columns-series-tag />
          </client-only>
          <pre class="mt-3 max-h-48 overflow-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">{{ JSON.stringify(columnsSeries, null, 2) }}</pre>
        </un-card>

        <un-card
          icon="lucide:layers"
          title="Nested series"
          subtitle="Teams and their members are both series, so both start collapsed.">
          <client-only>
            <nested-series-tag />
          </client-only>
          <pre class="mt-3 max-h-48 overflow-auto rounded-md bg-muted p-3 font-mono text-xs leading-relaxed">{{ JSON.stringify(nestedSeries, null, 2) }}</pre>
        </un-card>

      </div>

    </div>

  </div>
</template>
