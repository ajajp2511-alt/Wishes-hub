export function renderPreviewContainer(role) {
    return `<div class="p-4 bg-white border rounded shadow-xs">
        <span class="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase">Simulating View: ${role}</span>
        <p class="text-xs text-gray-600 mt-2">Active components rendered in isolated sandbox DOM container.</p>
    </div>`;
}
