<script lang="ts">
	import { onMount } from 'svelte';
	import Input from './ui/input/input.svelte';
	// Importing altcha package will introduce a new element <altcha-widget>

	onMount(async () => {
		await import('altcha');
	});

	let { value = $bindable(), ...props } = $props();

	const estonianStrings = {
		ariaLinkLabel: 'Külasta Altcha.org',
		error: 'Kinnitus nurjus. Proovi hiljem uuesti.',
		expired: 'Kinnitus aegus. Proovi uuesti.',
		footer:
			'Turvab <a href="https://altcha.org/" target="_blank" aria-label="Külasta Altcha.org">ALTCHA</a>',
		label: 'Ma ei ole robot',
		verified: 'Kõik ok!',
		verifying: 'Kinntan...',
		waitAlert: 'Kinnitan... palun oota.'
	};
</script>

<Input type="hidden" bind:value {...props} />

<altcha-widget
	strings={JSON.stringify(estonianStrings)}
	challengeurl="/api/altcha"
	spamfilter
	blockspam
	hidefooter
	expire={180000}
	onverified={(ev) => {
		if (ev.detail.payload) {
			value = ev.detail.payload;
		}
	}}>
</altcha-widget>
