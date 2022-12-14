<script>
	import { writable } from 'svelte/store';
	import Icon from 'mdi-svelte';
	import {
		mdiArrowLeft,
		mdiClipboardOutline,
		mdiDownload,
		mdiUpload,
		mdiCogOutline,
		mdiTrashCanOutline
	} from '@mdi/js';
	import { bytesToBase64 } from '../../base64';
	import { BlobReader, JSONReader } from 'guacamole-common-js';

	export let clipboardData = '';
	export let toolbarVisible = false;

	export let clipboardVisible = false;
	export let downloadsVisible = false;
	export let uploadsVisible = false;
	export let settingsVisible = false;

	export let client;
	export let fileSystem;

	const uploadsInProgress = writable([]);

	let fileUploadInputValue = '';
	let files = [];

	let remoteFiles = [];

	$: fileUploadInputValue, checkUpload(files[files.length - 1]);

	$: downloadsVisible, getFiles(downloadsVisible);

	function getFiles(bool) {
		if (!bool) {
			return;
		}
		fileSystem.requestInputStream('/Downloads');
		fileSystem.onbody = (stream, mimeType, name) => {
			if (name == '/Downloads') {
				stream.sendAck('', 0)
				const reader = new JSONReader(stream, mimeType);
				reader.onend = () => {
					const json = reader.getJSON();
					let keys = Object.keys(json);
					remoteFiles = [];
					keys.map((key) => {
						let name = key.split('/Downloads/')[1];
						remoteFiles.push(name);
					});
				}
			}
		};
	}

	function checkUpload(file) {
		if (fileUploadInputValue == '') {
			return;
		}
		if (!file) {
			return;
		}
		if ($uploadsInProgress.length) {
			if ($uploadsInProgress.filter((upload) => upload.name == file.name).length) {
				return;
			}
		}
		uploadFile(files[files.length - 1]);
	}

	function makeid(length) {
		let result = '';
		let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let charactersLength = characters.length;
		for (let i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	function downloadFile(fileName) {
		fileSystem.requestInputStream('/Downloads/' + fileName );
		fileSystem.onbody = (stream, mimeType, name) => {
			if (name == '/Downloads/' + fileName) {
				stream.sendAck('', 0)
				const reader = new BlobReader(stream, mimeType);
				reader.onend = () => {
					const blob = reader.getBlob();
					if (window.navigator.msSaveOrOpenBlob) {
						window.navigator.msSaveBlob(blob, fileName);
					} else {
						const elem = window.document.createElement('a');
						elem.href = window.URL.createObjectURL(blob);
						elem.download = fileName;
						document.body.appendChild(elem);
						elem.click();
						document.body.removeChild(elem);
					}
				}
			}
		};
	}

	function uploadFile(file) {
		let fileInput = document.getElementById('fileUploadInput');
		fileInput.value = '';
		fileInput.type = '';
		fileInput.type = 'file';		

		const STREAM_BLOB_SIZE = 4096;
		const fileUpload = {};
		const reader = new FileReader();

		reader.onloadend = function fileContentsLoaded() {
			const stream = fileSystem.createOutputStream(file.type ,'/Uploads/' + file.name );
			// const stream = client.createFileStream(file.type, file.name);
			const bytes = new Uint8Array(reader.result);

			let offset = 0;
			let progress = 0;

			fileUpload.id = makeid(8);
			fileUpload.name = file.name;
			fileUpload.mimetype = file.type;
			fileUpload.length = bytes.length;

			$uploadsInProgress.push({
				id: fileUpload.id,
				name: fileUpload.name,
				progress: 0
			});

			stream.onack = function ackReceived(status) {
				if (status.isError()) {
					$uploadsInProgress[
						$uploadsInProgress.findIndex((upload) => upload.id == fileUpload.id)
					].progress = 'Error';
					return false;
				}
				const slice = bytes.subarray(offset, offset + STREAM_BLOB_SIZE);
				const base64 = bytesToBase64(slice);

				// Write packet
				stream.sendBlob(base64);

				// Advance to next packet
				offset += STREAM_BLOB_SIZE;

				if (offset >= bytes.length) {
					progress = 100;
					stream.sendEnd();
				} else {
					progress = Math.floor((offset / bytes.length) * 100);
				}
				$uploadsInProgress[
					$uploadsInProgress.findIndex((upload) => upload.id == fileUpload.id)
				].progress = progress;
			};
		};

		reader.readAsArrayBuffer(file);

		return fileUpload;
	}
</script>

<div
	class="z-10 absolute top-[50px] {toolbarVisible
		? 'left-0'
		: '-left-16'} w-16 h-[calc(100vh-50px)] flex items-center justify-center border-r-2 border-white bg-blue-900 transition-all"
>
	<div
		on:click={() => (toolbarVisible = !toolbarVisible)}
		class="absolute top-[calc(50vh-80px)] -right-[26px] h-20 w-6 border border-l-0 border-white bg-blue-900 rounded-r-md hover:cursor-pointer flex flex-col justify-center items-center gap-2"
	>
		<div class="w-1 h-1 bg-white rounded-sm" />
		<div class="w-1 h-1 bg-white rounded-sm" />
		<div class="w-1 h-1 bg-white rounded-sm" />
	</div>
	<div class="flex flex-col w-full h-fit text-white ">
		{#if clipboardVisible}
			<div
				class="absolute left-[78px] bottom-[16px] w-[350px] h-[300px] bg-white p-3 border-2 border-blue-900 rounded-md flex flex-col items-center gap-2 z-0"
			>
				<button
					on:click={() => (clipboardVisible = false)}
					class="absolute top-3 right-3 text-gray-500 hover:text-gray-400 duration-100 font-semibold select-none"
				>
					X
				</button>
				<p class="font-semibold text-[15px] text-gray-900 select-none w-full text-center">
					Session Clipboard Data
				</p>
				<div class="flex gap-2 items-center">
					<div
						class="font-semibold text-[14px] text-white select-none rounded-sm bg-gray-300 p-1 flex gap-1 items-center"
					>
						<p class="p-1 pt-0 rounded-sm bg-gray-600">Shift</p>
						<p class="p-1 pt-0 rounded-sm bg-gray-600">+</p>
						<p class="p-1 pt-0 rounded-sm bg-gray-600">C</p>
					</div>
					<p class="font-semibold text-[14px] text-gray-700">to Copy</p>
				</div>
				<textarea
					bind:value={clipboardData}
					cols="40"
					rows="10"
					class="overflow-y-scroll focus:outline-none border-2 rounded-sm border-gray-900 text-gray-900"
				/>
			</div>
		{/if}
		{#if settingsVisible}
			<div
				class="absolute left-[78px] bottom-[16px] w-[350px] h-[300px] bg-white border-2 border-blue-900 p-3 rounded-md flex flex-col items-center gap-2 z-0"
			>
				<button
					on:click={() => (settingsVisible = false)}
					class="absolute top-3 right-3 text-gray-500 hover:text-gray-400 duration-100 font-semibold select-none"
				>
					X
				</button>
				<p class="font-semibold text-[15px] text-gray-900 select-none w-full text-center">
					Session Settings
				</p>
			</div>
		{/if}
		{#if downloadsVisible}
			<div
				class="absolute left-[78px] bottom-[16px] w-[350px] h-[300px] bg-white border-2 border-blue-900 p-3 rounded-md flex flex-col items-center gap-2 z-0"
			>
				<button
					on:click={() => (downloadsVisible = false)}
					class="absolute top-3 right-3 text-gray-500 hover:text-gray-400 duration-100 font-semibold select-none"
				>
					X
				</button>
				<p class="font-semibold text-[15px] text-gray-900 select-none w-full text-center">
					Download files
				</p>
				<p class="font-semibold text-[14px] text-gray-700 select-none w-full text-center">
					Files from remote host's Downloads folder will be available here
				</p>
				<div class='border-2 w-full h-full overflow-y-auto p-0'>
				{#each remoteFiles as fileName }
					<p on:click={() => {
						downloadFile(fileName);
					}} class='font-semibold text-sm text-gray-700 p-1 w-full hover:bg-gray-100 hover:cursor-pointer'>{fileName}</p>
				{/each}
			</div>
			</div>
		{/if}
		{#if uploadsVisible}
			<div
				class="absolute left-[78px] bottom-[16px] w-[350px] h-[300px] border-2 border-blue-900 bg-white p-3 rounded-md flex flex-col items-center gap-2 z-0"
			>
				<button
					on:click={() => (uploadsVisible = false)}
					class="absolute top-3 right-3 text-gray-500 hover:text-gray-400 duration-100 font-semibold select-none"
				>
					X
				</button>
				<p class="font-semibold text-[15px] text-gray-900 select-none w-full text-center">
					Upload files
				</p>
				<p class="font-semibold text-[14px] text-gray-700 select-none w-full text-center">
					Uploaded files will be available on remote host's Uploads folder
				</p>
				<label id="fileInputLabel" for="fileUploadInput">
					<div
						class="border-4 w-full h-full flex justify-center items-center bg-gray-50 rounded-md px-2 border-gray-200 border-dashed"
					>
						<p class="text-gray-700 font-semibold">Drag / Click here to upload files</p>
					</div>
					<input
						id="fileUploadInput"
						bind:value={fileUploadInputValue}
						bind:files
						type="file"
						class="w-[100%] hover:cursor-pointer"
					/>
				</label>
				<div class="w-full h-full overflow-y-auto border-2">
					{#if $uploadsInProgress.length}
						{#each $uploadsInProgress as upload}
							<div class="h-[30px] w-full p-1 flex gap-3">
								<p class="text-gray-700 text-sm font-semibold">{upload.name}</p>
								<p class="text-gray-700 text-sm font-semibold">{upload.progress}%</p>
								{#if upload.progress == 100 || upload.progress == 'Error'}
									<button
										on:click={() => {
											uploadsInProgress.set(
												$uploadsInProgress.filter((obj) => obj.id != upload.id)
											);
										}}
										class="absolute right-5"
									>
										<p
											class="text-sm text-gray-700 hover:text-gray-500 duration-100 scale-y-90 font-semibold"
										>
											X
										</p>
									</button>
								{/if}
							</div>
						{/each}
					{/if}
				</div>
			</div>
		{/if}

		<div
			on:click={() => (toolbarVisible = false)}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100"
		>
			<Icon path={mdiArrowLeft} />
		</div>

		<div
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 duration-100 {!clipboardVisible
				? ''
				: 'bg-blue-800'}"
		>
			<button
				on:click={() => {
					if (!clipboardVisible) {
						downloadsVisible = false;
						uploadsVisible = false;
						settingsVisible = false;
					}
					clipboardVisible = !clipboardVisible;
				}}
				class="w-[38px] h-[32px] flex items-center justify-center"
			>
				<Icon path={mdiClipboardOutline} />
			</button>
		</div>
		<div
			on:click={() => {
				if (!downloadsVisible) {
					clipboardVisible = false;
					uploadsVisible = false;
					settingsVisible = false;
				}
				downloadsVisible = !downloadsVisible;
			}}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!downloadsVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiDownload} />
		</div>
		<div
			on:click={() => {
				if (!uploadsVisible) {
					clipboardVisible = false;
					downloadsVisible = false;
					settingsVisible = false;
				}
				uploadsVisible = !uploadsVisible;
			}}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!uploadsVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiUpload} />
		</div>
		<div
			on:click={() => {
				if (!settingsVisible) {
					clipboardVisible = false;
					downloadsVisible = false;
					uploadsVisible = false;
				}
				settingsVisible = !settingsVisible;
			}}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 {!settingsVisible
				? ''
				: 'bg-blue-800'}"
		>
			<Icon path={mdiCogOutline} />
		</div>
		<div
			on:click={() => client.disconnect()}
			class="m-3 mb-0 h-8 flex justify-center items-center rounded-md hover:bg-blue-800 hover:cursor-pointer duration-100 text-red-800"
		>
			<Icon path={mdiTrashCanOutline} />
		</div>
	</div>
</div>

<style>
	input[type='file'] {
		position: absolute;
		left: 0;
		opacity: 0;
		top: 0;
		bottom: 0;
		width: 100%;
	}

	/* #excelDiv {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ccc;
  border: 3px dotted #bebebe;
  border-radius: 10px;
} */

	#fileInputLabel {
		display: inline-block;
		position: relative;
		height: 70px;
		width: 100%;
	}
</style>
