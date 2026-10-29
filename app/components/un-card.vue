<script setup lang="ts">

/* responsibility */

// Renders a card with typography header,
// body content, and optional action rows.


/* interface */

import type { ButtonProps, SlotClass } from '@nuxt/ui';


const props = defineProps<{

  icon?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  headerLevel?: number;

  fluidBody?: boolean;
  closable?: boolean;

  subtitleActions?: ( ButtonProps & { tooltip?: string; actionType?: 'button' | 'spacer' } )[];
  appendActions?: ( ButtonProps & { tooltip?: string; } )[];

  actions?: ( ButtonProps & { tooltip?: string; actionType?: 'button' | 'spacer' } )[];
  verticalActions?: boolean;

  ui?: {
    root?: SlotClass;
    base?: SlotClass;
    header?: SlotClass;
    body?: SlotClass;
    footer?: SlotClass;
    wrapper?: SlotClass;
    content?: SlotClass;
    heading?: SlotClass;
    icon?: SlotClass;
    titleWrapper?: SlotClass;
    title?: SlotClass;
    subtitleWrapper?: SlotClass;
    subtitle?: SlotClass;
    append?: SlotClass;
    text?: SlotClass;
  };

}>();


const emit = defineEmits<{
  close: [];
}>();


const slots = useSlots();


/* theme */

import { tv } from '@nuxt/ui/utils/tv';


const appConfig = useAppConfig();

const cardTheme = {
  slots: {
    root: '',
    base: 'p-0 sm:p-0 divide-y divide-default',
    header: 'p-3',
    body: 'p-3',
    footer: 'flex flex-wrap items-center gap-1 p-2',
    wrapper: '',
    content: '',
    heading: '',
    icon: '',
    titleWrapper: '',
    title: '',
    subtitleWrapper: '',
    subtitle: '',
    append: '',
    text: '',
  },
  variants: {
    fluidBody: {
      true: {
        body: 'p-0',
      },
    },
    verticalActions: {
      true: {
        footer: 'flex-col',
      },
    },
  },
};

const ui = computed(() => {
  return tv({
    extend: cardTheme,
    ...(appConfig.ui as { unCard?: Record<string, unknown> }).unCard,
  })({
    fluidBody: props.fluidBody,
    verticalActions: props.verticalActions,
  });
});

const typographySlots = [
  'wrapper',
  'content',
  'heading',
  'icon',
  'titleWrapper',
  'title',
  'subtitleWrapper',
  'subtitle',
  'append',
  'text',
] as const;

const typographyUi = computed(() => {

  const theme = ui.value as Record<string, (props?: { class?: unknown }) => string>;

  return Object.fromEntries(typographySlots.map((slot) => {
    return [slot, [theme[slot]?.(), props.ui?.[slot]].filter(Boolean)];
  }));

});


/* labels */

function getActionLabel(action: any) {
  if (action.label) {
    return undefined;
  }
  else {
    return action.tooltip;
  }
}

</script>


<template>
  <u-card
    :ui="{
      root: [ui.root(), props.ui?.root].filter(Boolean),
      body: ui.base({ class: props.ui?.base }),
    }">

    <un-typography
      :icon="props.icon"
      :title="props.title"
      :subtitle="props.subtitle"
      :header-level="props.headerLevel"
      :class="ui.header({ class: props.ui?.header })"
      :ui="typographyUi">

      <template v-if="isSlotFilled(slots.title)" #title>
        <slot name="title" />
      </template>

      <template v-if="props.subtitleActions || isSlotFilled(slots.subtitle)" #subtitle>
        <slot name="subtitle">
          <div class="flex flex-wrap justify-end gap-1">
            <template v-for="(action, index) of props.subtitleActions" :key="index">

              <template v-if="!action.actionType || action.actionType === 'button'">
                <u-tooltip :text="action.tooltip">
                  <u-button
                    :aria-label="getActionLabel(action)"
                    loading-auto
                    v-bind="radOmit(action, [ 'actionType', 'tooltip' ])"
                  />
                </u-tooltip>
              </template>

              <template v-else-if="action.actionType === 'spacer'">
                <div class="grow" />
              </template>

            </template>
          </div>
        </slot>
      </template>

      <template v-if="props.closable || props.appendActions || isSlotFilled(slots['append-prepend']) || isSlotFilled(slots.append)" #append>

        <slot name="append-prepend" />

        <template v-for="(action, index) of props.appendActions" :key="index">
          <u-tooltip :text="action.tooltip">
            <u-button
              :aria-label="getActionLabel(action)"
              loading-auto
              v-bind="radOmit(action, [ 'tooltip' ])"
            />
          </u-tooltip>
        </template>

        <slot name="append" />

        <template v-if="props.closable">
          <u-button
            variant="ghost"
            icon="lucide:x"
            :aria-label="$t('common.close')"
            @click="emit('close')"
          />
        </template>

      </template>

    </un-typography>

    <template v-if="props.text || isSlotFilled(slots.default)">
      <div :class="ui.body({ class: props.ui?.body })">

        <template v-if="props.text">
          <p :class="[ { 'mb-3': !!slots.default }, ui.text({ class: props.ui?.text }) ]">
            {{ props.text }}
          </p>
        </template>

        <slot />

      </div>
    </template>

    <template v-if="props.actions?.length || isSlotFilled(slots.actions)">
      <div :class="ui.footer({ class: props.ui?.footer })">
        <slot name="actions">

          <slot name="actions-prepend" />

          <template v-for="(action, index) of props.actions" :key="index">

            <template v-if="!action.actionType || action.actionType === 'button'">
              <u-tooltip :text="action.tooltip">
                <u-button
                  :aria-label="getActionLabel(action)"
                  loading-auto
                  :block="props.verticalActions"
                  v-bind="radOmit(action, [ 'actionType', 'tooltip' ])"
                />
              </u-tooltip>
            </template>

            <template v-else-if="action.actionType === 'spacer'">
              <div class="grow" />
            </template>

          </template>

          <slot name="actions-append" />

        </slot>
      </div>
    </template>

  </u-card>
</template>
