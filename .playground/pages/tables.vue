<script setup>

/* responsibility */

// Shows table actions,
// pagination, and sticky columns.


/* page */

definePageMeta({
  name: 'playground.tables',
});


/* seo */

useHead({
  title: 'Tables · Playground',
});

useSeoMeta({
  description: 'un-table wraps u-table with an actions column and a pagination footer. Parent owns the page of data. Slots, vIf, split, warning, separators, extraActions, and stickyActions are the rest of the surface.',
});


/* table */

const tablePeople = ref([
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'admin',
    status: 'active',
    city: 'London',
    department: 'Engineering',
    timezone: 'Europe/London',
    joined: '2024-01-12',
  },
  {
    id: 2,
    name: 'Alan Turing',
    email: 'alan@example.com',
    role: 'editor',
    status: 'active',
    city: 'Manchester',
    department: 'Research',
    timezone: 'Europe/London',
    joined: '2024-02-03',
  },
  {
    id: 3,
    name: 'Grace Hopper',
    email: 'grace@example.com',
    role: 'admin',
    status: 'invited',
    city: 'New York',
    department: 'Product',
    timezone: 'America/New_York',
    joined: '2024-03-18',
  },
  {
    id: 4,
    name: 'Katherine Johnson',
    email: 'katherine@example.com',
    role: 'viewer',
    status: 'active',
    city: 'White Sulphur Springs',
    department: 'Operations',
    timezone: 'America/New_York',
    joined: '2024-04-09',
  },
  {
    id: 5,
    name: 'Margaret Hamilton',
    email: 'margaret@example.com',
    role: 'editor',
    status: 'archived',
    city: 'Cambridge',
    department: 'Engineering',
    timezone: 'America/New_York',
    joined: '2024-05-22',
  },
  {
    id: 6,
    name: 'Donald Knuth',
    email: 'donald@example.com',
    role: 'viewer',
    status: 'active',
    city: 'Stanford',
    department: 'Research',
    timezone: 'America/Los_Angeles',
    joined: '2024-06-01',
  },
  {
    id: 7,
    name: 'Barbara Liskov',
    email: 'barbara@example.com',
    role: 'admin',
    status: 'active',
    city: 'Boston',
    department: 'Engineering',
    timezone: 'America/New_York',
    joined: '2024-06-14',
  },
  {
    id: 8,
    name: 'Edsger Dijkstra',
    email: 'edsger@example.com',
    role: 'editor',
    status: 'invited',
    city: 'Nuenen',
    department: 'Research',
    timezone: 'Europe/Amsterdam',
    joined: '2024-07-02',
  },
  {
    id: 9,
    name: 'Radia Perlman',
    email: 'radia@example.com',
    role: 'editor',
    status: 'active',
    city: 'Portsmouth',
    department: 'Infrastructure',
    timezone: 'America/New_York',
    joined: '2024-07-19',
  },
  {
    id: 10,
    name: 'Tim Berners-Lee',
    email: 'tim@example.com',
    role: 'viewer',
    status: 'active',
    city: 'London',
    department: 'Product',
    timezone: 'Europe/London',
    joined: '2024-08-08',
  },
  {
    id: 11,
    name: 'Hedy Lamarr',
    email: 'hedy@example.com',
    role: 'viewer',
    status: 'archived',
    city: 'Vienna',
    department: 'Operations',
    timezone: 'Europe/Vienna',
    joined: '2024-08-27',
  },
  {
    id: 12,
    name: 'John von Neumann',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    city: 'Budapest',
    department: 'Research',
    timezone: 'Europe/Budapest',
    joined: '2024-09-11',
  },
  {
    id: 13,
    name: 'Claude Shannon',
    email: 'claude@example.com',
    role: 'editor',
    status: 'active',
    city: 'Gaylord',
    department: 'Infrastructure',
    timezone: 'America/Detroit',
    joined: '2024-10-05',
  },
  {
    id: 14,
    name: 'Dorothy Vaughan',
    email: 'dorothy@example.com',
    role: 'admin',
    status: 'invited',
    city: 'Kansas City',
    department: 'Operations',
    timezone: 'America/Chicago',
    joined: '2024-10-28',
  },
  {
    id: 15,
    name: 'Linus Torvalds',
    email: 'linus@example.com',
    role: 'editor',
    status: 'active',
    city: 'Helsinki',
    department: 'Engineering',
    timezone: 'Europe/Helsinki',
    joined: '2024-11-16',
  },
  {
    id: 16,
    name: 'Guido van Rossum',
    email: 'guido@example.com',
    role: 'viewer',
    status: 'active',
    city: 'Haarlem',
    department: 'Engineering',
    timezone: 'Europe/Amsterdam',
    joined: '2024-12-03',
  },
  {
    id: 17,
    name: 'Brendan Eich',
    email: 'brendan@example.com',
    role: 'editor',
    status: 'archived',
    city: 'Pittsburgh',
    department: 'Product',
    timezone: 'America/New_York',
    joined: '2025-01-09',
  },
  {
    id: 18,
    name: 'Anders Hejlsberg',
    email: 'anders@example.com',
    role: 'admin',
    status: 'active',
    city: 'Copenhagen',
    department: 'Engineering',
    timezone: 'Europe/Copenhagen',
    joined: '2025-02-14',
  },
  {
    id: 19,
    name: 'Fran Allen',
    email: 'fran@example.com',
    role: 'viewer',
    status: 'active',
    city: 'Peru',
    department: 'Research',
    timezone: 'America/New_York',
    joined: '2025-03-01',
  },
  {
    id: 20,
    name: 'Ken Thompson',
    email: 'ken@example.com',
    role: 'editor',
    status: 'invited',
    city: 'New Orleans',
    department: 'Infrastructure',
    timezone: 'America/Chicago',
    joined: '2025-03-21',
  },
  {
    id: 21,
    name: 'Bjarne Stroustrup',
    email: 'bjarne@example.com',
    role: 'viewer',
    status: 'active',
    city: 'Aarhus',
    department: 'Engineering',
    timezone: 'Europe/Copenhagen',
    joined: '2025-04-08',
  },
  {
    id: 22,
    name: 'Adele Goldberg',
    email: 'adele@example.com',
    role: 'admin',
    status: 'active',
    city: 'Cleveland',
    department: 'Product',
    timezone: 'America/New_York',
    joined: '2025-05-17',
  },
  {
    id: 23,
    name: 'James Gosling',
    email: 'james@example.com',
    role: 'editor',
    status: 'active',
    city: 'Calgary',
    department: 'Engineering',
    timezone: 'America/Edmonton',
    joined: '2025-06-04',
  },
  {
    id: 24,
    name: 'Yukihiro Matsumoto',
    email: 'yukihiro@example.com',
    role: 'viewer',
    status: 'archived',
    city: 'Osaka',
    department: 'Research',
    timezone: 'Asia/Tokyo',
    joined: '2025-06-29',
  },
]);

const tableCurrentPage = ref(1);
const tableItemsPerPage = ref(10);
const isTableLoading = ref(false);

const tableColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'joined',
    header: 'Joined',
  },
];

const tableWideColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'timezone',
    header: 'Timezone',
  },
  {
    accessorKey: 'joined',
    header: 'Joined',
  },
];

const tableCompactColumns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
];

const tablePageData = computed(() => {
  const size = Number(tableItemsPerPage.value);
  const start = (Number(tableCurrentPage.value) - 1) * size;

  return tablePeople.value.slice(start, start + size);
});

const tableSubtitle = computed(() => {
  return `${tablePeople.value.length} people · page ${tableCurrentPage.value}`;
});

const tableCompactPeople = computed(() => {
  return tablePeople.value.slice(0, 4);
});

const tableActions = computed(() => {
  return [
    {
      icon: 'lucide:eye',
      tooltip: 'View',
      onClick: handleTableView,
    },
    {
      actionType: 'split',
      icon: 'lucide:download',
      tooltip: 'Export',
      onClick: handleTableCopyEmail,
      items: [
        {
          icon: 'lucide:file-text',
          label: 'Copy email',
          onSelect: handleTableCopyEmail,
        },
        {
          icon: 'lucide:archive',
          label: 'Archive',
          onSelect: handleTableArchive,
        },
      ],
    },
    {
      icon: 'lucide:mail',
      tooltip: 'Email',
      href: it => `mailto:${it.email}`,
    },
    {
      actionType: 'separator',
    },
    {
      vIf: it => it.status !== 'archived',
      color: 'error',
      icon: 'lucide:trash',
      tooltip: it => it.role === 'admin' ? 'Admins cannot be deleted' : 'Delete',
      warning: it => it.role === 'admin' ? 'Admins cannot be deleted' : undefined,
      disabled: it => it.role === 'admin',
      onClick: handleTableDelete,
    },
  ];
});

const tableExtraActions = computed(() => {
  return [
    {
      icon: 'lucide:copy',
      label: 'Copy email',
      onClick: handleTableCopyEmail,
    },
    {
      vIf: it => it.status !== 'archived',
      icon: 'lucide:archive',
      label: 'Archive',
      onClick: handleTableArchive,
    },
  ];
});


watch(
  tableItemsPerPage,
  resetTablePage,
);


function resetTablePage() {
  tableCurrentPage.value = 1;
}

function handleTableView(person) {
  toastInfo({
    title: person.name,
    description: person.email,
  });
}

async function handleTableDelete(person) {

  await new Promise(resolve => setTimeout(resolve, 600));


  tablePeople.value = tablePeople.value.filter(it => it.id !== person.id);


  const maxPage = Math.max(1, Math.ceil(tablePeople.value.length / Number(tableItemsPerPage.value)));

  if (Number(tableCurrentPage.value) > maxPage) {
    tableCurrentPage.value = maxPage;
  }


  toastSuccess({
    title: 'Deleted',
    description: person.name,
  });

}

async function handleTableCopyEmail(person) {
  await navigator.clipboard.writeText(person.email);

  toastSuccess({
    title: 'Copied',
    description: person.email,
  });
}

function handleTableArchive(person) {

  tablePeople.value = tablePeople.value.map(it => {
    if (it.id !== person.id) {
      return it;
    }
    else {
      return {
        ...it,
        status: 'archived',
      };
    }
  });


  toastWarning({
    title: 'Archived',
    description: person.name,
  });

}

async function handleTableReload() {

  isTableLoading.value = true;


  await new Promise(resolve => setTimeout(resolve, 1200));


  isTableLoading.value = false;

  toastSuccess({
    title: 'Reloaded',
    description: `${tablePeople.value.length} people`,
  });

}

</script>


<template>
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Tables
      </p>
      <p class="max-w-2xl text-pretty text-sm text-toned">
        un-table wraps u-table with an actions column and a pagination footer. Parent owns the page of data. Slots, vIf, split, warning, separators, extraActions, and stickyActions are the rest of the surface.
      </p>
    </div>

    <un-card
      icon="lucide:users"
      title="People"
      :subtitle="tableSubtitle"
      fluid-body
      :append-actions="[
        {
          icon: 'lucide:refresh-ccw',
          tooltip: 'Simulate a loading fetch',
          onClick: handleTableReload,
        },
      ]">
      <un-table
        :columns="tableColumns"
        :loading="isTableLoading"
        :data="tablePageData"
        :total-items="tablePeople.length"
        v-model:items-per-page="tableItemsPerPage"
        v-model:current-page="tableCurrentPage"
        :actions="tableActions"
        :extra-actions="tableExtraActions">

        <template #role-header>
          <div class="flex items-center gap-1">
            <span>
              Role
            </span>
            <u-tooltip text="Access level for this person">
              <u-icon
                name="lucide:info"
                class="size-3.5 text-muted"
              />
            </u-tooltip>
          </div>
        </template>

        <template #role-cell="{ row }">
          <template v-if="row.original.role === 'admin'">
            <u-badge
              variant="subtle"
              color="error"
              icon="lucide:shield"
              label="Admin"
            />
          </template>
          <template v-else-if="row.original.role === 'editor'">
            <u-badge
              variant="subtle"
              color="info"
              icon="lucide:pencil"
              label="Editor"
            />
          </template>
          <template v-else>
            <u-badge
              variant="subtle"
              icon="lucide:eye"
              label="Viewer"
            />
          </template>
        </template>

        <template #status-cell="{ row }">
          <template v-if="row.original.status === 'active'">
            <u-badge
              variant="subtle"
              color="success"
              icon="lucide:circle-check"
              label="Active"
            />
          </template>
          <template v-else-if="row.original.status === 'invited'">
            <u-badge
              variant="subtle"
              color="warning"
              icon="lucide:clock"
              label="Invited"
            />
          </template>
          <template v-else>
            <u-badge
              variant="subtle"
              icon="lucide:archive"
              label="Archived"
            />
          </template>
        </template>

        <template #joined-cell="{ row }">
          {{ formatDate(row.original.joined) }}
        </template>

      </un-table>
    </un-card>

    <div class="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">

      <un-card
        icon="lucide:list"
        title="Compact"
        subtitle="hidePagination, no row actions"
        fluid-body>
        <un-table
          :columns="tableCompactColumns"
          :data="tableCompactPeople"
          hide-pagination
        />
      </un-card>

      <un-card
        icon="lucide:ban"
        title="Empty"
        subtitle="Forwarded empty slot"
        fluid-body>
        <un-table
          :columns="tableCompactColumns"
          :data="[]"
          hide-pagination>
          <template #empty>
            <div class="flex flex-col items-center gap-2 py-8 text-center">
              <u-icon
                name="lucide:inbox"
                class="size-6 text-muted"
              />
              <p class="text-sm text-muted">
                Nothing to show. The empty slot is forwarded from u-table.
              </p>
            </div>
          </template>
        </un-table>
      </un-card>

    </div>

    <un-card
      icon="lucide:pin"
      title="Sticky actions"
      subtitle="Pin the actions column while the row scrolls sideways"
      fluid-body>
      <un-table
        :columns="tableWideColumns"
        :data="tableCompactPeople"
        hide-pagination
        sticky-actions
        :actions="tableActions"
        :extra-actions="tableExtraActions"
      />
    </un-card>

  </div>
</template>
