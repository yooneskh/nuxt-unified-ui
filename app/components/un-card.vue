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

  actions?: ( ButtonProps & { actionType?: 'button' | 'spacer' } )[];
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
      <template v-if="slots.append" #append>
        <slot name="append" />
      </template>
    </un-typography>

    <div
      v-if="slots.default || props.text"
      :class="{
        'p-3': !props.fluidBody,
      }">

      <p
        v-if="props.text"
        :class="[
          {
            'mb-3': !!slots.default,
          },
          props.textClasses,
        ]">
        {{ props.text }}
      </p>

      <slot />

    </div>

    <div
      v-if="props.actions?.length || slots.actions"
      class="flex items-center gap-1 p-2"
      :class="{
        'flex-col': props.verticalActions,
      }">
      <slot name="actions">

        <slot name="actions-prepend" />

        <template v-for="(action, index) of props.actions" :key="index">

          <template v-if="!action.actionType || action.actionType === 'button'">
            <u-button
              loading-auto
              :block="props.verticalActions"
              v-bind="radOmit(action, [ 'actionType' ])"
            />
          </template>

          <template v-if="action.actionType === 'spacer'">
            <div class="grow" />
          </template>

        </template>

        <slot name="actions-append" />

      </slot>
    </div>

  </u-card>
</template>
