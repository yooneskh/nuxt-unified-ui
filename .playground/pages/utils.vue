<script setup>

/* responsibility */

// Shows radashi, dates,
// smartMatch, and unSet.


/* page */

definePageMeta({
  name: 'playground.utils',
});


/* seo */

useHead({
  title: 'Utils · Playground',
});

useSeoMeta({
  description: 'Radashi is auto-imported as radXxx. Dates wrap @formkit/tempo. smartMatch accepts a boolean, function, or mongo filter. unSet writes nested paths.',
});


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


/* match */

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
  <div class="mx-auto w-full max-w-6xl space-y-8">

    <div class="space-y-1">
      <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted">
        Utils
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
