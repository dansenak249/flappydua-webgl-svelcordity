<script lang="ts">
	import { onMount } from "svelte";
	import { DiscordHelper } from "$lib/utils/DiscordHelper";
	import { config } from "$lib/config";

	let unityCanvas: HTMLCanvasElement | null = null;
	let unityInstance: any = null;
	let discordHelper: DiscordHelper;

	// Declare discordSdk globally to avoid ReferenceError
	declare const discordSdk: any;

	onMount(() => {
	// ===== Fix proxy for discordsays.com =====
	if (window.location.hostname.includes("discordsays.com")) {
	const originalFetch = window.fetch;
	window.fetch = (input, init) => {
	return originalFetch(".proxy/" + input, init);
	};
	}

	// ===== Discord SDK initialization =====
	async function initDiscord() {
	await discordSdk.ready();
	const user = await discordSdk.commands.getUser();
	window.__discord_user_id = user.id;
	}
	initDiscord();

	// ===== Unity → Server =====
	window.SendScoreToServer = async (score: number) => {
	await fetch("/api/score/update", {
	method: "POST",
	headers: { "Content-Type": "application/json" },
	body: JSON.stringify({
	userId: window.__discord_user_id || "0",
	score
	})
	});
	};

	// ===== Server → Unity =====
	window.GetBestScoreFromServer = async () => {
	const res = await fetch(`/api/score/get?userId=${window.__discord_user_id || "0"}`);
	const data = await res.json();
	unityInstance?.SendMessage(
	"ScoreService",
	"OnReceiveBestScore",
	data.maxScore ?? 0
	);
	};

	// Setup Discord Helper + Unity Loader
	discordHelper = new DiscordHelper();
	discordHelper.setupParentIframe();

	initializeUnity();
	});

	function initializeUnity() {
	if (!unityCanvas) return;

	const script = document.createElement("script");
	script.src = "/Build/WebGL.loader.js";
	script.async = true;

	script.onload = () => {
	createUnityInstance(unityCanvas!, {
	dataUrl: "/Build/WebGL.data.gz",
	frameworkUrl: "/Build/WebGL.framework.js.gz",
	codeUrl: "/Build/WebGL.wasm.gz",
	streamingAssetsUrl: "StreamingAssets",
	companyName: config.COMPANY_NAME,
	productName: config.PRODUCT_NAME,
	productVersion: config.PRODUCT_VERSION,
	}).then((instance: any) => {
	unityInstance = instance;
	});
	};

	document.body.appendChild(script);

	// Mobile layout
	if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
	const meta = document.createElement("meta");
	meta.name = "viewport";
	meta.content =
	"width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes";
	document.head.appendChild(meta);

	unityCanvas.style.width = "100%";
	unityCanvas.style.height = "100%";
	unityCanvas.style.position = "fixed";
	document.body.style.textAlign = "left";
	}
	}
</script>

<body>
	<canvas
        bind:this={unityCanvas}
        id="unity-canvas"
        tabindex="-1"
        width="960"
        style="
            width: 100vw;
            height: 100vh;
            background: url('/Build/WebGL.jpg') center / cover;
        "
    ></canvas>
</body>

<style>
	body {
	margin: 0px;
	background-color: #000000;
	padding: 0px;
	text-align: center;
	border: 0;
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	}
</style>
