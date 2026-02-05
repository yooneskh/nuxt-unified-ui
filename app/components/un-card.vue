<script setup lang="ts">

/* interface */

import type { ButtonProps } from '@nuxt/ui';


const props = defineProps<{

  icon?: string;
  title?: string;
  subtitle?: string;
  text?: string;
  iconClasses?: string;
  titleClasses?: string;
  subtitleClasses?: string;
  textClasses?: string;

  fluidBody?: boolean;

  subtitleActions?: ( ButtonProps & { tooltip?: string; actionType?: 'button' | 'spacer' } )[];
  appendActions?: ( ButtonProps & { tooltip?: string; } )[];

  actions?: ( ButtonProps & { tooltip?: string; actionType?: 'button' | 'spacer' } )[];
  verticalActions?: boolean;

}>();


const slots = useSlots();

</script>


<template>
  <u-card :ui="{ body: 'p-0 sm:p-0 divide-y divide-default' }">

    <un-typography
      :icon="props.icon"
      :title="props.title"
      :subtitle="props.subtitle"
      :icon-classes="props.iconClasses"
      :title-classes="props.titleClasses"
      :subtitle-classes="props.subtitleClasses"
      class="p-3">

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

      <template v-if="props.appendActions || isSlotFilled(slots['append-prepend']) || isSlotFilled(slots.append)" #append>
        <slot name="append-prepend" />
        <template v-for="action of props.appendActions">
          <u-tooltip :text="action.tooltip">
            <u-button
              loading-auto
              v-bind="radOmit(action, [ 'tooltip' ])"
            />
          </u-tooltip>
        </template>
        <slot name="append" />
      </template>

    </un-typography>

    <div
      v-if="props.text || isSlotFilled(slots.default)"
      :class="{
        'p-3': !props.fluidBody,
      }">

      <template v-if="props.text">
        <p :class="[ { 'mb-3': !!slots.default }, props.textClasses ]">
          {{ props.text }}
        </p>
      </template>

      <slot />

    </div>

    <template v-if="props.actions?.length || isSlotFilled(slots.actions)">
      <div
        class="flex flex-wrap items-center gap-1 p-2"
        :class="{
          'flex-col': props.verticalActions,
        }">
        <slot name="actions">

          <slot name="actions-prepend" />

          <template v-for="(action, index) of props.actions" :key="index">

            <template v-if="!action.actionType || action.actionType === 'button'">
              <u-tooltip :text="action.tooltip">
                <u-button
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
