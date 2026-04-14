<script lang="ts">
  // Importing altcha package will introduce a new element <altcha-widget>
  import 'altcha';
  import 'altcha/i18n/et';
  import type {} from 'altcha/types/svelte';
  import Input from './ui/input/input.svelte';
  import { getLocale } from '$lib/paraglide/runtime';

  let { value = $bindable(), ...props } = $props();

  const style =
    '--altcha-color-base: transparent;' +
    '--altcha-color-base-content:  var(--card-foreground);' +
    '--altcha-color-success: var(--color-lime-600);' +
    '--altcha-padding: calc(var(--spacing) * 3) calc(var(--spacing) * 2.5);' +
    '--altcha-border-width: 1px;' +
    '--altcha-border-color: var(--border);' +
    '--altcha-border-radius: calc(var(--radius) * 0.8);' +
    '--altcha-checkbox-size: calc(var(--spacing) * 4);' +
    '--altcha-checkbox-border-width: 1px;' +
    '--altcha-checkbox-border-radius: 4px;' +
    '--altcha-checkbox-border-color: var(--input);' +
    '--altcha-input-background-color: var(--input);' +
    '--altcha-input-background-color: color-mix(in oklab, var(--input) 30%, transparent);';
</script>

<Input type="hidden" bind:value {...props} />

<altcha-widget
  auto="onsubmit"
  language={getLocale()}
  challenge="/api/altcha/challenge"
  {style}
  configuration={JSON.stringify({
    hideFooter: true,
  })}
  onstatechange={(ev) => {
    const { payload, state } = ev.detail;
    if (state === 'verified' && payload) {
      value = payload;
    } else {
      value = '';
    }
  }}>
</altcha-widget>
