<script lang="ts">
	const segLength = 0.9;
	const segWidth = 0.2;
	const aspectRatio = 0.6;
	const padding = 0.15;

	const digitPatterns: Record<number, number[]> = {
		0: [1, 1, 1, 1, 1, 1, 0, 1],
		1: [0, 1, 1, 0, 0, 0, 0, 1],
		2: [1, 1, 0, 1, 1, 0, 1, 1],
		3: [1, 1, 1, 1, 0, 0, 1, 1],
		4: [0, 1, 1, 0, 0, 1, 1, 1],
		5: [1, 0, 1, 1, 0, 1, 1, 1],
		6: [1, 0, 1, 1, 1, 1, 1, 1],
		7: [1, 1, 1, 0, 0, 0, 0, 1],
		8: [1, 1, 1, 1, 1, 1, 1, 1],
		9: [1, 1, 1, 1, 0, 1, 1, 1]
	};

	let { digit, decimal = false }: { digit: number; decimal: boolean } = $props();

	let pattern = $derived(digitPatterns[digit]);
</script>

{#snippet segment(index: number, position: string, vertical: boolean, dot: boolean = false)}
	<div
		class="absolute {!dot
			? 'rounded-[2px]'
			: 'rounded-[1.5px]'} transition-colors [transition-duration:50ms]
        {digitPatterns[digit][index]
			? 'bg-lime-500 shadow-2xl shadow-black drop-shadow'
			: 'bg-white/10'}"
		style="height: {vertical && !dot ? segLength : segWidth}rem; width: {vertical || dot
			? segWidth
			: segLength * aspectRatio}rem; {position}; scale: {vertical || dot
			? 1
			: (segLength + segWidth / 1) / segLength} 1;">
	</div>
{/snippet}

<div
	class="relative"
	style="width: {(segLength * aspectRatio + 2 * segWidth) * (1 + padding)}rem; height: {(segLength *
		2 +
		3 * segWidth) *
		(1 + padding)}rem">
	{#if pattern}
		<!-- Segment A -->
		{@render segment(0, `left: ${segWidth * (1 + 2 * padding)}rem; top: 0;`, false)}

		<!-- Segment B -->
		{@render segment(1, `right: 0; top: ${segWidth * (1 + (2 * padding) / aspectRatio)}rem;`, true)}

		<!-- Segment C -->
		{@render segment(
			2,
			`bottom: ${segWidth * (1 + (2 * padding) / aspectRatio)}rem; right: 0;`,
			true
		)}

		<!-- Segment D -->
		{@render segment(3, `bottom: 0; left: ${segWidth * (1 + 2 * padding)}rem;`, false)}

		<!-- Segment E -->
		{@render segment(
			4,
			`bottom: ${segWidth * (1 + (2 * padding) / aspectRatio)}rem; left: 0;`,
			true
		)}

		<!-- Segment F -->
		{@render segment(5, `left: 0; top: ${segWidth * (1 + (2 * padding) / aspectRatio)}rem;`, true)}

		<!-- Segment G -->
		{@render segment(
			6,
			`left: ${segWidth * (1 + 2 * padding)}rem; top: 50%; margin-top: -${segWidth / 2}rem;`,
			false
		)}

		{#if decimal}
			{@render segment(7, `bottom: 0; right: -${segWidth / aspectRatio}rem;`, false, true)}
		{/if}
	{/if}
</div>
