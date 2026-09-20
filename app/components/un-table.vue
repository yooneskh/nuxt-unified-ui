<script setup>

/* interface */

const props = defineProps({
  columns: Array,
  loading: Boolean,
  data: Array,
  hidePagination: Boolean,
  totalItems: Number,
  actions: Array,
  extraActions: Array,
  stickyActions: Boolean,
  ui: Object,
  meta: Object,
});


const currentPage = defineModel('currentPage', {
  type: [
    Number,
    String,
  ],
  default: '1',
});

const itemsPerPage = defineModel('itemsPerPage', {
  type: [
    Number,
    String,
  ],
  default: '25',
});


/* columns */

const hasActions = computed(() => {
  return !!props.actions?.length || !!props.extraActions?.length;
});

const fullColumns = computed(() => {
  return [
    ...(props.columns || []),
    ...(!hasActions.value ? [] : [
      {
        header: $t('un.table.actions'),
        accessorKey: 'actions',
        meta: {
          class: {
            th: 'text-end!',
          },
        },
      },
    ]),
  ];
});

const columnPinning = computed(() => {
  return {
    right: props.stickyActions ? [
      'actions',
    ] : undefined,
  };
});

const tableUi = computed(() => {
  return {
    tr: 'data-[expanded=true]:bg-elevated!',
    ...(props.ui || {}),
  };
});


/* actions */

function resolveActionValue(value, row) {
  if (typeof value === 'function') {
    return value(row.original);
  }
  else {
    return value;
  }
}

function getExtraActionItems(row) {
  return (props.extraActions || [])
    .filter(it => !it.vIf || it.vIf(row.original))
    .map(it => {
      return {
        ...radOmit(it, [
          'vIf',
          'actionType',
          'tooltip',
          'to',
          'href',
          'disabled',
          'onClick',
        ]),
        href: resolveActionValue(it.href, row),
        to: resolveActionValue(it.to, row),
        disabled: resolveActionValue(it.disabled, row),
        onClick: () => it.onClick?.(row.original),
      };
    });
}


/* pagination */

const pageSizeItems = [
  5,
  10,
  25,
  50,
  100,
];

</script>


<template>
  <div>

    <u-table
      loading-color="neutral"
      :columns="fullColumns"
      :loading="props.loading"
      :data="props.data || []"
      :column-pinning="columnPinning"
      :ui="tableUi"
      :meta="props.meta">

      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot
          :name="name"
          v-bind="slotData"
        />
      </template>

      <template v-if="hasActions" #actions-cell="{ row }">
        <div class="flex items-center justify-end gap-1">

          <template v-for="(action, index) in props.actions" :key="index">
            <template v-if="!action.vIf || action.vIf(row.original)">

              <template v-if="!action.actionType || action.actionType === 'button'">
                <u-tooltip :text="action.tooltip">
                  <u-button
                    variant="subtle"
                    v-bind="radOmit(action, [ 'actionType', 'vIf', 'tooltip', 'to', 'href', 'disabled', 'onClick' ])"
                    :to="resolveActionValue(action.to, row)"
                    :href="resolveActionValue(action.href, row)"
                    :disabled="resolveActionValue(action.disabled, row)"
                    loading-auto
                    @click="action.onClick?.(row.original)"
                  />
                </u-tooltip>
              </template>

              <template v-else-if="action.actionType === 'separator'">
                <u-separator
                  orientation="vertical"
                  class="h-6 mx-1"
                />
              </template>

            </template>
          </template>

          <template v-if="!!props.extraActions?.length">

            <template v-if="!!props.actions?.length">
              <u-separator
                orientation="vertical"
                class="h-6 mx-1"
              />
            </template>

            <u-dropdown-menu :items="getExtraActionItems(row)">
              <u-button
                variant="subtle"
                icon="lucide:ellipsis-vertical"
              />
            </u-dropdown-menu>

          </template>

        </div>
      </template>

    </u-table>

    <template v-if="!props.hidePagination">
      <div class="flex items-center gap-2 p-3 border-t border-default">
        <u-pagination
          active-color="neutral"
          :total="props.totalItems"
          :items-per-page="Number(itemsPerPage)"
          :page="Number(currentPage)"
          @update:page="currentPage = $event"
        />
        <div class="grow" />
        <u-select
          :items="pageSizeItems"
          v-model="itemsPerPage"
        />
        <span class="text-sm">
          {{ $t('un.table.itemsPerPage') }}
        </span>
      </div>
    </template>

  </div>
</template>
